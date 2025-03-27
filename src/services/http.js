import https from 'node:https'

/**
 * Make a HTTP request to the GitHub API
 * @param {Object} options - HTTP request options
 * @returns {Promise<Object>} - Parsed JSON response
 */
export const makeRequest = (options) => {
  return new Promise((resolve, reject) => {
    const req = https.get(options, (res) => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => {
        // Check for rate limiting
        if (res.statusCode === 403 && res.headers['x-ratelimit-remaining'] === '0') {
          reject(new Error(`GitHub API rate limit exceeded. Resets at ${new Date(parseInt(res.headers['x-ratelimit-reset']) * 1000)}`))
          return
        }

        // Authentication errors
        if (res.statusCode === 401) {
          reject(new Error(`GitHub API authentication failed: ${data}`))
          return
        }

        // Check for other error status codes
        if (res.statusCode >= 400) {
          reject(new Error(`GitHub API returned status ${res.statusCode}: ${data}`))
          return
        }

        try {
          resolve(JSON.parse(data))
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error.message}`))
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.end()
  })
}
