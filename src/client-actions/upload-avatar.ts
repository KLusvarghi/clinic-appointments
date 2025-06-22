// export async function uploadAvatar(
//   file: File,
//   options?: { userId?: string; ownerType?: string }
// ): Promise<{ url: string }> {
//   const formData = new FormData();
//   formData.append("file", file);
//   if (options?.userId) formData.append("userId", options.userId);
//   if (options?.ownerType) formData.append("ownerType", options.ownerType);

//   const res = await fetch("/api/upload/avatar", {
//     method: "POST",
//     body: formData,
//   });

//   if (!res.ok) throw new Error("Failed to upload");

//   return res.json();
// }
