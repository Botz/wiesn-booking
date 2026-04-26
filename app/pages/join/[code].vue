<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const code = (route.params.code as string).toUpperCase()

const { data: codeData, error: codeError, loading: codeLoading, fetch } = useInviteCode(code)
const { book, loading: bookingLoading, error: bookingError, results } = useBooking()

const form = reactive({
  guestName: '',
  guestContact: '',
  plusOneName: ''
})

const bookingComplete = ref(false)
const selectedReservationIds = ref<string[]>([])

const allowPlusOne = computed(() => (codeData.value?.max_guests_per_booking ?? 1) >= 2)

const seatCount = computed(() => allowPlusOne.value && form.plusOneName.trim() ? 2 : 1)

watch(codeData, (data) => {
  if (data?.reservations) {
    selectedReservationIds.value = data.reservations.map(r => r.id)
  }
}, { immediate: true })

onMounted(() => fetch())

async function submit() {
  if (!form.guestName.trim() || selectedReservationIds.value.length === 0) return

  const result = await book({
    inviteCode: code,
    reservationIds: selectedReservationIds.value,
    guestName: form.guestName.trim(),
    guestContact: form.guestContact.trim() || undefined,
    plusOneName: allowPlusOne.value && form.plusOneName.trim() ? form.plusOneName.trim() : undefined,
    seatCount: seatCount.value
  })

  if (result) {
    bookingComplete.value = true
  }
}

function getReservationName(reservationId: string) {
  return codeData.value?.reservations.find(r => r.id === reservationId)?.name ?? reservationId
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="codeLoading" class="flex justify-center py-16">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
    </div>

    <!-- Invalid code -->
    <div v-else-if="codeError" class="text-center py-16">
      <div class="text-5xl mb-4">❌</div>
      <h1 class="text-2xl font-bold mb-2">Ungültiger Code</h1>
      <p class="text-muted mb-6">{{ codeError }}</p>
      <UButton to="/" variant="ghost" icon="i-lucide-arrow-left">Zurück</UButton>
    </div>

    <!-- Booking complete -->
    <div v-else-if="bookingComplete">
      <div class="text-center mb-8">
        <div class="text-5xl mb-4">🎉</div>
        <h1 class="text-2xl font-bold mb-2">Anmeldung erfolgreich!</h1>
        <p class="text-muted">
          Du erhältst weitere Informationen über die WhatsApp Gruppe.
        </p>
      </div>

      <div class="space-y-4">
        <div v-for="result in results" :key="result.reservationId" class="rounded-xl border p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="font-medium">{{ getReservationName(result.reservationId) }}</span>
            <BookingStatusBadge :status="result.status" />
          </div>
          <BookingCancellationTokenDisplay :token="result.cancellationToken" />
        </div>
      </div>

      <UAlert
        v-if="results.some(r => r.status === 'waitlisted')"
        class="mt-6"
        color="warning"
        icon="i-lucide-clock"
        title="Du bist auf der Warteliste"
        description="Du rückst automatisch nach, wenn ein Platz frei wird."
      />
    </div>

    <!-- Booking form -->
    <div v-else-if="codeData">
      <div class="mb-8">
        <NuxtLink to="/" class="text-muted text-sm flex items-center gap-1 mb-4 hover:text-foreground transition-colors">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Zurück
        </NuxtLink>
        <h1 class="text-2xl font-bold mb-1">Anmeldung</h1>
        <p v-if="codeData.label" class="text-muted">{{ codeData.label }}</p>
      </div>

      <!-- Reservations overview -->
      <div class="mb-8 space-y-3">
        <h2 class="font-semibold text-sm uppercase tracking-wide text-muted">
          Dein{{ codeData.reservations.length > 1 ? 'e Termine' : ' Termin' }}
        </h2>
        <div
          v-for="r in codeData.reservations"
          :key="r.id"
          class="border rounded-xl p-4 bg-white dark:bg-gray-900"
        >
          <div class="flex justify-between items-start gap-3 mb-3">
            <div>
              <p class="font-semibold">{{ r.name }}</p>
              <p class="text-sm text-muted">
                {{ new Date(r.date).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
              </p>
              <p v-if="r.tent" class="text-sm text-muted">{{ r.tent }}</p>
            </div>
            <ReservationWhatsAppButton v-if="r.whatsapp_link" :link="r.whatsapp_link" />
          </div>
          <ReservationSeatAvailabilityBar :total="r.total_seats" :available="r.available_seats" />
          <p v-if="r.total_cost" class="text-sm text-muted mt-2">
            {{ (r.total_cost / r.total_seats).toFixed(2) }} € pro Platz
          </p>
        </div>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <h2 class="font-semibold text-sm uppercase tracking-wide text-muted">Deine Daten</h2>

        <div>
          <label class="block text-sm font-medium mb-1.5">
            Name <span class="text-error-500">*</span>
          </label>
          <UInput
            v-model="form.guestName"
            placeholder="Max Mustermann"
            size="lg"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1.5">
            Telefon / WhatsApp
            <span class="text-muted font-normal">(optional)</span>
          </label>
          <UInput
            v-model="form.guestContact"
            placeholder="+49 176 ..."
            type="tel"
            size="lg"
          />
        </div>

        <div v-if="allowPlusOne">
          <label class="block text-sm font-medium mb-1.5">
            Begleitung
            <span class="text-muted font-normal">(optional)</span>
          </label>
          <UInput
            v-model="form.plusOneName"
            placeholder="Name deiner Begleitung"
            size="lg"
          />
        </div>

        <UAlert v-if="bookingError" color="error" :description="bookingError" />

        <UButton
          size="lg"
          class="w-full"
          :loading="bookingLoading"
          :disabled="!form.guestName.trim()"
          @click="submit"
        >
          Jetzt anmelden
        </UButton>

        <p class="text-xs text-muted text-center">
          Du erhältst nach der Anmeldung einen Stornierungslink. Bitte speichere diesen sorgfältig.
        </p>
      </div>
    </div>
  </div>
</template>
