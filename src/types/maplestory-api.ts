/**
 * TypeScript interfaces for MapleStory SEA API responses
 * These define the structure of data returned from the API
 */

export interface CharacterBasic {
  character_name: string;
  world_name: string;
  character_gender: string;
  character_class: string;
  character_class_level: string;
  character_level: number;
  character_exp: number;
  character_exp_rate: string;
  character_guild_name: string;
  character_image: string;
  character_date_create: string;
  access_flag: string;
  liberation_quest_clear_flag: string;
}

export interface CharacterStat {
  character_class: string;
  final_stat: StatDetail[];
  remain_ap: number;
}

export interface StatDetail {
  stat_name: string;
  stat_value: string;
}

export interface HyperStat {
  character_class: string;
  use_preset_no: string;
  use_available_hyper_stat: number;
  hyper_stat_preset_1: HyperStatPreset;
  hyper_stat_preset_2: HyperStatPreset;
  hyper_stat_preset_3: HyperStatPreset;
}

export interface HyperStatPreset {
  stat_type: string;
  stat_point: number;
  stat_level: number;
  stat_increase: string;
}

export interface CharacterAbility {
  ability_grade: string;
  ability_info: AbilityInfo[];
  remain_fame: number;
}

export interface AbilityInfo {
  ability_no: string;
  ability_grade: string;
  ability_value: string;
}

export interface ItemEquipment {
  character_gender: string;
  character_class: string;
  preset_no: number;
  item_equipment: EquipmentItem[];
  item_equipment_preset_1: EquipmentItem[];
  item_equipment_preset_2: EquipmentItem[];
  item_equipment_preset_3: EquipmentItem[];
  title: TitleInfo;
  dragon_equipment: EquipmentItem[];
  mechanic_equipment: EquipmentItem[];
}

export interface EquipmentItem {
  item_equipment_part: string;
  equipment_slot: string;
  item_name: string;
  item_icon: string;
  item_description: string;
  item_shape_name: string;
  item_shape_icon: string;
  item_gender: string;
  item_total_option: ItemOption;
  item_base_option: ItemOption;
  potential_option_grade: string;
  additional_potential_option_grade: string;
  potential_option_1: string;
  potential_option_2: string;
  potential_option_3: string;
  additional_potential_option_1: string;
  additional_potential_option_2: string;
  additional_potential_option_3: string;
  equipment_level_increase: number;
  item_exceptional_option: ItemOption;
  item_add_option: ItemOption;
  growth_exp: number;
  growth_level: number;
  scroll_upgrade: string;
  cuttable_count: string;
  golden_hammer_flag: string;
  scroll_resilience_count: string;
  scroll_upgradeable_count: string;
  soul_name: string;
  soul_option: string;
  item_etc_option: ItemOption;
  starforce: string;
  starforce_scroll_flag: string;
  item_starforce_option: ItemOption;
  special_ring_level: number;
  date_expire: string;
}

export interface ItemOption {
  str: string;
  dex: string;
  int: string;
  luk: string;
  max_hp: string;
  max_mp: string;
  attack_power: string;
  magic_power: string;
  armor: string;
  speed: string;
  jump: string;
  boss_damage: string;
  ignore_monster_armor: string;
  all_stat: string;
  damage: string;
  equipment_level_decrease: number;
  max_hp_rate: string;
  max_mp_rate: string;
}

export interface TitleInfo {
  title_name: string;
  title_icon: string;
  title_description: string;
  date_expire: string;
  date_option_expire: string;
}

// Combined character data interface
export interface CharacterData {
  ocid: string;
  basic: CharacterBasic | null;
  stat: CharacterStat | null;
  hyperStat: HyperStat | null;
  ability: CharacterAbility | null;
  itemEquipment: ItemEquipment | null;
  lastUpdated: Date;
  cacheExpiry?: Date;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
