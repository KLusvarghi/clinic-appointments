import { redirect } from "next/navigation";

import WithAuthentication from "@/hocs/with-authentication";

const ProfilePage = async () => {
  return (
    <WithAuthentication mustHaveClinic>
      {redirect("/settings/general")}
    </WithAuthentication>
  );
};

export default ProfilePage;
