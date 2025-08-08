"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GrowthData {
  date: string;
  level: number;
  exp: number;
  expRate: number;
}

interface GrowthTabProps {
  ocid: string;
}

export function GrowthTab({ ocid }: GrowthTabProps) {
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const getLastFiveDays = (): string[] => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(formatDate(date));
    }

    return dates;
  };

  const loadGrowthData = async () => {
    setLoading(true);
    setError("");

    try {
      const dates = getLastFiveDays();
      const apiKey =
        "live_ea78af0bb88d495a94b6f66066c720e33d4e8a3ef9dad5783bd0c610437d34f2efe8d04e6d233bd35cf2fabdeb93fb0d";

      const promises = dates.map(async (date, index) => {
        const url =
          index === dates.length - 1
            ? `https://open.api.nexon.com/maplestorysea/v1/character/basic?ocid=${ocid}`
            : `https://open.api.nexon.com/maplestorysea/v1/character/basic?ocid=${ocid}&date=${date}`;

        const response = await fetch(url, {
          headers: {
            "x-nxopen-api-key": apiKey,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${date}`);
        }

        const data = await response.json();
        return {
          date,
          level: parseInt(data.character_level) || 0,
          exp: parseInt(
            data.character_exp?.toString().replace(/,/g, "") || "0"
          ),
          expRate: parseFloat(data.character_exp_rate) || 0,
        };
      });

      const results = await Promise.all(promises);
      setGrowthData(results);
    } catch (err: any) {
      setError(err.message || "Failed to load growth data");
      setGrowthData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ocid) {
      loadGrowthData();
    }
  }, [ocid]);

  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  const formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const calculateLevelGrowth = (): number => {
    if (growthData.length < 2) return 0;
    return growthData[growthData.length - 1].level - growthData[0].level;
  };

  const calculateExpGrowth = (): number => {
    if (growthData.length < 2) return 0;
    const latestExp = growthData[growthData.length - 1].exp;
    const oldestExp = growthData[0].exp;
    const latestLevel = growthData[growthData.length - 1].level;
    const oldestLevel = growthData[0].level;

    // If level increased, we need to account for level ups
    if (latestLevel > oldestLevel) {
      // This is a simplified calculation - in reality you'd need the exact exp tables
      return latestExp + (latestLevel - oldestLevel) * 1000000000; // Rough estimate
    }

    return latestExp - oldestExp;
  };

  const getAverageExpRate = (): number => {
    if (growthData.length === 0) return 0;
    const sum = growthData.reduce((acc, data) => acc + data.expRate, 0);
    return sum / growthData.length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
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
          <span className="text-lg text-gray-600">Loading growth data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-300 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-200 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to Load Growth Data
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadGrowthData}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (growthData.length === 0) {
    return (
      <div className="text-center py-12">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Growth Data Available
        </h3>
        <p className="text-gray-600">
          Unable to retrieve character growth data for the past 5 days.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Growth Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Level Growth</h3>
              <p className="text-green-100 text-sm">Last 5 days</p>
            </div>
            <div className="text-3xl font-bold">+{calculateLevelGrowth()}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Avg EXP Rate</h3>
              <p className="text-blue-100 text-sm">5-day average</p>
            </div>
            <div className="text-3xl font-bold">
              {getAverageExpRate().toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Current Level</h3>
              <p className="text-purple-100 text-sm">Latest data</p>
            </div>
            <div className="text-3xl font-bold">
              {growthData[growthData.length - 1]?.level || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Level Growth Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Level Progression
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateDisplay}
                stroke="#666"
                fontSize={12}
              />
              <YAxis stroke="#666" fontSize={12} tickFormatter={formatNumber} />
              <Tooltip
                labelFormatter={(value) =>
                  `Date: ${formatDateDisplay(value as string)}`
                }
                formatter={(value: any, name: string) => [
                  name === "level" ? value : formatNumber(value),
                  name === "level" ? "Level" : "Level",
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="level"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
                name="Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* EXP Rate Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          EXP Rate Progression
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateDisplay}
                stroke="#666"
                fontSize={12}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                labelFormatter={(value) =>
                  `Date: ${formatDateDisplay(value as string)}`
                }
                formatter={(value: any) => [`${value}%`, "EXP Rate"]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="expRate"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                name="EXP Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Daily Progress Data
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  Level
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  Experience
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  EXP Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {growthData.map((data, index) => (
                <tr key={data.date} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-800">
                    {formatDateDisplay(data.date)}
                  </td>
                  <td className="p-3 text-gray-800 font-medium">
                    {data.level}
                  </td>
                  <td className="p-3 text-gray-800">
                    {formatNumber(data.exp)}
                  </td>
                  <td className="p-3 text-gray-800">
                    <div className="flex items-center space-x-2">
                      <span>{data.expRate.toFixed(1)}%</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, data.expRate)}%` }}
                        ></div>
                      </div>
                    </div>
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
