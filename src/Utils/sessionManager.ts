import * as Config from '../../config.json'
import * as thisText from './textFunction'

interface Session {
    active: boolean
    timeout?: NodeJS.Timeout
}

export const userSessions: Record<string, Session> = {}

// Mengatur ulang timer tiap kali user kirim pesan baru
export function resetTimeout(sender: string, WhatsAppClient: any) {
    if (userSessions[sender]?.timeout) {
        clearTimeout(userSessions[sender].timeout)
    }

    userSessions[sender].timeout = setTimeout(async () => {
        try {
            thisText.closingMessage(WhatsAppClient, sender)
        } catch (err) {
            console.error('Gagal mengirim pesan timeout:', err)
        }

        userSessions[sender].active = false
        delete userSessions[sender]
    }, Config.timeout * 60 * 1000)
}