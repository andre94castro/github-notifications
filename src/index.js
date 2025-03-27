#!/usr/bin/env node

import { loadEnv } from './utils/env.js'
import { getOpenPr, getPendingReviews, getOpenPRDetails } from './services/github.js'

/**
 * Main function to demonstrate the GitHub API functionality
 * Shows open PRs, pending reviews, and gets details for each PR
 */
async function main() {
  // Load environment variables - exit if not successful
  if (!loadEnv()) {
    console.error('Failed to load required environment variables. Exiting.')
    process.exit(1)
  }

  try {
    // Get user's open pull requests
    const openPullRequests = await getOpenPr()
    console.log('My Open PRs:', openPullRequests)

    // Get PRs pending user's review
    const pendingReviews = await getPendingReviews()
    console.log('PRs pending my review:', pendingReviews)

    // For each PR, get additional details
    for (const pr of [...openPullRequests, ...pendingReviews]) {
      const reviewers = await getOpenPRDetails(pr.number, pr.repository)
      console.log('Reviewers:', reviewers)
    }
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
