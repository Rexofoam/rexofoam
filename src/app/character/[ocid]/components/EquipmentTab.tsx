import { useState } from "react";

interface EquipmentTabProps {
  characterData: any;
}

export function EquipmentTab({ characterData }: EquipmentTabProps) {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const handleTooltipToggle = (index: number) => {
    setActiveTooltip(activeTooltip === index ? null : index);
  };

  return (
    <div onClick={() => setActiveTooltip(null)}>
      <h2 className="text-xl font-semibold mb-2">Equipment</h2>
      <div className="bg-gray-50 py-4 px-0 md:p-4 rounded-lg">
        <p className="mb-2 text-sm text-blue-600 md:hidden px-4 md:px-0">
          💡 Tap on equipment items to view details
        </p>
        <p className="mb-4 px-4 md:px-0">
          <strong>Equipment Count:</strong>{" "}
          {characterData.itemEquipment?.item_equipment?.length || 0}
        </p>

        {/* Equipment Table - 5 columns x 6 rows */}
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto px-4 md:px-0">
          {Array.from({ length: 30 }, (_, index) => {
            let item = null;

            // Equipment organization:
            // Rings: slots 0, 5, 10, 15
            // Hat: slot 2
            // Emblem: slot 4
            // Pendants: slots 6, 11
            // Face Accessory: slot 7
            // Badge: slot 9
            // Eye Accessory: slot 12
            // Earring: slot 13
            // Medal: slot 14
            // Weapon: slot 16
            // Top: slot 17
            // Shoulder Decoration: slot 18
            // Secondary Weapons: slot 19
            // Pocket Item: slot 20
            // Belt: slot 21
            // Bottom: slot 22
            // Glove: slot 23
            // Cape: slot 24
            // Shoes: slot 27
            // Mechanical Heart: slot 29
            // Always empty: slots 1, 3, 8, 25, 26
            if (
              index === 1 ||
              index === 3 ||
              index === 8 ||
              index === 25 ||
              index === 26
            ) {
              // Always empty slots
              item = null;
            } else if (index === 2) {
              // Hat slot: 2
              const hats =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "HAT"
                ) || [];
              item = hats[0] || null;
            } else if (index === 4) {
              // Emblem slot: 4
              const emblems =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "EMBLEM"
                ) || [];
              item = emblems[0] || null;
            } else if (index === 7) {
              // Face Accessory slot: 7
              const faceAccessories =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "FACE ACCESSORY"
                ) || [];
              item = faceAccessories[0] || null;
            } else if (index === 9) {
              // Badge slot: 9
              const badges =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "Badge"
                ) || [];
              item = badges[0] || null;
            } else if (index === 12) {
              // Eye Accessory slot: 12
              const eyeAccessories =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "EYE ACCESSORY"
                ) || [];
              item = eyeAccessories[0] || null;
            } else if (index === 13) {
              // Earring slot: 13
              const earrings =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "EARRING"
                ) || [];
              item = earrings[0] || null;
            } else if (index === 14) {
              // Medal slot: 14
              const medals =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "MEDAL"
                ) || [];
              item = medals[0] || null;
            } else if (index === 17) {
              // Top slot: 17
              const tops =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "TOP"
                ) || [];
              item = tops[0] || null;
            } else if (index === 18) {
              // Shoulder Decoration slot: 18
              const shoulderDecorations =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) =>
                    item.item_equipment_part === "SHOULDER DECORATION"
                ) || [];
              item = shoulderDecorations[0] || null;
            } else if (index === 19) {
              // Secondary Weapons slot: 19
              const secondaryWeapons =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) =>
                    item.item_equipment_slot === "Secondary Weapons"
                ) || [];
              item = secondaryWeapons[0] || null;
            } else if (
              index === 0 ||
              index === 5 ||
              index === 10 ||
              index === 15
            ) {
              // Ring slots: 0, 5, 10, 15
              const rings =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "RING"
                ) || [];

              // Map index to ring position
              let ringIndex = 0;
              if (index === 0) ringIndex = 0;
              else if (index === 5) ringIndex = 1;
              else if (index === 10) ringIndex = 2;
              else if (index === 15) ringIndex = 3;

              item = rings[ringIndex] || null;
            } else if (index === 6 || index === 11) {
              // Pendant slots: 6, 11
              const pendants =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "PENDANT"
                ) || [];

              // Map index to pendant position
              let pendantIndex = 0;
              if (index === 6) pendantIndex = 0;
              else if (index === 11) pendantIndex = 1;

              item = pendants[pendantIndex] || null;
            } else if (index === 16) {
              // Weapon slot: 16
              const weapons =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_slot === "WEAPON"
                ) || [];
              item = weapons[0] || null;
            } else if (index === 20) {
              // Pocket Item slot: 20
              const pocketItems =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "Pocket Item"
                ) || [];
              item = pocketItems[0] || null;
            } else if (index === 21) {
              // Belt slot: 21
              const belts =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "BELT"
                ) || [];
              item = belts[0] || null;
            } else if (index === 22) {
              // Bottom slot: 22
              const bottoms =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "BOTTOM"
                ) || [];
              item = bottoms[0] || null;
            } else if (index === 23) {
              // Glove slot: 23
              const gloves =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "GLOVE"
                ) || [];
              item = gloves[0] || null;
            } else if (index === 24) {
              // Cape slot: 24
              const capes =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "CAPE"
                ) || [];
              item = capes[0] || null;
            } else if (index === 27) {
              // Shoes slot: 27
              const shoes =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "SHOES"
                ) || [];
              item = shoes[0] || null;
            } else if (index === 29) {
              // Mechanical Heart slot: 29
              const mechanicalHearts =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) => item.item_equipment_part === "Mechanical Heart"
                ) || [];
              item = mechanicalHearts[0] || null;
            } else {
              // Other slots: remaining equipment
              const nonSpecialItems =
                characterData.itemEquipment?.item_equipment?.filter(
                  (item: any) =>
                    item.item_equipment_part !== "RING" &&
                    item.item_equipment_part !== "Pocket Item" &&
                    item.item_equipment_part !== "PENDANT" &&
                    item.item_equipment_slot !== "WEAPON" &&
                    item.item_equipment_slot !== "Secondary Weapons" &&
                    item.item_equipment_part !== "BELT" &&
                    item.item_equipment_part !== "HAT" &&
                    item.item_equipment_part !== "EMBLEM" &&
                    item.item_equipment_part !== "FACE ACCESSORY" &&
                    item.item_equipment_part !== "Badge" &&
                    item.item_equipment_part !== "EYE ACCESSORY" &&
                    item.item_equipment_part !== "EARRING" &&
                    item.item_equipment_part !== "MEDAL" &&
                    item.item_equipment_part !== "TOP" &&
                    item.item_equipment_part !== "SHOULDER DECORATION" &&
                    item.item_equipment_part !== "BOTTOM" &&
                    item.item_equipment_part !== "GLOVE" &&
                    item.item_equipment_part !== "CAPE" &&
                    item.item_equipment_part !== "SHOES" &&
                    item.item_equipment_part !== "Mechanical Heart"
                ) || [];

              // Calculate adjusted index (subtract special slots and always-empty slots that come before this index)
              let specialSlotsBefore = 0;
              if (index > 0) specialSlotsBefore++; // Ring slot 0
              if (index > 1) specialSlotsBefore++; // Always empty slot 1
              if (index > 2) specialSlotsBefore++; // Hat slot 2
              if (index > 3) specialSlotsBefore++; // Always empty slot 3
              if (index > 4) specialSlotsBefore++; // Emblem slot 4
              if (index > 5) specialSlotsBefore++; // Ring slot 5
              if (index > 6) specialSlotsBefore++; // Pendant slot 6
              if (index > 7) specialSlotsBefore++; // Face Accessory slot 7
              if (index > 8) specialSlotsBefore++; // Always empty slot 8
              if (index > 9) specialSlotsBefore++; // Badge slot 9
              if (index > 10) specialSlotsBefore++; // Ring slot 10
              if (index > 11) specialSlotsBefore++; // Pendant slot 11
              if (index > 12) specialSlotsBefore++; // Eye Accessory slot 12
              if (index > 13) specialSlotsBefore++; // Earring slot 13
              if (index > 14) specialSlotsBefore++; // Medal slot 14
              if (index > 15) specialSlotsBefore++; // Ring slot 15
              if (index > 16) specialSlotsBefore++; // Weapon slot 16
              if (index > 17) specialSlotsBefore++; // Top slot 17
              if (index > 18) specialSlotsBefore++; // Shoulder Decoration slot 18
              if (index > 19) specialSlotsBefore++; // Secondary Weapons slot 19
              if (index > 20) specialSlotsBefore++; // Pocket Item slot 20
              if (index > 21) specialSlotsBefore++; // Belt slot 21
              if (index > 22) specialSlotsBefore++; // Bottom slot 22
              if (index > 23) specialSlotsBefore++; // Glove slot 23
              if (index > 24) specialSlotsBefore++; // Cape slot 24
              if (index > 25) specialSlotsBefore++; // Always empty slot 25
              if (index > 26) specialSlotsBefore++; // Always empty slot 26
              if (index > 27) specialSlotsBefore++; // Shoes slot 27
              if (index > 29) specialSlotsBefore++; // Mechanical Heart slot 29

              const adjustedIndex = index - specialSlotsBefore;
              item = nonSpecialItems[adjustedIndex] || null;
            }

            if (!item) {
              // Empty slot
              return (
                <div
                  key={index}
                  className="bg-gray-100 border-2 border-gray-200 rounded-lg p-2 w-16 h-16 flex items-center justify-center"
                >
                  <span className="text-xs text-gray-400">Empty</span>
                </div>
              );
            }

            // Determine border and background colors based on potential grade
            let borderColor = "border-gray-200"; // default
            let backgroundColor = "bg-white"; // default

            if (item.potential_option_grade) {
              switch (item.potential_option_grade.toLowerCase()) {
                case "unique":
                  borderColor = "border-yellow-400";
                  backgroundColor = "bg-yellow-50";
                  break;
                case "rare":
                  borderColor = "border-blue-400";
                  backgroundColor = "bg-blue-50";
                  break;
                case "epic":
                  borderColor = "border-purple-400";
                  backgroundColor = "bg-purple-50";
                  break;
                case "legendary":
                  borderColor = "border-green-400";
                  backgroundColor = "bg-green-50";
                  break;
                default:
                  borderColor = "border-gray-200";
                  backgroundColor = "bg-white";
              }
            }

            return (
              <div
                key={index}
                className={`${backgroundColor} border-2 ${borderColor} rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer group relative w-16 h-16 flex items-center justify-center`}
                title={`${item.item_equipment_part}: ${item.item_name}${
                  item.starforce ? ` (★${item.starforce})` : ""
                }${
                  item.potential_option_grade
                    ? ` [${item.potential_option_grade}]`
                    : ""
                }`}
                onClick={() => handleTooltipToggle(index)}
                onTouchStart={() => handleTooltipToggle(index)}
                onClickCapture={(e) => e.stopPropagation()}
              >
                {item.item_icon ? (
                  <img
                    src={item.item_icon}
                    alt={item.item_name}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400">No Icon</span>
                  </div>
                )}

                {/* Rarity indicator */}
                {(() => {
                  let rarityLetter = "C";
                  let rarityColor = "bg-black";

                  if (item.potential_option_grade) {
                    switch (item.potential_option_grade.toLowerCase()) {
                      case "unique":
                        rarityLetter = "U";
                        rarityColor = "bg-yellow-400";
                        break;
                      case "rare":
                        rarityLetter = "R";
                        rarityColor = "bg-blue-400";
                        break;
                      case "epic":
                        rarityLetter = "E";
                        rarityColor = "bg-purple-400";
                        break;
                      case "legendary":
                        rarityLetter = "L";
                        rarityColor = "bg-green-400";
                        break;
                      default:
                        rarityLetter = "C";
                        rarityColor = "bg-black";
                    }
                  }

                  return (
                    <div
                      className={`absolute top-1 left-1 ${rarityColor} text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold`}
                    >
                      {rarityLetter}
                    </div>
                  );
                })()}

                {/* Starforce indicator */}
                {item.starforce && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs px-1 rounded-bl rounded-tr">
                    ★{item.starforce}
                  </div>
                )}

                {/* Tooltip on hover and touch */}
                <div
                  className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded transition-opacity pointer-events-none z-10 min-w-max ${
                    activeTooltip === index
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <div className="whitespace-nowrap">
                    <div className="font-semibold">
                      {item.potential_option_grade
                        ? `(${item.potential_option_grade}) `
                        : "(Common) "}
                      {item.item_name}
                    </div>
                    <div className="text-gray-300 mb-1">
                      {item.item_equipment_part}
                    </div>
                    {/* Item Total Option */}
                    {item.item_total_option && (
                      <div className="mt-2">
                        <div className="text-orange-300 font-semibold">
                          Total Stats:
                        </div>
                        {Object.entries(item.item_total_option).map(
                          ([key, value]) =>
                            value && value !== "0" && value !== "0%" ? (
                              <div key={key} className="text-orange-200">
                                • {key.replace(/_/g, " ").toUpperCase()}:{" "}
                                {String(value)}
                              </div>
                            ) : null
                        )}
                      </div>
                    )}
                    {/* Item Potential */}
                    {(item.potential_option_1 ||
                      item.potential_option_2 ||
                      item.potential_option_3) && (
                      <div className="mt-2">
                        <div className="text-blue-300 font-semibold">
                          Item Potential:
                        </div>
                        {item.potential_option_1 && (
                          <div className="text-green-300">
                            • {item.potential_option_1}
                          </div>
                        )}
                        {item.potential_option_2 && (
                          <div className="text-green-300">
                            • {item.potential_option_2}
                          </div>
                        )}
                        {item.potential_option_3 && (
                          <div className="text-green-300">
                            • {item.potential_option_3}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Additional Potential */}
                    {(item.additional_potential_option_1 ||
                      item.additional_potential_option_2 ||
                      item.additional_potential_option_3) && (
                      <div className="mt-2">
                        <div className="text-purple-300 font-semibold">
                          Additional Potential:
                        </div>
                        {item.additional_potential_option_1 && (
                          <div className="text-yellow-300">
                            • {item.additional_potential_option_1}
                          </div>
                        )}
                        {item.additional_potential_option_2 && (
                          <div className="text-yellow-300">
                            • {item.additional_potential_option_2}
                          </div>
                        )}
                        {item.additional_potential_option_3 && (
                          <div className="text-yellow-300">
                            • {item.additional_potential_option_3}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Starforce info */}
                    {item.starforce && (
                      <div className="mt-1 text-yellow-300">
                        Starforce: ★{item.starforce}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
