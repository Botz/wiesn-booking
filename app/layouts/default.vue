<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/" class="font-bold text-xl flex items-center gap-2">
          <span>🍺</span>
          <span>Wiesn Booking</span>
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} Wiesn Booking
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
