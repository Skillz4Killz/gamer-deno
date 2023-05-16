import { Collection } from "@discordeno/bot";
import { GamerMessage } from "./GamerMessage.js";

export enum Platforms {
    Discord,
    Guilded,
}

export interface CommandContext {
    /** The channel id this command was executed in. */
}

export interface Argument {
    /** The name of the argument. */
    name: string;
    /** The argument handler to execute. */
    execute: (argument: CommandArgument, params: string[], message: GamerMessage, command: Command) => unknown;
}

export interface Command {
    /** The name of the command. */
    name: string;
    /** The aliases that this command can also be triggerred by as well as translated names. */
    aliases: string[];
    /** The arguments that this command requires to be executed. */
    arguments: CommandArgument[];
    /** The subcommands that this command has. */
    subcommands?: Collection<string, Command>;
    /** Whether or not this command should be ran in ONLY prefix form. */
    prefixOnly?: boolean;
    /** Whether or not this command should be ran in vip only servers. */
    vipOnly?: boolean;
    /** The level of permission required to execute this command. */
    requiredPermissionLevel?: PermissionLevels;
    /** Command execution handler. */
    execute: (message: GamerMessage, args: any) => Promise<unknown>;
}

export interface CommandArgument {
    /** The name of the argument. */
    name: string;
    /** The type of the argument that is required. */
    type: "string" | "subcommand" | "user" | "number" | "...string" | "boolean" | "role" | "channel";
    /** The default value of the argument if none was provided. */
    defaultValue?: string | number;
    /** Whether or not this argument is required. */
    required: boolean;
    /** Handler function to execute if this argument was missing. */
    missing?: (message: GamerMessage) => unknown;
    /** Subarguments */
    arguments?: CommandArgument[];
    /** If the type is string or subcommand you can provide literals. The argument MUST be exactly the same as the literals to be accepted. For example, you can list the subcommands here to make sure it matches. */
    literals?: (string | { name: string; value: string | number })[];
    /** If the type is string, this will force this argument to be lowercase. */
    lowercase?: boolean;
    /** If the type is number set the minimum amount. By default the minimum is 0 */
    minimum?: number;
    /** If the type is a number set the maximum amount. By default this is disabled. */
    maximum?: number;
    /** If the type is a number, you can use this to allow/disable non-integers. By default this is false. */
    allowDecimals?: boolean;
}

export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export enum PermissionLevels {
    Admin,
}

export interface Task {
    /** The name of the task. */
    name: string;
    /** The time in milliseconds in which to run this task. */
    interval: number;
    /** The handler to execute when it is time for this task. */
    execute: () => unknown;
}

export enum Milliseconds {
    Year = 1000 * 60 * 60 * 24 * 30 * 12,
    Month = 1000 * 60 * 60 * 24 * 30,
    Week = 1000 * 60 * 60 * 24 * 7,
    Day = 1000 * 60 * 60 * 24,
    Hour = 1000 * 60 * 60,
    Minute = 1000 * 60,
    Second = 1000,
}