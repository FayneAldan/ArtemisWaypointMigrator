# Artemis Waypoint Migrator

This program will help you easily convert your legacy Wynntils (MC 1.12.2)
waypoints to an Artemis Wynntils (MC 1.18.2+) instance.

# Permissions

This program is written in Deno. Deno is secure by default and will not give my
program file or network access unless you grant those permissions. Deno will
prompt you to give the following permissions:

- Read access to your waypoints file in your legacy instance
- (Optional) Network access to `playerdb.co`, which is only used to format your
  UUID into an easier to read username
- ~~If you choose to save to the Artemis config automatically:~~ (Soon™️)
  - ~~Read and write access to your config file in your Artemis instance~~

# Easy Usage

1. [Download the latest compiled executable for your OS.][nightly.link]
2. Run the executable within the ZIP file.
3. Follow the instructions on screen.
4. ???
5. Profit!

# Slightly More Advanced Usage

1. [Download and install Deno.][deno]
2. `deno run --reload https://faynealdan.github.io/ArtemisWaypointMigrator/cli/migrate.ts`
   - `--reload` is used to make the latest version of the script is downloaded
     upon run.
3. Follow the instructions on screen.
4. ???
5. Profit!

[deno]: https://deno.land/
[nightly.link]: https://nightly.link/FayneAldan/ArtemisWaypointMigrator/workflows/deno/main
[deno permissions]: https://deno.land/manual@v1.29.1/basics/permissions
