export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { inviteCode, reservationIds, guestName, guestContact, plusOneName, seatCount } = body

  if (!inviteCode || !Array.isArray(reservationIds) || !reservationIds.length || !guestName || !seatCount) {
    throw createError({ statusCode: 400, statusMessage: 'Pflichtfelder fehlen' })
  }

  if (seatCount < 1 || seatCount > 2) {
    throw createError({ statusCode: 400, statusMessage: 'Ungültige Sitzanzahl' })
  }

  const supabase = useSupabaseAdmin()

  const { data: codeData, error: codeError } = await supabase
    .from('invite_codes')
    .select('id, max_guests_per_booking, invite_code_reservations(reservation_id)')
    .eq('code', inviteCode.toUpperCase())
    .eq('is_active', true)
    .single()

  if (codeError || !codeData) {
    throw createError({ statusCode: 404, statusMessage: 'Ungültiger Einladungscode' })
  }

  if (seatCount > codeData.max_guests_per_booking) {
    throw createError({ statusCode: 400, statusMessage: 'Der Code erlaubt keine Begleitung' })
  }

  const allowedIds: string[] = codeData.invite_code_reservations.map((r: any) => r.reservation_id)
  const invalidIds = (reservationIds as string[]).filter(id => !allowedIds.includes(id))
  if (invalidIds.length > 0) {
    throw createError({ statusCode: 400, statusMessage: 'Ungültige Reservierungs-ID' })
  }

  const results = []

  for (const reservationId of reservationIds as string[]) {
    const { data: bookedData } = await supabase
      .from('bookings')
      .select('seat_count')
      .eq('reservation_id', reservationId)
      .eq('status', 'confirmed')

    const totalBooked = (bookedData ?? []).reduce((sum: number, b: any) => sum + b.seat_count, 0)

    const { data: reservation } = await supabase
      .from('reservations')
      .select('total_seats')
      .eq('id', reservationId)
      .single()

    const availableSeats = (reservation?.total_seats ?? 0) - totalBooked
    const status = availableSeats >= seatCount ? 'confirmed' : 'waitlisted'

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        reservation_id: reservationId,
        invite_code_id: codeData.id,
        guest_name: guestName,
        guest_contact: guestContact ?? null,
        plus_one_name: plusOneName ?? null,
        seat_count: seatCount,
        status
      })
      .select('id, status, cancellation_token')
      .single()

    if (bookingError || !booking) {
      throw createError({ statusCode: 500, statusMessage: 'Buchung konnte nicht erstellt werden' })
    }

    results.push({
      reservationId,
      status: booking.status,
      cancellationToken: booking.cancellation_token
    })
  }

  return results
})
