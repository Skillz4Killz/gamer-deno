export class CommandContext {
    /** The data for this command. */
    data: CommandContextData;

    constructor(data: CommandContextData) {
        this.data = data;
    }

    /** The channel id this command occurred in. */
    get channelId(): string {
        return this.data.channelId;
    }
}

export interface CommandContextData {
    /** The channel id this command occurred in. */
    channelId: string;
}
