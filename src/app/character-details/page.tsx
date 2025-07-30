"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { characterDataService } from "@/services/character-data.service";
import { CharacterData } from "@/types/maplestory-api";
import { URLParams } from "@/utils/navigation";
import Header from "@/components/Header";

export default function CharacterDetailsPage() {
  const searchParams = useSearchParams();
  const ocid = URLParams.getCharacterOcid(searchParams);
  const characterName = URLParams.getCharacterName(searchParams);
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState("");

  // Debug logging
  console.log('CharacterDetailsPage render:', { 
    ocid, 
    characterName, 
    loading, 
    hasCharacterData: !!characterData,
    searchParamsString: searchParams.toString()
  });

  useEffect(() => {
    console.log('useEffect triggered with ocid:', ocid);
    
    if (!ocid) {
      console.log('No ocid found, setting loading to false');
      setLoading(false);
      return;
    }
    
    const loadCharacterData = async () => {
      setLoading(true);
      setError("");
      
      // Start timer for minimum loading time
      const startTime = Date.now();
      const minLoadingTime = 1000; // 1 second minimum
      
      try {
        // Check localStorage first for immediate display
        const cached = characterDataService.getFromLocalStorage(ocid);
        if (cached) {
          setCharacterData(cached);
        }
        
        // Fetch fresh data (will use cache if still valid)
        const data = await characterDataService.fetchCharacterData(ocid);
        setCharacterData(data);
        
        // Ensure minimum loading time
        const elapsed = Date.now() - startTime;
        const remainingTime = minLoadingTime - elapsed;
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
      } catch (err) {
        console.error('Error loading character data:', err);
        setError("Failed to fetch character details.");
        
        // Still respect minimum loading time even on error
        const elapsed = Date.now() - startTime;
        const remainingTime = minLoadingTime - elapsed;
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, [ocid]);

  const handleRefresh = async () => {
    if (!ocid) return;
    
    setLoading(true);
    
    // Start timer for minimum loading time
    const startTime = Date.now();
    const minLoadingTime = 1000; // 1 second minimum
    
    try {
      const data = await characterDataService.refreshCharacterData(ocid);
      setCharacterData(data);
      
      // Ensure minimum loading time
      const elapsed = Date.now() - startTime;
      const remainingTime = minLoadingTime - elapsed;
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
    } catch (err) {
      setError("Failed to refresh character data.");
      
      // Still respect minimum loading time even on error
      const elapsed = Date.now() - startTime;
      const remainingTime = minLoadingTime - elapsed;
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
    } finally {
      setLoading(false);
    }
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

      {/* Loading Overlay - Always on top when loading */}
      {loading && (
        <div className="fixed inset-0 z-[9999] min-h-screen flex flex-col items-center justify-center bg-red-500 bg-opacity-80">
          <div className="bg-yellow-400 border-4 border-red-600 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
            <div className="w-32 h-32 mb-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">LOADING</span>
            </div>
            <p className="text-lg font-bold text-black">
              Loading character data... (Debug Mode)
            </p>
            <p className="text-sm text-black mt-2">
              OCID: {ocid || 'No OCID found'}
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <Header variant="details" />
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-3/4 max-w-4xl bg-opacity-90 backdrop-blur-md max-h-[80vh] overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4 text-center text-black">
            Character Details
          </h1>
          
          {/* Refresh Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

          {error && <p className="text-center text-red-600 mb-4">{error}</p>}
          
          {characterData && (
            <div className="space-y-6 text-black">
              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-semibold mb-2 text-center">Basic Information</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Character Name:</strong> {characterData.basic?.character_name}</p>
                  <p><strong>Level:</strong> {characterData.basic?.character_level}</p>
                  <p><strong>Class:</strong> {characterData.basic?.character_class}</p>
                  <p><strong>World:</strong> {characterData.basic?.world_name}</p>
                  <p><strong>Guild:</strong> {characterData.basic?.character_guild_name || 'None'}</p>
                  <p><strong>Last Updated:</strong> {characterData.lastUpdated.toLocaleString()}</p>
                </div>
              </div>

              {/* Character Stats */}
              {characterData.stat && (
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-center">Character Stats</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {characterData.stat.final_stat?.slice(0, 10).map((stat, index) => (
                        <p key={index}>
                          <strong>{stat.stat_name}:</strong> {stat.stat_value}
                        </p>
                      ))}
                    </div>
                    {characterData.stat.final_stat?.length > 10 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-blue-600">Show All Stats</summary>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                          {characterData.stat.final_stat.slice(10).map((stat, index) => (
                            <p key={index + 10}>
                              <strong>{stat.stat_name}:</strong> {stat.stat_value}
                            </p>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Equipment Preview */}
              {characterData.itemEquipment && (
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-center">Equipment</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Equipment Count:</strong> {characterData.itemEquipment.item_equipment?.length || 0}</p>
                    {characterData.itemEquipment.item_equipment?.slice(0, 5).map((item, index) => (
                      <div key={index} className="border-b border-gray-200 py-2 last:border-b-0">
                        <p><strong>{item.item_equipment_part}:</strong> {item.item_name}</p>
                      </div>
                    ))}
                    {characterData.itemEquipment.item_equipment?.length > 5 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-blue-600">Show All Equipment</summary>
                        <div className="mt-2">
                          {characterData.itemEquipment.item_equipment.slice(5).map((item, index) => (
                            <div key={index + 5} className="border-b border-gray-200 py-2 last:border-b-0">
                              <p><strong>{item.item_equipment_part}:</strong> {item.item_name}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Raw Data (Collapsible) */}
              <details>
                <summary className="cursor-pointer text-blue-600 text-center">Show Raw API Data</summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-semibold">Basic Data:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(characterData.basic, null, 2)}
                    </pre>
                  </div>
                  
                  {characterData.stat && (
                    <div>
                      <h3 className="font-semibold">Stat Data:</h3>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(characterData.stat, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {characterData.hyperStat && (
                    <div>
                      <h3 className="font-semibold">Hyper Stat Data:</h3>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(characterData.hyperStat, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
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
