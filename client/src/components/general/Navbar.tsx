import { Bot, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const handleLogout = () => {
    // Later:
    // remove token
    // navigate("/login")

    console.log("Logout");
  };

  return (
    <header className="border-b border-white/10 bg-[#111113]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#1f1f23]">
            <Bot className="h-5 w-5 text-violet-400" />
          </div>

          <span className="text-lg font-semibold text-white">
            AI Notes
          </span>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="gap-2 text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />

          Logout
        </Button>
      </div>
    </header>
  );
}