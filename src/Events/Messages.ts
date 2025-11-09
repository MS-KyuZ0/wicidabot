import * as thisText from '../Utils/textFunction'
import * as Config from '../../config.json'
import { keywordIndex, loadKnowledgeBase } from '../Utils/knowledgeBase'
import { resetTimeout, userSessions } from '../Utils/sessionManager'
import { similarity } from '../Utils/typoHandle'

loadKnowledgeBase()

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

        let hasAnswer = null
        let bestScore = 0
        const isMessage = textMessage.toLowerCase().normalize('NFKC').replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim()

        for (const [key, kb] of keywordIndex.entries()) {
            const regex = new RegExp(`\\b${key}\\b`)

            if (regex.test(isMessage)) {
                hasAnswer = kb
                break
            }

            const score = similarity(key, isMessage)

            if (score > bestScore && score >= Config.typoThreshold){
                hasAnswer = kb
                bestScore = score
            }
        }

        if (!hasAnswer) return thisText.notFoundKeyword(WhatsAppClient, sender)

        try {
            await hasAnswer.execute(WhatsAppClient, sender)
            thisText.moreQuestion(WhatsAppClient, sender)
        } catch (err) {
            console.log(`[KnowledgeBase] Error executing keyword: ${err}`)
            thisText.notFoundKeyword(WhatsAppClient, sender)
        }
    }
}
