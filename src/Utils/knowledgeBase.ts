import * as Config from '../../config.json'

export function findBestAnswer(input: string): string | null {
    const knowledgeBase = Config.knowledgeBase as Record<string, {aliases: string[], answer: string}>
    const inputLower = input.toLowerCase().normalize('NFKC')
        .replace(/[^\w\s]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    for (const key in knowledgeBase) {
        const {aliases, answer} = knowledgeBase[key]

        for (const alias of aliases){
            const isText = alias.toLocaleLowerCase().normalize("NFKC").trim()
            const regex = new RegExp(`\\b${isText}\\b`)
            if (regex.test(inputLower)){
                return answer
            }
        }
    }

    return null
}