"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { characterDataService } from "@/services/character-data.service";
import { CharacterData } from "@/types/maplestory-api";
import Header from "@/components/Header";
import { buildUrl } from "@/config/routes";

interface CharacterStatsClientProps {
  ocid: string;
  initialData?: CharacterData;
}

export function CharacterStatsClient({ 
  ocid, 
  initialData 
}: CharacterStatsClientProps) {
  const [characterData, setCharacterData] = useState<CharacterData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData && ocid) {
      loadCharacterData();
    }
  }, [ocid, initialData]);

  const loadCharacterData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await characterDataService.fetchCharacterData(ocid);
      setCharacterData(data);
    } catch (err) {
      console.error('Error loading character data:', err);
      setError("Failed to fetch character details.");
    } finally {
      setLoading(false);
    }
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
            Loading character stats...
          </p>
        </div>
      </div>
    );
  }

  if (!characterData?.basic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600">Character not found</p>
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
          
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href={buildUrl.character(ocid)} className="hover:text-blue-600">
              {characterData.basic.character_name}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800">Stats</span>
          </nav>

          {/* Character Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              {characterData.basic.character_image && (
                <img
                  src={characterData.basic.character_image}
                  alt={characterData.basic.character_name}
                  className="w-16 h-16 rounded-lg"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-black">
                  {characterData.basic.character_name} - Stats
                </h1>
                <p className="text-lg text-gray-600">
                  Level {characterData.basic.character_level} {characterData.basic.character_class}
                </p>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="flex space-x-4">
              <Link
                href={buildUrl.character(ocid)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                ← Overview
              </Link>
              <Link
                href={buildUrl.characterEquipment(ocid)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                View Equipment →
              </Link>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {/* Stats Content */}
          {characterData.stat && (
            <div className="space-y-6 text-black">
              {/* Primary Stats */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Character Stats</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characterData.stat.final_stat?.map((stat, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{stat.stat_name}</span>
                          <span className="font-bold text-lg">{stat.stat_value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Remaining AP:</strong> {characterData.stat.remain_ap}</p>
                  </div>
                </div>
              </div>

              {/* Hyper Stats */}
              {characterData.hyperStat && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Hyper Stats</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="mb-4">
                      <p><strong>Active Preset:</strong> {characterData.hyperStat.use_preset_no}</p>
                      <p><strong>Available Points:</strong> {characterData.hyperStat.use_available_hyper_stat}</p>
                    </div>
                    
                    {/* Hyper Stat Presets */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: 'Preset 1', data: characterData.hyperStat.hyper_stat_preset_1 },
                        { name: 'Preset 2', data: characterData.hyperStat.hyper_stat_preset_2 },
                        { name: 'Preset 3', data: characterData.hyperStat.hyper_stat_preset_3 },
                      ].map((preset, index) => (
                        <div key={index} className="bg-white p-4 rounded border">
                          <h3 className="font-semibold mb-2">{preset.name}</h3>
                          {preset.data && (
                            <div className="space-y-1 text-sm">
                              <p><strong>Type:</strong> {preset.data.stat_type}</p>
                              <p><strong>Points:</strong> {preset.data.stat_point}</p>
                              <p><strong>Level:</strong> {preset.data.stat_level}</p>
                              <p><strong>Increase:</strong> {preset.data.stat_increase}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Abilities */}
              {characterData.ability && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Abilities</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="mb-4">
                      <p><strong>Ability Grade:</strong> {characterData.ability.ability_grade}</p>
                      <p><strong>Remaining Fame:</strong> {characterData.ability.remain_fame}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {characterData.ability.ability_info?.map((ability, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="text-sm">
                            <p><strong>Grade:</strong> {ability.ability_grade}</p>
                            <p><strong>Value:</strong> {ability.ability_value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
