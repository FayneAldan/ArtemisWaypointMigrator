import chroma from "https://esm.sh/chroma-js@2.4.2";

const colorMap: Record<string, string> = {
  "&0": "#000000",
  "&8": "#555555",
  "&1": "#0000AA",
  "&9": "#5555FF",
  "&2": "#00AA00",
  "&a": "#55FF55",
  "&3": "#00AAAA",
  "&b": "#55FFFF",
  "&4": "#AA0000",
  dark_red: "#AA0000",
  "&c": "#FF5555",
  "&5": "#AA00AA",
  "&d": "#FF55FF",
  "&6": "#FFAA00",
  "&e": "#FFFF55",
  "&7": "#AAAAAA",
  "&f": "#FFFFFF",
  black: "#000000",
  light_gray: "#ADADAD",
  red: "#FF0000",
  gray: "#636363",
  green: "#00FF00",
  pink: "#FFB7B7",
  blue: "#0000FF",
  light_green: "#49FF59",
  yellow: "#FFFF00",
  light_blue: "#00E9FF",
  brown: "#563100",
  magenta: "#FF0083",
  purple: "#B200FF",
  orange: "#FF9000",
  cyan: "#438E82",
  white: "#FFFFFF",
};

export function convertColor(input: string): string {
  if (colorMap[input.toLowerCase()]) {
    return chroma(colorMap[input.toLowerCase()]).hex();
  }
  if (input.startsWith("rgba(")) {
    const rgba = <[number, number, number, number]> input
      .substring(5, input.length - 1)
      .split(",")
      .map(Number);
    return chroma.gl(...rgba).hex();
  }
  if (chroma.valid(input)) return chroma(input).hex();
  throw new Error("Unrecognized format");
}
