import { cn } from "@/lib/utils"; // Certifique-se de ter essa função utilitária

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageProps) => {
  return <div className={cn("space-y-6 p-6", className)}>{children}</div>;
};

export const PageHeader = ({ children, className }: PageProps) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {children}
    </div>
  );
};

export const PageHeaderContent = ({ children, className }: PageProps) => {
  return <div className={cn("space-y-1", className)}>{children}</div>;
};

export const PageTitle = ({ children, className }: PageProps) => {
  return <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>;
};

export const PageDescription = ({ children, className }: PageProps) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
};

export const PageActions = ({ children, className }: PageProps) => {
  return <div className={cn("flex items-center gap-2", className)}>{children}</div>;
};

export const PageContent = ({ children, className }: PageProps) => {
  return <div className={cn("space-y-6", className)}>{children}</div>;
};
