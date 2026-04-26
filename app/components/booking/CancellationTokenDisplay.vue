<script setup lang="ts">
const props = defineProps<{
  token: string
}>()

const copied = ref(false)

const cancelUrl = computed(() => {
  if (import.meta.client) {
    return `${window.location.origin}/cancel/${props.token}`
  }
  return `/cancel/${props.token}`
})

async function copy() {
  await navigator.clipboard.writeText(cancelUrl.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <div class="rounded-xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-950 p-4">
    <p class="font-semibold text-amber-800 dark:text-amber-200 mb-1">
      ⚠️ Stornierungslink speichern!
    </p>
    <p class="text-sm text-amber-700 dark:text-amber-300 mb-3">
      Nur mit diesem Link kannst du deine Buchung stornieren. Speichere ihn jetzt!
    </p>
    <div class="rounded-lg bg-white dark:bg-gray-900 border p-3 font-mono text-xs break-all mb-2">
      {{ cancelUrl }}
    </div>
    <UButton
      size="sm"
      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
      color="warning"
      variant="soft"
      @click="copy"
    >
      {{ copied ? 'Kopiert!' : 'Link kopieren' }}
    </UButton>
  </div>
</template>
