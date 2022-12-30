import { Input } from "https://deno.land/x/cliffy@v0.25.6/prompt/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.6/ansi/mod.ts";

import { convertColor } from "./lib/convertColor.ts";

// REPL
while (true) {
  const input = await Input.prompt("Legacy color");
  try {
    const output = convertColor(input);
    console.log(output);
  } catch (e) {
    console.log(colors.red(String(e)));
  }
}
