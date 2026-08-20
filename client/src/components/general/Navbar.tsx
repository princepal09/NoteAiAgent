import { Bot, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logoutUser } from "@/api/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const{user} = useSelector((state:RootState) => state.auth);

  console.log("user", user);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(setLogout());
      toast.success("Logout successfully");
      navigate("/")
    } catch (err: any) {
      toast.error(err);
    }
  };

  return (
    <header className="border-b border-white/10 bg-[#111113]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#1f1f23]">
            <Bot className="h-5 w-5 text-violet-400" />
          </div>

          <span className="text-lg font-semibold text-white">AI Notes</span>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout} 
          className="gap-2 text-zinc-400 cursor-pointer hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
