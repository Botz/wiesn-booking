<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const token = route.params.token as string

const { cancel, loading, error, success, booking } = useCancellation(token)
</script>

<template>
  <div class="max-w-lg mx-auto px-4 py-16 text-center">
    <!-- Success -->
    <div v-if="success">
      <div class="text-5xl mb-4">
        ✅
      </div>
      <h1 class="text-2xl font-bold mb-2">
        Buchung storniert
      </h1>
      <p class="text-muted mb-2">
        Die Buchung von <strong>{{ booking?.guestName }}</strong> für
        <strong>{{ booking?.reservationName }}</strong> wurde storniert.
      </p>
      <p class="text-sm text-muted mb-8">
        Falls du auf der Warteliste warst, wurde die nächste Person automatisch nachgerückt.
      </p>
      <UButton to="/">
        Zurück zur Startseite
      </UButton>
    </div>

    <!-- Error -->
    <div v-else-if="error">
      <div class="text-5xl mb-4">
        ❌
      </div>
      <h1 class="text-2xl font-bold mb-2">
        Fehler
      </h1>
      <p class="text-muted mb-8">
        {{ error }}
      </p>
      <UButton to="/">
        Zurück zur Startseite
      </UButton>
    </div>

    <!-- Confirm prompt -->
    <div v-else>
      <div class="text-5xl mb-4">
        🗑️
      </div>
      <h1 class="text-2xl font-bold mb-2">
        Buchung stornieren
      </h1>
      <p class="text-muted mb-8">
        Möchtest du deine Buchung wirklich stornieren?
        Diese Aktion kann nicht rückgängig gemacht werden.
      </p>
      <div class="flex gap-3 justify-center">
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
        >
          Abbrechen
        </UButton>
        <UButton
          color="error"
          :loading="loading"
          @click="() => { cancel() }"
        >
          Jetzt stornieren
        </UButton>
      </div>
    </div>
  </div>
</template>
