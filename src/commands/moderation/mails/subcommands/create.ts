import { Channel } from "../../../../../deps.ts";
import { botCache } from "../../../../../mod.ts";
import { createSubcommand, } from "../../../../utils/helpers.ts";
import { PermissionLevels } from "../../../../types/commands.ts";
import { labelsDatabase } from "../../../../database/schemas/labels.ts";

createSubcommand("labels", {
	name: "create",
	aliases: ["c"],
	arguments: [{ name: "name", type: "string", lowercase: true }, { name: "categoryID", type: "categorychannel", }],
	cooldown: {
		seconds: 5,
		allowedUses: 2,
	},
	guildOnly: true,
	vipServerOnly: true,
	permissionLevels: [PermissionLevels.MODERATOR, PermissionLevels.ADMIN],
	execute: async (message, args: LabelsCreateArgs) => {
		const labelExists = await labelsDatabase.findOne({
			name: args.name,
			guildID: message.guildID
		})

		if (labelExists) return botCache.helpers.reactError(message)

		await labelsDatabase.insertOne({
			userID: message.author.id,
			categoryID: args.category.id,
			guildID: message.guildID,
			name: args.name
		})

		return botCache.helpers.reactSuccess(message)
	},
});

interface LabelsCreateArgs {
	name: string;
	category: Channel;
}
