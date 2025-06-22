"use client";

import classNames from "classnames";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  userId: string | null;
  name: string | null | undefined;
  isActive: boolean;
  useGetAvatar: (userId: string | null) => string | null;
}

export function UserAvatarCellWithHook({
  userId,
  name,
  isActive,
  useGetAvatar,
}: Props) {
  const avatarUrl = useGetAvatar(userId);

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar>
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={`${name ?? "User"} avatar`} />
          ) : (
            <AvatarFallback>
              {name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <span
          className={classNames(
            "border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2",
            {
              "bg-green-500": isActive,
              "bg-red-500": !isActive,
            },
          )}
        >
          <span className="sr-only">{isActive ? "Online" : "Offline"}</span>
        </span>
      </div>
      <div>
        <div className="font-medium">{name ?? "Unnamed"}</div>
      </div>
    </div>
  );
}
