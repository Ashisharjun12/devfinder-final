'use client';

import { UserProfileDialog } from "./UserProfileDialog";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserNav({ user }: UserNavProps) {
  return (
    <div className="flex items-center gap-4">
      <UserProfileDialog user={user} />
    </div>
  );
}
