#!/usr/bin/env node

import { loadEnv } from '../utils/env.js'
import { getOpenPr, getPendingReviews, getAssignedPRs, checkApiStatus } from '../services/github.js'

/**
 * Generate output for Waybar GitHub module
 * Displays counts of open PRs, pending reviews, and assigned PRs
 */
async function getWaybarOutput() {
  // Load environment variables - show error if not loaded
  if (!loadEnv()) {
    console.log(JSON.stringify({
      text: ' !',
      alt: 'error',
      tooltip: 'GitHub Token not found\nCheck your .env file',
      class: 'error',
      percentage: 0
    }))
    return
  }

  // Check API status
  const apiStatus = await checkApiStatus()
  if (!apiStatus) {
    console.log(JSON.stringify({
      text: ' ⚠',
      alt: 'error',
      tooltip: 'GitHub API connection issue\nCheck your token and network',
      class: 'error',
      percentage: 0
    }))
    return
  }

  try {
    // Run all queries in parallel for efficiency
    const [openPRs, pendingReviews, assignedPRs] = await Promise.all([
      getOpenPr(),
      getPendingReviews(),
      getAssignedPRs()
    ])

    // Count items in each category
    const openPRsCount = openPRs.length
    const pendingReviewsCount = pendingReviews.length
    const assignedPRsCount = assignedPRs.length

    // Total notification count
    const notificationCount = openPRsCount + pendingReviewsCount + assignedPRsCount

    // Create a detailed tooltip
    const tooltip = [
      `Open PRs: ${openPRsCount}`,
      `Pending Reviews: ${pendingReviewsCount}`,
      `Assigned PRs: ${assignedPRsCount}`,
      '───────────────',
      'Click for details'
    ].join('\n')

    // Always include the icon, vary the text
    console.log(JSON.stringify({
      text: ` ${notificationCount > 0 ? `${openPRsCount}  ${pendingReviewsCount}  ${assignedPRsCount}` : '0'}`,
      alt: 'github',
      tooltip,
      class: notificationCount > 0 ? 'has-alerts' : 'no-alerts'
    }))
  } catch (error) {
    console.error(error)
    console.log(JSON.stringify({
      text: ' !',
      alt: 'error',
      tooltip: `GitHub API Error: ${error.message}`,
      class: 'error',
      percentage: 0
    }))
  }
}

// Execute if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  getWaybarOutput()
}

export { getWaybarOutput }
