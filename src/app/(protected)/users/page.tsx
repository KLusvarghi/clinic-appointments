import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";

import AddUserButton from "./_components/add-user-button";
import UpsertUserForm from "./_components/upset-user-form";

const UsersPage = () => {
  return (
    <WithAuthentication mustHaveRole="ADMIN">
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Maneger Users</PageTitle>
            <PageDescription>Add or edit a collaborator to your clinic</PageDescription>
          </PageHeaderContent>
            <PageActions>
              <AddUserButton />   
            </PageActions>
        </PageHeader>
        <PageContent>
          <UpsertUserForm />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default UsersPage;
