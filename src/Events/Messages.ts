import * as thisText from '../Utils/textFunction'
import { findBestAnswer } from '../Utils/knowledgeBase'
import { resetTimeout, userSessions } from '../Utils/sessionManager'

module.exports = {
    name: 'messages.upsert',
    async execute(WhatsAppClient: any, connectToWhatsApp: any, res: any) {
        const message = res.messages[0]
        const isMsg = message.message

        if (!isMsg || message.key.fromMe) return

        const sender = message.key.remoteJid
        if (!sender) return

        const textMessage = (isMsg.conversation || isMsg.extendedTextMessage?.text)?.trim()
        if (!textMessage) return

        if (!userSessions[sender]) {
            userSessions[sender] = { active: true }
            try {
                thisText.welcomeMessage(WhatsAppClient, sender)
            } catch (err) {
                console.error('Gagal kirim pesan pembuka:', err)
            }
            resetTimeout(sender, WhatsAppClient)
            return
        }

        resetTimeout(sender, WhatsAppClient)

        const answer = findBestAnswer(textMessage)

        try {
            if (answer) {
                await WhatsAppClient.sendMessage(sender, { text: answer })
            } else {
                thisText.notFoundKeyword(WhatsAppClient, sender)
            }
        } catch (err) {
            console.error('Gagal kirim jawaban:', err)
        }
    }
}
