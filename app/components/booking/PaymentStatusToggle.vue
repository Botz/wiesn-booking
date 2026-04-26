<script setup lang="ts">
const props = defineProps<{
  status: 'pending' | 'paid'
  bookingId: string
}>()

const emit = defineEmits<{
  toggle: [id: string, current: string]
}>()
</script>

<template>
  <UButton
    size="xs"
    :color="props.status === 'paid' ? 'success' : 'warning'"
    variant="soft"
    :icon="props.status === 'paid' ? 'i-lucide-check-circle' : 'i-lucide-clock'"
    @click="emit('toggle', props.bookingId, props.status)"
  >
    {{ props.status === 'paid' ? 'Bezahlt' : 'Ausstehend' }}
  </UButton>
</template>
