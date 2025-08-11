"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { characterDataService } from "@/services/character-data.service";
import { CharacterData } from "@/types/maplestory-api";
import Header from "@/components/Header";
import { buildUrl } from "@/config/routes";
import { EquipmentTab } from "./components/EquipmentTab";
import { HyperTab } from "./components/HyperTab";
import { SymbolsTab } from "./components/SymbolsTab";
import { LinkSkillsTab } from "./components/LinkSkillsTab";
import { GrowthTab } from "./components/GrowthTab";

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
    | "overview"
    | "stats"
    | "hypers"
    | "equipment"
    | "symbols"
    | "linkskills"
    | "growth"
  >("overview");
  const [symbolData, setSymbolData] = useState<any>(null);
  const [symbolLoading, setSymbolLoading] = useState(false);
  const [symbolError, setSymbolError] = useState<string>("");
  const [equipmentData, setEquipmentData] = useState<any>(null);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentError, setEquipmentError] = useState<string>("");
  const [hyperPassiveSkills, setHyperPassiveSkills] = useState<any>(null);
  const [hyperActiveSkills, setHyperActiveSkills] = useState<any>(null);
  const [hyperStatData, setHyperStatData] = useState<any>(null);
  const [hyperSkillsLoading, setHyperSkillsLoading] = useState(false);
  const [hyperSkillsError, setHyperSkillsError] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [abilityData, setAbilityData] = useState<any>(null);
  const [abilityLoading, setAbilityLoading] = useState(false);
  const [abilityError, setAbilityError] = useState<string>("");
  const [linkSkillsData, setLinkSkillsData] = useState<any>(null);
  const [linkSkillsLoading, setLinkSkillsLoading] = useState(false);
  const [linkSkillsError, setLinkSkillsError] = useState<string>("");

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

  const loadHyperSkills = async () => {
    setHyperSkillsError("");
    setHyperSkillsLoading(true);
    try {
      // Fetch hyperpassive, hyperactive skills, and hyper stats in parallel
      const [passiveResponse, activeResponse, hyperStatResponse] =
        await Promise.all([
          fetch(
            `/api/character/hyper-skills?ocid=${ocid}&character_skill_grade=hyperpassive`
          ),
          fetch(
            `/api/character/hyper-skills?ocid=${ocid}&character_skill_grade=hyperactive`
          ),
          fetch(
            `/api/character/hyper-skills?ocid=${ocid}&data_type=hyper-stat`
          ),
        ]);

      if (!passiveResponse.ok || !activeResponse.ok || !hyperStatResponse.ok) {
        throw new Error("Failed to fetch hyper data");
      }

      const [passiveData, activeData, hyperStatData] = await Promise.all([
        passiveResponse.json(),
        activeResponse.json(),
        hyperStatResponse.json(),
      ]);

      setHyperPassiveSkills(passiveData);
      setHyperActiveSkills(activeData);
      setHyperStatData(hyperStatData);
    } catch (err: any) {
      setHyperSkillsError(err.message || "Failed to fetch hyper data");
      setHyperPassiveSkills(null);
      setHyperActiveSkills(null);
      setHyperStatData(null);
    } finally {
      setHyperSkillsLoading(false);
    }
  };

  const loadAbilityData = async () => {
    setAbilityError("");
    setAbilityLoading(true);
    try {
      const response = await fetch(`/api/character/ability?ocid=${ocid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch ability data");
      }
      const data = await response.json();
      setAbilityData(data);
    } catch (err: any) {
      setAbilityError(err.message || "Failed to fetch ability data");
      setAbilityData(null);
    } finally {
      setAbilityLoading(false);
    }
  };

  const loadLinkSkills = async () => {
    setLinkSkillsError("");
    setLinkSkillsLoading(true);
    try {
      const response = await fetch(`/api/character/link-skills?ocid=${ocid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch link skills data");
      }
      const data = await response.json();
      setLinkSkillsData(data);
    } catch (err: any) {
      setLinkSkillsError(err.message || "Failed to fetch link skills data");
      setLinkSkillsData(null);
    } finally {
      setLinkSkillsLoading(false);
    }
  };

  // Helper function to handle tab switching
  const handleTabSwitch = async (
    tab:
      | "overview"
      | "stats"
      | "hypers"
      | "equipment"
      | "symbols"
      | "linkskills"
      | "growth"
  ) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // Close mobile menu when tab is selected

    if (
      tab === "hypers" &&
      (!hyperPassiveSkills || !hyperActiveSkills || !hyperStatData)
    ) {
      await loadHyperSkills();
    } else if (tab === "stats" && !abilityData) {
      await loadAbilityData();
    } else if (tab === "equipment" && !equipmentData) {
      await loadEquipmentData();
    } else if (tab === "linkskills" && !linkSkillsData) {
      await loadLinkSkills();
    } else if (tab === "symbols") {
      setSymbolError("");
      setSymbolLoading(true);
      try {
        const response = await fetch(`/api/character/symbols?ocid=${ocid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch symbol data");
        }
        const data = await response.json();
        setSymbolData(data);
      } catch (err: any) {
        setSymbolError(err.message || "Failed to fetch symbol data");
        setSymbolData(null);
      } finally {
        setSymbolLoading(false);
      }
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

  // Navigate to guild details page
  const guildLink = () => {
    if(characterData?.oguild_id && characterData?.basic?.character_guild_name) {
      const url = `/guild/${characterData?.oguild_id}?name=${characterData?.basic?.character_guild_name}&world=${characterData?.basic?.world_name}`;
      return <a href={url} className="text-blue-500">{characterData?.basic?.character_guild_name}</a>
    }
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
                      {characterData.basic.character_guild_name && (
                        <>
                          {' • '}
                          {guildLink()}
                        </>
                      )}
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
              <div className="relative">
                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => handleTabSwitch("overview")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === "overview"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => handleTabSwitch("stats")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === "stats"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Stats
                  </button>
                  <button
                    onClick={() => handleTabSwitch("hypers")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === "hypers"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Hyper(s)
                  </button>
                  <button
                    onClick={() => handleTabSwitch("equipment")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === "equipment"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Equipment
                  </button>
                  <button
                    onClick={() => handleTabSwitch("linkskills")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === "linkskills"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Link Skills
                  </button>
                  <button
                    onClick={() => handleTabSwitch("symbols")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === "symbols"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Symbols
                  </button>
                  <button
                    onClick={() => handleTabSwitch("growth")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      activeTab === "growth"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Growth
                  </button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                  {/* Mobile Header with Hamburger */}
                  <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                    <span className="text-lg font-medium text-blue-600 capitalize">
                      {activeTab === "hypers"
                        ? "Hyper(s)"
                        : activeTab === "linkskills"
                        ? "Link Skills"
                        : activeTab}
                    </span>
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                      aria-label="Toggle navigation menu"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {mobileMenuOpen ? (
                          <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                      </svg>
                    </button>
                  </div>

                  {/* Mobile Menu Overlay */}
                  {mobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-2">
                      <div className="py-2">
                        <button
                          className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                            activeTab === "overview"
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => handleTabSwitch("overview")}
                        >
                          Overview
                        </button>
                        <button
                          className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                            activeTab === "stats"
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => handleTabSwitch("stats")}
                        >
                          Stats
                        </button>
                        <button
                          className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                            activeTab === "hypers"
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => handleTabSwitch("hypers")}
                        >
                          Hyper(s)
                        </button>
                        <button
                          className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                            activeTab === "equipment"
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => handleTabSwitch("equipment")}
                        >
                          Equipment
                        </button>
                        <button
                          className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                            activeTab === "linkskills"
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => handleTabSwitch("linkskills")}
                        >
                          Link Skills
                        </button>
                        <button
                          className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                            activeTab === "symbols"
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => handleTabSwitch("symbols")}
                        >
                          Symbols
                        </button>
                        <button
                          className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                            activeTab === "growth"
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => handleTabSwitch("growth")}
                        >
                          Growth
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
                                Combat power is calculated through main stats
                                and support stats, ATT/MATT, damage, boss
                                damage, final damage, and critical damage.
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
                          {characterData.basic?.character_guild_name ? guildLink() : "None"}
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
                <div className="space-y-6">
                  {/* Ability Info */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Inner Ability
                    </h2>

                    {abilityLoading && (
                      <div className="flex flex-col items-center justify-center py-8">
                        <img
                          src="/images/mushroom-loader.gif"
                          alt="Loading..."
                          className="w-16 h-16 mb-4"
                        />
                        <p className="text-gray-600">
                          Loading inner ability...
                        </p>
                      </div>
                    )}

                    {abilityError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800">Error: {abilityError}</p>
                      </div>
                    )}

                    {!abilityLoading &&
                      !abilityError &&
                      abilityData?.ability_info && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-3">
                            {abilityData.ability_info
                              .sort(
                                (a: any, b: any) =>
                                  parseInt(a.ability_no) -
                                  parseInt(b.ability_no)
                              )
                              .map((ability: any, index: number) => {
                                // Determine colors based on grade
                                let bgColor = "bg-gray-100";
                                let borderColor = "border-gray-300";
                                let textColor = "text-gray-800";
                                let badgeColor = "bg-gray-500";

                                switch (ability.ability_grade?.toLowerCase()) {
                                  case "legendary":
                                    bgColor = "bg-green-50";
                                    borderColor = "border-green-300";
                                    textColor = "text-green-800";
                                    badgeColor = "bg-green-500";
                                    break;
                                  case "unique":
                                    bgColor = "bg-yellow-50";
                                    borderColor = "border-yellow-300";
                                    textColor = "text-yellow-800";
                                    badgeColor = "bg-yellow-500";
                                    break;
                                  case "epic":
                                    bgColor = "bg-purple-50";
                                    borderColor = "border-purple-300";
                                    textColor = "text-purple-800";
                                    badgeColor = "bg-purple-500";
                                    break;
                                  case "rare":
                                    bgColor = "bg-blue-50";
                                    borderColor = "border-blue-300";
                                    textColor = "text-blue-800";
                                    badgeColor = "bg-blue-500";
                                    break;
                                  default:
                                    break;
                                }

                                return (
                                  <div
                                    key={index}
                                    className={`${bgColor} border-2 ${borderColor} rounded-lg p-4 transition-all hover:shadow-md`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                          <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${badgeColor}`}
                                          >
                                            Line {ability.ability_no}
                                          </span>
                                          <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor} text-white`}
                                          >
                                            {ability.ability_grade}
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className={`text-lg font-semibold ${textColor}`}
                                      >
                                        {ability.ability_value}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                    {!abilityLoading &&
                      !abilityError &&
                      (!abilityData?.ability_info ||
                        abilityData.ability_info.length === 0) && (
                        <div className="text-center py-8">
                          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-8 h-8 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            No Inner Ability Data
                          </h3>
                          <p className="text-gray-600">
                            This character doesn't have any inner ability
                            configured yet.
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Character Stats */}
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
                </div>
              )}

              {activeTab === "hypers" && (
                <HyperTab
                  hyperPassiveSkills={hyperPassiveSkills}
                  hyperActiveSkills={hyperActiveSkills}
                  hyperStatData={hyperStatData}
                  hyperSkillsLoading={hyperSkillsLoading}
                  hyperSkillsError={hyperSkillsError}
                />
              )}

              {activeTab === "equipment" && characterData.itemEquipment && (
                <EquipmentTab characterData={characterData} />
              )}
              {activeTab === "symbols" && (
                <SymbolsTab
                  symbolData={symbolData}
                  symbolLoading={symbolLoading}
                  symbolError={symbolError}
                />
              )}

              {activeTab === "linkskills" && (
                <LinkSkillsTab
                  linkSkillsData={linkSkillsData}
                  linkSkillsLoading={linkSkillsLoading}
                  linkSkillsError={linkSkillsError}
                />
              )}

              {activeTab === "growth" && <GrowthTab ocid={ocid} />}
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
