import { MessageEmbed, StringResolvable } from 'discord.js';

/**
 *
 * The name of all the applicable plans
 */
export type PlanName = 'SEND_MSG' | 'DELETE_MSG' | 'EDIT_MSG' | 'REBOOT_PACKET' | 'REMOVE_ROLE' | 'DELETE_PRIVATE_MSG';


/**
 * The different types of moment input
 */
export type MomentInput = Date | number | string;


/**
 * The different types of messages that can be sent
 */
export type MessageType = StringResolvable | MessageEmbed;
