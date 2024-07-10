import DetectLanguage from 'detectlanguage'

const languageDetectionApiKey = process.env.DETECTLANGUAGE_API_KEY

const languageDetectionInstace = new DetectLanguage(languageDetectionApiKey ?? '')

function cleanString(input: string): string {
  // First, remove URLs. This pattern targets a broad range of URLs.
  let cleanedString = input.replace(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/gu, '')

  // Remove hashtags. This regex looks for the '#' symbol followed by one or more word characters.
  cleanedString = cleanedString.replace(/#\w+/gu, '')

  return cleanedString
}

export async function predictLanguageWithProvider(texts: string[]) {
  const cleanedTexts = texts.map(cleanString)
  const result = await languageDetectionInstace.detect(cleanedTexts)
  return result.map((row) => row[0]?.language)
}
