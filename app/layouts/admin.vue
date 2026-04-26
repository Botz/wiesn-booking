<template>
  <UApp>
    <div class="flex min-h-screen">
      <AdminSidebar />
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </UApp>
</template>
