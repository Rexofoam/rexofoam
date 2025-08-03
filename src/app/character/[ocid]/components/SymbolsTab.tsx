interface SymbolsTabProps {
  symbolData: any;
  symbolLoading: boolean;
  symbolError: string;
}

export function SymbolsTab({
  symbolData,
  symbolLoading,
  symbolError,
}: SymbolsTabProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Symbols</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        {symbolLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <img
              src="/images/mushroom-loader.gif"
              alt="Loading symbols..."
              className="w-16 h-16 mb-4"
            />
            <p className="text-gray-700">Loading symbol data...</p>
          </div>
        )}
        {symbolError && <p className="text-red-600">{symbolError}</p>}
        {symbolData &&
          Array.isArray(symbolData.symbol) &&
          symbolData.symbol.length > 0 && (
            <>
              {/* Group Arcane Symbol */}
              {(() => {
                const arcane = symbolData.symbol.filter((s: any) =>
                  s.symbol_name.includes("Arcane Symbol")
                );
                const authentic = symbolData.symbol.filter((s: any) =>
                  s.symbol_name.includes("Authentic Symbol")
                );
                return (
                  <>
                    {arcane.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold mb-2 text-blue-700 text-center">
                          Arcane Symbols
                        </h3>
                        <div
                          className="grid grid-cols-3 gap-3 justify-center mx-auto"
                          style={{ maxWidth: "480px" }}
                        >
                          {arcane.map((symbol: any, idx: number) => (
                            <div
                              key={symbol.symbol_name + idx}
                              className="relative group flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-2 shadow hover:shadow-lg transition cursor-pointer"
                            >
                              {/* Icon + Level badge (top right) */}
                              <div className="relative mb-2 flex items-center justify-center w-full">
                                <img
                                  src={symbol.symbol_icon}
                                  alt={symbol.symbol_name}
                                  className="w-12 h-12 object-contain"
                                />
                                <span className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full border border-white shadow mt-1 mr-1">
                                  Lv. {symbol.symbol_level}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-gray-800 text-center">
                                {symbol.symbol_name}
                              </div>
                              {/* Tooltip */}
                              <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-black text-white text-xs rounded-lg px-4 py-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg whitespace-normal">
                                <div className="font-bold text-base mb-1">
                                  {symbol.symbol_name}
                                </div>
                                <div className="mb-1 flex items-center gap-2">
                                  <img
                                    src={symbol.symbol_icon}
                                    alt="icon"
                                    className="w-6 h-6 inline-block"
                                  />
                                  <span>
                                    Level:{" "}
                                    <span className="font-semibold text-yellow-300">
                                      {symbol.symbol_level}
                                    </span>
                                  </span>
                                </div>
                                {/* Show only non-zero STR/DEX/INT/LUK/HP */}
                                {[
                                  {
                                    label: "STR",
                                    value: symbol.symbol_str,
                                  },
                                  {
                                    label: "DEX",
                                    value: symbol.symbol_dex,
                                  },
                                  {
                                    label: "INT",
                                    value: symbol.symbol_int,
                                  },
                                  {
                                    label: "LUK",
                                    value: symbol.symbol_luk,
                                  },
                                  {
                                    label: "HP",
                                    value: symbol.symbol_hp,
                                  },
                                ].map((stat) =>
                                  stat.value !== undefined &&
                                  stat.value !== null &&
                                  stat.value !== "0" &&
                                  stat.value !== 0 ? (
                                    <div key={stat.label}>
                                      <span className="text-green-200">
                                        {stat.label}: +{stat.value}
                                      </span>
                                    </div>
                                  ) : null
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {authentic.length > 0 && (
                      <div className="mb-2">
                        <h3 className="text-lg font-bold mb-2 text-green-700 text-center">
                          Authentic Symbols
                        </h3>
                        <div
                          className="grid grid-cols-3 gap-3 justify-center mx-auto"
                          style={{ maxWidth: "480px" }}
                        >
                          {authentic.map((symbol: any, idx: number) => (
                            <div
                              key={symbol.symbol_name + idx}
                              className="relative group flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-2 shadow hover:shadow-lg transition cursor-pointer"
                            >
                              {/* Icon + Level badge (top right) */}
                              <div className="relative mb-2 flex items-center justify-center w-full">
                                <img
                                  src={symbol.symbol_icon}
                                  alt={symbol.symbol_name}
                                  className="w-12 h-12 object-contain"
                                />
                                <span className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full border border-white shadow mt-1 mr-1">
                                  Lv. {symbol.symbol_level}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-gray-800 text-center">
                                {symbol.symbol_name}
                              </div>
                              {/* Tooltip */}
                              <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-black text-white text-xs rounded-lg px-4 py-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg whitespace-normal">
                                <div className="font-bold text-base mb-1">
                                  {symbol.symbol_name}
                                </div>
                                <div className="mb-1 flex items-center gap-2">
                                  <img
                                    src={symbol.symbol_icon}
                                    alt="icon"
                                    className="w-6 h-6 inline-block"
                                  />
                                  <span>
                                    Level:{" "}
                                    <span className="font-semibold text-yellow-300">
                                      {symbol.symbol_level}
                                    </span>
                                  </span>
                                </div>
                                {/* Show only non-zero STR/DEX/INT/LUK/HP */}
                                {[
                                  {
                                    label: "STR",
                                    value: symbol.symbol_str,
                                  },
                                  {
                                    label: "DEX",
                                    value: symbol.symbol_dex,
                                  },
                                  {
                                    label: "INT",
                                    value: symbol.symbol_int,
                                  },
                                  {
                                    label: "LUK",
                                    value: symbol.symbol_luk,
                                  },
                                  {
                                    label: "HP",
                                    value: symbol.symbol_hp,
                                  },
                                ].map((stat) =>
                                  stat.value !== undefined &&
                                  stat.value !== null &&
                                  stat.value !== "0" &&
                                  stat.value !== 0 ? (
                                    <div key={stat.label}>
                                      <span className="text-green-200">
                                        {stat.label}: +{stat.value}
                                      </span>
                                    </div>
                                  ) : null
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          )}
        {symbolData &&
          (!Array.isArray(symbolData.symbol) ||
            symbolData.symbol.length === 0) && (
            <p className="text-gray-700">
              No symbols found for this character.
            </p>
          )}
        {!symbolLoading && !symbolError && !symbolData && (
          <p className="text-gray-700">
            Symbol progression and details will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
