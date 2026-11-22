import { createFileRoute } from "@tanstack/react-router";
import { handleMirraApi } from "@/lib/mirra/engine.server";

// MIRRA store + licence API: /api/mirra/<route>. All logic lives in engine.server.ts.
const handle = ({ request, params }: { request: Request; params: { _splat?: string } }) =>
  handleMirraApi(request, params._splat ?? "");

export const Route = createFileRoute("/api/mirra/$")({
  server: { handlers: { GET: handle, POST: handle } },
});
