<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

const { fetchOne, update } = useAdminReservations()
const router = useRouter()
const loading = ref(false)
const fetchLoading = ref(true)
const error = ref<string | null>(null)

const form = reactive({
  name: '',
  date: '',
  tent: '',
  total_seats: 10,
  total_cost: '',
  whatsapp_link: '',
  notes: ''
})

onMounted(async () => {
  const { data } = await fetchOne(id)
  if (data) {
    form.name = data.name
    form.date = data.date
    form.tent = data.tent ?? ''
    form.total_seats = data.total_seats
    form.total_cost = data.total_cost?.toString() ?? ''
    form.whatsapp_link = data.whatsapp_link ?? ''
    form.notes = data.notes ?? ''
  }
  fetchLoading.value = false
})

async function onSubmit() {
  if (!form.name.trim() || !form.date || !form.total_seats) return
  loading.value = true
  error.value = null

  const { error: updateError } = await update(id, {
    name: form.name.trim(),
    date: form.date,
    tent: form.tent.trim() || null,
    total_seats: Number(form.total_seats),
    total_cost: form.total_cost !== '' ? Number(form.total_cost) : null,
    whatsapp_link: form.whatsapp_link.trim() || null,
    notes: form.notes.trim() || null
  })

  if (updateError) {
    error.value = updateError.message
  } else {
    router.push(`/admin/reservations/${id}`)
  }
  loading.value = false
}
</script>

<template>
  <div class="max-w-lg">
    <div class="flex items-center gap-3 mb-6">
      <UButton
        :to="`/admin/reservations/${id}`"
        variant="ghost"
        icon="i-lucide-arrow-left"
        size="sm"
      />
      <h1 class="text-2xl font-bold">
        Reservierung bearbeiten
      </h1>
    </div>

    <div
      v-if="fetchLoading"
      class="flex justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="w-6 h-6 animate-spin text-muted"
      />
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <div>
        <label class="block text-sm font-medium mb-1.5">Name <span class="text-error-500">*</span></label>
        <UInput
          v-model="form.name"
          placeholder="Hofbräu Samstag 20.09."
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Datum <span class="text-error-500">*</span></label>
        <UInput
          v-model="form.date"
          type="date"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Zelt</label>
        <UInput
          v-model="form.tent"
          placeholder="Hofbräuzelt"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Plätze gesamt <span class="text-error-500">*</span></label>
        <UInput
          v-model.number="form.total_seats"
          type="number"
          min="1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Gesamtkosten (€)</label>
        <UInput
          v-model="form.total_cost"
          type="number"
          min="0"
          step="0.01"
          placeholder="z.B. 800.00"
        />
        <p class="text-xs text-muted mt-1">
          Preis pro Platz wird automatisch berechnet
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">WhatsApp Gruppenlink</label>
        <UInput
          v-model="form.whatsapp_link"
          placeholder="https://chat.whatsapp.com/..."
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Notizen</label>
        <UTextarea
          v-model="form.notes"
          placeholder="Interne Notizen..."
          :rows="3"
        />
      </div>

      <UAlert
        v-if="error"
        color="error"
        :description="error"
      />

      <div class="flex gap-3 pt-2">
        <UButton
          :to="`/admin/reservations/${id}`"
          color="neutral"
          variant="ghost"
        >
          Abbrechen
        </UButton>
        <UButton
          :loading="loading"
          :disabled="!form.name.trim() || !form.date"
          @click="onSubmit"
        >
          Speichern
        </UButton>
      </div>
    </div>
  </div>
</template>
