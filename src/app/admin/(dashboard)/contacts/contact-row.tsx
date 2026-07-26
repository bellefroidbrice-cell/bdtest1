"use client";

import { useTransition } from "react";

import type { ContactRequest } from "@/generated/prisma/client";
import { CONTACT_REQUEST_TYPES } from "@/lib/validations/contact";

import { markContactHandled } from "./actions";

const TYPE_LABELS = Object.fromEntries(
  CONTACT_REQUEST_TYPES.map((t) => [t.value, t.label]),
);

export function ContactRow({ request }: { request: ContactRequest }) {
  const [isPending, startTransition] = useTransition();
  const isHandled = Boolean(request.handledAt);

  return (
    <tr className="align-top text-ink">
      <td className="px-4 py-3 text-xs text-anthracite-light/60">
        {new Date(request.createdAt).toLocaleDateString("fr-BE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
      <td className="px-4 py-3">
        <span className="font-medium">{request.name}</span>
        <span className="block text-xs text-anthracite-light/60">
          {TYPE_LABELS[request.type] ?? request.type}
        </span>
      </td>
      <td className="px-4 py-3">
        <a href={`mailto:${request.email}`} className="block hover:text-accent">
          {request.email}
        </a>
        {request.phone && (
          <a href={`tel:${request.phone}`} className="block text-xs text-anthracite-light/60 hover:text-accent">
            {request.phone}
          </a>
        )}
      </td>
      <td className="max-w-sm px-4 py-3 text-sm text-anthracite-light/80">
        {request.message}
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              markContactHandled(request.id, !isHandled);
            })
          }
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            isHandled
              ? "bg-success-soft text-success"
              : "bg-mist text-anthracite-light"
          }`}
        >
          {isHandled ? "Traité" : "À traiter"}
        </button>
      </td>
    </tr>
  );
}
