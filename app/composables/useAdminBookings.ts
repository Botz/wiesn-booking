export const useAdminBookings = (reservationId?: string) => {
  const supabase = useSupabaseClient()
  const bookings = ref<any[]>([])
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
    if (data) bookings.value = data
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
      if (idx !== -1) bookings.value[idx].payment_status = newStatus
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
      if (idx !== -1) bookings.value[idx].status = 'cancelled'
    }
    return { data, error }
  }

  return { bookings, loading, fetchAll, togglePayment, cancelBooking }
}
