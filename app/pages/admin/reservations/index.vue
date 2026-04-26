<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { reservations, loading, fetchAll, remove } = useAdminReservations()

onMounted(() => fetchAll())

async function deleteReservation(id: string, name: string) {
  if (!window.confirm(`Reservierung "${name}" wirklich löschen? Alle Buchungen werden ebenfalls gelöscht.`)) return
  await remove(id)
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Reservierungen</h1>
      <UButton to="/admin/reservations/new" icon="i-lucide-plus">Neu</UButton>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-muted" />
    </div>

    <div v-else-if="reservations.length === 0" class="text-center py-12 text-muted">
      Keine Reservierungen vorhanden.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="r in reservations"
        :key="r.id"
        class="flex items-center justify-between p-4 border rounded-xl bg-white dark:bg-gray-900"
      >
        <div class="min-w-0">
          <p class="font-medium">{{ r.name }}</p>
          <p class="text-sm text-muted">
            {{ new Date(r.date).toLocaleDateString('de-DE') }}
            · {{ r.total_seats }} Plätze
            <span v-if="r.tent"> · {{ r.tent }}</span>
          </p>
        </div>
        <div class="flex gap-1 shrink-0 ml-4">
          <UButton :to="`/admin/reservations/${r.id}`" size="sm" variant="ghost" icon="i-lucide-eye" />
          <UButton :to="`/admin/reservations/${r.id}/edit`" size="sm" variant="ghost" icon="i-lucide-pencil" />
          <UButton
            size="sm"
            variant="ghost"
            color="error"
            icon="i-lucide-trash-2"
            @click="deleteReservation(r.id, r.name)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
