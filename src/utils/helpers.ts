import type {
  Channel,
  Emoji,
  Guild,
  Member,
  Message,
  MessageContent,
  Permission,
  Role,
} from "../../deps.ts";
import type { Embed } from "./Embed.ts";
import type { PermissionLevels } from "../types/commands.ts";

import { botCache } from "../../cache.ts";
import {
  botHasChannelPermissions,
  cache,
  Collection,
  deleteMessage,
  editMessage,
  sendMessage,
} from "../../deps.ts";

/** This function should be used when you want to send a response that will @mention the user and delete it after a certain amount of seconds. By default, it will be deleted after 10 seconds. */
export async function sendAlertResponse(
  message: Message,
  content: string | MessageContent,
  timeout = 10,
  reason = "",
) {
  const response = await sendResponse(message, content);
  deleteMessage(response, reason, timeout * 1000).catch(() => undefined);
}

/** This function should be used when you want to send a response that will send a reply message. */
export function sendResponse(
  message: Message,
  content: string | MessageContent,
) {
  const contentWithMention = typeof content === "string"
    ? { content, mentions: { repliedUser: true }, replyMessageID: message.id }
    : {
      ...content,
      mentions: { ...(content.mentions || {}), repliedUser: true },
      replyMessageID: message.id,
    };

  return sendMessage(message.channelID, contentWithMention);
}

/** This function should be used when you want to convert milliseconds to a human readable format like 1d5h. */
export function humanizeMilliseconds(milliseconds: number) {
  const years = Math.floor(milliseconds / botCache.constants.milliseconds.YEAR);
  const months = Math.floor(
    (milliseconds % botCache.constants.milliseconds.YEAR) /
      botCache.constants.milliseconds.MONTH,
  );
  const weeks = Math.floor(
    ((milliseconds % botCache.constants.milliseconds.YEAR) %
      botCache.constants.milliseconds.MONTH) /
      botCache.constants.milliseconds.WEEK,
  );
  const days = Math.floor(
    (((milliseconds % botCache.constants.milliseconds.YEAR) %
      botCache.constants.milliseconds.MONTH) %
      botCache.constants.milliseconds.WEEK) /
      botCache.constants.milliseconds.DAY,
  );
  const hours = Math.floor(
    ((((milliseconds % botCache.constants.milliseconds.YEAR) %
      botCache.constants.milliseconds.MONTH) %
      botCache.constants.milliseconds.WEEK) %
      botCache.constants.milliseconds.DAY) /
      botCache.constants.milliseconds.HOUR,
  );
  const minutes = Math.floor(
    (((((milliseconds % botCache.constants.milliseconds.YEAR) %
      botCache.constants.milliseconds.MONTH) %
      botCache.constants.milliseconds.WEEK) %
      botCache.constants.milliseconds.DAY) %
      botCache.constants.milliseconds.HOUR) /
      botCache.constants.milliseconds.MINUTE,
  );
  const seconds = Math.floor(
    (((((milliseconds % botCache.constants.milliseconds.YEAR) %
          botCache.constants.milliseconds.MONTH) %
          botCache.constants.milliseconds.WEEK) %
          botCache.constants.milliseconds.DAY) %
          botCache.constants.milliseconds.HOUR) %
        botCache.constants.milliseconds.MINUTE / 1000,
  );

  const yearString = years ? `${years}y ` : "";
  const monthString = months ? `${months}mo ` : "";
  const weekString = weeks ? `${weeks}w ` : "";
  const dayString = days ? `${days}d ` : "";
  const hourString = hours ? `${hours}h ` : "";
  const minuteString = minutes ? `${minutes}m ` : "";
  const secondString = seconds ? `${seconds}s ` : "";

  return `${yearString}${monthString}${weekString}${dayString}${hourString}${minuteString}${secondString}`
    .trimEnd() ||
    "1s";
}

/** This function helps convert a string like 1d5h to milliseconds. */
export function stringToMilliseconds(text: string) {
  const matches = text.match(/(\d+[w|d|h|m]{1})/g);
  if (!matches) return;

  let total = 0;

  for (const match of matches) {
    // Finds the first of these letters
    const validMatch = /(w|d|h|m|s)/.exec(match);
    // if none of them were found cancel
    if (!validMatch) return;
    // Get the number which should be before the index of that match
    const number = match.substring(0, validMatch.index);
    // Get the letter that was found
    const [letter] = validMatch;
    if (!number || !letter) return;

    let multiplier = botCache.constants.milliseconds.SECOND;
    switch (letter.toLowerCase()) {
      case `w`:
        multiplier = botCache.constants.milliseconds.WEEK;
        break;
      case `d`:
        multiplier = botCache.constants.milliseconds.DAY;
        break;
      case `h`:
        multiplier = botCache.constants.milliseconds.HOUR;
        break;
      case `m`:
        multiplier = botCache.constants.milliseconds.MINUTE;
        break;
    }

    const amount = number ? parseInt(number, 10) : undefined;
    if (!amount) return;

    total += amount * multiplier;
  }

  return total;
}

