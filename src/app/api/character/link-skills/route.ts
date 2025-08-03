import { NextRequest, NextResponse } from "next/server";
import { makeApiRequest, ENDPOINTS } from "@/config/maplestory-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ocid = searchParams.get("ocid");

    if (!ocid) {
      return NextResponse.json(
        { error: "Character OCID is required" },
        { status: 400 }
      );
    }

    const data = await makeApiRequest(ENDPOINTS.CHARACTER_LINK_SKILL, {
      ocid,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching character link skills:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
