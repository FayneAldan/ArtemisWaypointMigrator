import chroma from "chroma-js";

const colorMap: Record<string, string | number> = {
  // CommonColors
  BLACK: 0x000000,
  RED: 0xff0000,
  DARK_RED: 0xaa0000,
  GREEN: 0x00ff00,
  BLUE: 0x0000ff,
  YELLOW: 0xffff00,
  BROWN: 0x563100,
  PURPLE: 0xb200ff,
  CYAN: 0x438e82,
  LIGHT_GRAY: 0xadadad,
  GRAY: 0x636363,
  PINK: 0xffb7b7,
  LIGHT_GREEN: 0x49ff59,
  LIGHT_BLUE: 0x00e9ff,
  MAGENTA: 0xff0083,
  ORANGE: 0xff9000,
  WHITE: 0xffffff,

  GREY: 0x636363,
  LIGHT_GREY: 0xadadad,

  // CustomColor
  DARK_BLUE: 0x0000aa,
  DARK_GREEN: 0x00aa00,
  DARK_AQUA: 0x55ffff,
  DARK_PURPLE: 0xaa00aa,
  GOLD: 0xffaa00,
  DARK_GRAY: 0x555555,
  AQUA: 0x55ffff,
  LIGHT_PURPLE: 0xff55ff,

  // MinecraftChatColors Aliases
  DARK_CYAN: 0x00aaaa,
  SILVER: 0xaaaaaa,
  VIOLET: 0x5555ff,
  PALE_GREEN: 0x55ff55,
};

const mcChatColors: number[] = [
  0x000000, 0x0000aa, 0x00aa00, 0x00aaaa, 0xaa0000, 0xaa00aa, 0xffaa00,
  0xaaaaaa, 0x555555, 0x5555ff, 0x55ff55, 0x55ffff, 0xff5555, 0xff55ff,
  0xffff55, 0xffffff,
];
for (let i = 0; i < 16; i++) {
  colorMap["&" + i] = mcChatColors[i];
  colorMap["§" + i] = mcChatColors[i];
}

export function convertColor(input: string): string {
  const key = input.trim().replace(" ", "_").toLocaleUpperCase();
  if (colorMap[key]) {
    return chroma(colorMap[key]).hex();
  }

  if (input.startsWith("rgba(")) {
    const rgba = <[number, number, number, number]>input
      .substring(5, input.length - 1)
      .split(",")
      .map(Number);
    return chroma.gl(...rgba).hex();
  }
  if (chroma.valid(input)) return chroma(input).hex();
  throw new Error("Unrecognized format");
}
