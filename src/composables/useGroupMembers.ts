import { ref, watch, type MaybeRefOrGetter, toValue } from 'vue'
import type { User } from '@/types/user'
import { groupsService } from '@/services/groups.service'
import { useAuthStore } from '@/stores/auth.store'

export const useGroupMembers = (group: MaybeRefOrGetter<string>) => {
  const members = ref<User[]>([])
  const { user } = useAuthStore()

  const getMembers = async (selectedGroup: string) => {
    if (!selectedGroup) return

    const group = await groupsService.get(selectedGroup)

    members.value = group.memberships
      .filter((membership) => membership.user.id !== user.id)
      .map((membership) => membership.user)
  }

  watch(() => toValue(group), getMembers, { immediate: true })

  return members
}
