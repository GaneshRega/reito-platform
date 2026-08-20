import { notFound } from "next/navigation";
import { CLIENTS } from "@/lib/admin/data";
import ClientDetail from "./ClientDetail";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = CLIENTS.find(c => c.id === id);
  if (!client) notFound();
  return <ClientDetail client={client} />;
}
