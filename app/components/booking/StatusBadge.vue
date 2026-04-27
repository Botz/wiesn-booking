<script setup lang="ts">
const props = defineProps<{
  status: 'confirmed' | 'waitlisted' | 'cancelled'
}>()

const config = computed(() => ({
  confirmed: { color: 'success' as const, label: 'Bestätigt' },
  waitlisted: { color: 'warning' as const, label: 'Warteliste' },
  cancelled: { color: 'neutral' as const, label: 'Storniert' }
}[props.status]))
</script>

<template>
  <UBadge
    :color="config.color"
    variant="soft"
  >
    {{ config.label }}
  </UBadge>
</template>
