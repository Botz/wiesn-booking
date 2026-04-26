interface CancellationResult {
  success: boolean
  guestName: string
  reservationName: string
  reservationDate: string
}

export const useCancellation = (token: string) => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const booking = ref<CancellationResult | null>(null)

  async function cancel() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<CancellationResult>(`/api/cancel/${encodeURIComponent(token)}`, {
        method: 'POST'
      })
      booking.value = data
      success.value = true
      return data
    }
    catch (e: any) {
      error.value = e.data?.statusMessage ?? e.data?.message ?? 'Stornierung fehlgeschlagen'
      return null
    }
    finally {
      loading.value = false
    }
  }

  return { loading, error, success, booking, cancel }
}
