import { createFileRoute } from "@tanstack/react-router";
import { NotFoundState } from "@/components/zar/states";

/**
 * "/" never shows an invitation. Every invitation is selected only by
 * the final non-empty pathname segment (/:slug).
 */
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Wedding Invitations" },
      {
        name: "description",
        content: "Open your invitation using the personal link shared with you.",
      },
      { property: "og:title", content: "Digital Wedding Invitations" },
      {
        property: "og:description",
        content: "Open your invitation using the personal link shared with you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <NotFoundState />,
});
