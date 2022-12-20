import { red } from "https://deno.land/std@0.170.0/fmt/colors.ts";
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
  "&c": "#FF5555",
  "&5": "#AA00AA",
  "&d": "#FF55FF",
  "&6": "#FFAA00",
  "&e": "#FFFF55",
  "&7": "#AAAAAA",
  "&f": "#FFFFFF",
  BLACK: "#000000",
  LIGHT_GRAY: "#ADADAD",
  RED: "#FF0000",
  GRAY: "#636363",
  GREEN: "#00FF00",
  PINK: "#FFB7B7",
  BLUE: "#0000FF",
  LIGHT_GREEN: "#49FF59",
  YELLOW: "#FFFF00",
  LIGHT_BLUE: "#00E9FF",
  BROWN: "#563100",
  MAGENTA: "#FF0083",
  PURPLE: "#B200FF",
  ORANGE: "#FF9000",
  CYAN: "#438E82",
  WHITE: "#FFFFFF",
};

function convertColor(input: string): chroma.Color {
  if (colorMap[input]) return chroma(colorMap[input]);
  if (input.startsWith("rgba(")) {
    const rgba = <[number, number, number, number]>input
      .substring(5, input.length - 1)
      .split(",")
      .map(Number);
    return chroma.gl(...rgba);
  }
  if (chroma.valid(input)) return chroma(input);
  throw new Error("Unrecognized format");
}

if (import.meta.main) {
  // REPL
  while (true) {
    const input = prompt(">") || "";
    try {
      const output = convertColor(input);
      console.log(output.hex());
    } catch (e) {
      console.log(red(String(e)));
    }
  }
}
