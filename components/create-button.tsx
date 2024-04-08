"use client";

import { FunctionComponent } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface CreateButtonProps {
  children: React.ReactNode;
  component: React.ReactNode;
  asChild?: boolean;
}

export const CreateButton = ({
  children,
  component,
  asChild,
}: CreateButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent className="p-0 w-auto bg-transparent border-none">
        {component}
      </DialogContent>
    </Dialog>
  );
};
