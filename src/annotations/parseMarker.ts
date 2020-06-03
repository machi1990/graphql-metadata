import safeEval from 'safe-eval'
import { TypeOrDescription } from 'src/definitions'

/**
 * Parse marker annotations.
 * Examples:
 * ```
 * @marker
 * @marker data
 * @marker create:false, create:"test"
 * ``
 *
 * @param {string} marker
 * @param {TypeOrDescription|string} description
 * @returns {object}
 */
export function parseMarker(marker: string, definition: TypeOrDescription): any | boolean {
  let description: string;
  if (typeof definition === "string") {
    description = definition;
  } else {
    description = definition.description
  }

  if (description) {
    const start = `@${marker}`
    let line = description.split('\n').map(line => line.trim())
      .find(line => line.startsWith(start))
    if (!line) {
      return undefined
    }
    line = line.substr(start.length).trim()
    if (line === '') {
      return true
    }
    const entries = line.split(',')
    let obj = {}
    for (const entry of entries) {
      const [key, value] = entry.split(':')
      if (key && value) {
        try {
          obj[key.trim()] = safeEval(value)
        } catch (e) {
          console.error(`Can't parse annotation ${line}: ${e.message}`)
        }
      } else if (key) {
        try {
          obj = safeEval(key)
        } catch (e) {
          console.error(`Can't parse annotation ${line}: ${e.message}`)
        }
      }
    }
    return obj
  }
  return undefined
}