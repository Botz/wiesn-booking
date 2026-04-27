<script setup lang="ts">
const props = defineProps<{
  total: number
  available: number
}>()

const confirmed = computed(() => props.total - props.available)
const percentage = computed(() => Math.round((confirmed.value / props.total) * 100))
const color = computed<'success' | 'warning' | 'error'>(() => {
  if (percentage.value >= 100) return 'error'
  if (percentage.value >= 80) return 'warning'
  return 'success'
})
</script>

<template>
  <div>
    <div class="flex justify-between text-sm mb-1">
      <span class="text-muted">{{ confirmed }} / {{ total }} belegt</span>
      <span
        :class="available === 0 ? 'text-error-500' : 'text-success-500'"
        class="font-medium"
      >
        {{ available }} frei
      </span>
    </div>
    <UProgress
      :value="confirmed"
      :max="total"
      :color="color"
    />
  </div>
</template>
