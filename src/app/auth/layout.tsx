import Link from "next/link";
import { ReactNode } from "react";

import Authenticated from "@/hocs/authenticated";

export default function AlfaLayout({ children }: { children: ReactNode }) {
  return (
    <Authenticated>
      <div className="bg-muted flex h-screen flex-col items-center justify-center gap-6">
        <div className="h-auto">{children}</div>
        <div className="text-muted-foreground space-x-4 text-center text-sm">
          <Link href="/" className="hover:text-gray-700">
            © Credlin
          </Link>
          <Link href="/privacy-and-terms" className="hover:text-gray-700">
            Privacy & terms
          </Link>
        </div>
      </div>
    </Authenticated>
  );
}
