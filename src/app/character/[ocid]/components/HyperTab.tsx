interface HyperTabProps {
  hyperPassiveSkills: any;
  hyperActiveSkills: any;
  hyperStatData: any;
  hyperSkillsLoading: boolean;
  hyperSkillsError: string;
  isDark?: boolean;
}

export function HyperTab({
  hyperPassiveSkills,
  hyperActiveSkills,
  hyperStatData,
  hyperSkillsLoading,
  hyperSkillsError,
  isDark = false,
}: HyperTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Hyper Skills</h2>

      {hyperSkillsLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <img
            src="/images/mushroom-loader.gif"
            alt="Loading..."
            className="w-16 h-16 mb-4"
          />
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            Loading hyper skills...
          </p>
        </div>
      )}

      {hyperSkillsError && (
        <div
          className={`border rounded-lg p-4 mb-4 ${
            isDark ? "bg-red-950/40 border-red-700" : "bg-red-50 border-red-200"
          }`}
        >
          <p className={isDark ? "text-red-300" : "text-red-800"}>
            Error: {hyperSkillsError}
          </p>
        </div>
      )}

      {!hyperSkillsLoading &&
        !hyperSkillsError &&
        (hyperPassiveSkills || hyperActiveSkills || hyperStatData) && (
          <div className="space-y-6">
            {/* Hyper Passive Skills */}
            {hyperPassiveSkills?.character_skill &&
              hyperPassiveSkills.character_skill.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-purple-700">
                    Hyper Passive Skills
                  </h3>
                  <div className="flex justify-center">
                    <div className="grid grid-cols-5 gap-3 justify-items-center">
                      {hyperPassiveSkills.character_skill.map(
                        (skill: any, index: number) => (
                          <div
                            key={index}
                            className={`group relative border rounded-md p-2 transition-colors w-20 h-20 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
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
                                <div className="w-16 h-16 bg-purple-200 rounded flex items-center justify-center">
                                  <span className="text-purple-600 text-sm font-bold">
                                    {skill.skill_name?.[0] || "?"}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] whitespace-nowrap max-w-sm w-64">
                              <div className="font-semibold">
                                {skill.skill_name}
                              </div>
                              {skill.skill_level && (
                                <div className="text-gray-300">
                                  Level: {skill.skill_level}
                                </div>
                              )}
                              {skill.skill_effect && (
                                <div className="text-blue-300 mt-1 whitespace-normal">
                                  {skill.skill_effect}
                                </div>
                              )}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Hyper Active Skills */}
            {hyperActiveSkills?.character_skill &&
              hyperActiveSkills.character_skill.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-700">
                    Hyper Active Skills
                  </h3>
                  <div className="flex justify-center">
                    <div className="grid grid-cols-5 gap-3 justify-items-center">
                      {hyperActiveSkills.character_skill.map(
                        (skill: any, index: number) => (
                          <div
                            key={index}
                            className={`group relative border rounded-md p-2 transition-colors w-20 h-20 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
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
                                <div className="w-16 h-16 bg-red-200 rounded flex items-center justify-center">
                                  <span className="text-red-600 text-sm font-bold">
                                    {skill.skill_name?.[0] || "?"}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] whitespace-nowrap max-w-sm w-64">
                              <div className="font-semibold">
                                {skill.skill_name}
                              </div>
                              {skill.skill_level && (
                                <div className="text-gray-300">
                                  Level: {skill.skill_level}
                                </div>
                              )}
                              {skill.skill_effect && (
                                <div className="text-blue-300 mt-1 whitespace-normal">
                                  {skill.skill_effect}
                                </div>
                              )}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Hyper Stats */}
            {hyperStatData?.hyper_stat_preset_1 &&
              hyperStatData.hyper_stat_preset_1.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-700">
                    Hyper Stats
                  </h3>
                  <div
                    className={`rounded-lg p-4 ${
                      isDark ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {hyperStatData.hyper_stat_preset_1.map(
                        (stat: any, index: number) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${
                              isDark
                                ? "bg-gray-700 border-gray-600"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div
                                  className={`font-semibold ${
                                    isDark ? "text-gray-100" : "text-gray-800"
                                  }`}
                                >
                                  {stat.stat_type}
                                </div>
                                <div
                                  className={`text-sm ${
                                    isDark ? "text-gray-300" : "text-gray-600"
                                  }`}
                                >
                                  Level {stat.stat_level}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-green-600">
                                  {stat.stat_increase}
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* No data found */}
            {(!hyperPassiveSkills?.character_skill ||
              hyperPassiveSkills.character_skill.length === 0) &&
              (!hyperActiveSkills?.character_skill ||
                hyperActiveSkills.character_skill.length === 0) &&
              (!hyperStatData?.hyper_stat_preset_1 ||
                hyperStatData.hyper_stat_preset_1.length === 0) && (
                <div className="text-center py-8">
                  <div
                    className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`w-8 h-8 ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDark ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    No Hyper Data Found
                  </h3>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    This character doesn't have any hyper skills or hyper stats
                    configured yet.
                  </p>
                </div>
              )}
          </div>
        )}
    </div>
  );
}
