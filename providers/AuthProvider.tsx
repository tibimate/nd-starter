"use client";

import { SessionProvider } from "next-auth/react";
import React, { PropsWithChildren, ReactNode } from "react";


interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: PropsWithChildren<Props>) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
export default AuthProvider;
