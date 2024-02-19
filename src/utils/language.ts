import { detect } from 'tinyld'

function cleanString(input: string): string {
  // Remove symbols, numbers, and emojis
  // The regex [\p{P}\p{S}\p{N}\p{M}] matches all kinds of punctuation, symbols, numbers, and mark characters (including emojis)
  // \p{P} matches any kind of punctuation character
  // \p{S} matches any kind of math symbol, currency sign, or modifier symbol
  // \p{N} matches any kind of numeric character in any script
  // \p{M} matches characters that are combined with other characters, often used for emojis and diacritics
  // The 'u' flag enables Unicode support, allowing the regex to match Unicode characters and properties
  const cleanedString = input.replace(/[\p{P}\p{S}\p{N}\p{M}]/gu, '')
  return cleanedString.toLowerCase()
}

// Example usage
export const predictLanguage = (text: string): string | undefined => {
  const cleanedText = cleanString(text)
  return detect(cleanedText) || undefined
}
