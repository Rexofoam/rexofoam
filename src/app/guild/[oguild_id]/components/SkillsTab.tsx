import { InvalidDataFallback } from "@/components/InvalidDataFallback";
import { SkillsTooltip } from "../../../../components/SkillsTooltip";
import { NoblesseSkills } from "./NoblesseSkills";
import { InvalidSkillsFallback } from "./InvalidSkillsFallback";

interface SkillsTabProps {
    regularSkillsData: any;
    noblesseSkillsData: any;
    skillsLoading: boolean;
    skillsError: string;
}

export function SkillsTab({
    regularSkillsData,
    noblesseSkillsData,
    skillsLoading,
    skillsError
}: SkillsTabProps) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Guild Skills</h2>

            {skillsLoading && (
                <div className="flex flex-col items-center justify-center py-8">
                    <img
                        src="/images/mushroom-loader.gif"
                        alt="Loading..."
                        className="w-16 h-16 mb-4"
                    />
                    <p className="text-gray-600">Loading guild skills...</p>
                </div>
            )}

            {skillsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800">Error: {skillsError}</p>
                </div>
            )}
            {/* Regular Guild Skills */}
            {!skillsLoading &&
                !skillsError &&
                regularSkillsData && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-2 text-blue-700">
                            Regular Guild Skills
                        </h3>
                        <div className="flex">
                            <div className="grid grid-cols-6 gap-3 justify-items-center">
                                {regularSkillsData.map(
                                    (skill: any, index: number) => (
                                        <div
                                            key={index}
                                            className="group relative bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-100 transition-colors w-20 h-20 shadow-sm hover:shadow-md"
                                            title={skill.skill_name}
                                        >
                                            <div className="w-full h-full flex items-center justify-center">
                                                {skill.skill_icon ? (
                                                    <img
                                                        src={skill.skill_icon}
                                                        alt={skill.skill_name}
                                                        className="w-16 h-16 object-contain"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-blue-200 rounded flex items-center justify-center">
                                                        <span className="text-blue-600 text-sm font-bold">
                                                            {skill.skill_name?.[0] || "?"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tooltip on hover */}
                                            <SkillsTooltip
                                                skillsData={skill}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            {/* Fallback for invalid guild skills */}
            <InvalidSkillsFallback
                skillsData={regularSkillsData}
                loading={skillsLoading}
                error={skillsError}
                type="guild_skill"
            />

            {/* Noblesse Guild Skills */}
            {!skillsLoading &&
                !skillsError &&
                noblesseSkillsData && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold mb-2 text-rose-700">
                            Noblesse Guild Skills
                        </h3>
                        <div className="flex">
                            <NoblesseSkills
                                skillsData={noblesseSkillsData}
                            />
                        </div>
                    </div>
                )}
            {/* Fallback for invalid noblesse skills*/}
            <InvalidSkillsFallback
                skillsData={noblesseSkillsData}
                loading={skillsLoading}
                error={skillsError}
                type="noblesse_skill"
            />
        </div>
    );
}