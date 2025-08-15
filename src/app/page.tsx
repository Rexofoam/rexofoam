"use client";

import { useState } from "react";
import { useNavigation } from "@/utils/navigation";
import Header from "@/components/Header";

export default function BackgroundPage() {
  const [isGuildMode, setIsGuildMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [worldName, setWorldName] = useState("Aquila");
  const [searchResult, setSearchResult] = useState<{
    character_name?: string;
    ocid?: string;
    name?: string;
    level?: string;
    members?: string;
    leader?: string;
    guild_name?: string;
    world_name?: string;
    oguild_id?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigation = useNavigation();
  const worlds = ["Aquila", "Bootes", "Cassiopeia", "Draco"];
  const toggleMode = () => {
    setIsGuildMode(!isGuildMode);
    setInputValue("");
    setWorldName("Aquila");
    setSearchResult(null);
    setError("");
  };

  const handleSearch = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      if (isGuildMode) {
        // Use real MapleStory SEA API for guild search
        const response = await fetch(
          `https://open.api.nexon.com/maplestorysea/v1/guild/id?guild_name=${encodeURIComponent(
            inputValue
          )}&world_name=${encodeURIComponent(worldName)}`,
          {
            headers: {
              "x-nxopen-api-key":
                "test_ea78af0bb88d495a94b6f66066c720e395fdf4f7b152747fba72a401626e4bfdefe8d04e6d233bd35cf2fabdeb93fb0d",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.oguild_id) {
            setSearchResult({
              guild_name: inputValue,
              world_name: worldName,
              oguild_id: data.oguild_id,
            });
            // Redirect to guild details page with new SEO-friendly URL
            navigation.goToGuildDetails(data.oguild_id, inputValue, worldName);
          } else {
            setError("Guild not found");
            setSearchResult(null);
          }
        } else {
          setError("Guild not found on API error");
          setSearchResult(null);
        }
      } else {
        // Use real MapleStory SEA API for character search
        const response = await fetch(
          `https://open.api.nexon.com/maplestorysea/v1/id?character_name=${encodeURIComponent(
            inputValue
          )}`,
          {
            headers: {
              "x-nxopen-api-key":
                "live_ea78af0bb88d495a94b6f66066c720e33d4e8a3ef9dad5783bd0c610437d34f2efe8d04e6d233bd35cf2fabdeb93fb0d",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data.ocid) {
            setSearchResult({
              character_name: inputValue,
              ocid: data.ocid,
            });

            // Redirect to character details page with new SEO-friendly URL
            navigation.goToCharacterDetails(data.ocid, inputValue);
          } else {
            setError("Character not found");
            setSearchResult(null);
          }
        } else {
          setError("Character not found or API error");
          setSearchResult(null);
        }
      }
    } catch (err: unknown) {
      setError("Failed to search. Please check your connection and try again.");
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const backgroundImage = isGuildMode
    ? "/images/background2.webp"
    : "/images/background.webp";

  return (
    <>
      {/* Hidden SEO Content for Search Engines */}
      <div className="sr-only">
        <h1>MapleSEA Tracker - MapleStory SEA Character and Guild Analytics</h1>
        <p>
          MapleSEA Tracker is the premier analytics platform for MapleStory SEA
          (Singapore) players. Our comprehensive tracking system provides
          real-time character statistics, guild management tools, and detailed
          progression analytics across all MapleStory SEA servers including
          Aquila, Bootes, Cassiopeia, and Draco.
        </p>
        <h2>Character Tracking Features</h2>
        <p>
          Track your MapleStory SEA character with detailed statistics including
          level progression, combat power, equipment analysis, skill
          distribution, symbol tracking, and job advancement history. Monitor
          your character's growth over time with historical data comparison and
          performance benchmarks.
        </p>
        <h2>Guild Management System</h2>
        <p>
          Comprehensive guild analytics for MapleStory SEA guilds featuring
          member activity monitoring, growth trend analysis, new member
          detection, guild skill progression tracking, and detailed performance
          reports. Perfect for guild masters and officers managing their
          communities.
        </p>
        <h2>Supported MapleStory SEA Servers</h2>
        <ul>
          <li>Aquila Server - Character and guild tracking</li>
          <li>Bootes Server - Real-time analytics</li>
          <li>Cassiopeia Server - Progression monitoring</li>
          <li>Draco Server - Community management</li>
        </ul>
      </div>

      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 sm:p-8"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      >
        {/* Center Container */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-6 sm:p-12 w-full max-w-sm sm:max-w-md shadow-2xl border border-gray-200">
          <div className="flex flex-col items-center space-y-6 sm:space-y-8">
            {/* Logo */}
            <Header variant="home" />

            {/* Horizontal Divider */}
            <div className="w-full border-t border-gray-300"></div>

            {/* Search Input */}
            <div className="w-full space-y-4">
              <label
                htmlFor="searchInput"
                className="block text-gray-800 text-xl sm:text-2xl font-semibold text-center"
              >
                {isGuildMode ? "Enter Guild Name" : "Enter Character Name"}
              </label>
              <div className="text-center space-y-2">
                <p className="text-gray-600 text-sm">
                  Search for MapleStory SEA{" "}
                  {isGuildMode ? "Guild" : "Character"} Details
                </p>
                <p className="text-gray-500 text-xs">
                  {isGuildMode
                    ? "Track guild progress, members, and growth analytics across Aquila, Bootes, Cassiopeia, and Draco worlds"
                    : "View character stats, equipment, skills, symbols, and progression history in real-time"}
                </p>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  id="searchInput"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isGuildMode ? "Guild Name" : "Character Name"}
                  className="w-full px-4 py-3 bg-white bg-opacity-80 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 text-center hover:scale-105 transform"
                  disabled={isLoading}
                />
                {isGuildMode && (
                  <div>
                    <label
                      htmlFor="worldName"
                      className="block text-gray-800 text-xl sm:text-2xl font-semibold text-center"
                    >
                      Select World
                    </label>
                    <select
                      id="worldName"
                      className="w-full px-4 py-3 bg-white bg-opacity-80 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-500 text-left hover:scale-105 transform"
                      value={worldName}
                      onChange={(e) => setWorldName(e.target.value)}
                      disabled={isLoading}
                    >
                      {worlds.map((world: any, index: number) => (
                        <option key={index} value={world}>
                          {world}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 transform disabled:hover:scale-100"
                >
                  {isLoading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <span>{isLoading ? "Searching..." : "Search"}</span>
                </button>
              </div>

              {/* Toggle Link */}
              <div className="text-center">
                <button
                  onClick={toggleMode}
                  className="text-black hover:text-gray-700 text-sm font-medium transition-colors duration-200"
                >
                  {isGuildMode ? "Search Character" : "Search Guild"}
                </button>
              </div>
            </div>

            {/* Results Display */}
            {error && (
              <div
                className={`w-full p-4 border rounded-lg ${
                  error.includes("development")
                    ? "bg-yellow-100 border-yellow-300"
                    : "bg-red-100 border-red-300"
                }`}
              >
                <p
                  className={`text-center ${
                    error.includes("development")
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {error}
                </p>
              </div>
            )}

            {searchResult && (
              <div className="w-full p-4 bg-green-100 border border-green-300 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  {isGuildMode ? "Guild Found!" : "Character Found!"}
                </h3>
                {isGuildMode ? (
                  <div className="text-green-700 space-y-1">
                    <p>
                      <strong>Guild Name:</strong> {searchResult.guild_name}
                    </p>
                    <p>
                      <strong>World:</strong> {searchResult.world_name}
                    </p>
                  </div>
                ) : (
                  <div className="text-green-700 space-y-1">
                    <p>
                      <strong>Character Name:</strong>{" "}
                      {searchResult.character_name}
                    </p>
                    <p>
                      <strong>OCID:</strong> {searchResult.ocid}
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      ✅ Character exists in MapleStory SEA!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content Section - Below the hero image */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-blue-300 flex items-center">
                <span className="mr-2">📊</span>
                Character Analytics
              </h2>
              <p className="text-sm leading-relaxed">
                Track your MapleStory SEA character progression with detailed
                statistics. Monitor equipment, skills, symbols, and combat power
                changes over time. View comprehensive character profiles
                including level progression, job advancement history, and guild
                affiliations across all SEA servers.
              </p>
              <ul className="text-xs space-y-1 text-gray-300">
                <li>• Real-time character stats tracking</li>
                <li>• Equipment and enhancement monitoring</li>
                <li>• Skill point distribution analysis</li>
                <li>• Symbol progression tracking</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-green-300 flex items-center">
                <span className="mr-2">🏰</span>
                Guild Management
              </h2>
              <p className="text-sm leading-relaxed">
                Comprehensive guild tracking and analytics for MapleStory SEA
                guilds. Monitor member activity, track guild growth, analyze
                skill contributions, and identify new recruits. Perfect for
                guild masters and officers managing their communities across
                Aquila, Bootes, Cassiopeia, and Draco worlds.
              </p>
              <ul className="text-xs space-y-1 text-gray-300">
                <li>• Guild member activity monitoring</li>
                <li>• Growth analytics and trends</li>
                <li>• New member detection system</li>
                <li>• Guild skill progression tracking</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-purple-300 flex items-center">
                <span className="mr-2">📈</span>
                Advanced Features
              </h2>
              <p className="text-sm leading-relaxed">
                Leverage powerful analytics tools designed specifically for
                MapleStory SEA players. Historical data comparison, performance
                benchmarking, and detailed progression reports help you optimize
                your gameplay and achieve your MapleStory goals faster.
              </p>
              <ul className="text-xs space-y-1 text-gray-300">
                <li>• Historical data comparison</li>
                <li>• Performance trend analysis</li>
                <li>• Multi-character portfolio tracking</li>
                <li>• Export and sharing capabilities</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-600">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">
                MapleSEA Tracker - The Ultimate MapleStory SEA Analytics
                Platform
              </h1>
              <p className="text-base text-gray-300 max-w-4xl mx-auto">
                Serving the MapleStory SEA community with comprehensive
                character and guild tracking across all servers. Join thousands
                of players using our free analytics tools to enhance their
                MapleStory experience.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mt-6">
                <span className="flex items-center">
                  <span className="text-green-400 mr-1">✓</span> Free to Use
                </span>
                <span className="flex items-center">
                  <span className="text-green-400 mr-1">✓</span> Real-time
                  Updates
                </span>
                <span className="flex items-center">
                  <span className="text-green-400 mr-1">✓</span> All SEA Servers
                </span>
                <span className="flex items-center">
                  <span className="text-green-400 mr-1">✓</span> Mobile Friendly
                </span>
                <span className="flex items-center">
                  <span className="text-green-400 mr-1">✓</span> No Registration
                  Required
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional SEO Content Section */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose MapleSEA Tracker?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  🚀 Real-time Data
                </h3>
                <p className="text-sm text-gray-600">
                  Get the latest character and guild information directly from
                  Nexon's official MapleStory SEA API.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  📱 Mobile Optimized
                </h3>
                <p className="text-sm text-gray-600">
                  Access your character and guild data on any device with our
                  responsive design.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  🔒 Privacy Focused
                </h3>
                <p className="text-sm text-gray-600">
                  No registration required. Your searches are private and not
                  stored on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  ⚡ Lightning Fast
                </h3>
                <p className="text-sm text-gray-600">
                  Optimized performance with caching and efficient API calls for
                  instant results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
