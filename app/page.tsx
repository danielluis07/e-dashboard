import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-r from-red-100 to-fuchsia-400">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}>
          🔒Auth
        </h1>
        <p className="text-white text-lg">Serviço de autenticação</p>
      </div>
      <div>
        <LoginButton mode="modal" asChild>
          <Button variant="secondary" size="lg">
            Entrar
          </Button>
        </LoginButton>
      </div>
    </div>
  );
}
