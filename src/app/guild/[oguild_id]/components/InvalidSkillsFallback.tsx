import { InvalidDataFallback } from "@/components/InvalidDataFallback";
import { GuildNoblesseSkill, GuildSkill } from "@/types/maplestory-api";

type SkillsType = GuildSkill | GuildNoblesseSkill

interface InvalidSkillsFallbackProps {
    skillsData: SkillsType[];
    loading: boolean;
    error: string;
    type: string;
}

export function InvalidSkillsFallback({
    skillsData,
    loading,
    error,
    type
}: InvalidSkillsFallbackProps) {
    let fallbackTitle = '';
    let fallbackMessage = '';

    if (type === "guild_skill") {
        fallbackTitle = "Guild Skills Not Activated"
        fallbackMessage = "This guild doesn't have any guild skills activated yet."
    } else if (type === "noblesse_skill") {
        fallbackTitle = "Noblesse Skills Not Activated"
        fallbackMessage = "This guild doesn't have any noblesse skills activated yet."
    }

    return (
        <div>
            {!loading &&
                !error &&
                (!skillsData ||
                    skillsData.length === 0) && (
                    <InvalidDataFallback
                        fallbackTitle={fallbackTitle}
                        fallbackMessage={fallbackMessage}
                    />
                )}
        </div>
    )
}