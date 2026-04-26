<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { bookings, loading, fetchAll, togglePayment, cancelBooking } = useAdminBookings()

const filterStatus = ref<string>('all')
const filterPayment = ref<string>('all')
const searchQuery = ref('')

onMounted(() => fetchAll())

const filteredBookings = computed(() => {
  return bookings.value.filter(b => {
    if (filterStatus.value !== 'all' && b.status !== filterStatus.value) return false
    if (filterPayment.value !== 'all' && b.payment_status !== filterPayment.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return b.guest_name.toLowerCase().includes(q)
        || b.guest_contact?.toLowerCase().includes(q)
        || b.reservations?.name?.toLowerCase().includes(q)
    }
    return true
  })
})

async function handleTogglePayment(id: string, current: string) {
  await togglePayment(id, current)
}

async function handleCancel(id: string, name: string) {
  if (!window.confirm(`Buchung von "${name}" stornieren?`)) return
  await cancelBooking(id)
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Alle Buchungen</h1>
      <p class="text-muted text-sm">{{ filteredBookings.length }} Einträge</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <UInput
        v-model="searchQuery"
        placeholder="Suchen..."
        icon="i-lucide-search"
        class="w-48"
      />

      <div class="flex gap-1">
        <UButton
          v-for="opt in [{ value: 'all', label: 'Alle' }, { value: 'confirmed', label: 'Bestätigt' }, { value: 'waitlisted', label: 'Warteliste' }, { value: 'cancelled', label: 'Storniert' }]"
          :key="opt.value"
          size="sm"
          :variant="filterStatus === opt.value ? 'solid' : 'ghost'"
          color="neutral"
          @click="filterStatus = opt.value"
        >
          {{ opt.label }}
        </UButton>
      </div>

      <div class="flex gap-1">
        <UButton
          v-for="opt in [{ value: 'all', label: 'Zahlung: Alle' }, { value: 'pending', label: 'Ausstehend' }, { value: 'paid', label: 'Bezahlt' }]"
          :key="opt.value"
          size="sm"
          :variant="filterPayment === opt.value ? 'solid' : 'ghost'"
          color="neutral"
          @click="filterPayment = opt.value"
        >
          {{ opt.label }}
        </UButton>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
    </div>

    <div v-else-if="filteredBookings.length === 0" class="text-center py-12 text-muted">
      Keine Buchungen gefunden.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="b in filteredBookings"
        :key="b.id"
        class="flex items-center justify-between p-3 border rounded-xl bg-white dark:bg-gray-900"
        :class="b.status === 'cancelled' ? 'opacity-50' : ''"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="font-medium">{{ b.guest_name }}</span>
            <BookingStatusBadge :status="b.status" />
          </div>
          <p class="text-xs text-muted">
            <NuxtLink
              v-if="b.reservations"
              :to="`/admin/reservations/${b.reservation_id}`"
              class="hover:underline"
            >
              {{ b.reservations.name }}
            </NuxtLink>
            <span v-if="b.invite_codes?.code"> · {{ b.invite_codes.code }}</span>
            <span v-if="b.seat_count > 1"> · {{ b.seat_count }} Plätze</span>
            <span v-if="b.plus_one_name"> · +{{ b.plus_one_name }}</span>
          </p>
        </div>
        <div class="flex gap-2 items-center shrink-0 ml-4">
          <BookingPaymentStatusToggle
            v-if="b.status === 'confirmed'"
            :status="b.payment_status"
            :booking-id="b.id"
            @toggle="handleTogglePayment"
          />
          <UButton
            v-if="b.status !== 'cancelled'"
            size="xs"
            variant="ghost"
            color="error"
            icon="i-lucide-x"
            @click="handleCancel(b.id, b.guest_name)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
