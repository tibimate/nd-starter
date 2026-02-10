import { PropsWithChildren, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: PropsWithChildren<Props>) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="max-w-sm w-full">
        {children}
      </div>
    </div>
  );
}
