import type { Collection, Guild, Message, Permission } from "../../deps.ts";

export interface Command {
  name: string;
  aliases?: string[];
  dmOnly?: boolean;
  guildOnly?: boolean;
  nsfw?: boolean;
  permissionLevels?:
    | PermissionLevels[]
    | ((
      message: Message,
      command: Command,
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
  arguments?: CommandArgument[];
  subcommands?: Collection<string, Command>;
  usage?: string | string[];
  vipServerOnly?: boolean;
  // deno-lint-ignore no-explicit-any
  execute?: (message: Message, args: any, guild?: Guild) => unknown;
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

export interface Argument {
  name: string;
  execute: (
    arg: CommandArgument,
    parameter: string[],
    message: Message,
    command: Command,
  ) => unknown;
}

export interface Args {
  [key: string]: unknown;
}

export enum PermissionLevels {
  MEMBER,
  MODERATOR,
  ADMIN,
  SERVER_OWNER,
  VIP_SERVER,
  BOT_SUPPORT,
  BOT_DEVS,
  BOT_OWNER,
}
