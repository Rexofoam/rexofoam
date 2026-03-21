"use client";

import Image from "next/image";
import { useState } from "react";
import Header from "@/components/Header";
import {
  mapleCharacterCategories,
  mapleCharacterEntries,
  type MapleCharacterEntry,
  type MapleCharacterCategory,
} from "@/data/maple-characters";
import { getCharacterVideoSrc } from "@/utils/character-video";

const categoryStyles: Record<
  MapleCharacterCategory,
  {
    accent: string;
    pill: string;
    ring: string;
  }
> = {
  Warrior: {
    accent: "from-amber-500 via-orange-400 to-rose-400",
    pill: "bg-amber-100 text-amber-900",
    ring: "ring-amber-200",
  },
  Magician: {
    accent: "from-cyan-500 via-sky-400 to-indigo-500",
    pill: "bg-cyan-100 text-cyan-900",
    ring: "ring-cyan-200",
  },
  Bowman: {
    accent: "from-emerald-500 via-lime-400 to-yellow-300",
    pill: "bg-emerald-100 text-emerald-900",
    ring: "ring-emerald-200",
  },
  Thief: {
    accent: "from-fuchsia-500 via-pink-400 to-rose-400",
    pill: "bg-fuchsia-100 text-fuchsia-900",
    ring: "ring-fuchsia-200",
  },
  Pirate: {
    accent: "from-blue-600 via-sky-500 to-teal-400",
    pill: "bg-blue-100 text-blue-900",
    ring: "ring-blue-200",
  },
};

const statRows = [
  { label: "Attack", key: "attack", low: "Low", high: "High" },
  { label: "Defense", key: "defense", low: "Low", high: "High" },
  { label: "Mobility", key: "mobility", low: "Slow", high: "Fast" },
  {
    label: "Difficulty",
    key: "difficulty",
    low: "Easy",
    high: "Difficult",
  },
] as const;

const getCharacterImageSrc = (name: string) => {
  const specialFileNames: Record<string, string> = {
    "Arch Mage (Fire/Poison)": "arch mage _fire_poison.png",
    "Arch Mage (Ice/Lightning)": "arch mage ice_lightning.png",
  };

  const fileName = specialFileNames[name] ?? `${name.toLowerCase()}.png`;
  return `/images/characters/${encodeURIComponent(fileName)}`;
};

const statTicks = [20, 40, 60, 80, 100] as const;

const snapToStatTick = (value: number) => {
  const bounded = Math.max(20, Math.min(100, value));
  return Math.round(bounded / 20) * 20;
};

