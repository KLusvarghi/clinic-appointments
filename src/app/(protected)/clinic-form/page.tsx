import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WithAuthentication from "@/hocs/with-authentication";

import ClinicForm from "./_components/form";

const ClinicFormPage = () => {
  return (
    <WithAuthentication mustHavePlan mustHaveRole="ADMIN">
      <div>
        <Dialog open>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a clinic</DialogTitle>
              <DialogDescription>Add a clinic to continue.</DialogDescription>
            </DialogHeader>
            <ClinicForm />
          </DialogContent>
        </Dialog>
      </div>
    </WithAuthentication>
  );
};

export default ClinicFormPage;
