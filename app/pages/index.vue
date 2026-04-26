<script setup lang="ts">
definePageMeta({ layout: 'default' })

const code = ref('')
const router = useRouter()

function join() {
  const trimmed = code.value.trim().toUpperCase()
  if (trimmed) {
    router.push(`/join/${trimmed}`)
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <div class="text-7xl mb-6">🍺</div>
      <h1 class="text-4xl font-bold mb-3">Wiesn Booking</h1>
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
    </div>
  </div>
</template>
