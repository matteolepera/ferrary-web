/** Oltre questa lunghezza un racconto merita una sezione sua; sotto, sta nell'apertura */
const SHORT_STORY = 220

/** Una descrizione da due o tre righe: abbastanza breve da stare sotto il nome */
export const isShortStory = (text: string) => text.trim().length <= SHORT_STORY
