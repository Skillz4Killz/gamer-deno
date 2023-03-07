import { FULL_STRING_MATCHES_SNOWFLAKE_REGEX } from "./constants.js";

export function snowflakeToTimestamp(id: string) {
    return Math.floor(Number(id) / 4194304) + 1420070400000;
}

export function validateSnowflake(snowflake: bigint | string) {
    return FULL_STRING_MATCHES_SNOWFLAKE_REGEX.test(snowflake.toString());
}
