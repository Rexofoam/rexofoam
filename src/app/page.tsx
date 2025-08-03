"use client";

import { useState } from "react";
import { useNavigation } from "@/utils/navigation";
import Header from "@/components/Header";

export default function BackgroundPage() {
  const [isGuildMode, setIsGuildMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState<{
    character_name?: string;
    ocid?: string;
    name?: string;
    level?: string;
    members?: string;
    leader?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigation = useNavigation();

  const toggleMode = () => {
    setIsGuildMode(!isGuildMode);
    setInputValue("");
    setSearchResult(null);
    setError("");
  };

  const handleSearch = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      if (isGuildMode) {
        // Guild search is in development
        setError(
          "🚧 Guild search is currently in development. Please check back soon!"
        );
        setSearchResult(null);
        setIsLoading(false);
        return;
      } else {
        // Use real MapleStory SEA API for character search
        const response = await fetch(
          `https://open.api.nexon.com/maplestorysea/v1/id?character_name=${encodeURIComponent(
            inputValue
          )}`,
          {
            headers: {
              "x-nxopen-api-key":
                "test_ea78af0bb88d495a94b6f66066c720e395fdf4f7b152747fba72a401626e4bfdefe8d04e6d233bd35cf2fabdeb93fb0d",
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
            <p className="text-center text-gray-600 text-sm mt-1">
              Search for MapleSea Account Details.
            </p>
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
                    <strong>Name:</strong> {searchResult.name}
                  </p>
                  <p>
                    <strong>Level:</strong> {searchResult.level}
                  </p>
                  <p>
                    <strong>Members:</strong> {searchResult.members}
                  </p>
                  <p>
                    <strong>Leader:</strong> {searchResult.leader}
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
  );
}
