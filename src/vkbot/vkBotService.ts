import {Message, Payload, VkBotPayload} from "./payloads/vkBotPayloads";
import Logger from "../logger/logger"
import VkMessageService from "./messages/vkMessageService"
import VkBotKeyboardService from "./keyboard/vkBotKeyboardService";
import {isMatch, isMatchInUpperCase} from "../utils/regexUtils";
import VkVisaService from "./vkVisaService"
import {
    VK_IN_CHECK_PUBLIC_NOTICE_REGEX, VK_IN_CHECK_VISA_REGEX, VK_IN_MESSAGE_PREFIX_REGEX,
    VK_IN_WAKE_UP_REGEX
} from "./vkInputMessagePatterns";


class VkBotService {

    processInputMessage(botPayload : VkBotPayload) : void {

        let inputMessage : Message = botPayload.object;
        Logger.logInfo(inputMessage);

        if (inputMessage.payload){
            this._processMessagePayload(botPayload.object);
            return
        }

        if (inputMessage.text && isMatchInUpperCase(inputMessage.text, VK_IN_MESSAGE_PREFIX_REGEX)){
            this._processMessageText(inputMessage)
            return;
        }
    }

    private _processMessageText(inputMessage : Message) : void {
        inputMessage.text = inputMessage.text.toUpperCase();
        let text = inputMessage.text.toUpperCase();
        if (isMatch(text, VK_IN_WAKE_UP_REGEX)){
            this._markAsRead(inputMessage)
            VkMessageService.sendWakeupMessage(inputMessage.peer_id, inputMessage.group_id);
            return
        }
        if (isMatch(text, VK_IN_CHECK_PUBLIC_NOTICE_REGEX)) {
            this._markAsRead(inputMessage)
            VkVisaService.processGetPublicNoticeMessage(inputMessage);
            return;
        }
        if (isMatch(text, VK_IN_CHECK_VISA_REGEX)) {
            this._markAsRead(inputMessage)
            VkVisaService.processGetVisaStatus(inputMessage);
            return;
        }
    }

    private _processMessagePayload(inputMessage : Message) : void {
        Logger.logInfo(inputMessage);
        this._markAsRead(inputMessage)

        let payload : Payload = JSON.parse(inputMessage.payload);

        let peerId : number = inputMessage.peer_id;
        let groupId : number = inputMessage.group_id;

        if (payload.button) {
            VkBotKeyboardService.processKeyboardInput(payload.button, peerId, groupId);
            return;
        }

        if (payload.command === "start"){
            VkMessageService.sendWelcomeMessage(peerId, groupId);
            return;
        }
    }

    private _markAsRead(message : Message) : void {
        VkMessageService.markAsRead(message.peer_id, message.group_id);
    }
}

export default new VkBotService();