export default function MaplecharactersPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    MapleCharacterCategory | "All"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharacter, setSelectedCharacter] =
    useState<MapleCharacterEntry | null>(null);
  const [fullDescriptions, setFullDescriptions] = useState<
    Record<string, string>
  >({});
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");

  const normalizedQuery = searchTerm.trim().toLowerCase();

  const handleOpenCharacterModal = async (entry: MapleCharacterEntry) => {
    setSelectedCharacter(entry);
    setDescriptionError("");

    if (fullDescriptions[entry.name]) {
      return;
    }

    setIsDescriptionLoading(true);

    try {
      const response = await fetch(
        `/api/character/description?name=${encodeURIComponent(entry.name)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch character description");
      }

      const payload = (await response.json()) as { description?: string };

      if (!payload.description) {
        throw new Error("Character description not found");
      }

      const description = payload.description;

      setFullDescriptions((current) => ({
        ...current,
        [entry.name]: description,
      }));
    } catch {
      setDescriptionError("Unable to load the full description right now.");
    } finally {
      setIsDescriptionLoading(false);
    }
  };

  const handleCloseCharacterModal = () => {
    setSelectedCharacter(null);
    setIsDescriptionLoading(false);
    setDescriptionError("");
  };

  const filteredCharacters = mapleCharacterEntries.filter((entry) => {
    const matchesCategory =
      selectedCategory === "All" || entry.category === selectedCategory;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      entry.name.toLowerCase().includes(normalizedQuery) ||
      entry.branch.toLowerCase().includes(normalizedQuery) ||
      entry.mainStat.toLowerCase().includes(normalizedQuery) ||
      entry.highlights.some((highlight) =>
        highlight.toLowerCase().includes(normalizedQuery),
      );

    return matchesCategory && matchesQuery;
  });

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-fixed bg-cover bg-center bg-no-repeat text-slate-900"
      style={{
        backgroundImage: "url('/images/character-bg.png')",
        backgroundAttachment: "fixed",
      }}
    >
      <Header variant="details" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-orange-200/60 blur-3xl" />
        <div className="absolute right-[-4rem] top-24 h-64 w-64 rounded-full bg-sky-200/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="rounded-[2rem] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur xl:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Filter Deck
              </p>
              <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">
                Search by job, branch, stat, or skill name.
              </h2>
            </div>
            <label className="block w-full max-w-xl">
              <span className="mb-2 block text-sm font-medium text-slate-600">
                Search the local seed dataset
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Try Hero, Explorer, DEX, or Grand Finale"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === "All"
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Jobs
            </button>
            {mapleCharacterCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category.id
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title={category.description}
              >
                {category.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCharacters.map((entry) => {
            const theme = categoryStyles[entry.category];

            return (
              <article
                key={entry.id}
                onClick={() => {
                  void handleOpenCharacterModal(entry);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    void handleOpenCharacterModal(entry);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`group overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ${theme.ring} transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(15,23,42,0.12)]`}
              >
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${theme.accent}`}
                />

                <div className="relative mt-4 h-44 rounded-2xl bg-slate-100/80">
                  <Image
                    src={getCharacterImageSrc(entry.name)}
                    alt={`${entry.name} artwork`}
                    fill
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${theme.pill}`}
                    >
                      {entry.category}
                    </span>
                    <h3 className="mt-3 text-2xl font-black text-slate-950">
                      {entry.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {entry.branch} class
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      Main Stat
                    </div>
                    <div className="mt-1 text-lg font-black">
                      {entry.mainStat}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {entry.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5">
                    {entry.movement}
                  </span>
                  {entry.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-slate-100 px-3 py-1.5"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-300 bg-slate-50/95 p-3">
                  {statRows.map((row) => {
                    const value = entry.stats[row.key];
                    const snappedValue = snapToStatTick(value);
                    return (
                      <div
                        key={row.key}
                        className="grid grid-cols-[5.5rem_2.2rem_1fr_2.8rem] items-center gap-2 py-1"
                      >
                        <span className="text-[13px] font-bold leading-none text-sky-700">
                          {row.label}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {row.low}
                        </span>

                        <div className="relative h-4">
                          <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-slate-300" />

                          {statTicks.map((tick) => (
                            <span
                              key={`${row.key}-tick-${tick}`}
                              className="absolute top-1/2 h-[7px] w-[7px] -translate-y-1/2 -translate-x-1/2 rounded-full border border-slate-400/80 bg-white"
                              style={{ left: `${tick}%` }}
                            />
                          ))}

                          <span
                            className="absolute top-1/2 h-[9px] w-[9px] -translate-y-1/2 -translate-x-1/2 rounded-full border border-cyan-200 bg-sky-500 shadow-[0_0_0_1px_rgba(2,132,199,0.55)]"
                            style={{ left: `${snappedValue}%` }}
                          />
                        </div>

                        <span className="text-right text-[11px] font-semibold text-slate-700">
                          {row.high}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>

        {selectedCharacter && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
            onClick={handleCloseCharacterModal}
          >
            <div
              className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_24px_90px_rgba(15,23,42,0.3)] sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {selectedCharacter.category}
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">
                    {selectedCharacter.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {selectedCharacter.branch} class
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseCharacterModal}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 flex justify-center">
                <div className="w-full max-w-[650px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                  <video
                    key={selectedCharacter.name}
                    autoPlay
                    controls
                    preload="none"
                    className="block h-auto w-full"
                    poster={getCharacterImageSrc(selectedCharacter.name)}
                  >
                    <source
                      src={getCharacterVideoSrc(selectedCharacter.name) ?? undefined}
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Full Description
                </h3>

                {isDescriptionLoading &&
                  !fullDescriptions[selectedCharacter.name] && (
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Loading full description...
                    </p>
                  )}

                {!isDescriptionLoading &&
                  descriptionError &&
                  !fullDescriptions[selectedCharacter.name] && (
                    <p className="mt-3 text-sm leading-7 text-red-600">
                      {descriptionError}
                    </p>
                  )}

                <p className="mt-3 text-sm leading-7 text-slate-700 whitespace-pre-line">
                  {fullDescriptions[selectedCharacter.name] ??
                    selectedCharacter.summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredCharacters.length === 0 && (
          <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center shadow-sm backdrop-blur">
            <h2 className="text-2xl font-black text-slate-950">
              No seeded jobs match that filter.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Try a broader search or switch categories. If you want, I can next
              expand the local dataset, add class detail pages, or wire in a
              one-time importer that produces a repo-local JSON file.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
