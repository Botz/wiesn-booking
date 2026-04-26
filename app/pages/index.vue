<script setup lang="ts">
definePageMeta({ layout: 'default' })

const code = ref('')
const router = useRouter()
const { isOpen, remaining } = useBookingGate()

function join() {
  const trimmed = code.value.trim().toUpperCase()
  if (trimmed) {
    router.push(`/join/${trimmed}`)
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <div class="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <div class="text-7xl mb-6">
        🍺
      </div>
      <h1 class="text-4xl font-bold mb-3">
        Wiesn Booking
      </h1>

      <!-- Countdown -->
      <template v-if="!isOpen">
        <p class="text-lg text-muted mb-8">
          Die Reservierung öffnet am 1. Mai um 08:00 Uhr
        </p>

        <div class="flex justify-center gap-4 mb-8">
          <div
            v-for="(value, label) in { Tage: remaining.days, Std: remaining.hours, Min: remaining.minutes, Sek: remaining.seconds }"
            :key="label"
            class="flex flex-col items-center"
          >
            <span class="text-4xl font-mono font-bold tabular-nums">{{ pad(value) }}</span>
            <span class="text-xs text-muted uppercase tracking-wide mt-1">{{ label }}</span>
          </div>
        </div>

        <p class="text-sm text-muted">
          Halte deinen Einladungscode bereit!
        </p>
      </template>

      <!-- Code entry -->
      <template v-else>
        <p class="text-lg text-muted mb-10">
          Dein Einladungscode für die Oktoberfest-Reservierung
        </p>

        <div class="flex gap-3">
          <UInput
            v-model="code"
            placeholder="Einladungscode eingeben"
            size="lg"
            class="flex-1"
            autocomplete="off"
            autocapitalize="characters"
            @keyup.enter="join"
          />
          <UButton
            size="lg"
            icon="i-lucide-arrow-right"
            :disabled="!code.trim()"
            @click="join"
          >
            Los
          </UButton>
        </div>

        <p class="text-sm text-muted mt-4">
          Du hast keinen Code? Frag den Veranstalter.
        </p>
      </template>
    </div>
  </div>
</template>
