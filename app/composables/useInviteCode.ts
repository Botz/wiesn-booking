interface ReservationWithAvailability {
  id: string
  name: string
  date: string
  tent: string | null
  total_seats: number
  total_cost: number | null
  whatsapp_link: string | null
  notes: string | null
  available_seats: number
}

interface InviteCodeData {
  code: string
  label: string | null
  max_guests_per_booking: number
  reservations: ReservationWithAvailability[]
}

export const useInviteCode = (code: string) => {
  const data = ref<InviteCodeData | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      const result = await $fetch<InviteCodeData>(`/api/invite-codes/${encodeURIComponent(code)}`)
      data.value = result
    }
    catch (e: any) {
      error.value = e.data?.statusMessage ?? e.data?.message ?? 'Ungültiger Einladungscode'
    }
    finally {
      loading.value = false
    }
  }

  return { data, error, loading, fetch }
}
