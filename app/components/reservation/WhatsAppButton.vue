<script setup lang="ts">
defineProps<{
  link: string
}>()
</script>

<template>
  <UButton
    :to="link"
    target="_blank"
    icon="i-simple-icons-whatsapp"
    color="success"
    variant="soft"
    size="sm"
  >
    WhatsApp Gruppe
  </UButton>
</template>
