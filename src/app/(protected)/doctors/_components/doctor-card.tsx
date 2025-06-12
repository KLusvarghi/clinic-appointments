"use client";

import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doctorsTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

import { getAvailability } from "../_helpers/availability";
import UpsertDoctorForm from "./upsert-doctor-form";

interface DoctorCardProps {
  // Assim conseguimos pegar o tipo do doctor que vem do banco de dados
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  // state para fechar o dialog após atualizar o médico
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    useState(false);

  const doctorInitials = doctor.name
    .split(" ") // separnado na ocorrencia do espaço
    .map((name) => name[0]) // pegando a primeira letra de cada nome
    .join(""); // juntando as letras em uma string
  const { from, to } = getAvailability(doctor);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          {/* apenas formatamos para o dia da semana */}
          {from.format("dddd")} to {to.format("dddd")}
        </Badge>
        <Badge variant="outline">
          <ClockIcon className="mr-1" />
          {/* Convertendo para hora e minutos */}
          {from.format("HH:mm")} - {to.format("HH:mm")}
        </Badge>
        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {formatCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog
          open={isUpsertDoctorDialogOpen}
          onOpenChange={setIsUpsertDoctorDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">See details</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            isOpen={isUpsertDoctorDialogOpen}
            doctor={{
              ...doctor,
              // o "doctor" é o que vem do banco, então o horário está em UTC, então precisamos converter para o horário local
              availableFromTime: from.format("HH:mm:ss"),
              availableToTime: to.format("HH:mm:ss"),
            }}
            onSuccess={() => setIsUpsertDoctorDialogOpen(false)}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
