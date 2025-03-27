import { createGitHubOptions } from '../utils/config.js'
import { makeRequest } from './http.js'
import { PullRequest } from '../models/PullRequest.js'
import { SearchResult } from '../models/SearchResult.js'

const ensureEnvironmentLoaded = () => {
  if (!process.env.GITHUB_USERNAME || !process.env.GITHUB_TOKEN) {
    throw new Error('Required environment variables not loaded')
  }
}

/**
 * Extract repository name from repository URL
 * @param {string} repoUrl - Repository URL
 * @returns {string} - Repository name in format "owner/repo"
 */
const extractRepoName = (repoUrl) => {
  // If the URL is in the format "https://api.github.com/repos/owner/repo"
  if (repoUrl && repoUrl.includes('/repos/')) {
    // Extract just the "owner/repo" part
    return repoUrl.split('/repos/')[1]
  }

  // If it's already in the "owner/repo" format
  return repoUrl
}

/**
 * Get details for a specific PR
 * @param {number} prNumber - Pull request number
 * @param {string} repo - Repository name or URL
 * @returns {Promise<PullRequest>} - Pull request details
 */
export const getOpenPRDetails = async (prNumber, repo) => {
  ensureEnvironmentLoaded()
  const repoName = extractRepoName(repo)
  const options = createGitHubOptions(`/repos/${repoName}/pulls/${prNumber}`)
  const data = await makeRequest(options)
  return new PullRequest(data)
}

/**
 * Get open pull requests created by the user
 * @returns {Promise<Array>} - List of open pull requests
 */
export const getOpenPr = async () => {
  ensureEnvironmentLoaded()
  const username = process.env.GITHUB_USERNAME
  const options = createGitHubOptions(`/search/issues?q=is:pr+is:open+author:${username}`)
  const data = await makeRequest(options)
  const searchResult = new SearchResult(data)
  return searchResult.items
}

/**
 * Get pull requests where the user is requested as a reviewer
 * @returns {Promise<Array>} - List of PRs pending review
 */
export const getPendingReviews = async () => {
  ensureEnvironmentLoaded()
  const username = process.env.GITHUB_USERNAME
  const options = createGitHubOptions(`/search/issues?q=is:pr+is:open+review-requested:${username}`)
  const data = await makeRequest(options)
  const searchResult = new SearchResult(data)
  return searchResult.items
}

/**
 * Get pull requests assigned to the user
 * @returns {Promise<Array>} - List of assigned PRs
 */
export const getAssignedPRs = async () => {
  ensureEnvironmentLoaded()
  const username = process.env.GITHUB_USERNAME
  const options = createGitHubOptions(`/search/issues?q=is:pr+is:open+assignee:${username}`)
  const data = await makeRequest(options)
  const searchResult = new SearchResult(data)
  return searchResult.items
}

/**
 * Check GitHub API connection status
 * @returns {Promise<boolean>} - True if API is accessible
 */
export const checkApiStatus = async () => {
  try {
    ensureEnvironmentLoaded()
    const options = createGitHubOptions('/user')
    await makeRequest(options)
    return true
  } catch (error) {
    console.error('GitHub API status check failed:', error.message)
    return false
  }
}
