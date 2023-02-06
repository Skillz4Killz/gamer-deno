import { Collection } from "@discordeno/bot";
import { GamerMessage } from "./GamerMessage";

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
}

export interface CommandArgument {
    /** The name of the argument. */
    name: string;
    /** The type of the argument that is required. */
    type: "string" | "subcommand";
    /** The default value of the argument if none was provided. */
    defaultValue?: string;
    /** Whether or not this argument is required. */
    required: boolean;
    /** Handler function to execute if this argument was missing. */
    missing: (message: GamerMessage) => unknown;

}