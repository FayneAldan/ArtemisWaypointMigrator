import { ArtemisWaypoint } from "./ArtemisConfig";

function normalize(waypoint: ArtemisWaypoint): string {
  return JSON.stringify([
    waypoint.name,
    waypoint.color,
    waypoint.icon,
    waypoint.visibility,
    waypoint.location.x,
    waypoint.location.y,
    waypoint.location.z,
  ]);
}

export function mergeWaypoints(
  a: ArtemisWaypoint[],
  b: ArtemisWaypoint[]
): ArtemisWaypoint[] {
  const arr = [...a, ...b];
  return arr.filter(
    (element, index) =>
      arr.findIndex((step) => normalize(element) == normalize(step)) == index
  );
}
