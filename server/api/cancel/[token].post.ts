export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token fehlt' })
  }

  const supabase = useSupabaseAdmin()

  const { data: booking, error: findError } = await supabase
    .from('bookings')
    .select('id, status, guest_name, reservations(name, date)')
    .eq('cancellation_token', token)
    .single()

  if (findError || !booking) {
    throw createError({ statusCode: 404, statusMessage: 'Buchung nicht gefunden' })
  }

  if (booking.status === 'cancelled') {
    throw createError({ statusCode: 400, statusMessage: 'Diese Buchung wurde bereits storniert' })
  }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', booking.id)

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: 'Stornierung fehlgeschlagen' })
  }

  const reservation = booking.reservations as { name?: string, date?: string } | null
  return {
    success: true,
    guestName: booking.guest_name,
    reservationName: reservation?.name ?? '',
    reservationDate: reservation?.date ?? ''
  }
})
