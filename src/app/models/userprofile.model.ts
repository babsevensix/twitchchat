export interface UserProfile {
  uniqueId?: string | undefined;
  username: string;
  displayName?: string | undefined;

  lastOnlineDate: Date;

  avatarUrl: string | null;
}
