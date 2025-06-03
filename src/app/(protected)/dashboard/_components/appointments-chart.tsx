"use client";

import dayjs from "dayjs";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrencyInCents } from "@/helpers/currency";

export const description = "An area chart with gradient fill";

interface DailyAppointment {
  date: string;
  appointments: number;
  revenue: number | null;
}

interface AppointmentsChartProps {
  dailyAppointmentsData: DailyAppointment[];
}

export function AppointmentsChart({ dailyAppointmentsData }: AppointmentsChartProps) {
  // Essa variável irá criar um array de 21 dias, 10 dias antes + hoje +10 dias depois
  const chartDays = Array.from({ length: 21 }).map((_, i) =>
    dayjs()
      .subtract(10 - i, "days")
      .format("YYYY-MM-DD"),
  );

  // essa função irá mapear os dias do array chartDays e buscar os dados do dailyAppointmentsData
  // e retornar um novo array com os dados formatados para ser exibido no gráfico
  const chartData = chartDays.map((date) => {
    // para cada dia do array chartDays, ele vai buscar os dados do dailyAppointmentsData
    const dataForDay = dailyAppointmentsData.find((item) => item.date === date);
    return {
      date: dayjs(date).format("DD/MM"), // formatando a data para o formato DD/MM
      fullDate: date,
      appointments: dataForDay?.appointments ?? 0,
      revenue: dataForDay?.revenue ?? 0,
    };
  });

  console.log(chartData)

  const chartConfig = {
    desktop: {
      label: "appointments",
      color: "#0B68F7",
    },
    mobile: {
      label: "revenue",
      color: "#10B981",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments and Revenue</CardTitle>
        <CardDescription>
          Showing total Appointments and Revenue for the last and next 10 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px]">
          <AreaChart
            // accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 30,
              bottom: 20,
              top: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* eixo horizontal que vai mostrar os dias */}
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            {/* sendo esses os eixos verticais, um para a quantidade de agendamentos e outro para a receita */}
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrencyInCents(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return (
                        <>
                          <div className="h-3 w-3 rounded bg-[#10B981]" />
                          <span className="text-muted-foreground">
                            Revenue:
                          </span>
                          <span className="font-semibold">
                            {formatCurrencyInCents(Number(value))}
                          </span>
                        </>
                      );
                    }
                    return (
                      <>
                        <div className="h-3 w-3 rounded bg-[#0B68F7]" />
                        <span className="text-muted-foreground">
                          Appointments:
                        </span>
                        <span className="font-semibold">{value}</span>
                      </>
                    );
                  }}
                  // customização do label do tooltip, para mostrar a data completa
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return dayjs(payload[0].payload?.fullDate).format(
                        "DD/MM/YYYY (dddd)",
                      );
                    }
                    return label;
                  }}
                />
              }
            />{" "}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="appointments"
              stroke="var(--color-appointments)"
              fill="var(--color-appointments)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