export function createCommand<T extends readonly ArgumentDefinition[]>(
  command: Command<T>,
) {
  botCache.commands.set(command.name, command);
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends
  ((k: infer I) => void) ? I : never;

type Identity<T> = { [P in keyof T]: T[P] };

// Define each of the types here
type BaseDefinition = {
  lowercase?: boolean;
  minimum?: number;
  maximum?: number;
  defaultValue?: unknown;
};
type BooleanArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: "boolean";
};
type BooleanOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & { name: N; type: "boolean"; required: false };
type StringArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: "string" | "...string" | "subcommand" | "snowflake";
};
type StringOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "string" | "...string" | "subcommand" | "snowflake";
    required: false;
  };
type MultiStringArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "...snowflake";
  };
type MultiStringOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "...snowflake";
    required: false;
  };
type NumberArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: "number" | "duration";
};
type NumberOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "number" | "duration";
    required: false;
  };
type EmojiArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: "emoji";
};
type EmojiOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "emoji";
    required: false;
  };
type MemberArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: "member";
};
type MemberOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "member";
    required: false;
  };
type RoleArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: "role";
};
type RoleOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "role";
    required: false;
  };
type MultiRoleArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: "...roles";
};
type MultiRoleOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "...roles";
    required: false;
  };
type ChannelArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type:
    | "categorychannel"
    | "newschannel"
    | "textchannel"
    | "guildtextchannel"
    | "voicechannel";
};
type ChannelOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type:
      | "categorychannel"
      | "newschannel"
      | "textchannel"
      | "guildtextchannel"
      | "voicechannel";
  };
type CommandArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: "command" | "nestedcommand";
};
type CommandOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "command" | "nestedcommand";
    required: false;
  };
type GuildArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: "guild";
};
type GuildOptionalArgumentDefinition<N extends string = string> =
  & BaseDefinition
  & {
    name: N;
    type: "guild";
    required: false;
  };

// Add each of known ArgumentDefinitions to this union.
type ArgumentDefinition =
  | BooleanArgumentDefinition
  | StringArgumentDefinition
  | StringOptionalArgumentDefinition
  | MultiStringArgumentDefinition
  | MultiStringOptionalArgumentDefinition
  | NumberArgumentDefinition
  | EmojiArgumentDefinition
  | MemberArgumentDefinition
  | RoleArgumentDefinition
  | MultiRoleArgumentDefinition
  | RoleOptionalArgumentDefinition
  | MultiRoleOptionalArgumentDefinition
  | ChannelArgumentDefinition
  | CommandArgumentDefinition
  | GuildArgumentDefinition;

// OPTIONALS MUST BE FIRST!!!
export type ConvertArgumentDefinitionsToArgs<
  T extends readonly ArgumentDefinition[],
> = Identity<
  UnionToIntersection<
    {
      [P in keyof T]: T[P] extends BooleanOptionalArgumentDefinition<infer N>
        ? { [_ in N]?: boolean }
        : T[P] extends BooleanArgumentDefinition<infer N>
          ? { [_ in N]: boolean }
        : T[P] extends StringOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: string }
        : T[P] extends StringArgumentDefinition<infer N> ? { [_ in N]: string }
        : T[P] extends MultiStringOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: string[] }
        : T[P] extends MultiStringArgumentDefinition<infer N>
          ? { [_ in N]: string[] }
        : T[P] extends NumberOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: number }
        : T[P] extends NumberArgumentDefinition<infer N> ? { [_ in N]: number }
        : T[P] extends EmojiOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: string }
        : T[P] extends EmojiArgumentDefinition<infer N> ? { [_ in N]: string }
        : T[P] extends MemberOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: Member }
        : T[P] extends MemberArgumentDefinition<infer N> ? { [_ in N]: Member }
        : T[P] extends RoleOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: Role }
        : T[P] extends RoleArgumentDefinition<infer N> ? { [_ in N]: Role }
        : T[P] extends MultiRoleOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: Role[] }
        : T[P] extends MultiRoleArgumentDefinition<infer N>
          ? { [_ in N]: Role[] }
        : T[P] extends ChannelOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: Channel }
        : T[P] extends ChannelArgumentDefinition<infer N>
          ? { [_ in N]: Channel }
        : T[P] extends CommandOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: Command<T> }
        : T[P] extends CommandArgumentDefinition<infer N>
          ? { [_ in N]: Command<T> }
        : T[P] extends GuildOptionalArgumentDefinition<infer N>
          ? { [_ in N]?: Guild }
        : T[P] extends GuildArgumentDefinition<infer N> ? { [_ in N]: Guild }
        : never;
    }[number]
  >
>;

export interface Command<T extends readonly ArgumentDefinition[]> {
  name: string;
  aliases?: string[];
  dmOnly?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
  permissionLevels?:
    | PermissionLevels[]
    | ((
      message: Message,
      command: Command<T>,
      guild?: Guild,
    ) => boolean | Promise<boolean>);
  botServerPermissions?: Permission[];
  botChannelPermissions?: Permission[];
  userServerPermissions?: Permission[];
  userChannelPermissions?: Permission[];
  description?: string;
  cooldown?: {
    seconds: number;
    allowedUses?: number;
  };
  arguments?: T;
  subcommands?: Collection<string, Command<T>>;
  usage?: string | string[];
  vipServerOnly?: boolean;
  vipUserOnly?: boolean;
  execute?: (
    message: Message,
    args: ConvertArgumentDefinitionsToArgs<T>,
    guild?: Guild,
  ) => unknown;
}

