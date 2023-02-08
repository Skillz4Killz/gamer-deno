export const YEAR = 1000 * 60 * 60 * 24 * 30 * 12;
export const MONTH = 1000 * 60 * 60 * 24 * 30;
export const WEEK = 1000 * 60 * 60 * 24 * 7;
export const DAY = 1000 * 60 * 60 * 24;
export const HOUR = 1000 * 60 * 60;
export const MINUTE = 1000 * 60;
export const SECOND = 1000;

export function humanizeMilliseconds(milliseconds: number) {
    const years = Math.floor(milliseconds / YEAR);
    const months = Math.floor((milliseconds % YEAR) / MONTH);
    const weeks = Math.floor(((milliseconds % YEAR) % MONTH) / WEEK);
    const days = Math.floor((((milliseconds % YEAR) % MONTH) % WEEK) / DAY);
    const hours = Math.floor(((((milliseconds % YEAR) % MONTH) % WEEK) % DAY) / HOUR);
    const minutes = Math.floor((((((milliseconds % YEAR) % MONTH) % WEEK) % DAY) % HOUR) / MINUTE);
    const seconds = Math.floor(((((((milliseconds % YEAR) % MONTH) % WEEK) % DAY) % HOUR) % MINUTE) / 1000);

    const yearString = years ? `${years}y ` : "";
    const monthString = months ? `${months}mo ` : "";
    const weekString = weeks ? `${weeks}w ` : "";
    const dayString = days ? `${days}d ` : "";
    const hourString = hours ? `${hours}h ` : "";
    const minuteString = minutes ? `${minutes}m ` : "";
    const secondString = seconds ? `${seconds}s ` : "";

    return `${yearString}${monthString}${weekString}${dayString}${hourString}${minuteString}${secondString}`.trimEnd() || "1s";
}
