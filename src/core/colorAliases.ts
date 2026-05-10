export interface ColorAlias {
  canonicalName: string;
  aliases: string[];
}

export const colorAliases: ColorAlias[] = [
  {
    canonicalName: "warm yellow",
    aliases: ["warm yellow", "golden yellow", "sunny yellow", "butter yellow"]
  },
  {
    canonicalName: "coral",
    aliases: ["coral"]
  },
  {
    canonicalName: "bright coral",
    aliases: ["bright coral", "clear coral", "vivid coral"]
  },
  {
    canonicalName: "peach",
    aliases: ["peach", "peachy", "apricot"]
  },
  {
    canonicalName: "camel",
    aliases: ["camel", "tan camel"]
  },
  {
    canonicalName: "warm aqua",
    aliases: ["warm aqua", "aqua", "turquoise"]
  },
  {
    canonicalName: "apple green",
    aliases: ["apple green", "grass green"]
  },
  {
    canonicalName: "bright blue",
    aliases: ["bright blue", "clear blue"]
  },
  {
    canonicalName: "warm beige",
    aliases: ["warm beige", "sand", "oatmeal"]
  },
  {
    canonicalName: "ivory",
    aliases: ["ivory", "off white", "off-white"]
  },
  {
    canonicalName: "light warm gray",
    aliases: ["light warm gray", "light warm grey", "warm gray", "warm grey"]
  },
  {
    canonicalName: "clear navy",
    aliases: ["clear navy"]
  },
  {
    canonicalName: "lavender",
    aliases: ["lavender", "lilac"]
  },
  {
    canonicalName: "sky blue",
    aliases: ["sky blue", "pale blue", "baby blue"]
  },
  {
    canonicalName: "sage green",
    aliases: ["sage green", "sage"]
  },
  {
    canonicalName: "pale pink",
    aliases: ["pale pink", "soft pink", "blush pink", "blush"]
  },
  {
    canonicalName: "powdery blue",
    aliases: ["powdery blue", "powder blue", "dusty blue"]
  },
  {
    canonicalName: "mauve",
    aliases: ["mauve", "dusty rose"]
  },
  {
    canonicalName: "soft white",
    aliases: ["soft white", "winter white"]
  },
  {
    canonicalName: "cool beige",
    aliases: ["cool beige", "taupe"]
  },
  {
    canonicalName: "light gray",
    aliases: ["light gray", "light grey", "silver gray", "silver grey"]
  },
  {
    canonicalName: "soft navy",
    aliases: ["soft navy"]
  },
  {
    canonicalName: "rust",
    aliases: ["rust", "rust red", "burnt orange", "cinnamon"]
  },
  {
    canonicalName: "olive green",
    aliases: ["olive green", "army green"]
  },
  {
    canonicalName: "pumpkin",
    aliases: ["pumpkin", "pumpkin orange"]
  },
  {
    canonicalName: "mustard yellow",
    aliases: ["mustard yellow", "mustard", "golden mustard"]
  },
  {
    canonicalName: "chocolate brown",
    aliases: ["chocolate brown", "chocolate", "espresso", "coffee brown"]
  },
  {
    canonicalName: "deep teal",
    aliases: ["deep teal", "teal", "petrol"]
  },
  {
    canonicalName: "dark chocolate",
    aliases: ["dark chocolate", "dark brown"]
  },
  {
    canonicalName: "khaki",
    aliases: ["khaki"]
  },
  {
    canonicalName: "olive",
    aliases: ["olive"]
  },
  {
    canonicalName: "cream",
    aliases: ["cream", "ecru"]
  },
  {
    canonicalName: "emerald green",
    aliases: ["emerald green", "emerald"]
  },
  {
    canonicalName: "royal blue",
    aliases: ["royal blue", "cobalt blue", "cobalt"]
  },
  {
    canonicalName: "deep purple",
    aliases: ["deep purple", "plum", "aubergine"]
  },
  {
    canonicalName: "fuchsia",
    aliases: ["fuchsia", "magenta", "hot pink"]
  },
  {
    canonicalName: "bright red",
    aliases: ["bright red", "cherry red", "true red"]
  },
  {
    canonicalName: "icy pink",
    aliases: ["icy pink"]
  },
  {
    canonicalName: "true black",
    aliases: ["true black", "black", "jet black"]
  },
  {
    canonicalName: "crisp white",
    aliases: ["crisp white", "optic white", "pure white", "white"]
  },
  {
    canonicalName: "cool gray",
    aliases: ["cool gray", "cool grey", "charcoal gray", "charcoal grey"]
  },
  {
    canonicalName: "deep navy",
    aliases: ["deep navy", "navy", "midnight blue"]
  },
  {
    canonicalName: "earthy orange",
    aliases: ["earthy orange", "terracotta", "terra cotta", "burnt sienna"]
  },
  {
    canonicalName: "beige",
    aliases: ["beige"]
  },
  {
    canonicalName: "earthy browns",
    aliases: ["earthy brown", "earthy browns", "brown"]
  },
  {
    canonicalName: "harsh bright orange",
    aliases: ["harsh bright orange", "neon orange", "bright orange"]
  },
  {
    canonicalName: "pastel shades",
    aliases: ["pastel", "pastel shades", "pastel color", "pastel colours"]
  },
  {
    canonicalName: "cool-toned purples",
    aliases: ["cool purple", "cool-toned purple", "violet"]
  },
  {
    canonicalName: "muted cool tones",
    aliases: ["muted cool", "dusty purple", "slate blue"]
  },
  {
    canonicalName: "harsh black",
    aliases: ["harsh black"]
  }
];

export const aliasToCanonical = new Map<string, string>(
  colorAliases.flatMap(({ canonicalName, aliases }) =>
    aliases.map((alias) => [alias, canonicalName] as const)
  )
);