export interface Argument {
  name: string;
  execute<T extends readonly ArgumentDefinition[]>(
    arg: CommandArgument,
    parameter: string[],
    message: Message,
    command: Command<T>,
  ): unknown;
}

export interface CommandArgument {
  /** The name of the argument. Useful for when you need to alert the user X arg is missing. */
  name: string;
  /** The type of the argument you would like. Defaults to string. */
  type?:
    | "number"
    | "emoji"
    | "string"
    | "...string"
    | "boolean"
    | "subcommand"
    | "member"
    | "role"
    | "...roles"
    | "categorychannel"
    | "newschannel"
    | "textchannel"
    | "guildtextchannel"
    | "voicechannel"
    | "command"
    | "duration"
    | "guild"
    | "snowflake"
    | "...snowflake"
    | "nestedcommand";
  /** The function that runs if this argument is required and is missing. */
  missing?: (message: Message) => unknown;
  /** Whether or not this argument is required. Defaults to true. */
  required?: boolean;
  /** If the type is string, this will force this argument to be lowercase. */
  lowercase?: boolean;
  /** If the type is string or subcommand you can provide literals. The argument MUST be exactly the same as the literals to be accepted. For example, you can list the subcommands here to make sure it matches. */
  literals?: string[];
  /** The default value for this argument/subcommand. */
  defaultValue?: string | boolean | number;
  /** If the type is number set the minimum amount. By default the minimum is 0 */
  minimum?: number;
  /** If the type is a number set the maximum amount. By default this is disabled. */
  maximum?: number;
  /** If the type is a number, you can use this to allow/disable non-integers. By default this is false. */
  allowDecimals?: boolean;
}

export function createSubcommand<T extends readonly ArgumentDefinition[]>(
  commandName: string,
  subcommand: Command<T>,
  retries = 0,
) {
  const names = commandName.split("-");

  let command: Command<T> = botCache.commands.get(commandName)!;

  if (names.length > 1) {
    for (const name of names) {
      const validCommand = command
        ? command.subcommands?.get(name)
        : botCache.commands.get(name);

      if (!validCommand) {
        if (retries === 20) break;
        setTimeout(
          () => createSubcommand(commandName, subcommand, retries++),
          botCache.constants.milliseconds.SECOND * 30,
        );
        return;
      }

      command = validCommand;
    }
  }

  if (!command) {
    // If 10 minutes have passed something must have been wrong
    if (retries === 20) {
      return console.error(
        `Subcommand ${subcommand} unable to be created for ${commandName}`,
      );
    }

    // Try again in 30 seconds in case this command file just has not been loaded yet.
    setTimeout(
      () => createSubcommand(commandName, subcommand, retries++),
      botCache.constants.milliseconds.SECOND * 30,
    );
    return;
  }

  if (!command.subcommands) {
    command.subcommands = new Collection();
  }

  command.subcommands.set(subcommand.name, subcommand);
}

/** Use this function to send an embed with ease. */
export function sendEmbed(channelID: string, embed: Embed, content?: string) {
  const channel = cache.channels.get(channelID);
  if (!channel) return;

  if (
    !botHasChannelPermissions(
      channel.id,
      [
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
      ],
    )
  ) {
    return;
  }

  return sendMessage(channel.id, { content, embed, file: embed.embedFile });
}

/** Use this function to edit an embed with ease. */
export function editEmbed(message: Message, embed: Embed, content?: string) {
  return editMessage(message, { content, embed });
}

// Very important to make sure files are reloaded properly
let uniqueFilePathCounter = 0;
/** This function allows reading all files in a folder. Useful for loading/reloading commands, monitors etc */
export async function importDirectory(path: string) {
  const files = Deno.readDirSync(Deno.realPathSync(path));
  const folder = path.substring(path.indexOf("/src/") + 5);
  if (!folder.includes("/")) console.log(`Loading ${folder}...`);

  const directories: string[] = [];
  for (const file of files) {
    if (!file.name) continue;

    const currentPath = `${path}/${file.name}`;
    if (file.isFile) {
      await import(`file:///${currentPath}#${uniqueFilePathCounter}`);
      continue;
    }

    directories.push(currentPath);
  }

  // Wait untill all files are processed before processing folders. Important for nested subcommands
  for (const directory of directories) {
    importDirectory(directory);
  }

  uniqueFilePathCounter++;
}

export function getTime() {
  const now = new Date();
  const hours = now.getHours();
  const minute = now.getMinutes();

  let hour = hours;
  let amOrPm = `AM`;
  if (hour > 12) {
    amOrPm = `PM`;
    hour = hour - 12;
  }

  return `${hour >= 10 ? hour : `0${hour}`}:${
    minute >= 10 ? minute : `0${minute}`
  } ${amOrPm}`;
}
