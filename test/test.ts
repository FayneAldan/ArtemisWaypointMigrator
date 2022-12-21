import { convertColor } from "../src/convertColor.ts";
import { LegacyConfig } from "../src/LegacyConfig.d.ts";

const input = <LegacyConfig>(
  JSON.parse(await Deno.readTextFile("test/map-waypoints1.config"))
);
const { waypoints, pathWaypoints } = input;
const colors = [
  ...waypoints.map((v) => v.color),
  ...pathWaypoints.map((v) => v.color),
].map((v) => {
  try {
    return convertColor(v).hex();
  } catch (e) {
    return v + " / " + e;
  }
});
console.log([...new Set(colors)].join("\t"));
