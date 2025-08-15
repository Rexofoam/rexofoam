import { useState } from "react";
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
  skillsError,
}: SkillsTabProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleTooltipToggle = (skillKey: string) => {
    setActiveTooltip(activeTooltip === skillKey ? null : skillKey);
  };

  return (
    <div onClick={() => setActiveTooltip(null)}>
      <h2 className="text-xl font-semibold mb-4">Guild Skills</h2>
      <p className="mb-2 text-sm text-blue-600 md:hidden px-4 md:px-0">
        💡 Tap on skill icons to view details
      </p>

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
      {!skillsLoading && !skillsError && regularSkillsData && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-blue-700">
            Regular Guild Skills
          </h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 justify-items-center">
              {regularSkillsData.map((skill: any, index: number) => {
                const skillKey = `regular-${skill.skill_name}-${index}`;
                return (
                  <div
                    key={index}
                    className="group relative bg-white border border-gray-200 rounded-lg p-1 md:p-2 hover:bg-gray-100 transition-colors w-16 md:w-20 h-16 md:h-20 shadow-sm hover:shadow-md cursor-pointer"
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
                    <div className="w-full h-full flex items-center justify-center">
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
                    </div>

                    {/* Tooltip on hover */}
                    <SkillsTooltip skillsData={skill} />
                  </div>
                );
              })}
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
      {!skillsLoading && !skillsError && noblesseSkillsData && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-rose-700">
            Noblesse Guild Skills
          </h3>
          <div className="flex justify-center">
            <NoblesseSkills skillsData={noblesseSkillsData} />
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
