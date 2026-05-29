/**
 * 把原 index.html 里的 8 条默认数据塞进 SQLite
 * 运行：pnpm db:seed
 */
import { prisma } from "../src/lib/prisma";

const entries = [
  {
    destination: "Kyoto",
    country: "Japan",
    startDate: new Date("2025-03-12"),
    endDate: new Date("2025-03-24"),
    rating: 5,
    review:
      "The sakura were in full bloom as we wandered through the Philosopher's Path. Each morning began with the subtle fragrance of cherry blossoms and the distant sound of temple bells echoing through the misty hills. We spent hours in the bamboo groves of Arashiyama, where the light filtered through the towering stalks in ethereal shafts of green and gold.\n\nThe kaiseki dinner at the ryokan was a revelation — each dish a miniature work of art, from the delicate slices of sashimi to the perfectly formed wagashi, sweet confections that mirrored the blossoms outside our window.",
    tags: ["Culture", "Nature", "Cuisine", "Temples"],
    imageUrl: "https://loremflickr.com/800/600/kyoto,japan,temple",
    mood: "🌸",
    favorite: true,
  },
  {
    destination: "Santorini",
    country: "Greece",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-06-10"),
    rating: 5,
    review:
      "There is nothing quite like watching the sun melt into the Aegean from the cliffs of Oia. The whitewashed buildings, with their blue-domed roofs, cascade down the volcanic caldera like a cubist painting come to life. We spent our days swimming in the impossibly clear waters of Red Beach and our evenings savoring grilled octopus and Assyrtiko wine at seaside tavernas.\n\nThe light here is different — as if the gods themselves adjusted the saturation. Every photograph looked like a postcard, yet no image could capture the feeling of the warm breeze carrying the scent of thyme and salt.",
    tags: ["Coastal", "Romantic", "Sunsets", "Cuisine"],
    imageUrl: "https://loremflickr.com/800/600/santorini,greece",
    mood: "🌊",
    favorite: true,
  },
  {
    destination: "Patagonia",
    country: "Argentina",
    startDate: new Date("2024-11-05"),
    endDate: new Date("2024-11-18"),
    rating: 4,
    review:
      "Raw, untamed, and humbling. Patagonia is not a destination — it is a confrontation with the sublime. The granite spires of Fitz Roy pierce the sky like the bones of the earth itself, while the Perito Moreno glacier groans and calves with a thunder that resonates in your chest.\n\nWe trekked through landscapes that felt prehistoric, where guanacos grazed beneath condors riding thermal currents. The wind never stopped — a constant, howling companion that reminded us of nature's indifference. And yet, in the small refugios at night, sharing maté with fellow trekkers, there was a warmth that no Patagonian wind could extinguish.",
    tags: ["Adventure", "Nature", "Hiking", "Wilderness"],
    imageUrl: "https://loremflickr.com/800/600/patagonia,mountain",
    mood: "🏔️",
    favorite: false,
  },
  {
    destination: "Marrakech",
    country: "Morocco",
    startDate: new Date("2025-01-08"),
    endDate: new Date("2025-01-15"),
    rating: 4,
    review:
      "The medina is a labyrinth of the senses — the scent of saffron and cumin drifting from spice stalls, the vibrant chaos of the Jemaa el-Fna square at dusk, the intricate zellige tilework of hidden riads that open like secret gardens behind unassuming doors.\n\nWe got lost countless times in the souks, but each wrong turn revealed something wonderful: a craftsman hammering intricate patterns into brass, a rooftop café serving mint tea with a view of the Atlas Mountains dusted in snow. Marrakech doesn't reveal itself easily, but those who surrender to its rhythm are rewarded with magic.",
    tags: ["Culture", "Markets", "Architecture", "Cuisine"],
    imageUrl: "https://loremflickr.com/800/600/marrakech,morocco,market",
    mood: "🏛️",
    favorite: true,
  },
  {
    destination: "Amalfi Coast",
    country: "Italy",
    startDate: new Date("2025-05-15"),
    endDate: new Date("2025-05-22"),
    rating: 5,
    review:
      "The Amalfi Coast defies hyperbole. Driving the SS163 — that ribbon of asphalt clinging to cliffs between sea and sky — is an act of exhilaration and faith. Pastel villages tumble down mountainsides into a sea so blue it seems chemically enhanced. In Ravello, we sat in gardens suspended between heaven and earth, listening to a pianist practice Chopin as the sun set over the Gulf of Salerno.\n\nThe food, of course, was transcendent. Hand-rolled scialatielli with frutti di mare in Cetara, sfogliatella still warm from the oven in Amalfi, and limoncello made from lemons the size of grapefruits — each meal felt like a celebration of simply being alive.",
    tags: ["Coastal", "Cuisine", "Romantic", "Driving"],
    imageUrl: "https://loremflickr.com/800/600/amalfi,italy,coast",
    mood: "🌊",
    favorite: false,
  },
  {
    destination: "Bali",
    country: "Indonesia",
    startDate: new Date("2024-12-20"),
    endDate: new Date("2025-01-03"),
    rating: 4,
    review:
      "Bali exists in a state of lush, verdant dream. The rice terraces of Tegallalang cascade in impossible geometries of green, while temple ceremonies fill the air with the scent of frangipani and incense. We rose before dawn to hike Mount Batur, watching the sunrise paint the sky in shades of rose and tangerine above the clouds.\n\nIn Ubud, we found a slower rhythm — mornings of yoga, afternoons exploring sacred monkey forests, evenings of gamelan music. The Balinese philosophy of Tri Hita Karana — harmony between people, nature, and the divine — is not just spoken here but lived in every offering, every smile, every carefully tended rice paddy.",
    tags: ["Tropical", "Spiritual", "Nature", "Culture"],
    imageUrl: "https://loremflickr.com/800/600/bali,indonesia,rice",
    mood: "🌴",
    favorite: false,
  },
  {
    destination: "Reykjavik",
    country: "Iceland",
    startDate: new Date("2024-10-10"),
    endDate: new Date("2024-10-17"),
    rating: 5,
    review:
      "Iceland feels like visiting another planet — one where the earth is still being formed. We drove the Ring Road through landscapes of impossible contrast: black sand beaches beside glaciers, geothermal vents hissing steam into frigid air, waterfalls that plunge from moss-covered cliffs with the force of creation itself.\n\nAnd then, on our final night, the aurora appeared. Green ribbons unfurled across the sky like divine calligraphy, dancing and twisting in a silent symphony. We lay in the snow, breath visible in the cold, utterly speechless. It was not just beautiful — it was a reminder that the universe is far more wondrous than we dare to imagine.",
    tags: ["Adventure", "Nature", "Northern Lights", "Geothermal"],
    imageUrl: "https://loremflickr.com/800/600/iceland,aurora,northern",
    mood: "🏔️",
    favorite: true,
  },
  {
    destination: "Cusco",
    country: "Peru",
    startDate: new Date("2025-04-02"),
    endDate: new Date("2025-04-12"),
    rating: 5,
    review:
      "At 3,400 meters, Cusco takes your breath away — literally and figuratively. The former capital of the Inca Empire is a palimpsest of civilizations, where Spanish colonial churches sit atop Inca stonework so precise that a blade cannot fit between the blocks. The Plaza de Armas hums with a very Andean energy — part indigenous pride, part colonial legacy, part modern vitality.\n\nMachu Picchu, when we finally arrived after days on the Inca Trail, exceeded every impossible expectation. Emerging from the Sun Gate at dawn, watching the mist slowly reveal the lost city below, was a moment of pure transcendence. The Incas believed the mountains were living deities — standing there, it was impossible to disagree.",
    tags: ["Adventure", "History", "Hiking", "Culture"],
    imageUrl: "https://loremflickr.com/800/600/machu,picchu,peru",
    mood: "🏛️",
    favorite: true,
  },
];

async function main() {
  const existing = await prisma.entry.count();
  if (existing > 0) {
    console.log(`数据库里已有 ${existing} 条记录，跳过 seed。`);
    return;
  }
  for (const e of entries) {
    const { tags, ...rest } = e;
    await prisma.entry.create({
      data: { ...rest, tagsJson: JSON.stringify(tags) },
    });
  }
  console.log(`✓ 写入 ${entries.length} 条默认旅行记录。`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
