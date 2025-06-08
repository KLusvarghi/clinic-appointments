"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { addAppointment } from "@/actions/add-appointment";
import { getAvailableTimes } from "@/actions/get-available-times";
import type { TimeSlot } from "@/actions/get-available-times/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable, patientsTable } from "@/db/new_schema";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  patientId: z.string().min(1, {
    message: "Patient is required.",
  }),
  doctorId: z.string().min(1, {
    message: "Doctor is required.",
  }),
  appointmentPrice: z.number().min(1, {
    message: "Appointment price is required.",
  }),
  date: z.date({
    message: "Date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required.",
  }),
});

interface AddAppointmentFormProps {
  isOpen: boolean;
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  onSuccess: () => void;
}

export function AddAppointmentForm({
  isOpen,
  patients,
  doctors,
  onSuccess,
}: AddAppointmentFormProps) {
  const createAppointmentAction = useAction(addAppointment, {
    onSuccess: () => {
      toast.success("Appointment created successfully");
      onSuccess();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    createAppointmentAction.execute({
      ...values,
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true, // para que o form seja resetado quando o dialog for fechado
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentPrice: 0,
      date: undefined,
      time: "",
    },
  });

  // o metodo "watch" é usado para monitorar o valor de um campo do form
  const selectedDoctorId = form.watch("doctorId");
  const selectedPatientId = form.watch("patientId");
  const selectedDate = form.watch("date");

  // uma quety é basicamente uma função que retorna um valor, e o react query é responsável por gerenciar o estado dessa query, assim, toda a aplicação consegue usar o react query
  // basicamente, é como se fosse fazer um get para a api / backend. Não é uma regra ser apenas um "GET", pode ser um "POST", "PUT", "DELETE", etc, mas é mais comum ser um "GET" porque o reqct query tem o sistema de cache, etc
  const { data: availableTimes } = useQuery({
    // queryKey é o nome da query, e o array é o que vai ser usado para identificar a query, e dentro dela precisamos passar todas as dependencias da query (os parametros usados para buscar os dados)
    queryKey: ["available-times", selectedDate, selectedDoctorId],
    // queryFn é a função que vai ser executada para buscar os dados
    queryFn: () =>
      getAvailableTimes({
        // passando minah server action / api para buscar os dados
        date: dayjs(selectedDate).format("YYYY-MM-DD"), // Precisando formatar para "YYYY-MM-DD", por isso usar o dayjs
        doctorId: selectedDoctorId, // passando o id do médico
      }),
    // se olhar no devtools, vai ver que a query é executada mesmo antes de selecioanr datra, e para evitar isso fazemos:
    enabled: !!selectedDate && !!selectedDoctorId, // para que a query seja executada apenas quando o date e o doctorId forem selecionados
  });

  // Atualizar o preço quando o médico for selecionado, e se mudar o médico, ele muda o appointmentPrice
  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id === selectedDoctorId,
      );
      if (selectedDoctor) {
        // setando/mudnado o valor do campo "appointmentPrice", pelo valor o appointmentPrice encontrado no banco que é referente ao correspondente doctor
        form.setValue(
          "appointmentPrice",
          selectedDoctor.appointmentPriceInCents / 100,
        );
      }
    }
  }, [selectedDoctorId, doctors, form]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: "",
        doctorId: "",
        appointmentPrice: 0,
        date: undefined,
        time: "",
      });
    }
  }, [isOpen, form]);

  // essa função é responsavel por verificar se a data selecionada está disponível para o médico selecionado (neste caso são os dias da semana)
  const isDateAvailable = (date: Date) => {
    if (!selectedDoctorId) return false;
    const selectedDoctor = doctors.find(
      (doctor) => doctor.id === selectedDoctorId,
    );
    if (!selectedDoctor) return false;
    const dayOfWeek = date.getDay();
    return (
      dayOfWeek >= selectedDoctor?.availableFromWeekDay &&
      dayOfWeek <= selectedDoctor?.availableToWeekDay
    );
  };

  // assim o campo de date e time só será habilitado quando o paciente e o médico forem selecionados
  const isDateTimeEnabled = selectedPatientId && selectedDoctorId;

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>New appointment</DialogTitle>
        <DialogDescription>
          Create a new appointment for your clinic.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* para cada paciente no banco de dados ele renderiza um select item */}
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* para cada médico no banco de dados ele renderiza um select item */}
                    {doctors.map((doctor) => (
                      // sendo o value o id do doctor, que será ele que usaremos para validar se o médico está disponível no dia selecionado
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment price</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  thousandSeparator="."
                  prefix="R$ "
                  allowNegative={false}
                  // enquanto o médico não for selecionado, o campo de preço não será habilitado
                  disabled={!selectedDoctorId}
                  customInput={Input}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled={!isDateTimeEnabled}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          // isso fará com que o calendario mostre a data em português
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          // format(field.value, "PPP")
                          <span>Select a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || !isDateAvailable(date)
                      }
                      initialFocus
                      // para que o calendario mostre os meses em português
                      // locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!isDateTimeEnabled || !selectedDate}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* aqui estamos renderizando os horários disponíveis para o médico */}
                    {availableTimes?.data?.map((time: TimeSlot) => (
                      <SelectItem
                        key={time.value}
                        value={time.value}
                        // caso o valor esteja com o time.available como false, ele desabilita a text
                        disabled={!time.available}
                      >
                        {/* E se o valor estiver desabilitado ele exibe a mensagem */}
                        {time.label} {!time.available && "(Unavailable)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={createAppointmentAction.isPending}>
              {createAppointmentAction.isPending
                ? "Creating..."
                : "Create appointment"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
