"use client";

import { useRouter } from "next/navigation";
import { IoChevronBackCircle } from "react-icons/io5";
import { IoChevronForwardCircle } from "react-icons/io5";

export const BackForward = () => {
  const route = useRouter();
  return (
    <div className="flex items-center text-gray-400/100 text-4xl ml-5 pt-4">
      <div
        onClick={() => route.back()}
        className="cursor-pointer hover:text-gray-300">
        <IoChevronBackCircle />
      </div>
      <div
        onClick={() => route.forward()}
        className="cursor-pointer hover:text-gray-300">
        <IoChevronForwardCircle />
      </div>
    </div>
  );
};
