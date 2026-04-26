interface BookingPayload {
  inviteCode: string
  reservationIds: string[]
  guestName: string
  guestContact?: string
  plusOneName?: string
  seatCount: number
}

interface BookingResult {
  reservationId: string
  status: 'confirmed' | 'waitlisted'
  cancellationToken: string
}

export const useBooking = () => {
  const results = ref<BookingResult[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function book(payload: BookingPayload) {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<BookingResult[]>('/api/bookings', {
        method: 'POST',
        body: payload
      })
      results.value = data
      return data
    }
    catch (e: any) {
      error.value = e.data?.statusMessage ?? e.data?.message ?? 'Buchung fehlgeschlagen'
      return null
    }
    finally {
      loading.value = false
    }
  }

  return { results, loading, error, book }
}
