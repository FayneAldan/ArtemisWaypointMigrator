import { join } from "https://deno.land/std@0.170.0/path/mod.ts";

import {
  Input,
  Select,
  SelectValueOptions,
} from "https://deno.land/x/cliffy@v0.25.6/prompt/mod.ts";
import { keypress } from "https://deno.land/x/cliffy@v0.25.6/keypress/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.6/ansi/mod.ts";

import { LegacyConfig } from "./src/LegacyConfig.d.ts";
import { ArtemisWaypoint } from "./src/ArtemisConfig.d.ts";
import { convertColor } from "./src/convertColor.ts";

const { red, yellow, green, bold } = colors;
const { log } = console;

async function enterToExit(): Promise<never> {
  log("Press [Enter] to exit");
  for await (const event of keypress()) {
    if (event.key == "return") {
      break;
    }
  }
  Deno.exit();
}

let legacyPath = await Input.prompt({
  message: "Where is your legacy instance?",
  default: Deno.args[0],
  hint: "This should be a .minecraft folder containing Wynntils for 1.12.2",
});
legacyPath = join(legacyPath, "wynntils", "configs");

let uuids: string[] = [];

try {
  uuids = [...Deno.readDirSync(legacyPath)]
    .filter((v) => v.isDirectory)
    .map((v) => v.name);
} catch (e) {
  if (e instanceof Deno.errors.NotFound) {
    log(red("Failed to find Wynntils legacy configs in the specified folder"));
  } else if (e instanceof Deno.errors.PermissionDenied) {
    log(red("Permission denied to read from this folder"));
  } else throw e;
  await enterToExit();
}

log();

if (uuids.length == 0) {
  log(red("Failed to find any legacy Wynntils configs in this folder"));
  await enterToExit();
}

const uuidMap: Record<string, string> = {};

const playerdbPerm: Deno.NetPermissionDescriptor = {
  name: "net",
  host: "playerdb.co",
};

if ((await Deno.permissions.query(playerdbPerm)).state == "prompt") {
  log(bold("Requesting permission"), "to check Minecraft usernames...");
  if ((await Deno.permissions.request(playerdbPerm)).state == "denied") {
    log(yellow("Permission denied."), "Will show UUIDs instead.");
    log();
  }
}

if ((await Deno.permissions.query(playerdbPerm)).state == "granted") {
  log("Checking Minecraft usernames...");
  for (const uuid of uuids) {
    try {
      const profile: Response = await fetch(
        `https://playerdb.co/api/player/minecraft/${uuid}`,
        {
          headers: {
            "user-agent": "github.com/FayneAldan/ArtemisWaypointMigrator",
          },
        },
      );
      const name = (await profile.json()).data.player.username;
      uuidMap[uuid] = name;
      // deno-lint-ignore no-empty
    } catch { }
  }
  log();
} else for (const uuid of uuids) uuidMap[uuid] = uuid;

function getNameFromUUID(uuid: string): string {
  return uuidMap[uuid] || `${uuid} (Failed to get username)`;
}

const uuid: string = await (async () => {
  const options: SelectValueOptions = [];
  for (const uuid of uuids) {
    options.push({
      name: getNameFromUUID(uuid),
      value: uuid,
    });
  }

  return await Select.prompt({
    message: "Select your Minecraft account",
    options,
  });
})();
log();

legacyPath = join(legacyPath, uuid, "map-waypoints.config");

let legacyData: LegacyConfig;
try {
  const fileData = await Deno.readTextFile(legacyPath);
  legacyData = JSON.parse(fileData);
} catch (e) {
  if (e instanceof SyntaxError) {
    log(red("Failed to read legacy waypoint data"));
    log(
      `Please report the error below and include wynntils/config/${uuid}/map-waypoints.config`,
    );
  } else if (e instanceof Deno.errors.NotFound) {
    log(red("Failed to find legacy waypoint data"));
  } else throw e;

  log(e);
  await enterToExit();
  Deno.exit(); // https://github.com/microsoft/TypeScript/issues/34955
}

const artemisWaypoints: ArtemisWaypoint[] = [];
for (const waypoint of legacyData.waypoints) {
  const { name, type, zoomNeeded, x, y, z } = waypoint;

  const chest = name.match(/^Loot Chest T([0-4])$/);

  artemisWaypoints.push({
    name: chest ? `Loot Chest ${chest[1]}` : name,
    color: convertColor(waypoint.color),
    icon: type == "LOOTCHEST_T1"
      ? "CHEST_T1"
      : type == "LOOTCHEST_T2"
        ? "CHEST_T1"
        : type == "LOOTCHEST_T3"
          ? "CHEST_T1"
          : type == "LOOTCHEST_T4"
            ? "CHEST_T1"
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

log(green("Your waypoints have been converted!"));
const method = await Select.prompt({
  message: "What should we do with these waypoints?",
  options: [
    {
      name: "Print to console",
      value: "console",
    },
    {
      name: "Merge with my Artemis waypoints (Not yet implemented)",
      value: "merge",
      disabled: true,
    },
    {
      name: "Replace my Artemis waypoints (Not yet implemented)",
      value: "replace",
      disabled: true,
    },
  ],
});
log();

if (method == "console") {
  log(
    bold(
      `Replace mapFeature.customPois in wynntils/config/${uuid}.conf.json with this:`,
    ),
  );
  log();
  log(JSON.stringify(artemisWaypoints));
  log();
  log("(you may need to scroll up)");
  await enterToExit();
} else {
  // Not yet implemented
}
