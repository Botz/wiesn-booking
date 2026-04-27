interface AdminBooking {
  id: string
  reservation_id: string
  guest_name: string
  guest_contact: string | null
  plus_one_name: string | null
  seat_count: number
  status: 'confirmed' | 'waitlisted' | 'cancelled'
  payment_status: 'pending' | 'paid'
  created_at: string | null
  reservations?: { name: string, date: string } | null
  invite_codes?: { code: string } | null
}

export const useAdminBookings = (reservationId?: string) => {
  const supabase = useSupabaseClient()
  const bookings = ref<AdminBooking[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    let query = supabase
      .from('bookings')
      .select('*, reservations(name, date), invite_codes(code)')
      .order('created_at', { ascending: false })

    if (reservationId) {
      query = query.eq('reservation_id', reservationId)
    }

    const { data, error } = await query
    if (data) bookings.value = data as AdminBooking[]
    loading.value = false
    return { data, error }
  }

  async function togglePayment(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending'
    const { data, error } = await supabase
      .from('bookings')
      .update({ payment_status: newStatus })
      .eq('id', id)
      .select()
      .single()
    if (data) {
      const idx = bookings.value.findIndex(b => b.id === id)
      const booking = bookings.value[idx]
      if (idx !== -1 && booking) booking.payment_status = newStatus
    }
    return { data, error }
  }

  async function cancelBooking(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()
    if (data) {
      const idx = bookings.value.findIndex(b => b.id === id)
      const booking = bookings.value[idx]
      if (idx !== -1 && booking) booking.status = 'cancelled'
    }
    return { data, error }
  }

  return { bookings, loading, fetchAll, togglePayment, cancelBooking }
}
