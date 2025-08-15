"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GrowthData {
  date: string;
  memberCount: number;
  guildLevel: number;
  guildPoints: number;
  guildFame: number;
  displayDate: string;
}

interface GrowthTabProps {
  oguild_id: string;
  currentData: {
    guild_member_count: number;
    guild_level: number;
    guild_point: number;
    guild_fame: number;
  };
}

export function GrowthTab({ oguild_id, currentData }: GrowthTabProps) {
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGrowthData();
  }, [oguild_id]);

  const fetchGrowthData = async () => {
    setLoading(true);
    setError("");

    try {
      const today = new Date();
      const dates = [
        null, // Today (no date parameter)
        new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()), // 1 month ago
        new Date(today.getFullYear(), today.getMonth() - 2, today.getDate()), // 2 months ago
        new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()), // 3 months ago
      ];

      const promises = dates.map(async (date, index) => {
        const displayDate =
          index === 0
            ? "Today"
            : index === 1
            ? "1 Month Ago"
            : index === 2
            ? "2 Months Ago"
            : "3 Months Ago";
        try {
          const dateParam = date
            ? `&date=${date.toISOString().split("T")[0]}`
            : "";
          const response = await fetch(
            `https://open.api.nexon.com/maplestorysea/v1/guild/basic?oguild_id=${oguild_id}${dateParam}`,
            {
              headers: {
                "x-nxopen-api-key":
                  "live_ea78af0bb88d495a94b6f66066c720e33d4e8a3ef9dad5783bd0c610437d34f2efe8d04e6d233bd35cf2fabdeb93fb0d",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();

            return {
              date: date
                ? date.toISOString().split("T")[0]
                : today.toISOString().split("T")[0],
              memberCount: data.guild_member_count || 0,
              guildLevel: data.guild_level || 0,
              guildPoints: data.guild_point || 0,
              guildFame: data.guild_fame || 0,
              displayDate,
            };
          } else {
            console.warn(`Failed to fetch data for ${displayDate}`);
            return null;
          }
        } catch (err) {
          console.warn(`Error fetching data for date ${date}:`, err);
          return null;
        }
      });

      const results = await Promise.all(promises);
      const validResults = results.filter(
        (result) => result !== null
      ) as GrowthData[];

      // Sort by actual date (oldest first for better chart display)
      validResults.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setGrowthData(validResults);
    } catch (err) {
      console.error("Error fetching growth data:", err);
      setError("Failed to load guild growth data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <img
          src="/images/mushroom-loader.gif"
          alt="Loading..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-600">Loading guild growth data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchGrowthData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const memberGrowth =
    growthData.length > 1
      ? growthData[growthData.length - 1].memberCount -
        growthData[0].memberCount
      : 0;

  const levelGrowth =
    growthData.length > 1
      ? growthData[growthData.length - 1].guildLevel - growthData[0].guildLevel
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 p-6 rounded-2xl shadow-xl text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
          <span className="text-3xl">📈</span>
          Guild Growth Analysis
        </h2>
        <p className="text-green-100 text-sm md:text-base">
          Track your guild's progress over the last 3 months
        </p>
      </div>

      {/* Growth Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="text-2xl mb-1">👥</div>
          <div
            className={`text-2xl font-bold ${
              memberGrowth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {memberGrowth >= 0 ? "+" : ""}
            {memberGrowth}
          </div>
          <div className="text-xs text-gray-500">Member Growth</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="text-2xl mb-1">⭐</div>
          <div
            className={`text-2xl font-bold ${
              levelGrowth >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            {levelGrowth >= 0 ? "+" : ""}
            {levelGrowth}
          </div>
          <div className="text-xs text-gray-500">Level Growth</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-2xl font-bold text-purple-600">
            {currentData.guild_member_count}
          </div>
          <div className="text-xs text-gray-500">Current Members</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-indigo-600">
            {currentData.guild_level}
          </div>
          <div className="text-xs text-gray-500">Current Level</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Count Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <span>👥</span>
            Member Count Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="memberCount"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Guild Level Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <span>⭐</span>
            Guild Level Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="guildLevel"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-2xl">📋</span>
            Historical Data
          </h3>
          <p className="text-gray-600 mt-1">
            Detailed guild statistics over time
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fame
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {growthData.map((data, index) => (
                <tr key={index} className={index === 0 ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.displayDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.memberCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.guildLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.guildPoints.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.guildFame.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
