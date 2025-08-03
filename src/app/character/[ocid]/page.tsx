import { Metadata } from "next";
import { CharacterDetailsClient } from "./character-details-client";

interface PageProps {
  params: { ocid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate static params for popular characters (optional optimization)
export async function generateStaticParams() {
  // For MVP, return empty array to generate pages on-demand
  return [];
}

// Generate dynamic metadata for SEO - simplified for MVP
export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { ocid } = await params;
  const resolvedSearchParams = await searchParams;
  const characterName = resolvedSearchParams.name as string;

  // Use simple metadata without server-side API calls for MVP
  const title = characterName
    ? `${characterName} - MapleStory SEA Character`
    : "Character Details - MapleStory SEA";

  const description = characterName
    ? `View ${characterName}'s detailed character information including stats, equipment, and more.`
    : "View detailed character information including stats, equipment, and more.";

  return {
    title: `${title} | MapleStory SEA Character Lookup`,
    description,
    keywords: [
      characterName || "character",
      "MapleStory SEA",
      "character stats",
      "equipment",
      "level",
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "profile",
      siteName: "MapleStory SEA Character Lookup",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `/character/${ocid}`,
    },
  };
}

// Server component - simplified for MVP (no server-side data fetching)
export default async function CharacterPage({
  params,
  searchParams,
}: PageProps) {
  const { ocid } = await params;
  const resolvedSearchParams = await searchParams;

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
    <CharacterDetailsClient
      ocid={ocid}
      characterName={resolvedSearchParams.name as string}
      initialData={undefined}
    />
  );
}
