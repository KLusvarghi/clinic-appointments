
import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";

// import SessionsTable from "./_components/sessions-table";

const SessionsPage = async () => {


  return (
    <WithAuthentication mustHaveRole="ADMIN">
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Active Sessions</PageTitle>
            <PageDescription>Manage active user sessions</PageDescription>
          </PageHeaderContent>
        </PageHeader>
        <PageContent>
          <h1>teste</h1>
          {/* <SessionsTable /> */}
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default SessionsPage;
