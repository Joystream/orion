import { detectAll } from 'tinyld'
import { Video } from '../model'

function cleanString(input: string): string {
  // First, remove URLs. This pattern targets a broad range of URLs.
  let cleanedString = input.replace(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/gu, '')

  // Remove hashtags. This regex looks for the '#' symbol followed by one or more word characters.
  cleanedString = cleanedString.replace(/#\w+/gu, '')

  return cleanedString
}

export function predictLanguage(text: string): { lang: string; accuracy: number } | undefined {
  const cleanedText = cleanString(text)

  // console.log(`Cleaned text: ${cleanedText}`)
  // Get the most accurate language prediction
  return detectAll(cleanedText).length ? detectAll(cleanedText)[0] : undefined
}

export function predictVideoLanguage({
  title,
  description,
}: Pick<Video, 'title' | 'description'>): string | undefined {
  let detectedLang: string | undefined

  const titleLang = predictLanguage(title ?? '')
  if (titleLang && titleLang?.accuracy < 0.5) {
    const titleAndDescriptionLang = predictLanguage(`${title} ${description}`)
    if (titleAndDescriptionLang && titleAndDescriptionLang?.accuracy > titleLang?.accuracy) {
      // then
      detectedLang = titleAndDescriptionLang.lang
    } else {
      detectedLang = titleLang.lang
    }
  }

  return detectedLang
}
