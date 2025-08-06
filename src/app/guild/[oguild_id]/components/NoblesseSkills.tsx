import { SkillsTooltip } from "@/components/SkillsTooltip";

interface NoblesseSkillsProps {
    skillsData: any;
}

export function NoblesseSkills({
    skillsData
}: NoblesseSkillsProps) {
    return (
        <div>
            {skillsData && (
                <div className="flex flex-row gap-3 text-sm">
                    {skillsData.map((skill: any, index: number) => (
                        <div
                            key={index}
                            className="group relative bg-gray-400 border border-gray-300 rounded-lg p-2 hover:bg-gray-300 transition-colors w-20 h-24 shadow-sm hover:shadow-md"
                            title={skill.skill_name}
                        >
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
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
                                <span className="text-yellow-300 text-sm font-bold">
                                    {skill.skill_level}/15
                                </span>
                            </div>

                            {/* Tooltip on hover */}
                            <SkillsTooltip
                                skillsData={skill}
                            />

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}