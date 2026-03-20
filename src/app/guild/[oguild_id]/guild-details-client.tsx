"use client";

import Header from "@/components/Header";
import guildDataService from "@/services/guild-data.service";
import { GuildData } from "@/types/maplestory-api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SkillsTab } from "./components/SkillsTab";
import { NoblesseSkills } from "./components/NoblesseSkills";
import { InvalidSkillsFallback } from "./components/InvalidSkillsFallback";
import { MembersTab } from "./components/MembersTab";
import { GrowthTab } from "./components/GrowthTab";

interface GuildDetailsClientProps {
  oguild_id: string;
  guildName?: string;
  world?: string;
  initialData?: GuildData;
}

export function GuildDetailsClient({
  oguild_id,
  guildName,
  world,
  initialData,
}: GuildDetailsClientProps) {
  const [guildData, setGuildData] = useState<GuildData | null>(
    initialData || null,
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "skills" | "members" | "growth"
  >("overview");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const isDark = theme === "dark";

  useEffect(() => {
    if (!initialData && oguild_id) {
      loadGuildData();
    }
  }, [oguild_id, initialData]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("guild-details-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  const loadGuildData = async () => {
    setLoading(true);
    setError("");

    try {
      // Check localStorage first for immediate display
      const cached = guildDataService.getFromLocalStorage(oguild_id);
      if (cached) {
        setGuildData(cached);
      }

      // Fetch fresh data (will use cache if still valid)
      const data = await guildDataService.fetchGuildData(oguild_id);
      setGuildData(data);
    } catch (error) {
      console.error("Error loading guild data:", error);
      setError("Failed to fetch guild details.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!oguild_id) return;

    setLoading(true);
    try {
      const data = await guildDataService.refreshGuildDate(oguild_id);
      setGuildData(data);
    } catch (error) {
      setError("Failed to refresh guild data");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("guild-details-theme", nextTheme);
  };

  if (loading && !guildData) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          isDark ? "bg-gray-950/90" : "bg-white bg-opacity-80"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full w-full">
          <img
            src="/images/mushroom-loader.gif"
            alt="Loading..."
            className="w-32 h-32 mb-6"
          />
          <p
            className={`text-lg font-semibold ${
              isDark ? "text-gray-100" : "text-black"
            }`}
          >
            Loading guild data...
          </p>
        </div>
      </div>
    );
  }

  // Navigate to character details page of guild master
  const guildMasterCharLink = () => {
    if (guildData?.guild_master_ocid) {
      const url = `/character/${guildData?.guild_master_ocid}?name=${guildData?.basic?.guild_master_name}`;
      return (
        <a href={url} className="text-blue-500">
          {guildData?.basic?.guild_master_name}
        </a>
      );
    }
    return guildData?.basic?.guild_master_name;
  };

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
        <div
          className={`rounded-xl shadow-lg p-8 w-full max-w-6xl backdrop-blur-md max-h-[85vh] overflow-y-auto ${
            isDark
              ? "bg-gray-900/90 border border-gray-700"
              : "bg-white rounded-xl bg-opacity-90"
          }`}
        >
          {/* Guild Header */}
          {guildData?.basic && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Guild Master Image */}
                  {guildData.basic.guild_master_name && (
                    <img
                      src={guildData.guild_master_image}
                      alt={guildData.guild_master_image}
                      className="w-16 h-16 rounded-lg"
                    />
                  )}
                  <div>
                    <h1
                      className={`text-3xl font-bold ${
                        isDark ? "text-gray-100" : "text-black"
                      }`}
                    >
                      {guildName}
                    </h1>
                    <p
                      className={`text-lg ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Level {guildData.basic.guild_level}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {world} World • {guildMasterCharLink()}'s guild
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={toggleTheme}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isDark
                        ? "bg-yellow-500 hover:bg-yellow-400 text-gray-900"
                        : "bg-gray-900 hover:bg-black text-white"
                    }`}
                    aria-label="Toggle dark and light mode"
                  >
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </button>
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
              <div
                className={`flex space-x-1 p-1 rounded-lg ${
                  isDark ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === "overview"
                      ? isDark
                        ? "bg-gray-700 text-blue-300 shadow-sm"
                        : "bg-white text-blue-600 shadow-sm"
                      : isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === "skills"
                      ? isDark
                        ? "bg-gray-700 text-blue-300 shadow-sm"
                        : "bg-white text-blue-600 shadow-sm"
                      : isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab("members")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === "members"
                      ? isDark
                        ? "bg-gray-700 text-blue-300 shadow-sm"
                        : "bg-white text-blue-600 shadow-sm"
                      : isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Members
                </button>
                <button
                  onClick={() => setActiveTab("growth")}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === "growth"
                      ? isDark
                        ? "bg-gray-700 text-blue-300 shadow-sm"
                        : "bg-white text-blue-600 shadow-sm"
                      : isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Growth
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div
              className={`border rounded-lg p-4 mb-6 ${
                isDark
                  ? "bg-red-950/40 border-red-700"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Content based on active tab */}
          {guildData && (
            <div
              className={`space-y-6 ${isDark ? "text-gray-100" : "text-black"}`}
            >
              {activeTab === "overview" && (
                <>
                  {/* Guild Info */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Guild Info</h2>
                    <div
                      className={`p-4 rounded-lg grid grid-cols-2 gap-4 ${
                        isDark ? "bg-gray-800" : "bg-gray-50"
                      }`}
                    >
                      <div>
                        <p>
                          <strong>Guild Name:</strong> {guildName}
                        </p>
                        <p>
                          <strong>Level:</strong> {guildData.basic?.guild_level}
                        </p>
                        <p>
                          <strong>World:</strong> {world}
                        </p>
                        <p>
                          <strong>Honor EXP:</strong>{" "}
                          {guildData.basic?.guild_fame}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Guild Master:</strong> {guildMasterCharLink()}
                        </p>
                        <p>
                          <strong>Guild Members:</strong>{" "}
                          {guildData.basic?.guild_member_count} / 200
                        </p>
                        <p>
                          <strong>Guild Points:</strong>{" "}
                          {guildData.basic?.guild_point}
                        </p>
                        <p>
                          <strong>Last Updated:</strong>{" "}
                          {guildData.lastUpdated.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Noblesse Skills Preview */}
                  <h2 className="text-xl font-semibold mb-2">
                    Noblesse Skills
                  </h2>
                  {guildData.basic?.guild_noblesse_skill &&
                    guildData.basic.guild_noblesse_skill.length > 0 && (
                      <div>
                        <div
                          className={`p-4 rounded-lg ${
                            isDark ? "bg-gray-800" : "bg-gray-50"
                          }`}
                        >
                          <NoblesseSkills
                            skillsData={guildData.basic?.guild_noblesse_skill}
                            isDark={isDark}
                          />
                          <button
                            onClick={() => setActiveTab("skills")}
                            className={`mt-5 text-sm ${
                              isDark
                                ? "text-blue-300 hover:text-blue-200"
                                : "text-blue-600 hover:text-blue-800"
                            }`}
                          >
                            View All Skills →
                          </button>
                        </div>
                      </div>
                    )}
                  {/* Fallback for invalid noblesse skills*/}
                  <InvalidSkillsFallback
                    skillsData={guildData.basic?.guild_noblesse_skill ?? []}
                    loading={loading}
                    error={error}
                    type="noblesse_skill"
                    isDark={isDark}
                  />
                </>
              )}

              {activeTab === "skills" && guildData.basic?.guild_skill && (
                <SkillsTab
                  regularSkillsData={guildData.basic?.guild_skill}
                  noblesseSkillsData={guildData.basic?.guild_noblesse_skill}
                  skillsLoading={loading}
                  skillsError={error}
                  isDark={isDark}
                />
              )}

              {activeTab === "members" && guildData.basic?.guild_member && (
                <MembersTab
                  guildData={guildData}
                  oguild_id={oguild_id}
                  isDark={isDark}
                />
              )}

              {activeTab === "growth" && (
                <GrowthTab
                  oguild_id={oguild_id}
                  isDark={isDark}
                  currentData={{
                    guild_member_count:
                      guildData.basic?.guild_member_count || 0,
                    guild_level: guildData.basic?.guild_level || 0,
                    guild_point: guildData.basic?.guild_point || 0,
                    guild_fame: guildData.basic?.guild_fame || 0,
                  }}
                />
              )}
            </div>
          )}

          {!error && !guildData && !loading && (
            <p
              className={`text-center ${isDark ? "text-gray-100" : "text-black"}`}
            >
              No guild data found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
