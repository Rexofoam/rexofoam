import { GuildData } from "@/types/maplestory-api";
import { useNavigation } from "@/utils/navigation";
import { toast } from "react-toastify";

interface MembersTabProps {
    guildData: GuildData;
}

export function MembersTab({
    guildData,
}: MembersTabProps) {
    const navigation = useNavigation();

    // Go to character details
    const goToCharacterDetails = async (name: string) => {
        try {
            // Use real MapleStory SEA API for character search
            const response = await fetch(
                `https://open.api.nexon.com/maplestorysea/v1/id?character_name=${name}`,
                {
                    headers: {
                        "x-nxopen-api-key":
                            "live_ea78af0bb88d495a94b6f66066c720e33d4e8a3ef9dad5783bd0c610437d34f2efe8d04e6d233bd35cf2fabdeb93fb0d",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                navigation.goToCharacterDetails(data.ocid, name)
            } else {
                toast.error('Character info is not available.', {
                    theme: 'colored',
                });
            }

        } catch (err) {
            console.error('Failed to load character details: ', err);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-2">Guild Members</h2>
                <h2 className="text-xl font-semibold mb-2">Member Count: {guildData.basic?.guild_member_count}</h2>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">

                <div className="space-y-2">
                    {guildData.basic?.guild_member.sort().map((member, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-200 py-2 last:border-b-0">
                            <p className="text-left w-full py-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">{member}</p>
                            <button onClick={() => goToCharacterDetails(member)} className="text-sm text-gray-500">Stalk...</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}