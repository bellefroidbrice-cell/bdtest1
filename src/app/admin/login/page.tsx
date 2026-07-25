"use client";

import { Lock } from "lucide-react";
import { useActionState } from "react";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { login } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <main className="flex flex-1 items-center justify-center bg-mist py-16">
      <Container className="flex max-w-md flex-col items-center">
        <Card className="flex w-full flex-col gap-6 p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-ink">Administration</h1>
            <p className="text-sm text-anthracite-light/70">
              Connectez-vous pour gérer le contenu du site.
            </p>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-ink">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoFocus
                required
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-accent">{state.error}</p>
            )}

            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </Card>
      </Container>
    </main>
  );
}
