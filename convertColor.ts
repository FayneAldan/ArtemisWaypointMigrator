import { red } from "https://deno.land/std@0.170.0/fmt/colors.ts";
import { Input } from "https://deno.land/x/cliffy@v0.25.5/prompt/mod.ts";
import { convertColor } from "./src/convertColor.ts";

// REPL
while (true) {
  const input = await Input.prompt("Legacy color");
  try {
    const output = convertColor(input);
    console.log(output.hex());
  } catch (e) {
    console.log(red(String(e)));
  }
}
