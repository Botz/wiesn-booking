-- Enable pgcrypto for gen_random_bytes
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- reservations
CREATE TABLE reservations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  date          date NOT NULL,
  tent          text,
  total_seats   int NOT NULL,
  total_cost    numeric(10,2),
  whatsapp_link text,
  notes         text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- invite_codes
CREATE TABLE invite_codes (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                   text UNIQUE NOT NULL,
  label                  text,
  is_active              boolean DEFAULT true,
  max_guests_per_booking int NOT NULL DEFAULT 1,
  created_at             timestamptz DEFAULT now()
);

-- invite_code_reservations (junction)
CREATE TABLE invite_code_reservations (
  invite_code_id  uuid REFERENCES invite_codes(id) ON DELETE CASCADE,
  reservation_id  uuid REFERENCES reservations(id) ON DELETE CASCADE,
  PRIMARY KEY (invite_code_id, reservation_id)
);

-- bookings
CREATE TABLE bookings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id      uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  invite_code_id      uuid REFERENCES invite_codes(id),
  guest_name          text NOT NULL,
  guest_contact       text,
  plus_one_name       text,
  seat_count          int NOT NULL DEFAULT 1,
  status              text NOT NULL DEFAULT 'confirmed'
                        CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
  cancellation_token  text UNIQUE NOT NULL DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  payment_status      text NOT NULL DEFAULT 'pending'
                        CHECK (payment_status IN ('pending', 'paid')),
  payment_note        text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_bookings_reservation_id ON bookings(reservation_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_cancellation_token ON bookings(cancellation_token);
CREATE INDEX idx_invite_code_reservations_reservation ON invite_code_reservations(reservation_id);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Waitlist promotion trigger (race-condition-safe via DB transaction)
CREATE OR REPLACE FUNCTION promote_waitlisted_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
    UPDATE bookings
    SET status = 'confirmed', updated_at = now()
    WHERE id = (
      SELECT id FROM bookings
      WHERE reservation_id = NEW.reservation_id
        AND status = 'waitlisted'
      ORDER BY created_at ASC
      LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER promote_waitlisted_on_cancel
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION promote_waitlisted_booking();

-- RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_code_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- authenticated (admin) has full access
CREATE POLICY "admin_all_reservations" ON reservations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_invite_codes" ON invite_codes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_invite_code_reservations" ON invite_code_reservations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_bookings" ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- anon has NO direct table access — all public ops go via service-role server routes
