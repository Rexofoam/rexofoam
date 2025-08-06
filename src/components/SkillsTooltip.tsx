interface SkillsTooltipProps {
    skillsData: any;
}

export function SkillsTooltip({
    skillsData
}: SkillsTooltipProps) {
    return (
        <div>
            {skillsData && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/4 mb-2 px-4 py-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] max-w-sm w-64">
                    <div className="font-semibold mb-1">
                        {skillsData.skill_name}
                    </div>
                    {skillsData.skill_level && (
                        <div className="text-gray-300 mb-1">
                            Level: {skillsData.skill_level}
                        </div>
                    )}
                    {skillsData.skill_effect && (
                        <div className="text-blue-300 whitespace-normal">
                            {skillsData.skill_effect}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}