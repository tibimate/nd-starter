"use client";

import { PropsWithChildren, ReactNode } from "react";
import { useSession } from "next-auth/react";

export default function App({ children }: PropsWithChildren<{ children: ReactNode }>) {  
  const { status } = useSession();
  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (<>{children}</>);
}
