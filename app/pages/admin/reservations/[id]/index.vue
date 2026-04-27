<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

const { fetchOne } = useAdminReservations()
const { bookings, loading: bookingsLoading, fetchAll, togglePayment, cancelBooking } = useAdminBookings(id)

interface Reservation {
  id: string
  name: string
  date: string
  tent: string | null
  total_seats: number
  total_cost: number | null
  whatsapp_link: string | null
  notes: string | null
}

const reservation = ref<Reservation | null>(null)

const confirmedBookings = computed(() => bookings.value.filter(b => b.status === 'confirmed'))
const waitlistedBookings = computed(() => bookings.value.filter(b => b.status === 'waitlisted'))
const cancelledBookings = computed(() => bookings.value.filter(b => b.status === 'cancelled'))

const bookedSeats = computed(() =>
  confirmedBookings.value.reduce((sum, b) => sum + b.seat_count, 0)
)

const availableSeats = computed(() =>
  reservation.value ? reservation.value.total_seats - bookedSeats.value : 0
)

const pricePerSeat = computed(() =>
  reservation.value?.total_cost
    ? (reservation.value.total_cost / reservation.value.total_seats).toFixed(2)
    : null
)

onMounted(async () => {
  const { data } = await fetchOne(id)
  reservation.value = data
  await fetchAll()
})

async function handleTogglePayment(bookingId: string, currentStatus: string) {
  await togglePayment(bookingId, currentStatus)
}

async function handleCancelBooking(bookingId: string, guestName: string) {
  if (!window.confirm(`Buchung von "${guestName}" stornieren?`)) return
  await cancelBooking(bookingId)
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UButton
        to="/admin/reservations"
        variant="ghost"
        icon="i-lucide-arrow-left"
        size="sm"
      />
      <div class="flex-1">
        <h1 class="text-2xl font-bold">
          {{ reservation?.name ?? '...' }}
        </h1>
        <p
          v-if="reservation"
          class="text-muted text-sm"
        >
          {{ new Date(reservation.date).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
          <span v-if="reservation.tent"> · {{ reservation.tent }}</span>
        </p>
      </div>
      <UButton
        v-if="reservation"
        :to="`/admin/reservations/${id}/edit`"
        variant="ghost"
        icon="i-lucide-pencil"
        size="sm"
      >
        Bearbeiten
      </UButton>
    </div>

    <!-- Stats -->
    <div
      v-if="reservation"
      class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
    >
      <UCard>
        <div class="text-2xl font-bold">
          {{ reservation.total_seats }}
        </div>
        <div class="text-sm text-muted">
          Plätze gesamt
        </div>
      </UCard>
      <UCard>
        <div class="text-2xl font-bold">
          {{ bookedSeats }}
        </div>
        <div class="text-sm text-muted">
          Belegt
        </div>
      </UCard>
      <UCard>
        <div
          class="text-2xl font-bold"
          :class="availableSeats === 0 ? 'text-error-500' : 'text-success-500'"
        >
          {{ availableSeats }}
        </div>
        <div class="text-sm text-muted">
          Verfügbar
        </div>
      </UCard>
      <UCard>
        <div class="text-2xl font-bold">
          {{ waitlistedBookings.length }}
        </div>
        <div class="text-sm text-muted">
          Warteliste
        </div>
      </UCard>
    </div>

    <div
      v-if="reservation"
      class="mb-6"
    >
      <ReservationSeatAvailabilityBar
        :total="reservation.total_seats"
        :available="availableSeats"
      />
      <div class="flex gap-4 mt-2 text-sm text-muted">
        <span v-if="pricePerSeat">{{ pricePerSeat }} € / Platz</span>
        <span v-if="reservation.whatsapp_link">
          <ReservationWhatsAppButton :link="reservation.whatsapp_link" />
        </span>
      </div>
    </div>

    <!-- Bookings -->
    <div
      v-if="bookingsLoading"
      class="flex justify-center py-8"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="w-6 h-6 animate-spin text-muted"
      />
    </div>

    <div v-else>
      <!-- Confirmed -->
      <div class="mb-6">
        <h2 class="font-semibold mb-3 flex items-center gap-2">
          Bestätigte Buchungen
          <UBadge
            color="success"
            variant="soft"
          >
            {{ confirmedBookings.length }}
          </UBadge>
        </h2>
        <div
          v-if="confirmedBookings.length === 0"
          class="text-sm text-muted"
        >
          Keine bestätigten Buchungen.
        </div>
        <div
          v-else
          class="space-y-2"
        >
          <div
            v-for="b in confirmedBookings"
            :key="b.id"
            class="flex items-center justify-between p-3 border rounded-xl bg-white dark:bg-gray-900"
          >
            <div>
              <p class="font-medium">
                {{ b.guest_name }}
              </p>
              <p class="text-xs text-muted">
                {{ b.seat_count }} Platz{{ b.seat_count > 1 ? 'e' : '' }}
                <span v-if="b.plus_one_name"> · Mit {{ b.plus_one_name }}</span>
                <span v-if="b.guest_contact"> · {{ b.guest_contact }}</span>
              </p>
              <p class="text-xs text-muted">
                Angemeldet {{ new Date(b.created_at ?? '').toLocaleDateString('de-DE') }}
                <span v-if="b.invite_codes?.code"> · Code: {{ b.invite_codes.code }}</span>
              </p>
            </div>
            <div class="flex gap-2 items-center">
              <BookingPaymentStatusToggle
                :status="b.payment_status"
                :booking-id="b.id"
                @toggle="handleTogglePayment"
              />
              <UButton
                size="xs"
                variant="ghost"
                color="error"
                icon="i-lucide-x"
                @click="handleCancelBooking(b.id, b.guest_name)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Waitlisted -->
      <div
        v-if="waitlistedBookings.length > 0"
        class="mb-6"
      >
        <h2 class="font-semibold mb-3 flex items-center gap-2">
          Warteliste
          <UBadge
            color="warning"
            variant="soft"
          >
            {{ waitlistedBookings.length }}
          </UBadge>
        </h2>
        <div class="space-y-2">
          <div
            v-for="b in waitlistedBookings"
            :key="b.id"
            class="flex items-center justify-between p-3 border rounded-xl bg-white dark:bg-gray-900 opacity-75"
          >
            <div>
              <p class="font-medium">
                {{ b.guest_name }}
              </p>
              <p class="text-xs text-muted">
                {{ b.seat_count }} Platz{{ b.seat_count > 1 ? 'e' : '' }}
                <span v-if="b.plus_one_name"> · Mit {{ b.plus_one_name }}</span>
              </p>
            </div>
            <BookingStatusBadge status="waitlisted" />
          </div>
        </div>
      </div>

      <!-- Cancelled -->
      <div v-if="cancelledBookings.length > 0">
        <h2 class="font-semibold mb-3 flex items-center gap-2 text-muted">
          Storniert
          <UBadge
            color="neutral"
            variant="soft"
          >
            {{ cancelledBookings.length }}
          </UBadge>
        </h2>
        <div class="space-y-2">
          <div
            v-for="b in cancelledBookings"
            :key="b.id"
            class="flex items-center justify-between p-3 border rounded-xl opacity-50"
          >
            <p class="text-sm">
              {{ b.guest_name }}
            </p>
            <BookingStatusBadge status="cancelled" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
