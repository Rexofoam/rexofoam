interface LinkSkillsTabProps {
  linkSkillsData: any;
  linkSkillsLoading: boolean;
  linkSkillsError: string;
}

export function LinkSkillsTab({
  linkSkillsData,
  linkSkillsLoading,
  linkSkillsError,
}: LinkSkillsTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Link Skills</h2>

      {linkSkillsLoading && (
        <div className="flex flex-col items-center justify-center py-8">
          <img
            src="/images/mushroom-loader.gif"
            alt="Loading..."
            className="w-16 h-16 mb-4"
          />
          <p className="text-gray-600">Loading link skills...</p>
        </div>
      )}

      {linkSkillsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">Error: {linkSkillsError}</p>
        </div>
      )}

      {!linkSkillsLoading &&
        !linkSkillsError &&
        linkSkillsData?.character_link_skill && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-center">
              <div className="grid grid-cols-5 gap-3 justify-items-center">
                {linkSkillsData.character_link_skill.map(
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
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999] max-w-sm w-64">
                        <div className="font-semibold mb-1">
                          {skill.skill_name}
                        </div>
                        {skill.skill_level && (
                          <div className="text-gray-300 mb-1">
                            Level: {skill.skill_level}
                          </div>
                        )}
                        {skill.skill_effect && (
                          <div className="text-blue-300 whitespace-normal">
                            {skill.skill_effect}
                          </div>
                        )}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

      {!linkSkillsLoading &&
        !linkSkillsError &&
        (!linkSkillsData?.character_link_skill ||
          linkSkillsData.character_link_skill.length === 0) && (
          <div className="text-center py-8">
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Link Skills Found
            </h3>
            <p className="text-gray-600">
              This character doesn't have any link skills configured yet.
            </p>
          </div>
        )}
    </div>
  );
}
