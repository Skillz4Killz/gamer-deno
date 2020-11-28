/**
 * TODO
 * 1. Achievements
 * 2. Translations
 * 4. Prestige
 * 5. Ads
 * 6. Website Profile
 * 7. Website Leaderboard
 * 8. Website Shop
 */
import { createCommand } from "../../../utils/helpers.ts";

createCommand({
  name: "idle",
  arguments: [
    { name: "subcommand", type: "subcommand", defaultValue: "upgrade" },
  ],
});
