"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { characterDataService } from "@/services/character-data.service";
import { CharacterData } from "@/types/maplestory-api";
import Header from "@/components/Header";
import { buildUrl } from "@/config/routes";

interface CharacterDetailsClientProps {
  ocid: string;
  characterName?: string;
  initialData?: CharacterData;
}

export function CharacterDetailsClient({
  ocid,
  characterName,
  initialData,
}: CharacterDetailsClientProps) {
  const router = useRouter();
  const [characterData, setCharacterData] = useState<CharacterData | null>(
    initialData || null
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "stats" | "equipment" | "symbols"
  >("overview");
  const [symbolData, setSymbolData] = useState<any>(null);
  const [symbolLoading, setSymbolLoading] = useState(false);
  const [symbolError, setSymbolError] = useState<string>("");
  const [equipmentData, setEquipmentData] = useState<any>(null);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentError, setEquipmentError] = useState<string>("");

  useEffect(() => {
    if (!initialData && ocid) {
      loadCharacterData();
    }
  }, [ocid, initialData]);

  const loadCharacterData = async () => {
    setLoading(true);
    setError("");

    try {
      // Check localStorage first for immediate display
      const cached = characterDataService.getFromLocalStorage(ocid);
      if (cached) {
        setCharacterData(cached);
      }

      // Fetch fresh data (will use cache if still valid)
      const data = await characterDataService.fetchCharacterData(ocid);
      setCharacterData(data);
    } catch (err) {
      console.error("Error loading character data:", err);
      setError("Failed to fetch character details.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!ocid) return;

    setLoading(true);
    try {
      const data = await characterDataService.refreshCharacterData(ocid);
      setCharacterData(data);
    } catch (err) {
      setError("Failed to refresh character data.");
    } finally {
      setLoading(false);
    }
  };

  const loadEquipmentData = async () => {
    setEquipmentError("");
    setEquipmentLoading(true);
    try {
      const response = await fetch(`/api/character/equipment?ocid=${ocid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch equipment data");
      }
      const data = await response.json();
      setEquipmentData(data);
    } catch (err: any) {
      setEquipmentError(err.message || "Failed to fetch equipment data");
      setEquipmentData(null);
    } finally {
      setEquipmentLoading(false);
    }
  };

  // Navigation handlers for different views
  const navigateToStats = () => {
    router.push(buildUrl.characterStats(ocid));
  };

  const navigateToEquipment = () => {
    router.push(buildUrl.characterEquipment(ocid));
  };

  if (loading && !characterData) {
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
      <Header variant="details" />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-6xl bg-opacity-90 backdrop-blur-md max-h-[85vh] overflow-y-auto">
          {/* Character Header */}
          {characterData?.basic && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {characterData.basic.character_image && (
                    <img
                      src={characterData.basic.character_image}
                      alt={characterData.basic.character_name}
                      className="w-16 h-16 rounded-lg"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-black">
                      {characterData.basic.character_name}
                    </h1>
                    <p className="text-lg text-gray-600">
                      Level {characterData.basic.character_level}{" "}
                      {characterData.basic.character_class}
                    </p>
                    <p className="text-sm text-gray-500">
                      {characterData.basic.world_name} World
                      {characterData.basic.character_guild_name &&
                        ` • ${characterData.basic.character_guild_name}`}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                  >
                    {loading ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === "overview"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === "stats"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Stats
                </button>
                <button
                  onClick={async () => {
                    setActiveTab("equipment");
                    if (!equipmentData) {
                      await loadEquipmentData();
                    }
                  }}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === "equipment"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Equipment
                </button>
                <button
                  onClick={async () => {
                    setActiveTab("symbols");
                    setSymbolError("");
                    setSymbolLoading(true);
                    try {
                      const response = await fetch(
                        `/api/character/symbols?ocid=${ocid}`
                      );
                      if (!response.ok) {
                        throw new Error("Failed to fetch symbol data");
                      }
                      const data = await response.json();
                      setSymbolData(data);
                    } catch (err: any) {
                      setSymbolError(
                        err.message || "Failed to fetch symbol data"
                      );
                      setSymbolData(null);
                    } finally {
                      setSymbolLoading(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === "symbols"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Symbols
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Content based on active tab */}
          {characterData && (
            <div className="space-y-6 text-black">
              {activeTab === "overview" && (
                <>
                  {/* Combat Power Highlight Section */}
                  {characterData.stat && (
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-white/20 rounded-full p-3">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-white mb-1">
                                Combat Power
                              </h2>
                              <p className="text-blue-100">
                                Cpmbat power is calculated through main stats
                                and support stats, ATT/MATT, damage, boss
                                damage, final damage, and crtical damage.
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-black text-white mb-1">
                              {(() => {
                                const combatPowerValue =
                                  characterData.stat?.final_stat?.find(
                                    (stat) => stat.stat_name === "Combat Power"
                                  )?.stat_value;
                                if (!combatPowerValue) return "N/A";

                                // Parse as number and format with commas
                                const numericValue = parseInt(
                                  combatPowerValue.replace(/,/g, "")
                                );
                                return isNaN(numericValue)
                                  ? combatPowerValue
                                  : numericValue.toLocaleString();
                              })()}
                            </div>
                            <div className="text-blue-100 text-sm font-medium">
                              Power Level
                            </div>
                          </div>
                        </div>

                        {/* EXP Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-blue-100 text-sm">
                              EXP Progress
                            </span>
                            <span className="text-white text-sm font-semibold">
                              {characterData.basic?.character_exp_rate || "0"}%
                              to Next Level
                            </span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    parseFloat(
                                      characterData.basic?.character_exp_rate ||
                                        "0"
                                    )
                                  )
                                )}%`,
                              }}
                            >
                              {/* Animated shimmer effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-1 text-xs text-blue-100">
                            <span>
                              Current EXP:{" "}
                              {characterData.basic?.character_exp?.toLocaleString() ||
                                "0"}
                            </span>
                            <span>
                              Total Required:{" "}
                              {(() => {
                                const currentExp = parseInt(
                                  characterData.basic?.character_exp?.toString() ||
                                    "0"
                                );
                                const expRate = parseFloat(
                                  characterData.basic?.character_exp_rate || "0"
                                );
                                if (expRate > 0) {
                                  const totalRequired = Math.round(
                                    (currentExp / expRate) * 100
                                  );
                                  return totalRequired.toLocaleString();
                                }
                                return "N/A";
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Basic Info */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Basic Information
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                      <div>
                        <p>
                          <strong>Character Name:</strong>{" "}
                          {characterData.basic?.character_name}
                        </p>
                        <p>
                          <strong>Level:</strong>{" "}
                          {characterData.basic?.character_level}
                        </p>
                        <p>
                          <strong>Class:</strong>{" "}
                          {characterData.basic?.character_class}
                        </p>
                        <p>
                          <strong>World:</strong>{" "}
                          {characterData.basic?.world_name}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Guild:</strong>{" "}
                          {characterData.basic?.character_guild_name || "None"}
                        </p>
                        <p>
                          <strong>Gender:</strong>{" "}
                          {characterData.basic?.character_gender}
                        </p>
                        <p>
                          <strong>Created:</strong>{" "}
                          {characterData.basic?.character_date_create}
                        </p>
                        <p>
                          <strong>EXP Rate:</strong>{" "}
                          {characterData.basic?.character_exp_rate || "N/A"}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Preview */}
                  {characterData.stat && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Key Stats</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          {characterData.stat.final_stat
                            ?.slice(0, 6)
                            .map((stat, index) => (
                              <p key={index}>
                                <strong>{stat.stat_name}:</strong>{" "}
                                {stat.stat_value}
                              </p>
                            ))}
                        </div>
                        <button
                          onClick={() => setActiveTab("stats")}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View All Stats →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "stats" && characterData.stat && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Character Stats
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {characterData.stat.final_stat?.map((stat, index) => (
                        <p key={index}>
                          <strong>{stat.stat_name}:</strong> {stat.stat_value}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "equipment" && characterData.itemEquipment && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Equipment</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-4">
                      <strong>Equipment Count:</strong>{" "}
                      {characterData.itemEquipment.item_equipment?.length || 0}
                    </p>

                    {/* Equipment Table - 5 columns x 6 rows */}
                    <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                      {Array.from({ length: 30 }, (_, index) => {
                        let item = null;

                        // Equipment organization:
                        // Rings: slots 0, 5, 10, 15
                        // Hat: slot 2
                        // Emblem: slot 4
                        // Pendants: slots 6, 11
                        // Face Accessory: slot 7
                        // Badge: slot 9
                        // Eye Accessory: slot 12
                        // Earring: slot 13
                        // Medal: slot 14
                        // Weapon: slot 16
                        // Top: slot 17
                        // Shoulder Decoration: slot 18
                        // Secondary Weapons: slot 19
                        // Pocket Item: slot 20
                        // Belt: slot 21
                        // Bottom: slot 22
                        // Glove: slot 23
                        // Cape: slot 24
                        // Shoes: slot 27
                        // Mechanical Heart: slot 29
                        // Always empty: slots 1, 3, 8, 25, 26
                        if (
                          index === 1 ||
                          index === 3 ||
                          index === 8 ||
                          index === 25 ||
                          index === 26
                        ) {
                          // Always empty slots
                          item = null;
                        } else if (index === 2) {
                          // Hat slot: 2
                          const hats =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "HAT"
                            ) || [];
                          item = hats[0] || null;
                        } else if (index === 4) {
                          // Emblem slot: 4
                          const emblems =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "EMBLEM"
                            ) || [];
                          item = emblems[0] || null;
                        } else if (index === 7) {
                          // Face Accessory slot: 7
                          const faceAccessories =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) =>
                                item.item_equipment_part === "FACE ACCESSORY"
                            ) || [];
                          item = faceAccessories[0] || null;
                        } else if (index === 9) {
                          // Badge slot: 9
                          const badges =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "Badge"
                            ) || [];
                          item = badges[0] || null;
                        } else if (index === 12) {
                          // Eye Accessory slot: 12
                          const eyeAccessories =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) =>
                                item.item_equipment_part === "EYE ACCESSORY"
                            ) || [];
                          item = eyeAccessories[0] || null;
                        } else if (index === 13) {
                          // Earring slot: 13
                          const earrings =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "EARRING"
                            ) || [];
                          item = earrings[0] || null;
                        } else if (index === 14) {
                          // Medal slot: 14
                          const medals =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "MEDAL"
                            ) || [];
                          item = medals[0] || null;
                        } else if (index === 17) {
                          // Top slot: 17
                          const tops =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "TOP"
                            ) || [];
                          item = tops[0] || null;
                        } else if (index === 18) {
                          // Shoulder Decoration slot: 18
                          const shoulderDecorations =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) =>
                                item.item_equipment_part ===
                                "SHOULDER DECORATION"
                            ) || [];
                          item = shoulderDecorations[0] || null;
                        } else if (index === 19) {
                          // Secondary Weapons slot: 19
                          const secondaryWeapons =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) =>
                                item.item_equipment_slot === "Secondary Weapons"
                            ) || [];
                          item = secondaryWeapons[0] || null;
                        } else if (
                          index === 0 ||
                          index === 5 ||
                          index === 10 ||
                          index === 15
                        ) {
                          // Ring slots: 0, 5, 10, 15
                          const rings =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "RING"
                            ) || [];

                          // Map index to ring position
                          let ringIndex = 0;
                          if (index === 0) ringIndex = 0;
                          else if (index === 5) ringIndex = 1;
                          else if (index === 10) ringIndex = 2;
                          else if (index === 15) ringIndex = 3;

                          item = rings[ringIndex] || null;
                        } else if (index === 6 || index === 11) {
                          // Pendant slots: 6, 11
                          const pendants =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "PENDANT"
                            ) || [];

                          // Map index to pendant position
                          let pendantIndex = 0;
                          if (index === 6) pendantIndex = 0;
                          else if (index === 11) pendantIndex = 1;

                          item = pendants[pendantIndex] || null;
                        } else if (index === 16) {
                          // Weapon slot: 16
                          const weapons =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_slot === "WEAPON"
                            ) || [];
                          item = weapons[0] || null;
                        } else if (index === 20) {
                          // Pocket Item slot: 20
                          const pocketItems =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) =>
                                item.item_equipment_part === "Pocket Item"
                            ) || [];
                          item = pocketItems[0] || null;
                        } else if (index === 21) {
                          // Belt slot: 21
                          const belts =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "BELT"
                            ) || [];
                          item = belts[0] || null;
                        } else if (index === 22) {
                          // Bottom slot: 22
                          const bottoms =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "BOTTOM"
                            ) || [];
                          item = bottoms[0] || null;
                        } else if (index === 23) {
                          // Glove slot: 23
                          const gloves =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "GLOVE"
                            ) || [];
                          item = gloves[0] || null;
                        } else if (index === 24) {
                          // Cape slot: 24
                          const capes =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "CAPE"
                            ) || [];
                          item = capes[0] || null;
                        } else if (index === 27) {
                          // Shoes slot: 27
                          const shoes =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) => item.item_equipment_part === "SHOES"
                            ) || [];
                          item = shoes[0] || null;
                        } else if (index === 29) {
                          // Mechanical Heart slot: 29
                          const mechanicalHearts =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) =>
                                item.item_equipment_part === "Mechanical Heart"
                            ) || [];
                          item = mechanicalHearts[0] || null;
                        } else {
                          // Other slots: remaining equipment
                          const nonSpecialItems =
                            characterData.itemEquipment?.item_equipment?.filter(
                              (item) =>
                                item.item_equipment_part !== "RING" &&
                                item.item_equipment_part !== "Pocket Item" &&
                                item.item_equipment_part !== "PENDANT" &&
                                item.item_equipment_slot !== "WEAPON" &&
                                item.item_equipment_slot !==
                                  "Secondary Weapons" &&
                                item.item_equipment_part !== "BELT" &&
                                item.item_equipment_part !== "HAT" &&
                                item.item_equipment_part !== "EMBLEM" &&
                                item.item_equipment_part !== "FACE ACCESSORY" &&
                                item.item_equipment_part !== "Badge" &&
                                item.item_equipment_part !== "EYE ACCESSORY" &&
                                item.item_equipment_part !== "EARRING" &&
                                item.item_equipment_part !== "MEDAL" &&
                                item.item_equipment_part !== "TOP" &&
                                item.item_equipment_part !==
                                  "SHOULDER DECORATION" &&
                                item.item_equipment_part !== "BOTTOM" &&
                                item.item_equipment_part !== "GLOVE" &&
                                item.item_equipment_part !== "CAPE" &&
                                item.item_equipment_part !== "SHOES" &&
                                item.item_equipment_part !== "Mechanical Heart"
                            ) || [];

                          // Calculate adjusted index (subtract special slots and always-empty slots that come before this index)
                          let specialSlotsBefore = 0;
                          if (index > 0) specialSlotsBefore++; // Ring slot 0
                          if (index > 1) specialSlotsBefore++; // Always empty slot 1
                          if (index > 2) specialSlotsBefore++; // Hat slot 2
                          if (index > 3) specialSlotsBefore++; // Always empty slot 3
                          if (index > 4) specialSlotsBefore++; // Emblem slot 4
                          if (index > 5) specialSlotsBefore++; // Ring slot 5
                          if (index > 6) specialSlotsBefore++; // Pendant slot 6
                          if (index > 7) specialSlotsBefore++; // Face Accessory slot 7
                          if (index > 8) specialSlotsBefore++; // Always empty slot 8
                          if (index > 9) specialSlotsBefore++; // Badge slot 9
                          if (index > 10) specialSlotsBefore++; // Ring slot 10
                          if (index > 11) specialSlotsBefore++; // Pendant slot 11
                          if (index > 12) specialSlotsBefore++; // Eye Accessory slot 12
                          if (index > 13) specialSlotsBefore++; // Earring slot 13
                          if (index > 14) specialSlotsBefore++; // Medal slot 14
                          if (index > 15) specialSlotsBefore++; // Ring slot 15
                          if (index > 16) specialSlotsBefore++; // Weapon slot 16
                          if (index > 17) specialSlotsBefore++; // Top slot 17
                          if (index > 18) specialSlotsBefore++; // Shoulder Decoration slot 18
                          if (index > 19) specialSlotsBefore++; // Secondary Weapons slot 19
                          if (index > 20) specialSlotsBefore++; // Pocket Item slot 20
                          if (index > 21) specialSlotsBefore++; // Belt slot 21
                          if (index > 22) specialSlotsBefore++; // Bottom slot 22
                          if (index > 23) specialSlotsBefore++; // Glove slot 23
                          if (index > 24) specialSlotsBefore++; // Cape slot 24
                          if (index > 25) specialSlotsBefore++; // Always empty slot 25
                          if (index > 26) specialSlotsBefore++; // Always empty slot 26
                          if (index > 27) specialSlotsBefore++; // Shoes slot 27
                          if (index > 29) specialSlotsBefore++; // Mechanical Heart slot 29

                          const adjustedIndex = index - specialSlotsBefore;
                          item = nonSpecialItems[adjustedIndex] || null;
                        }

                        if (!item) {
                          // Empty slot
                          return (
                            <div
                              key={index}
                              className="bg-gray-100 border-2 border-gray-200 rounded-lg p-2 w-16 h-16 flex items-center justify-center"
                            >
                              <span className="text-xs text-gray-400">
                                Empty
                              </span>
                            </div>
                          );
                        }

                        // Determine border and background colors based on potential grade
                        let borderColor = "border-gray-200"; // default
                        let backgroundColor = "bg-white"; // default

                        if (item.potential_option_grade) {
                          switch (item.potential_option_grade.toLowerCase()) {
                            case "unique":
                              borderColor = "border-yellow-400";
                              backgroundColor = "bg-yellow-50";
                              break;
                            case "rare":
                              borderColor = "border-blue-400";
                              backgroundColor = "bg-blue-50";
                              break;
                            case "epic":
                              borderColor = "border-purple-400";
                              backgroundColor = "bg-purple-50";
                              break;
                            case "legendary":
                              borderColor = "border-green-400";
                              backgroundColor = "bg-green-50";
                              break;
                            default:
                              borderColor = "border-gray-200";
                              backgroundColor = "bg-white";
                          }
                        }

                        return (
                          <div
                            key={index}
                            className={`${backgroundColor} border-2 ${borderColor} rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer group relative w-16 h-16 flex items-center justify-center`}
                            title={`${item.item_equipment_part}: ${
                              item.item_name
                            }${item.starforce ? ` (★${item.starforce})` : ""}${
                              item.potential_option_grade
                                ? ` [${item.potential_option_grade}]`
                                : ""
                            }`}
                          >
                            {item.item_icon ? (
                              <img
                                src={item.item_icon}
                                alt={item.item_name}
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-400">
                                  No Icon
                                </span>
                              </div>
                            )}

                            {/* Rarity indicator */}
                            {(() => {
                              let rarityLetter = "C";
                              let rarityColor = "bg-black";

                              if (item.potential_option_grade) {
                                switch (
                                  item.potential_option_grade.toLowerCase()
                                ) {
                                  case "unique":
                                    rarityLetter = "U";
                                    rarityColor = "bg-yellow-400";
                                    break;
                                  case "rare":
                                    rarityLetter = "R";
                                    rarityColor = "bg-blue-400";
                                    break;
                                  case "epic":
                                    rarityLetter = "E";
                                    rarityColor = "bg-purple-400";
                                    break;
                                  case "legendary":
                                    rarityLetter = "L";
                                    rarityColor = "bg-green-400";
                                    break;
                                  default:
                                    rarityLetter = "C";
                                    rarityColor = "bg-black";
                                }
                              }

                              return (
                                <div
                                  className={`absolute top-1 left-1 ${rarityColor} text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold`}
                                >
                                  {rarityLetter}
                                </div>
                              );
                            })()}

                            {/* Starforce indicator */}
                            {item.starforce && (
                              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs px-1 rounded-bl rounded-tr">
                                ★{item.starforce}
                              </div>
                            )}

                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-max">
                              <div className="whitespace-nowrap">
                                <div className="font-semibold">
                                  {item.potential_option_grade
                                    ? `(${item.potential_option_grade}) `
                                    : "(Common) "}
                                  {item.item_name}
                                </div>
                                <div className="text-gray-300 mb-1">
                                  {item.item_equipment_part}
                                </div>
                                {/* Item Total Option */}
                                {item.item_total_option && (
                                  <div className="mt-2">
                                    <div className="text-orange-300 font-semibold">
                                      Total Stats:
                                    </div>
                                    {Object.entries(item.item_total_option).map(
                                      ([key, value]) =>
                                        value &&
                                        value !== "0" &&
                                        value !== "0%" ? (
                                          <div
                                            key={key}
                                            className="text-orange-200"
                                          >
                                            •{" "}
                                            {key
                                              .replace(/_/g, " ")
                                              .toUpperCase()}
                                            : {value}
                                          </div>
                                        ) : null
                                    )}
                                  </div>
                                )}
                                {/* Item Potential */}
                                {(item.potential_option_1 ||
                                  item.potential_option_2 ||
                                  item.potential_option_3) && (
                                  <div className="mt-2">
                                    <div className="text-blue-300 font-semibold">
                                      Item Potential:
                                    </div>
                                    {item.potential_option_1 && (
                                      <div className="text-green-300">
                                        • {item.potential_option_1}
                                      </div>
                                    )}
                                    {item.potential_option_2 && (
                                      <div className="text-green-300">
                                        • {item.potential_option_2}
                                      </div>
                                    )}
                                    {item.potential_option_3 && (
                                      <div className="text-green-300">
                                        • {item.potential_option_3}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {/* Additional Potential */}
                                {(item.additional_potential_option_1 ||
                                  item.additional_potential_option_2 ||
                                  item.additional_potential_option_3) && (
                                  <div className="mt-2">
                                    <div className="text-purple-300 font-semibold">
                                      Additional Potential:
                                    </div>
                                    {item.additional_potential_option_1 && (
                                      <div className="text-yellow-300">
                                        • {item.additional_potential_option_1}
                                      </div>
                                    )}
                                    {item.additional_potential_option_2 && (
                                      <div className="text-yellow-300">
                                        • {item.additional_potential_option_2}
                                      </div>
                                    )}
                                    {item.additional_potential_option_3 && (
                                      <div className="text-yellow-300">
                                        • {item.additional_potential_option_3}
                                      </div>
                                    )}
                                  </div>
                                )}
                                {/* Starforce info */}
                                {item.starforce && (
                                  <div className="mt-1 text-yellow-300">
                                    Starforce: ★{item.starforce}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "symbols" && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Symbols</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {symbolLoading && (
                      <div className="flex flex-col items-center justify-center py-8">
                        <img
                          src="/images/mushroom-loader.gif"
                          alt="Loading symbols..."
                          className="w-16 h-16 mb-4"
                        />
                        <p className="text-gray-700">Loading symbol data...</p>
                      </div>
                    )}
                    {symbolError && (
                      <p className="text-red-600">{symbolError}</p>
                    )}
                    {symbolData &&
                      Array.isArray(symbolData.symbol) &&
                      symbolData.symbol.length > 0 && (
                        <>
                          {/* Group Arcane Symbol */}
                          {(() => {
                            const arcane = symbolData.symbol.filter((s: any) =>
                              s.symbol_name.includes("Arcane Symbol")
                            );
                            const authentic = symbolData.symbol.filter(
                              (s: any) =>
                                s.symbol_name.includes("Authentic Symbol")
                            );
                            return (
                              <>
                                {arcane.length > 0 && (
                                  <div className="mb-6">
                                    <h3 className="text-lg font-bold mb-2 text-blue-700 text-center">
                                      Arcane Symbols
                                    </h3>
                                    <div
                                      className="grid grid-cols-3 gap-3 justify-center mx-auto"
                                      style={{ maxWidth: "480px" }}
                                    >
                                      {arcane.map(
                                        (symbol: any, idx: number) => (
                                          <div
                                            key={symbol.symbol_name + idx}
                                            className="relative group flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-2 shadow hover:shadow-lg transition cursor-pointer"
                                          >
                                            {/* Icon + Level badge (top right) */}
                                            <div className="relative mb-2 flex items-center justify-center w-full">
                                              <img
                                                src={symbol.symbol_icon}
                                                alt={symbol.symbol_name}
                                                className="w-12 h-12 object-contain"
                                              />
                                              <span className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full border border-white shadow mt-1 mr-1">
                                                Lv. {symbol.symbol_level}
                                              </span>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-800 text-center">
                                              {symbol.symbol_name}
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-black text-white text-xs rounded-lg px-4 py-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg whitespace-normal">
                                              <div className="font-bold text-base mb-1">
                                                {symbol.symbol_name}
                                              </div>
                                              <div className="mb-1 flex items-center gap-2">
                                                <img
                                                  src={symbol.symbol_icon}
                                                  alt="icon"
                                                  className="w-6 h-6 inline-block"
                                                />
                                                <span>
                                                  Level:{" "}
                                                  <span className="font-semibold text-yellow-300">
                                                    {symbol.symbol_level}
                                                  </span>
                                                </span>
                                              </div>
                                              {/* Show only non-zero STR/DEX/INT/LUK/HP */}
                                              {[
                                                {
                                                  label: "STR",
                                                  value: symbol.symbol_str,
                                                },
                                                {
                                                  label: "DEX",
                                                  value: symbol.symbol_dex,
                                                },
                                                {
                                                  label: "INT",
                                                  value: symbol.symbol_int,
                                                },
                                                {
                                                  label: "LUK",
                                                  value: symbol.symbol_luk,
                                                },
                                                {
                                                  label: "HP",
                                                  value: symbol.symbol_hp,
                                                },
                                              ].map((stat) =>
                                                stat.value !== undefined &&
                                                stat.value !== null &&
                                                stat.value !== "0" &&
                                                stat.value !== 0 ? (
                                                  <div key={stat.label}>
                                                    <span className="text-green-200">
                                                      {stat.label}: +
                                                      {stat.value}
                                                    </span>
                                                  </div>
                                                ) : null
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                                {authentic.length > 0 && (
                                  <div className="mb-2">
                                    <h3 className="text-lg font-bold mb-2 text-green-700 text-center">
                                      Authentic Symbols
                                    </h3>
                                    <div
                                      className="grid grid-cols-3 gap-3 justify-center mx-auto"
                                      style={{ maxWidth: "480px" }}
                                    >
                                      {authentic.map(
                                        (symbol: any, idx: number) => (
                                          <div
                                            key={symbol.symbol_name + idx}
                                            className="relative group flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-2 shadow hover:shadow-lg transition cursor-pointer"
                                          >
                                            {/* Icon + Level badge (top right) */}
                                            <div className="relative mb-2 flex items-center justify-center w-full">
                                              <img
                                                src={symbol.symbol_icon}
                                                alt={symbol.symbol_name}
                                                className="w-12 h-12 object-contain"
                                              />
                                              <span className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full border border-white shadow mt-1 mr-1">
                                                Lv. {symbol.symbol_level}
                                              </span>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-800 text-center">
                                              {symbol.symbol_name}
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-black text-white text-xs rounded-lg px-4 py-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg whitespace-normal">
                                              <div className="font-bold text-base mb-1">
                                                {symbol.symbol_name}
                                              </div>
                                              <div className="mb-1 flex items-center gap-2">
                                                <img
                                                  src={symbol.symbol_icon}
                                                  alt="icon"
                                                  className="w-6 h-6 inline-block"
                                                />
                                                <span>
                                                  Level:{" "}
                                                  <span className="font-semibold text-yellow-300">
                                                    {symbol.symbol_level}
                                                  </span>
                                                </span>
                                              </div>
                                              {/* Show only non-zero STR/DEX/INT/LUK/HP */}
                                              {[
                                                {
                                                  label: "STR",
                                                  value: symbol.symbol_str,
                                                },
                                                {
                                                  label: "DEX",
                                                  value: symbol.symbol_dex,
                                                },
                                                {
                                                  label: "INT",
                                                  value: symbol.symbol_int,
                                                },
                                                {
                                                  label: "LUK",
                                                  value: symbol.symbol_luk,
                                                },
                                                {
                                                  label: "HP",
                                                  value: symbol.symbol_hp,
                                                },
                                              ].map((stat) =>
                                                stat.value !== undefined &&
                                                stat.value !== null &&
                                                stat.value !== "0" &&
                                                stat.value !== 0 ? (
                                                  <div key={stat.label}>
                                                    <span className="text-green-200">
                                                      {stat.label}: +
                                                      {stat.value}
                                                    </span>
                                                  </div>
                                                ) : null
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </>
                      )}
                    {symbolData &&
                      (!Array.isArray(symbolData.symbol) ||
                        symbolData.symbol.length === 0) && (
                        <p className="text-gray-700">
                          No symbols found for this character.
                        </p>
                      )}
                    {!symbolLoading && !symbolError && !symbolData && (
                      <p className="text-gray-700">
                        Symbol progression and details will appear here.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!error && !characterData && !loading && (
            <p className="text-center text-black">No character data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
