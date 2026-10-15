export const instant = false;

import {
  type InvitationItem,
  type UserItem,
  UsersManager,
} from "@/components/admin/modules/users-manager";
import { getPendingInvitationsAction } from "@/server/actions/users";
import { requireAdmin } from "@/server/auth/guard";
import { getAdminUsers } from "@/server/queries/admin";

export default async function AdminUsersPage() {
  const { user } = await requireAdmin();
  const [rawUsers, rawInvitations] = await Promise.all([
    getAdminUsers(),
    getPendingInvitationsAction(),
  ]);

  return (
    <UsersManager
      initialUsers={rawUsers as UserItem[]}
      initialInvitations={rawInvitations as InvitationItem[]}
      currentUserId={user.id}
    />
  );
}
