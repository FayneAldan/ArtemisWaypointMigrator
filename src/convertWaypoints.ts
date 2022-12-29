import { convertColor } from "./convertColor.ts";
import { ArtemisWaypoint } from "./ArtemisConfig.d.ts";
import { LegacyWaypoint } from "./LegacyConfig.d.ts";

export function convertWaypoints(
  legacyWaypoints: LegacyWaypoint[],
): ArtemisWaypoint[] {
  const waypoints: ArtemisWaypoint[] = [];
  for (const waypoint of legacyWaypoints) {
    const { name, type, zoomNeeded, x, y, z } = waypoint;

    const chest = name.match(/^Loot Chest T([0-4])$/);

    waypoints.push({
      name: chest ? `Loot Chest ${chest[1]}` : name,
      color: convertColor(waypoint.color),
      icon: type == "LOOTCHEST_T1"
        ? "CHEST_T1"
        : type == "LOOTCHEST_T2"
        ? "CHEST_T2"
        : type == "LOOTCHEST_T3"
        ? "CHEST_T3"
        : type == "LOOTCHEST_T4"
        ? "CHEST_T4"
        : type == "TURRET"
        ? "WALL"
        : type,
      visibility: zoomNeeded > -1
        ? "DEFAULT"
        : zoomNeeded < -1
        ? "ALWAYS"
        : "DEFAULT",
      location: { x, y, z },
    });
  }
  return waypoints;
}
