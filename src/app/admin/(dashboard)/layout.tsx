import { Car, ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";

import { logout } from "@/app/admin/login/actions";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-mist">
      <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-line bg-white p-6">
        <div className="flex flex-col gap-8">
          <Link href="/admin" className="text-lg font-bold tracking-tight text-ink">
            BD <span className="text-accent">Automobile</span>
          </Link>

          <nav className="flex flex-col gap-1">
            <Link
              href="/admin/vehicules"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-mist"
            >
              <Car className="h-4 w-4" />
              Véhicules
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-anthracite-light hover:bg-mist"
          >
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-anthracite-light hover:bg-mist"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
