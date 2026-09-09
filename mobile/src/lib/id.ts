/** Identifiant court, unique à l'échelle de l'appareil. */
export function createId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
