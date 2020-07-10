import { Client, PresenceData } from 'discord.js';
import { Command } from '../commands/commands';
import LocaleService from '../services/LocaleService';

export interface Bot {
    token: string;
    name: string;
    lang: 'en' | 'fr',
    clientID: string;
    enabled: boolean;
    guildsID: string[];
    commands: string[];
    events: string[];
    commandStart: string;
    _id: any;
    presence?: PresenceData;
}

export interface BotInstance {
    client: Client;
    config: Bot;
    commands: Command[];
    localeService: LocaleService;
}

export interface BotPacket<T = undefined> {
    type: 'reboot' | 'resolved-role' | 'resolved-guild';
    data: T;
}

export interface CorePacket<T = undefined> {
    type: 'start' | 'reboot' | 'shutdown' | 'reload-commands' | 'reload-events' | 'external-reboot'
        | 'resolve-role' | 'resolve-guild';
    data: T;
}
