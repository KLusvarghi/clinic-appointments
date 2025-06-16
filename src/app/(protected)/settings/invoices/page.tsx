"use client";
import { DownloadIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const invoices = [
  {
    id: "1",
    date: "June 2025",
    status: "PENDING",
    paymentMethod: "Mastercard ending in 4339",
    amount: "$20.00",
  },
  {
    id: "2",
    date: "May 2025",
    status: "PAID",
    paymentMethod: "Mastercard ending in 4339",
    amount: "$20.00",
  },
  {
    id: "3",
    date: "April 2025",
    status: "PAID",
    paymentMethod: "Mastercard ending in 4339",
    amount: "$20.00",
  },
];

export default function InvoicesSettingsPage() {
  return (
    <div className="space-y-8 pt-12">
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              <div className="font-medium">{invoice.date}</div>
              <Badge
                variant={invoice.status === "PAID" ? "default" : "secondary"}
                className={invoice.status === "PAID" ? "bg-green-600" : ""}
              >
                {invoice.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-4 w-6 items-center justify-center rounded-sm bg-red-500">
                  <div className="h-3 w-4 rounded-sm bg-red-600"></div>
                </div>
                <span className="text-muted-foreground text-sm">
                  {invoice.paymentMethod}
                </span>
              </div>

              <div className="font-semibold">{invoice.amount}</div>

              <Button variant="outline" size="sm">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
