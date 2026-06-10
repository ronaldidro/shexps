import { ref, watch, type MaybeRefOrGetter, toValue } from "vue";
import type { User } from "@/types/user";
import { membershipsService } from "@/services/memberships.service";

export const useGroupMembers = (group: MaybeRefOrGetter<string>) => {
  const members = ref<User[]>([]);

  const getMembers = async (selectedGroup: string) => {
    if (!selectedGroup) return;

    const memberships = await membershipsService.getAll({
      group: selectedGroup,
    });

    members.value = memberships.map((membership) => membership.user);
  };

  watch(() => toValue(group), getMembers, { immediate: true });

  return members;
};
