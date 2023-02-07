export function snowflakeToTimestamp(id: string) {
    return Math.floor(Number(id) / 4194304) + 1420070400000;
}
