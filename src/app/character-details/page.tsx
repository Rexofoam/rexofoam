"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CharacterDetailsPage() {
  const searchParams = useSearchParams();
  const ocid = searchParams.get("ocid");
  const [characterData, setCharacterData] = useState<any>(null);
  const [characterStat, setCharacterStat] = useState<any>(null);
  const [hyperStat, setHyperStat] = useState<any>(null);
  const [ability, setAbility] = useState<any>(null);
  const [itemIcon, setItemIcon] = useState<string>("");
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ocid) return;
    setLoading(true);
    setError("");
    Promise.all([
      fetch(
        `https://open.api.nexon.com/maplestorysea/v1/character/basic?ocid=${encodeURIComponent(
          ocid
        )}`,
        {
          headers: {
            "x-nxopen-api-key":
              "test_ea78af0bb88d495a94b6f66066c720e395fdf4f7b152747fba72a401626e4bfdefe8d04e6d233bd35cf2fabdeb93fb0d",
          },
        }
      ).then((res) => res.json()),
      fetch(
        `https://open.api.nexon.com/maplestorysea/v1/character/stat?ocid=${encodeURIComponent(
          ocid
        )}`,
        {
          headers: {
            "x-nxopen-api-key":
              "test_ea78af0bb88d495a94b6f66066c720e395fdf4f7b152747fba72a401626e4bfdefe8d04e6d233bd35cf2fabdeb93fb0d",
          },
        }
      ).then((res) => res.json()),
      fetch(
        `https://open.api.nexon.com/maplestorysea/v1/character/hyper-stat?ocid=${encodeURIComponent(
          ocid
        )}`,
        {
          headers: {
            "x-nxopen-api-key":
              "test_ea78af0bb88d495a94b6f66066c720e395fdf4f7b152747fba72a401626e4bfdefe8d04e6d233bd35cf2fabdeb93fb0d",
          },
        }
      ).then((res) => res.json()),
      fetch(
        `https://open.api.nexon.com/maplestorysea/v1/character/ability?ocid=${encodeURIComponent(
          ocid
        )}`,
        {
          headers: {
            "x-nxopen-api-key":
              "test_ea78af0bb88d495a94b6f66066c720e395fdf4f7b152747fba72a401626e4bfdefe8d04e6d233bd35cf2fabdeb93fb0d",
          },
        }
      ).then((res) => res.json()),
      fetch(
        `https://open.api.nexon.com/maplestorysea/v1/character/item-equipment?ocid=${encodeURIComponent(
          ocid
        )}`,
        {
          headers: {
            "x-nxopen-api-key":
              "test_ea78af0bb88d495a94b6f66066c720e395fdf4f7b152747fba72a401626e4bfdefe8d04e6d233bd35cf2fabdeb93fb0d",
          },
        }
      ).then((res) => res.json()),
    ])
      .then(
        ([
          basicData,
          statData,
          hyperStatData,
          abilityData,
          itemDetailsData,
        ]) => {
          setCharacterData(basicData);
          setCharacterStat(statData);
          setHyperStat(hyperStatData);
          setAbility(abilityData);
          setItemIcon("");
          setItemDetails(itemDetailsData);
        }
      )
      .catch(() => {
        setError("Failed to fetch character details.");
      })
      .finally(() => setLoading(false));
  }, [ocid]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white bg-opacity-80">
        <div className="flex flex-col items-center justify-center h-full w-full">
          <img
            src="/images/mushroom-loader.gif"
            alt="Loading..."
            className="w-32 h-32 mb-6"
          />
          <p className="text-lg font-semibold text-black">
            Loading character data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/images/maplestory-motion-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Header Section */}
      <header className="w-full flex items-center justify-center px-8 py-4 bg-gray/90 backdrop-blur-lg shadow-md z-10">
        <img
          src="/images/logo-flat.png"
          alt="Maplesea Logo Flat"
          className="h-12 w-auto object-contain transition-transform duration-200 hover:scale-105 opacity-100"
          style={{ cursor: "pointer" }}
        />
      </header>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-3/4 max-w-4xl bg-opacity-90 backdrop-blur-md max-h-[80vh] overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4 text-center text-black">
            Character Details
          </h1>
          {error && <p className="text-center text-black">{error}</p>}
          {!error && characterData && (
            <div className="space-y-2 text-black">
              <p>
                <strong>OCID:</strong> {ocid}
              </p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-black">
                {JSON.stringify(characterData, null, 2)}
              </pre>
              {characterStat && (
                <>
                  <h2 className="text-xl font-semibold mt-6 mb-2 text-center text-black">
                    Character Stat
                  </h2>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-black">
                    {JSON.stringify(characterStat, null, 2)}
                  </pre>
                </>
              )}
              {hyperStat && (
                <>
                  <h2 className="text-xl font-semibold mt-6 mb-2 text-center text-black">
                    Hyper Stat
                  </h2>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-black">
                    {JSON.stringify(hyperStat, null, 2)}
                  </pre>
                </>
              )}
              {ability && (
                <>
                  <h2 className="text-xl font-semibold mt-6 mb-2 text-center text-black">
                    Ability
                  </h2>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-black">
                    {JSON.stringify(ability, null, 2)}
                  </pre>
                </>
              )}
              {itemDetails && (
                <>
                  <h2 className="text-xl font-semibold mt-6 mb-2 text-center text-black">
                    Item Details
                  </h2>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-black">
                    {JSON.stringify(itemDetails, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
          {!error && !characterData && (
            <p className="text-center text-black">No character data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
