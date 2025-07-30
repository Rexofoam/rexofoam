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
  initialData 
}: CharacterDetailsClientProps) {
  const router = useRouter();
  const [characterData, setCharacterData] = useState<CharacterData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'equipment'>('overview');

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
      console.error('Error loading character data:', err);
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

  // Navigation handlers for different views
  const navigateToStats = () => {
    router.push(buildUrl.characterStats(ocid));
  };

  const navigateToEquipment = () => {
    router.push(buildUrl.characterEquipment(ocid));
  };

  const handleCompareCharacter = () => {
    // Add current character to comparison
    const currentComparison = localStorage.getItem('character_comparison');
    const characters = currentComparison ? JSON.parse(currentComparison) : [];
    
    if (!characters.some((char: any) => char.ocid === ocid)) {
      characters.push({
        ocid,
        name: characterData?.basic?.character_name,
        level: characterData?.basic?.character_level,
        class: characterData?.basic?.character_class,
      });
      localStorage.setItem('character_comparison', JSON.stringify(characters));
    }
    
    router.push(buildUrl.characterCompare([ocid]));
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
                      Level {characterData.basic.character_level} {characterData.basic.character_class}
                    </p>
                    <p className="text-sm text-gray-500">
                      {characterData.basic.world_name} World
                      {characterData.basic.character_guild_name && 
                        ` • ${characterData.basic.character_guild_name}`
                      }
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
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </button>
                  <button
                    onClick={handleCompareCharacter}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Compare
                  </button>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'stats' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Stats
                </button>
                <button
                  onClick={() => setActiveTab('equipment')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'equipment' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Equipment
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
              {activeTab === 'overview' && (
                <>
                  {/* Basic Info */}
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
                    <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                      <div>
                        <p><strong>Character Name:</strong> {characterData.basic?.character_name}</p>
                        <p><strong>Level:</strong> {characterData.basic?.character_level}</p>
                        <p><strong>Class:</strong> {characterData.basic?.character_class}</p>
                        <p><strong>World:</strong> {characterData.basic?.world_name}</p>
                      </div>
                      <div>
                        <p><strong>Guild:</strong> {characterData.basic?.character_guild_name || 'None'}</p>
                        <p><strong>Gender:</strong> {characterData.basic?.character_gender}</p>
                        <p><strong>Created:</strong> {characterData.basic?.character_date_create}</p>
                        <p><strong>Last Updated:</strong> {characterData.lastUpdated.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Preview */}
                  {characterData.stat && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Key Stats</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          {characterData.stat.final_stat?.slice(0, 6).map((stat, index) => (
                            <p key={index}>
                              <strong>{stat.stat_name}:</strong> {stat.stat_value}
                            </p>
                          ))}
                        </div>
                        <button
                          onClick={() => setActiveTab('stats')}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View All Stats →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'stats' && characterData.stat && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Character Stats</h2>
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

              {activeTab === 'equipment' && characterData.itemEquipment && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Equipment</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-4"><strong>Equipment Count:</strong> {characterData.itemEquipment.item_equipment?.length || 0}</p>
                    <div className="space-y-2">
                      {characterData.itemEquipment.item_equipment?.map((item, index) => (
                        <div key={index} className="border-b border-gray-200 py-2 last:border-b-0">
                          <p><strong>{item.item_equipment_part}:</strong> {item.item_name}</p>
                          {item.starforce && <p className="text-sm text-gray-600">★ {item.starforce}</p>}
                        </div>
                      ))}
                    </div>
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
