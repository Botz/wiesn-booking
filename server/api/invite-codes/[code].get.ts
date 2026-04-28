export default defineEventHandler(async (event) => {
  rateLimit(event, { key: 'invite-codes', limit: 10, windowMs: 60_000 })

  const code = getRouterParam(event, 'code')

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Code fehlt' })
  }

  const supabase = useSupabaseAdmin()

  const { data: inviteCode, error: codeError } = await supabase
    .from('invite_codes')
    .select('id, code, label, max_guests_per_booking, invite_code_reservations(reservation_id)')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (codeError || !inviteCode) {
    throw createError({ statusCode: 404, statusMessage: 'Ungültiger oder inaktiver Einladungscode' })
  }

  const reservationIds: string[] = inviteCode.invite_code_reservations.map((r: { reservation_id: string }) => r.reservation_id)

  if (reservationIds.length === 0) {
    return {
      code: inviteCode.code,
      label: inviteCode.label,
      max_guests_per_booking: inviteCode.max_guests_per_booking,
      reservations: []
    }
  }

  const { data: reservations, error: resError } = await supabase
    .from('reservations')
    .select('*')
    .in('id', reservationIds)
    .order('date', { ascending: true })

  if (resError || !reservations) {
    throw createError({ statusCode: 500, statusMessage: 'Fehler beim Laden der Reservierungen' })
  }

  const { data: bookedData } = await supabase
    .from('bookings')
    .select('reservation_id, seat_count')
    .in('reservation_id', reservationIds)
    .eq('status', 'confirmed')

  const bookedByReservation: Record<string, number> = {}
  for (const b of bookedData ?? []) {
    bookedByReservation[b.reservation_id] = (bookedByReservation[b.reservation_id] ?? 0) + b.seat_count
  }

  return {
    code: inviteCode.code,
    label: inviteCode.label,
    max_guests_per_booking: inviteCode.max_guests_per_booking,
    reservations: reservations.map(r => ({
      ...r,
      available_seats: r.total_seats - (bookedByReservation[r.id] ?? 0)
    }))
  }
})
