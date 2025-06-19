import { userRoleEnum } from "@/db/schema";

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export interface Member {
  id?: string;
  role: UserRole;
  isActive: boolean;
  user?: {
    id: string;
    avatarId: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string | Date;
  } | null;
}
