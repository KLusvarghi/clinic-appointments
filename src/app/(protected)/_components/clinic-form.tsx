import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "../clinic-form/_components/form";

interface ClinicFormComponentProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

const ClinicFormComponent = ({
  isOpen,
  setIsOpen,
}: ClinicFormComponentProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a clinic</DialogTitle>
          <DialogDescription>Add a clinic to continue.</DialogDescription>
        </DialogHeader>
        <ClinicForm setIsOpen/>
      </DialogContent>
    </Dialog>
  );
};

export default ClinicFormComponent;
