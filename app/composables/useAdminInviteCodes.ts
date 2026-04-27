interface AdminInviteCode {
  id: string
  code: string
  label: string | null
  is_active: boolean | null
  max_guests_per_booking: number
  invite_code_reservations: Array<{
    reservation_id: string
    reservations?: { name: string, date: string } | null
  }>
}

export const useAdminInviteCodes = () => {
  const supabase = useSupabaseClient()
  const inviteCodes = ref<AdminInviteCode[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    const { data, error } = await supabase
      .from('invite_codes')
      .select('*, invite_code_reservations(reservation_id, reservations(name, date))')
      .order('created_at', { ascending: false })
    if (data) inviteCodes.value = data
    loading.value = false
    return { data, error }
  }

  async function create(
    payload: {
      code: string
      label?: string
      is_active?: boolean
      max_guests_per_booking?: number
    },
    reservationIds: string[]
  ) {
    const { data, error } = await supabase
      .from('invite_codes')
      .insert({ ...payload, code: payload.code.toUpperCase() })
      .select()
      .single()

    if (error || !data) return { data, error }

    if (reservationIds.length > 0) {
      const junctions = reservationIds.map(rid => ({
        invite_code_id: data.id,
        reservation_id: rid
      }))
      await supabase.from('invite_code_reservations').insert(junctions)
    }

    return { data, error: null }
  }

  async function remove(id: string) {
    const { error } = await supabase
      .from('invite_codes')
      .delete()
      .eq('id', id)
    if (!error) {
      inviteCodes.value = inviteCodes.value.filter(c => c.id !== id)
    }
    return { error }
  }

  async function toggleActive(id: string, current: boolean) {
    const { data, error } = await supabase
      .from('invite_codes')
      .update({ is_active: !current })
      .eq('id', id)
      .select()
      .single()
    if (data) {
      const idx = inviteCodes.value.findIndex(c => c.id === id)
      const code = inviteCodes.value[idx]
      if (idx !== -1 && code) code.is_active = !current
    }
    return { data, error }
  }

  return { inviteCodes, loading, fetchAll, create, remove, toggleActive }
}
