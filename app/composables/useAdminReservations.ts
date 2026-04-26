export const useAdminReservations = () => {
  const supabase = useSupabaseClient()
  const reservations = ref<any[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
    if (data) reservations.value = data
    loading.value = false
    return { data, error }
  }

  async function fetchOne(id: string) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  }

  async function create(payload: {
    name: string
    date: string
    tent?: string | null
    total_seats: number
    total_cost?: number | null
    whatsapp_link?: string | null
    notes?: string | null
  }) {
    const { data, error } = await supabase
      .from('reservations')
      .insert(payload)
      .select()
      .single()
    return { data, error }
  }

  async function update(id: string, payload: Partial<{
    name: string
    date: string
    tent: string | null
    total_seats: number
    total_cost: number | null
    whatsapp_link: string | null
    notes: string | null
  }>) {
    const { data, error } = await supabase
      .from('reservations')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }

  async function remove(id: string) {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)
    if (!error) {
      reservations.value = reservations.value.filter(r => r.id !== id)
    }
    return { error }
  }

  return { reservations, loading, fetchAll, fetchOne, create, update, remove }
}
