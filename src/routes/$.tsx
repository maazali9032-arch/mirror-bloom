import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { resolveSlug } from "@/lib/zar/slug";
import { fetchInvitation } from "@/lib/zar/invitation";
import { Invitation } from "@/components/zar/Invitation";
import { BrandTicker } from "@/components/zar/BrandTicker";
import {
  ErrorState,
  FallbackState,
  LoadingState,
  NotFoundState,
} from "@/components/zar/states";

export const Route = createFileRoute("/$")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Wedding Invitation" },
      {
        name: "description",
        content: "You are warmly invited — open this digital wedding invitation.",
      },
      { property: "og:title", content: "Wedding Invitation" },
      {
        property: "og:description",
        content: "You are warmly invited — open this digital wedding invitation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitationRoute,
});

function InvitationRoute() {
  const { _splat } = Route.useParams();
  const slug = useMemo(() => resolveSlug(`/${_splat ?? ""}`), [_splat]);

  const query = useQuery({
    queryKey: ["zar-invitation", slug],
    queryFn: () => fetchInvitation(slug as string),
    enabled: Boolean(slug),
    retry: 1,
    staleTime: 60_000,
  });

  if (!slug) return <NotFoundState />;
  if (query.isPending) return <LoadingState />;
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />;

  const payload = query.data!;
  if (payload.state === "not_found") return <NotFoundState />;
  if (payload.state === "fallback") {
    return <FallbackState brandName={payload.brand_display_name} />;
  }

  return (
    <>
      <Invitation payload={payload} />
      <BrandTicker brandName={payload.brand_display_name} />
    </>
  );
}
