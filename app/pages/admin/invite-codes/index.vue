<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { inviteCodes, loading, fetchAll, remove, toggleActive } = useAdminInviteCodes()

onMounted(() => fetchAll())

const copiedId = ref<string | null>(null)

function joinUrl(code: string) {
  if (import.meta.client) {
    return `${window.location.origin}/join/${code}`
  }
  return `/join/${code}`
}

async function copyJoinUrl(id: string, code: string) {
  await navigator.clipboard.writeText(joinUrl(code))
  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

async function deleteCode(id: string, code: string) {
  if (!window.confirm(`Invite Code "${code}" wirklich löschen?`)) return
  await remove(id)
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        Invite Codes
      </h1>
      <UButton
        to="/admin/invite-codes/new"
        icon="i-lucide-plus"
      >
        Neu
      </UButton>
    </div>

    <div
      v-if="loading"
      class="flex justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="w-8 h-8 animate-spin text-muted"
      />
    </div>

    <div
      v-else-if="inviteCodes.length === 0"
      class="text-center py-12 text-muted"
    >
      Noch keine Invite Codes vorhanden.
    </div>

    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="c in inviteCodes"
        :key="c.id"
        class="border rounded-xl p-4 bg-white dark:bg-gray-900"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-mono font-bold text-lg">{{ c.code }}</span>
              <UBadge
                v-if="!c.is_active"
                color="neutral"
                variant="soft"
                size="xs"
              >
                Inaktiv
              </UBadge>
              <UBadge
                v-if="c.max_guests_per_booking > 1"
                color="info"
                variant="soft"
                size="xs"
              >
                +1 erlaubt
              </UBadge>
            </div>
            <p
              v-if="c.label"
              class="text-sm text-muted"
            >
              {{ c.label }}
            </p>
            <div class="flex flex-wrap gap-1 mt-2">
              <UBadge
                v-for="r in c.invite_code_reservations"
                :key="r.reservation_id"
                color="neutral"
                variant="outline"
                size="xs"
              >
                {{ r.reservations?.name }}
              </UBadge>
            </div>

            <!-- Join URL -->
            <div class="mt-2 flex items-center gap-2">
              <code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded truncate max-w-xs">
                {{ joinUrl(c.code) }}
              </code>
              <UButton
                size="xs"
                variant="ghost"
                :icon="copiedId === c.id ? 'i-lucide-check' : 'i-lucide-copy'"
                @click="copyJoinUrl(c.id, c.code)"
              />
            </div>
          </div>

          <div class="flex gap-1 shrink-0">
            <UButton
              size="sm"
              variant="ghost"
              :icon="c.is_active ? 'i-lucide-toggle-right' : 'i-lucide-toggle-left'"
              :color="c.is_active ? 'success' : 'neutral'"
              @click="toggleActive(c.id, !!c.is_active)"
            />
            <UButton
              size="sm"
              variant="ghost"
              color="error"
              icon="i-lucide-trash-2"
              @click="deleteCode(c.id, c.code)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
