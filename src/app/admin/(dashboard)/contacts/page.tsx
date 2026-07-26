import type { ContactRequest } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import { ContactRow } from "./contact-row";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  let requests: ContactRequest[] = [];
  let dbError = false;

  try {
    requests = await prisma.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load contact requests", error);
    dbError = true;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-ink">Demandes de contact</h1>

      {dbError && (
        <div className="rounded-xl border border-accent/30 bg-accent-soft p-4 text-sm text-accent-dark">
          Impossible de charger les demandes : la base de données n&apos;est
          pas accessible.
        </div>
      )}

      {!dbError && requests.length === 0 && (
        <div className="rounded-card border border-dashed border-line p-12 text-center text-sm text-anthracite-light/70">
          Aucune demande de contact pour l&apos;instant.
        </div>
      )}

      {!dbError && requests.length > 0 && (
        <div className="overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-anthracite-light/60">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {requests.map((request) => (
                <ContactRow key={request.id} request={request} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
