import $ from "jquery";
import { LegacyConfig } from "../lib/LegacyConfig";
import { ArtemisConfig, ArtemisWaypoints } from "../lib/ArtemisConfig";
import { lookupPlayer } from "../lib/mcPlayer";
import { convertWaypoints } from "../lib/convertWaypoints";
import { mergeWaypoints } from "../lib/mergeWaypoints";

function hideAll() {
  for (const id of [
    "error",
    "username",
    "account",
    "legacy",
    "artemis",
    "download",
  ]) {
    $("#" + id).slideUp();
  }
}

function show(id: string) {
  $("#" + id).slideDown();
}

function toPage(id: string) {
  hideAll();
  show(id);
}

function error(error: string) {
  const el = $("#error");
  const visible = el.is(":visible");
  if (visible) {
    el.fadeOut();
    setTimeout(() => {
      $("#error-text").text(error);
      el.fadeIn();
    }, 400);
  } else {
    $("#error-text").text(error);
    el.slideDown();
  }
}

$(() => {
  console.log("Loaded.");
  toPage("username");

  setTimeout(() => {
    $("body").show();
  });
});

let username: string;
let uuid: string;

function setUUIDDisplays() {
  $("#legacy-uuid").text(uuid);
  $("#artemis-uuid").text(uuid);
  $("#download-uuid").text(uuid);
}

$("form").on("submit", () => false);

$("#username-next").on("click", async () => {
  const name = <string>$("#username-input").val();
  try {
    const player = await lookupPlayer(name);
    hideAll();
    username = player.username;
    uuid = player.raw_id;

    $("#account-username").text(username);
    $("#account-uuid").text(player.id);
    $("#account-avatar").one("load", () => {
      console.log("Avatar loaded");
      show("account");
    });
    $("#account-avatar").attr(
      "src",
      `https://visage.surgeplay.com/bust/128/${uuid}`
    );

    setUUIDDisplays();
  } catch (e) {
    error("Failed to find your profile. Consider skipping?\n" + e);
    show("username");
  }
});

$("#username-skip").on("click", () => {
  uuid = "(uuid)";
  setUUIDDisplays();
  toPage("legacy");
});

$("#account-next").on("click", () => {
  toPage("legacy");
});

$("#account-back").on("click", () => {
  toPage("username");
});

$("#legacy-file").on("change", async () => {
  const file = $("#legacy-file").prop("files")[0];
  $("#legacy-data").val(await file.text());
});

let waypoints: ArtemisWaypoints = [];

$("#legacy-next").on("click", () => {
  try {
    const rawData = <string>$("#legacy-data").val();
    const data = LegacyConfig.parse(JSON.parse(rawData));
    try {
      waypoints = convertWaypoints(data.waypoints);
      console.log("Converted Waypoints", JSON.stringify(waypoints));
      toPage("artemis");
    } catch (e) {
      error("Failed to convert waypoints.\n" + e);
    }
  } catch (e) {
    error("Failed to parse config.\n" + e);
  }
});

$("#legacy-back").on("click", () => {
  toPage("username");
});

$("#artemis-file").on("change", async () => {
  const file = $("#artemis-file").prop("files")[0];
  $("#artemis-data").val(await file.text());
});

$("#artemis-next").on("click", () => {
  try {
    const rawData = <string>$("#artemis-data").val();
    const data = ArtemisConfig.parse(JSON.parse(rawData));
    try {
      const newWPs = mergeWaypoints(waypoints, data["mapFeature.customPois"]);
      data["mapFeature.customPois"] = newWPs;
      console.log(JSON.stringify(data, null, 2));
      $("#download-data").val(JSON.stringify(data, null, 2));
      toPage("download");
    } catch (e) {
      error("Failed to merge configs.\n" + e);
    }
  } catch (e) {
    error("Failed to parse config.\n" + e);
  }
  // const newWPs = mergeWaypoints();
});

$("#artemis-back").on("click", () => {
  toPage("legacy");
});

$("#download-btn").on("click", () => {
  const contents = <string>$("#download-data").val();
  const myFile = new Blob([contents], { type: "application/json" });
  const href = URL.createObjectURL(myFile);
  console.log(href);

  const a = document.createElement("a");
  a.setAttribute("download", uuid + ".conf.json");
  a.href = href;
  a.setAttribute("target", "_blank");
  a.click();

  URL.revokeObjectURL(href);
});

$("#download-back").on("click", () => {
  toPage("artemis");
});
