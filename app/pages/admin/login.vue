<script setup lang="ts">
definePageMeta({ layout: false })

const { signIn } = useAuth()
const form = reactive({ email: '', password: '' })
const error = ref<string | null>(null)
const loading = ref(false)

async function onSubmit() {
  if (!form.email || !form.password) return
  loading.value = true
  error.value = null

  const { error: signInError } = await signIn(form.email, form.password)
  if (signInError) {
    error.value = signInError.message
  } else {
    await navigateTo('/admin')
  }
  loading.value = false
}
</script>

<template>
  <UApp>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <UCard class="w-full max-w-sm">
        <template #header>
          <div class="text-center py-2">
            <div class="text-4xl mb-2">
              🍺
            </div>
            <h1 class="text-xl font-bold">
              Wiesn Admin
            </h1>
            <p class="text-sm text-muted">
              Anmelden um fortzufahren
            </p>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">E-Mail</label>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="admin@example.com"
              size="lg"
              @keyup.enter="onSubmit"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5">Passwort</label>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              size="lg"
              @keyup.enter="onSubmit"
            />
          </div>
          <UAlert
            v-if="error"
            color="error"
            :description="error"
          />
          <UButton
            class="w-full"
            size="lg"
            :loading="loading"
            @click="onSubmit"
          >
            Anmelden
          </UButton>
        </div>
      </UCard>
    </div>
  </UApp>
</template>
