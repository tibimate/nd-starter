"use client";

import { Toaster } from "@/components/ui/sonner";
import React, { PropsWithChildren, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ToastProvider({ children }: PropsWithChildren<Props>) {
  return (
    <>
      <Toaster position="top-center" />
      {children}
    </>
  );
}

export default ToastProvider;
