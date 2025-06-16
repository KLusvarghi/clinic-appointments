import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "../clinic-form/_components/form";

const ClinicFormComponent = (isOPen: boolean) => {
  return (
    <Dialog open={isOPen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a clinic</DialogTitle>
          <DialogDescription>Add a clinic to continue.</DialogDescription>
        </DialogHeader>
        <ClinicForm />
      </DialogContent>
    </Dialog>
  );
};

export default ClinicFormComponent;
