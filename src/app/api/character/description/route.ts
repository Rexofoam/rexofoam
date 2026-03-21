import { NextRequest, NextResponse } from "next/server";

const DESCRIPTION_SOURCE_URL =
  "https://g.nexonstatic.com/maplestory/cms/v1/classes-jobs";

const normalizeName = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Missing required query parameter: name" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(DESCRIPTION_SOURCE_URL, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch description source" },
        { status: 502 },
      );
    }

    const groups = (await response.json()) as Array<{
      Children?: Array<{ name?: string; description?: string }>;
    }>;

    const normalizedName = normalizeName(name);
    const match = groups
      .flatMap((group) => group.Children ?? [])
      .find((character) =>
        character.name ? normalizeName(character.name) === normalizedName : false,
      );

    if (!match?.description) {
      return NextResponse.json(
        { error: "Character description not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      name,
      description: match.description,
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while retrieving description" },
      { status: 500 },
    );
  }
}