import * as Config from '../../config.json'

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

    // Set ulang 5 menit (300.000 ms)
    userSessions[sender].timeout = setTimeout(async () => {
        try {
            await WhatsAppClient.sendMessage(sender, { text: Config.tidakAdaRespon })
        } catch (err) {
            console.error('Gagal mengirim pesan timeout:', err)
        }

        userSessions[sender].active = false
        delete userSessions[sender]
    }, Config.timeout * 60 * 1000)
}