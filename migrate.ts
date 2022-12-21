import { join } from "https://deno.land/std@0.170.0/path/mod.ts";
import { grantOrThrow } from "https://deno.land/std@0.170.0/permissions/mod.ts";
import {
  Input,
  Select,
  SelectValueOptions,
} from "https://deno.land/x/cliffy@v0.25.6/prompt/mod.ts";
import { keypress } from "https://deno.land/x/cliffy@v0.25.6/keypress/mod.ts";
import { bold, red, yellow } from "https://deno.land/std@0.170.0/fmt/colors.ts";
import { LegacyConfig } from "./src/LegacyConfig.d.ts";
import { ArtemisWaypoint } from "./src/ArtemisConfig.d.ts";

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

let uuids: string[] = [];

let legacyPath = await Input.prompt({
  message: "Where is your legacy instance?",
  default: Deno.args[0],
  id: "legacyPath",
  hint: "This should be a .minecraft folder containing Wynntils for 1.12.2",

  validate: (legacyPath) => {
    legacyPath = join(legacyPath, "wynntils", "configs");

    try {
      uuids = [...Deno.readDirSync(legacyPath)]
        .filter((v) => v.isDirectory)
        .map((v) => v.name);
      if (uuids.length == 0)
        return "Failed to find any legacy Wynntils configs in this folder.";
      return true;
    } catch (e) {
      if (e instanceof Deno.errors.NotFound)
        return "Failed to find Wynntils legacy configs in this .minecraft folder";
      else if (e instanceof Deno.errors.PermissionDenied)
        return "Permission denied to read from this folder.\n   If this was a mistake, you will need to restart the program.";
      else throw e;
    }
  },
});
legacyPath = join(legacyPath, "wynntils", "configs");

log();

const uuidMap: Record<string, string> = {};

const mojangRequest: Deno.NetPermissionDescriptor = {
  name: "net",
  host: "sessionserver.mojang.com",
};

if ((await Deno.permissions.query(mojangRequest)).state == "prompt") {
  log(bold("Requesting permission"), "to check Minecraft usernames...");
  if ((await Deno.permissions.request(mojangRequest)).state == "denied") {
    log(yellow("Permission denied."), "Will show UUIDs instead.");
  }
  log();
}

for (const uuid of uuids) {
  try {
    const profile: Response = await fetch(
      `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
    );
    const name = (await profile.json()).name;
    uuidMap[uuid] = name;
  } catch {}
}

function getNameFromUUID(uuid: string): string {
  return uuidMap[uuid] || `${uuid} (Failed to get username)`;
}

const uuid: string = await (async () => {
  const options: SelectValueOptions = [];
  for (const uuid of uuids)
    options.push({
      name: getNameFromUUID(uuid),
      value: uuid,
    });

  return await Select.prompt({
    message: "Select your Minecraft username",
    options,
  });
})();

legacyPath = join(legacyPath, uuid, "map-waypoints.config");

let legacyData: LegacyConfig;
try {
  const fileData = await Deno.readTextFile(legacyPath);
  legacyData = JSON.parse(fileData);
} catch (e) {
  if (e instanceof SyntaxError) {
    log(red("Failed to read legacy waypoint data"));
    log(
      `Please report the error below and include wynntils/config/${uuid}/map-waypoints.config`
    );
  } else if (e instanceof Deno.errors.NotFound) {
    log(red("Failed to find legacy waypoint data"));
  } else throw e;

  log(e);
  await enterToExit();
  // https://github.com/microsoft/TypeScript/issues/34955
  Deno.exit();
}

const artemisWaypoints: ArtemisWaypoint[] = [];
for (const waypoint of legacyData.waypoints) {
}

log("Migrator isn't complete. Please wait for an update. :)");
await enterToExit();
