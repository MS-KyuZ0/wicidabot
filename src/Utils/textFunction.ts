export function welcomeMessage(WhatsAppClient: any, sender: string){
    WhatsAppClient.sendMessage(sender, { text: `Hai! 👋 Saya adalah asisten wicida! Apakah ada yang bisa saya bantu?`})
}

export function closingMessage(WhatsAppClient: any, sender: string){
    WhatsAppClient.sendMessage(sender, { text: `Karena belum ada respon, kami izin akhiri sesi chat ini. Namun jangan khawatir, kamu bisa memulai percakapan baru nantinya.`})
    WhatsAppClient.sendMessage(sender, { text: `Terima kasih sudah menghubungi *WhatsApp Wicida Support* senang dapat membantu Anda.`})
}

export function notFoundKeyword(WhatsAppClient: any, sender: string){
    WhatsAppClient.sendMessage(sender, {text: `Maaf untuk hal ini kamu perlu datang ke BAAK untuk tanya langsung atau perlu saya bantu untuk langsung hubungkan dengan Admin BAAK ?`})
}

export function moreQuestion(WhatsAppClient: any, sender: string){
    WhatsAppClient.sendMessage(sender, {text: `Apakah masih ada pertanyaan lain ? Jika tidak ada kamu bisa abaikan pesan ini.`})
}