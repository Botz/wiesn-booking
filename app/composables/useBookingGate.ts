// Booking opens on 2026-05-01 at 08:00 Munich time (Europe/Berlin = CEST = UTC+2)
const GATE_DATE = new Date('2026-05-01T06:00:00Z')

export const useBookingGate = () => {
  const now = ref(new Date())
  const isOpen = computed(() => now.value >= GATE_DATE)

  const remaining = computed(() => {
    const diff = GATE_DATE.getTime() - now.value.getTime()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    }
  })

  let interval: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    interval = setInterval(() => {
      now.value = new Date()
    }, 1000)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return { isOpen, remaining, gateDate: GATE_DATE }
}
