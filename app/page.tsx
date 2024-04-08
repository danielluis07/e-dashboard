import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-r from-fuchsia-500 to-pink-500">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold text-white drop-shadow-md">
          Seja Bem vindo!
        </h1>
        <p className="text-milky text-lg font-bold">
          Clique no botão abaixo para entrar no Dashboard
        </p>
        <div>
          <LoginButton mode="modal" asChild>
            <Button variant="secondary" size="lg">
              Entrar
            </Button>
          </LoginButton>
        </div>
      </div>
    </div>
  );
}
