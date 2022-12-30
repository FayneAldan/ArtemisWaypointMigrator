import { convertColor } from "./convertColor";
import { ArtemisWaypoint, ArtemisWaypoints } from "./ArtemisConfig";
import { LegacyWaypoint, LegacyWaypoints } from "./LegacyConfig";

export function convertWaypoint(waypoint: LegacyWaypoint): ArtemisWaypoint {
  const { name, type, zoomNeeded, x, y, z } = waypoint;
  const chest = name.match(/^Loot Chest T([1-4])$/);

  return ArtemisWaypoint.parse({
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

export function convertWaypoints(waypoints: LegacyWaypoints): ArtemisWaypoints {
  return waypoints.map(convertWaypoint);
}
