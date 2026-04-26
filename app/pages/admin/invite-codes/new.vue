<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { create } = useAdminInviteCodes()
const { reservations, fetchAll: fetchReservations } = useAdminReservations()
const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  code: '',
  label: '',
  max_guests_per_booking: 1,
  is_active: true,
  selectedReservationIds: [] as string[]
})

onMounted(() => fetchReservations())

function toggleReservation(id: string) {
  const idx = form.selectedReservationIds.indexOf(id)
  if (idx === -1) {
    form.selectedReservationIds.push(id)
  }
  else {
    form.selectedReservationIds.splice(idx, 1)
  }
}

async function onSubmit() {
  if (!form.code.trim()) return
  loading.value = true
  error.value = null

  const { error: createError } = await create(
    {
      code: form.code.trim().toUpperCase(),
      label: form.label.trim() || undefined,
      is_active: form.is_active,
      max_guests_per_booking: form.max_guests_per_booking
    },
    form.selectedReservationIds
  )

  if (createError) {
    error.value = createError.message
  }
  else {
    router.push('/admin/invite-codes')
  }
  loading.value = false
}
</script>

<template>
  <div class="max-w-lg">
    <div class="flex items-center gap-3 mb-6">
      <UButton to="/admin/invite-codes" variant="ghost" icon="i-lucide-arrow-left" size="sm" />
      <h1 class="text-2xl font-bold">Neuer Invite Code</h1>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1.5">Code <span class="text-error-500">*</span></label>
        <UInput
          v-model="form.code"
          placeholder="WIESN2025"
          autocapitalize="characters"
          class="font-mono"
        />
        <p class="text-xs text-muted mt-1">Wird automatisch in Großbuchstaben umgewandelt</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Beschreibung (intern)</label>
        <UInput v-model="form.label" placeholder="z.B. Freunde & Familie" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Max. Gäste pro Buchung</label>
        <div class="flex gap-3">
          <UButton
            :variant="form.max_guests_per_booking === 1 ? 'solid' : 'outline'"
            @click="form.max_guests_per_booking = 1"
          >
            1 (nur selbst)
          </UButton>
          <UButton
            :variant="form.max_guests_per_booking === 2 ? 'solid' : 'outline'"
            @click="form.max_guests_per_booking = 2"
          >
            2 (+ Begleitung)
          </UButton>
        </div>
      </div>

      <!-- Reservations -->
      <div>
        <label class="block text-sm font-medium mb-2">Verknüpfte Reservierungen</label>
        <div v-if="reservations.length === 0" class="text-sm text-muted">
          Keine Reservierungen vorhanden. <NuxtLink to="/admin/reservations/new" class="underline">Jetzt erstellen</NuxtLink>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="r in reservations"
            :key="r.id"
            class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            :class="form.selectedReservationIds.includes(r.id) ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' : ''"
            @click="toggleReservation(r.id)"
          >
            <UIcon
              :name="form.selectedReservationIds.includes(r.id) ? 'i-lucide-check-square' : 'i-lucide-square'"
              class="w-4 h-4 shrink-0"
              :class="form.selectedReservationIds.includes(r.id) ? 'text-primary-500' : 'text-muted'"
            />
            <div>
              <p class="text-sm font-medium">{{ r.name }}</p>
              <p class="text-xs text-muted">{{ new Date(r.date).toLocaleDateString('de-DE') }}</p>
            </div>
          </div>
        </div>
      </div>

      <UAlert v-if="error" color="error" :description="error" />

      <div class="flex gap-3 pt-2">
        <UButton to="/admin/invite-codes" color="neutral" variant="ghost">Abbrechen</UButton>
        <UButton :loading="loading" :disabled="!form.code.trim()" @click="onSubmit">
          Erstellen
        </UButton>
      </div>
    </div>
  </div>
</template>
