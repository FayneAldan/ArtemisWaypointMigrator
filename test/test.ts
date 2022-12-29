import { convertColor } from "../src/convertColor.ts";
import { LegacyConfig } from "../src/LegacyConfig.d.ts";

const input = <LegacyConfig> (
  JSON.parse(
    await Deno.readTextFile(new URL("map-waypoints1.config", import.meta.url)),
  )
);
const { waypoints, pathWaypoints } = input;
let colors = [
  ...waypoints.map((v) => v.color),
  ...pathWaypoints.map((v) => v.color),
];
colors = [...new Set(colors)];
for (const color of colors) {
  console.log(color, convertColor(color));
}
