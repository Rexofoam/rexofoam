"use client";

import Header from "@/components/Header";
import guildDataService from "@/services/guild-data.service";
import { GuildData } from "@/types/maplestory-api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SkillsTab } from "./components/SkillsTab";
import { NoblesseSkills } from "./components/NoblesseSkills";
import { InvalidSkillsFallback } from "./components/InvalidSkillsFallback";

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
    const [guildData, setGuildData] = useState<GuildData | null>(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'members'>('overview');

    useEffect(() => {
        if (!initialData && oguild_id) {
            loadGuildData();
        }
    }, [oguild_id, initialData]);

    const loadGuildData = async () => {
        setLoading(true);
        setError('');

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
            console.error('Error loading guild data:', error);
            setError('Failed to fetch guild details.');
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
            setError('Failed to refresh guild data');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !guildData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white bg-opacity-80">
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <img
                        src="/images/mushroom-loader.gif"
                        alt="Loading..."
                        className="w-32 h-32 mb-6"
                    />
                    <p className="text-lg font-semibold text-black">
                        Loading guild data...
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
                                        <h1 className="text-3xl font-bold text-black">
                                            {guildName}
                                        </h1>
                                        <p className="text-lg text-gray-600">
                                            Level {guildData.basic.guild_level}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {world} World • {guildData.basic.guild_master_name}'s guild
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
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'overview'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('skills')}
                                    className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'skills'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Skills
                                </button>
                                <button
                                    onClick={() => setActiveTab('members')}
                                    className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'members'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Members
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
                    {guildData && (
                        <div className="space-y-6 text-black">
                            {activeTab === 'overview' && (
                                <>
                                    {/* Guild Info */}
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">Guild Info</h2>
                                        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                                            <div>
                                                <p><strong>Guild Name:</strong> {guildName}</p>
                                                <p><strong>Level:</strong> {guildData.basic?.guild_level}</p>
                                                <p><strong>World:</strong> {world}</p>
                                                <p><strong>Honor EXP:</strong> {guildData.basic?.guild_fame}</p>
                                            </div>
                                            <div>
                                                <p><strong>Guild Master:</strong> {guildData.basic?.guild_master_name}</p>
                                                <p><strong>Guild Members:</strong> {guildData.basic?.guild_member_count} / 200</p>
                                                <p><strong>Guild Points:</strong> {guildData.basic?.guild_point}</p>
                                                <p><strong>Last Updated:</strong> {guildData.lastUpdated.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Noblesse Skills Preview */}
                                    <h2 className="text-xl font-semibold mb-2">Noblesse Skills</h2>
                                    {(guildData.basic?.guild_noblesse_skill &&
                                        guildData.basic.guild_noblesse_skill.length > 0) &&
                                        (
                                            <div>

                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <NoblesseSkills
                                                        skillsData={guildData.basic?.guild_noblesse_skill}
                                                    />
                                                    <button
                                                        onClick={() => setActiveTab('skills')}
                                                        className="mt-5 text-blue-600 hover:text-blue-800 text-sm"
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
                                    />
                                </>
                            )}

                            {activeTab === 'skills' && guildData.basic?.guild_skill && (
                                <SkillsTab
                                    regularSkillsData={guildData.basic?.guild_skill}
                                    noblesseSkillsData={guildData.basic?.guild_noblesse_skill}
                                    skillsLoading={loading}
                                    skillsError={error}
                                />
                            )}

                            {activeTab === 'members' && guildData.basic?.guild_member && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Members</h2>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="mb-4"><strong>Member Count:</strong> {guildData.basic?.guild_member_count}</p>
                                        <div className="space-y-2">
                                            {guildData.basic?.guild_member.map((member, index) => (
                                                <div key={index} className="border-b border-gray-200 py-2 last:border-b-0">
                                                    <p>{member}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!error && !guildData && !loading && (
                        <p className="text-center text-black">No guild data found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}