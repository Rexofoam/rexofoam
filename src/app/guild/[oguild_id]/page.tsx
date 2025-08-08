"use client";

import { useParams, useSearchParams } from "next/navigation";
import { GuildDetailsClient } from "./guild-details-client";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Client component to avoid DYNAMIC_SERVER_USAGE errors
export default function GuildPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const oguild_id = params?.oguild_id as string;
  const guildName = searchParams?.get("name") as string;
  const world = searchParams?.get('world') as string;

  // Basic oguild_id validation
  if (!oguild_id || oguild_id.length < 10) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invalid Guild ID
          </h1>
          <p className="text-gray-600">
            The guild ID provided is not valid.
          </p>
        </div>
      </div>
    );
  }

  // Return client component without server-side data pre-fetching for MVP
  return (
    <ErrorBoundary>
      <GuildDetailsClient
        oguild_id={oguild_id}
        guildName={guildName}
        world={world}
        initialData={undefined}
      />
    </ErrorBoundary>
  );
}
