"use client";

import { ClipLoader } from "react-spinners";

interface ExitModalProps {
  exited: boolean;
}

export const ExitModal = ({ exited }: ExitModalProps) => {
  if (!exited) return null;

  return (
    <div className="fixed flex justify-center items-center h-full inset-0 z-50 bg-milky opacity-50">
      <ClipLoader color="#d946ef" />
    </div>
  );
};
