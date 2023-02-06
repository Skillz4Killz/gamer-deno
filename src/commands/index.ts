import { Gamer } from 'bot';
import ping from './general/ping';

export function loadCommands() {
    Gamer.commands.set(ping.name, ping);
}