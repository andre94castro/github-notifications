import { spawn } from 'child_process'
import fs from 'fs/promises'
import { loadEnv } from '../utils/env.js'
import { getOpenPr, getPendingReviews, getAssignedPRs, checkApiStatus } from '../services/github.js'
import { dashboardTemplate, errorTemplate } from './templates.js'

/**
 * Generate and display the GitHub dashboard
 */
async function generateDashboard() {
  // Load environment variables - show error if not loaded
  if (!loadEnv()) {
    return errorTemplate('GitHub Token not found. Check your .env file.')
  }

  try {
    // Check API status first
    const apiStatus = await checkApiStatus()
    if (!apiStatus) {
      return errorTemplate('GitHub API connection issue. Check your token and network.')
    }

    const [openPRs, pendingReviews, assignedPRs] = await Promise.all([
      getOpenPr(),
      getPendingReviews(),
      getAssignedPRs()
    ])

    return dashboardTemplate(openPRs, pendingReviews, assignedPRs)
  } catch (error) {
    console.error(error)
    return errorTemplate(`Error fetching GitHub data: ${error.message}`)
  }
}

/**
 * Create a temporary HTML file and launch Chrome to display it
 */
async function main() {
  try {
    const html = await generateDashboard()
    const tempFile = `/tmp/github-dashboard-${Date.now()}.html`
    await fs.writeFile(tempFile, html)

    // Launch Chrome
    const cmd = `google-chrome-stable --app="file://${tempFile}"`

    spawn('bash', ['-c', cmd], {
      detached: true,
      stdio: 'ignore'
    }).unref()
  } catch (error) {
    console.error('Error generating dashboard:', error)
    process.exit(1)
  }
}

// Execute if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { generateDashboard, main }
