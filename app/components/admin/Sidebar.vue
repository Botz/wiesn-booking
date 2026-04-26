<script setup lang="ts">
const { signOut } = useAuth()

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: 'i-lucide-layout-dashboard', exact: true },
  { label: 'Reservierungen', to: '/admin/reservations', icon: 'i-lucide-calendar' },
  { label: 'Invite Codes', to: '/admin/invite-codes', icon: 'i-lucide-key' },
  { label: 'Alle Buchungen', to: '/admin/bookings', icon: 'i-lucide-users' }
]
</script>

<template>
  <aside class="w-56 shrink-0 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col min-h-screen">
    <div class="p-4 border-b border-gray-200 dark:border-gray-800">
      <NuxtLink
        to="/admin"
        class="flex items-center gap-2"
      >
        <span class="text-2xl">🍺</span>
        <div>
          <p class="font-bold text-sm leading-tight">Wiesn Booking</p>
          <p class="text-xs text-muted">Admin</p>
        </div>
      </NuxtLink>
    </div>

    <nav class="flex-1 p-3 flex flex-col gap-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
        active-class="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-medium"
        :exact="item.exact"
      >
        <UIcon
          :name="item.icon"
          class="w-4 h-4 shrink-0"
        />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="p-3 border-t border-gray-200 dark:border-gray-800">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-log-out"
        size="sm"
        class="w-full justify-start"
        @click="signOut"
      >
        Abmelden
      </UButton>
    </div>
  </aside>
</template>
