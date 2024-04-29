"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";

interface FormWrapper {
  children: React.ReactNode;
  className?: string;
}

export const FormWrapper = ({ children, className }: FormWrapper) => {
  return (
    <Card className={cn("w-full max-w-7xl", className)}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
