const CHARACTER_VIDEO_FILES = [
  "adele.mp4",
  "angelic buster.mp4",
  "aran.mp4",
  "arch mage fire poison.mp4",
  "arch mage ice lightning.mp4",
  "ark.mp4",
  "battle mage.mp4",
  "bishop.mp4",
  "blaster.mp4",
  "blaze wizard.mp4",
  "bow master.mp4",
  "buccaneer.mp4",
  "cadena.mp4",
  "cannoneer.mp4",
  "corsair.mp4",
  "dark knight.mp4",
  "dawn warrior.mp4",
  "demon avenger.mp4",
  "demon slayer.mp4",
  "dual blade.mp4",
  "evan.mp4",
  "hayato.mp4",
  "hero.mp4",
  "hoyung.mp4",
  "ilium.mp4",
  "kain.mp4",
  "kaiser.mp4",
  "kanna.mp4",
  "khali.mp4",
  "kinesis.mp4",
  "lara.mp4",
  "luminous.mp4",
  "lynn.mp4",
  "marksman.mp4",
  "mechanic.mp4",
  "mercedes.mp4",
  "mihile.mp4",
  "mo xuan.mp4",
  "night lord.mp4",
  "night walker.mp4",
  "paladin.mp4",
  "pathfinder.mp4",
  "phantom.mp4",
  "ren.mp4",
  "shade.mp4",
  "shadower.mp4",
  "sia astelle.mp4",
  "thunder breaker.mp4",
  "wild hunter.mp4",
  "wind archer.mp4",
  "xenon.mp4",
  "zero.mp4",
] as const;

const normalizeMediaKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.mp4$/i, "")
    .replace(/[^a-z0-9]/g, "");

const normalizedVideoFileMap = new Map<string, string>(
  CHARACTER_VIDEO_FILES.map((fileName) => [normalizeMediaKey(fileName), fileName]),
);

const normalizedAliases = new Map<string, string>([
  [normalizeMediaKey("Arch Mage (F/P)"), "arch mage fire poison.mp4"],
  [normalizeMediaKey("Arch Mage (I/L)"), "arch mage ice lightning.mp4"],
  [normalizeMediaKey("Soul Master"), "dawn warrior.mp4"],
  [normalizeMediaKey("Hoyoung"), "hoyung.mp4"],
  [normalizeMediaKey("Illium"), "ilium.mp4"],
]);

export const resolveCharacterVideoFileName = (
  characterClassOrName?: string,
): string | null => {
  if (!characterClassOrName) {
    return null;
  }

  const normalizedInput = normalizeMediaKey(characterClassOrName);
  const aliasedFile = normalizedAliases.get(normalizedInput);

  if (aliasedFile) {
    return aliasedFile;
  }

  return normalizedVideoFileMap.get(normalizedInput) ?? null;
};

export const getCharacterVideoSrc = (
  characterClassOrName?: string,
): string | null => {
  const fileName = resolveCharacterVideoFileName(characterClassOrName);
  if (!fileName) {
    return null;
  }

  return `/images/characters/video/${encodeURIComponent(fileName)}`;
};