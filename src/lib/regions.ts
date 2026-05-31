/**
 * 国家 → 地区 + 国旗 emoji 映射。
 * 未收录的国家归到 "Worldwide"，emoji 用 📍。
 */
export const countryRegions: Record<
  string,
  { region: string; emoji: string }
> = {
  Japan: { region: "East Asia", emoji: "🇯🇵" },
  Greece: { region: "Europe", emoji: "🇬🇷" },
  Argentina: { region: "South America", emoji: "🇦🇷" },
  Morocco: { region: "North Africa", emoji: "🇲🇦" },
  Italy: { region: "Europe", emoji: "🇮🇹" },
  Indonesia: { region: "Southeast Asia", emoji: "🇮🇩" },
  Iceland: { region: "Europe", emoji: "🇮🇸" },
  Peru: { region: "South America", emoji: "🇵🇪" },
};

export function regionFor(country: string): string {
  return countryRegions[country]?.region ?? "Worldwide";
}

export function emojiFor(country: string): string {
  return countryRegions[country]?.emoji ?? "📍";
}
