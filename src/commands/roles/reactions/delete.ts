import { botCache } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { PermissionLevels } from "../../../types/commands.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand('roles-reactions', {
	name: 'delete',
	aliases: ["del", "d"],
	permissionLevels: [PermissionLevels.ADMIN],
	guildOnly: true,
	arguments: [
		{ name: "name", type: "string", lowercase: true },
	],
	execute: async function (message, args: CommandArgs) {
		db.reactionroles.deleteOne({ name: args.name, guildID: message.guildID });
		botCache.helpers.reactSuccess(message);
	}
})

interface CommandArgs {
	name: string;
}
