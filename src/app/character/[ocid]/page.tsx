"use client";

import { useParams, useSearchParams } from "next/navigation";
import { CharacterDetailsClient } from "./character-details-client";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Client component to avoid DYNAMIC_SERVER_USAGE errors
export default function CharacterPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const ocid = params?.ocid as string;
  const characterName = searchParams?.get("name") || undefined;

  // Basic OCID validation
  if (!ocid || ocid.length < 10) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invalid Character ID
          </h1>
          <p className="text-gray-600">
            The character ID provided is not valid.
          </p>
        </div>
      </div>
    );
  }

  // Return client component without server-side data pre-fetching for MVP
  return (
    <ErrorBoundary>
      <CharacterDetailsClient
        ocid={ocid}
        characterName={characterName}
        initialData={undefined}
      />
    </ErrorBoundary>
  );
}
