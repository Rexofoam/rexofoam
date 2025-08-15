import { useState, useEffect } from "react";
import { GuildData } from "@/types/maplestory-api";
import { useNavigation } from "@/utils/navigation";
import { toast } from "react-toastify";

interface MembersTabProps {
  guildData: GuildData;
  oguild_id: string;
}

export function MembersTab({ guildData, oguild_id }: MembersTabProps) {
  const navigation = useNavigation();
  const [previousMembers, setPreviousMembers] = useState<string[]>([]);
  const [newMembers, setNewMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch guild data from 1 month ago to identify new members
  useEffect(() => {
    fetchPreviousMonthData();
  }, [oguild_id]);

  const fetchPreviousMonthData = async () => {
    if (!oguild_id) return;

    try {
      // Calculate date 1 month ago
      const today = new Date();
      const oneMonthAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );
      const dateParam = oneMonthAgo.toISOString().split("T")[0];

      const response = await fetch(
        `https://open.api.nexon.com/maplestorysea/v1/guild/basic?oguild_id=${oguild_id}&date=${dateParam}`,
        {
          headers: {
            "x-nxopen-api-key":
              "live_ea78af0bb88d495a94b6f66066c720e33d4e8a3ef9dad5783bd0c610437d34f2efe8d04e6d233bd35cf2fabdeb93fb0d",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const prevMembers = data.guild_member || [];
        setPreviousMembers(prevMembers);

        // Find new members (current members not in previous month)
        const currentMembers = guildData.basic?.guild_member || [];
        const newMembersList = currentMembers.filter(
          (member) => !prevMembers.includes(member)
        );
        setNewMembers(newMembersList);
      } else {
        console.warn("Failed to fetch previous month guild data");
      }
    } catch (error) {
      console.error("Error fetching previous month data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if a member is new (joined in the last month)
  const isNewMember = (memberName: string) => {
    return newMembers.includes(memberName);
  };

  // Go to character details
  const goToCharacterDetails = async (name: string) => {
    try {
      // Use real MapleStory SEA API for character search
      const response = await fetch(
        `https://open.api.nexon.com/maplestorysea/v1/id?character_name=${name}`,
        {
          headers: {
            "x-nxopen-api-key":
              "live_ea78af0bb88d495a94b6f66066c720e33d4e8a3ef9dad5783bd0c610437d34f2efe8d04e6d233bd35cf2fabdeb93fb0d",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        navigation.goToCharacterDetails(data.ocid, name);
      } else {
        toast.error("Character info is not available due to inactivity.", {
          theme: "colored",
        });
      }
    } catch (err) {
      console.error("Failed to load character details: ", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6 rounded-2xl shadow-xl text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-3xl">👥</span>
              Guild Members
            </h2>
            <p className="text-blue-100 text-sm md:text-base">
              Discover and connect with fellow guild mates
            </p>
            {!loading && newMembers.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-yellow-300 text-lg">✨</span>
                <span className="text-yellow-300 text-sm font-medium">
                  {newMembers.length} new member
                  {newMembers.length > 1 ? "s" : ""} this month!
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">
                  {guildData.basic?.guild_member_count}
                </div>
                <div className="text-blue-100 text-xs md:text-sm font-medium">
                  Total Members
                </div>
              </div>
            </div>
            {!loading && newMembers.length > 0 && (
              <div className="bg-yellow-400/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300/30">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300">
                    {newMembers.length}
                  </div>
                  <div className="text-yellow-200 text-xs md:text-sm font-medium">
                    New This Month
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Members List Header */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-2xl">📋</span>
              All Members
            </h3>
            <p className="text-gray-600 mt-1">
              Click on any member to view their character profile
              {!loading && newMembers.length > 0 && (
                <span className="text-yellow-600 font-medium">
                  {" "}
                  • New members are highlighted with a golden glow
                </span>
              )}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guildData.basic?.guild_member.sort().map((member, index) => {
                const isNew = isNewMember(member);
                return (
                  <div
                    key={index}
                    className={`group relative p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                      isNew
                        ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 hover:border-yellow-400 shadow-lg shadow-yellow-200/50"
                        : "bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-blue-300 hover:shadow-lg"
                    }`}
                  >
                    {/* Member Avatar Circle */}
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                          isNew
                            ? "bg-gradient-to-br from-yellow-500 to-amber-600"
                            : "bg-gradient-to-br from-blue-500 to-purple-600"
                        }`}
                      >
                        {member[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold text-lg group-hover:text-blue-600 transition-colors ${
                              isNew ? "text-amber-900" : "text-gray-900"
                            }`}
                          >
                            {member}
                          </h3>
                          {isNew && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                              ✨ NEW
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            isNew ? "text-amber-600" : "text-gray-500"
                          }`}
                        >
                          Guild Member #{index + 1}
                          {isNew && (
                            <span className="ml-2 text-yellow-600 font-medium">
                              • Joined this month
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => goToCharacterDetails(member)}
                      className={`w-full font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                        isNew
                          ? "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      }`}
                    >
                      <span className="text-sm">{isNew ? "✨" : "🔍"}</span>
                      {isNew ? "View New Member" : "View Profile"}
                    </button>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
