import { join } from "https://deno.land/std@0.170.0/path/mod.ts";
import { grantOrThrow } from "https://deno.land/std@0.170.0/permissions/mod.ts";
import {
  Input,
  Confirm,
  Select,
  SelectValueOptions,
} from "https://deno.land/x/cliffy@v0.25.5/prompt/mod.ts";
import { keypress } from "https://deno.land/x/cliffy@v0.25.5/keypress/mod.ts";
import { red } from "https://deno.land/std@0.170.0/fmt/colors.ts";

const { log } = console;

async function enterToExit() {
  log("Press [Enter] to exit");
  for await (const event of keypress()) {
    if (event.key == "return") {
      return;
    }
  }
}

let mcfolder = await Input.prompt({
  message: "Where is your .minecraft folder?",
  // default: "%AppData%\\.minecraft",
  default:
    "C:\\Users\\ethan\\AppData\\Roaming\\PrismLauncher\\instances\\Wynncraft\\.minecraft",
});

if (mcfolder == "%AppData%\\.minecraft") {
  // grantOrThrow({ name: "env", name: "AppData" });
  const appdata = Deno.env.get("AppData");
  if (!appdata) {
    log(red("Failed to get %AppData%. Please manually specify path."));
    await enterToExit();
    Deno.exit();
  }
  mcfolder = join(appdata, ".minecraft");
}

const legacyWTConfigs = join(mcfolder, "wynntils", "configs");
// grantOrThrow({ name: "read", path: legacyWTConfigs });

let uuids;
try {
  uuids = [...Deno.readDirSync(legacyWTConfigs)]
    .filter((v) => v.isDirectory)
    .map((v) => v.name);
} catch (e) {
  if (e instanceof Deno.errors.NotFound) {
    log("Failed to find Wynntils configs in this .minecraft folder");
    await enterToExit();
    Deno.exit();
  } else throw e;
}

const uuidMap: Record<string, string> = {};

if (
  uuids.length > 0 &&
  (
    await Deno.permissions.query({
      name: "net",
      host: "sessionserver.mojang.com",
    })
  ).state == "prompt"
) {
  console.log("Requesting permission to check Minecraft usernames...");
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
  return uuidMap[uuid] || `${uuid} (Failed to get UUID)`;
}

let uuid: string;

if (uuids.length == 0) {
  log("Failed to find any Wynntils configs.");
} else if (uuids.length == 1) {
  uuid = uuids[0];
  log("Only one Wynntils config was found.");
  if (!(await Confirm.prompt(`Is your username ${getNameFromUUID(uuid)}?`))) {
    log("No other configs were found.");
    await enterToExit();
    Deno.exit();
  }
} else {
  const options: SelectValueOptions = [];
  for (const uuid of uuids)
    options.push({
      name: getNameFromUUID(uuid),
      value: uuid,
    });

  uuid = await Select.prompt({
    message: "Select your Minecraft username",
    options,
  });
}

log("Migrator isn't complete. Please wait for an update. :)");
await enterToExit();
