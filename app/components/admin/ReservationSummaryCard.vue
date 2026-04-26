<script setup lang="ts">
const props = defineProps<{
  reservation: {
    id: string
    name: string
    date: string
    tent: string | null
    total_seats: number
    total_cost: number | null
    whatsapp_link: string | null
  }
  bookedSeats: number
  paidCount: number
  totalBookings: number
}>()

const available = computed(() => props.reservation.total_seats - props.bookedSeats)

const pricePerSeat = computed(() =>
  props.reservation.total_cost
    ? (props.reservation.total_cost / props.reservation.total_seats).toFixed(2)
    : null
)

const paidPercentage = computed(() =>
  props.totalBookings > 0
    ? Math.round((props.paidCount / props.totalBookings) * 100)
    : 0
)
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-start gap-2">
        <div class="min-w-0">
          <h3 class="font-semibold truncate">{{ reservation.name }}</h3>
          <p class="text-sm text-muted">
            {{ new Date(reservation.date).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }) }}
            <span v-if="reservation.tent"> · {{ reservation.tent }}</span>
          </p>
        </div>
        <NuxtLink :to="`/admin/reservations/${reservation.id}`">
          <UButton size="xs" variant="ghost" icon="i-lucide-arrow-right" />
        </NuxtLink>
      </div>
    </template>

    <ReservationSeatAvailabilityBar :total="reservation.total_seats" :available="available" />

    <div class="mt-3 flex gap-4 text-xs text-muted">
      <span v-if="pricePerSeat">{{ pricePerSeat }} € / Platz</span>
      <span>{{ paidCount }}/{{ totalBookings }} bezahlt ({{ paidPercentage }}%)</span>
    </div>

    <template #footer>
      <div class="flex gap-2 flex-wrap">
        <ReservationWhatsAppButton v-if="reservation.whatsapp_link" :link="reservation.whatsapp_link" />
        <NuxtLink :to="`/admin/reservations/${reservation.id}/edit`">
          <UButton size="xs" variant="ghost" icon="i-lucide-pencil">
            Bearbeiten
          </UButton>
        </NuxtLink>
      </div>
    </template>
  </UCard>
</template>
