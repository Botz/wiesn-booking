<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { reservations, loading, fetchAll } = useAdminReservations()
const { bookings, fetchAll: fetchBookings } = useAdminBookings()

const stats = computed(() => reservations.value.map((r) => {
  const resBookings = bookings.value.filter(b => b.reservation_id === r.id && b.status === 'confirmed')
  const bookedSeats = resBookings.reduce((sum, b) => sum + b.seat_count, 0)
  const paidCount = resBookings.filter(b => b.payment_status === 'paid').length
  return {
    reservation: r,
    bookedSeats,
    paidCount,
    totalBookings: resBookings.length
  }
}))

onMounted(() => Promise.all([fetchAll(), fetchBookings()]))
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Dashboard
      </h1>
      <UButton
        to="/admin/reservations/new"
        icon="i-lucide-plus"
      >
        Neue Reservierung
      </UButton>
    </div>

    <div
      v-if="loading"
      class="flex justify-center py-16"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="w-8 h-8 animate-spin text-muted"
      />
    </div>

    <div
      v-else-if="reservations.length === 0"
      class="text-center py-16 text-muted"
    >
      <div class="text-4xl mb-4">
        📋
      </div>
      <p class="mb-4">
        Noch keine Reservierungen angelegt.
      </p>
      <UButton
        to="/admin/reservations/new"
        icon="i-lucide-plus"
      >
        Erste Reservierung erstellen
      </UButton>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <AdminReservationSummaryCard
        v-for="s in stats"
        :key="s.reservation.id"
        :reservation="s.reservation"
        :booked-seats="s.bookedSeats"
        :paid-count="s.paidCount"
        :total-bookings="s.totalBookings"
      />
    </div>
  </div>
</template>
