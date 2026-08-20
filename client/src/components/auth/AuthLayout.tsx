import type { ReactNode } from "react";
import { Bot } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4">
      
      {/* Background glow */}
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/15 blur-[140px]" />

      <div className="relative w-full max-w-md">
        
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#18181b] shadow-xl">
            <Bot className="h-8 w-8 text-violet-400" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            AI Notes
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Your intelligent personal workspace
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-white/10 bg-[#18181b] p-6 shadow-2xl sm:p-8">
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {title}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              {description}
            </p>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}