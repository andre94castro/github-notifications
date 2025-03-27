/**
 * Create options for GitHub API requests
 * @param {string} path - API endpoint path
 * @returns {Object} - HTTP request options
 */
export const createGitHubOptions = (path) => {
  // Ensure token is available
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not available')
  }

  return {
    hostname: 'api.github.com',
    path,
    headers: {
      'User-Agent': 'Node.js',
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json'
    }
  }
}
