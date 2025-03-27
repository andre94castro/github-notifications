import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import fs from 'fs'

/**
 * Load environment variables from .env file
 * @returns {boolean} - True if required environment variables are available
 */
export const loadEnv = () => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const rootDir = path.dirname(path.dirname(__dirname))

    // Look in the project root directory
    const envPath = path.join(rootDir, '.env')

    // Check if .env file exists
    if (!fs.existsSync(envPath)) {
      console.error('Could not find .env file in project root')
      return false
    }

    // Load the env file
    const result = dotenv.config({ path: envPath })
    if (result.error) {
      console.error(`Error loading .env: ${result.error.message}`)
      return false
    }

    // Verify required variables are present
    if (!process.env.GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN is missing from your .env file')
      return false
    }

    if (!process.env.GITHUB_USERNAME) {
      console.error('GITHUB_USERNAME is missing from your .env file')
      return false
    }

    // Environment is properly loaded
    return true
  } catch (err) {
    console.error(`Error loading environment: ${err.message}`)
    return false
  }
}

/**
 * Verify GitHub token is available
 * @returns {boolean} - True if token is available
 */
export const verifyToken = () => {
  return !!process.env.GITHUB_TOKEN && !!process.env.GITHUB_USERNAME
}
