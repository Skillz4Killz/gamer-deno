// TODO: dotenv - every config from .env file should be brought into here and typechecked.
export const configs = {
    /** The command prefix for message based commands. */
    prefix: "",
    /** Configs related to specific platforms. */
    platforms: {
        /** Configs related to discord platform. */
        discord: {
            token: "",
        },
        /** Configs related to guilded platform. */
        guilded: {
            token: "",
        },
    },
};
