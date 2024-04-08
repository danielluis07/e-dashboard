"use client";

import { Card, CardContent, CardHeader } from "./ui/card";

interface FormWrapper {
  children: React.ReactNode;
}

export const FormWrapper = ({ children }: FormWrapper) => {
  return (
    <Card className="w-full max-w-7xl mb-2">
      <CardContent>{children}</CardContent>
    </Card>
  );
};
