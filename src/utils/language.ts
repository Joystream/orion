import { detectAll } from 'tinyld'

function cleanString(input: string): string {
  // First, remove URLs. This pattern targets a broad range of URLs.
  let cleanedString = input.replace(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/gu, '')

  // Remove hashtags. This regex looks for the '#' symbol followed by one or more word characters.
  cleanedString = cleanedString.replace(/#\w+/gu, '')

  return cleanedString
}

function predictLanguage(text: string): { lang: string; accuracy: number } | undefined {
  const cleanedText = cleanString(text)

  // Get the most accurate language prediction
  return detectAll(cleanedText)?.[0]
}

export function predictVideoLanguage({ title, description }: any): string | undefined {
  let detectedLang: string | undefined

  const titleLang = predictLanguage(title ?? '')

  detectedLang = titleLang?.lang

  if ((titleLang?.accuracy || 0) < 0.5) {
    const titleAndDescriptionLang = predictLanguage(`${title} ${description}`)
    if ((titleAndDescriptionLang?.accuracy || 0) > (titleLang?.accuracy || 0)) {
      // then
      detectedLang = titleAndDescriptionLang?.lang
    }
  }

  return detectedLang
}
