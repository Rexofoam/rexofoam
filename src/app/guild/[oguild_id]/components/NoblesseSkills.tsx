import { useState } from "react";
import { SkillsTooltip } from "@/components/SkillsTooltip";

interface NoblesseSkillsProps {
  skillsData: any;
}

export function NoblesseSkills({ skillsData }: NoblesseSkillsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleTooltipToggle = (skillKey: string) => {
    setActiveTooltip(activeTooltip === skillKey ? null : skillKey);
  };

  return (
    <div onClick={() => setActiveTooltip(null)}>
      {skillsData && (
        <div className="grid grid-cols-3 md:flex md:flex-row gap-2 md:gap-3 text-sm justify-items-center md:justify-start">
          {skillsData.map((skill: any, index: number) => {
            const skillKey = `noblesse-${skill.skill_name}-${index}`;
            return (
              <div
                key={index}
                className="group relative bg-gray-400 border border-gray-300 rounded-lg p-1 md:p-2 hover:bg-gray-300 transition-colors w-16 md:w-20 h-20 md:h-24 shadow-sm hover:shadow-md cursor-pointer"
                title={skill.skill_name}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTooltipToggle(skillKey);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTooltipToggle(skillKey);
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  {skill.skill_icon ? (
                    <img
                      src={skill.skill_icon}
                      alt={skill.skill_name}
                      className="w-12 md:w-16 h-12 md:h-16 object-contain"
                    />
                  ) : (
                    <div className="w-12 md:w-16 h-12 md:h-16 bg-blue-200 rounded flex items-center justify-center">
                      <span className="text-blue-600 text-xs md:text-sm font-bold">
                        {skill.skill_name?.[0] || "?"}
                      </span>
                    </div>
                  )}
                  <span className="text-yellow-300 text-xs md:text-sm font-bold">
                    {skill.skill_level}/15
                  </span>
                </div>

                {/* Tooltip on hover */}
                <SkillsTooltip skillsData={skill} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
