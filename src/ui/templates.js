/**
 * HTML templates for the dashboard UI
 */

/**
 * Render the list of pull requests as HTML
 * @param {Array} prs - Array of pull request objects
 * @returns {string} - HTML string
 */
export function renderPrList(prs) {
  if (prs.length === 0) {
    return '<div class="empty-state">No pull requests found</div>'
  }

  return `
    <ul class="pr-list">
        ${prs.map(pr => `
            <li class="pr-item">
                <div class="pr-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"></path>
                    </svg>
                </div>
                <div class="pr-content">
                    <div class="pr-title">
                        <a href="${pr.url}" target="_blank">${pr.title}</a>
                    </div>
                    <div class="pr-meta">
                        ${pr.repository ? pr.repository.replace('https://api.github.com/repos/', '') : ''} • #${pr.number} • ${pr.state}
                    </div>
                </div>
            </li>
        `).join('')}
    </ul>
    `
}

/**
 * Create dashboard HTML template
 * @param {Array} openPRs - User's open pull requests
 * @param {Array} pendingReviews - PRs pending user's review
 * @param {Array} assignedPRs - PRs assigned to user
 * @returns {string} - Complete HTML for dashboard
 */
export function dashboardTemplate(openPRs, pendingReviews, assignedPRs) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitHub Notifications</title>
        <style>
            :root {
                --bg-color: #0d1117;
                --text-color: #c9d1d9;
                --border-color: #30363d;
                --header-bg: #161b22;
                --card-bg: #161b22;
                --accent-color: #58a6ff;
                --green: #2ea043;
                --yellow: #d29922;
                --red: #f85149;
            }
            
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                background-color: var(--bg-color);
                color: var(--text-color);
                line-height: 1.5;
                height: 100vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .container {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background-color: var(--header-bg);
                border-bottom: 1px solid var(--border-color);
            }
            
            .dashboard-header h1 {
                margin: 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .dashboard-header .actions {
                display: flex;
                gap: 10px;
            }
            
            .btn {
                padding: 5px 16px;
                font-size: 14px;
                font-weight: 500;
                line-height: 20px;
                cursor: pointer;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                background-color: #21262d;
                color: var(--text-color);
                transition: 0.2s;
            }
            
            .btn:hover {
                background-color: #30363d;
            }
            
            .btn-primary {
                background-color: var(--green);
                border-color: rgba(240, 246, 252, 0.1);
            }
            
            .btn-primary:hover {
                background-color: #2c974b;
            }
            
            .content-area {
                flex: 1;
                overflow: hidden;
                display: flex;
                padding: 16px;
                gap: 16px;
            }
            
            .column {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .section {
                display: flex;
                flex-direction: column;
                flex: 1;
                overflow: hidden;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                margin-bottom: 16px;
            }
            
            .section-header {
                padding: 16px;
                background-color: var(--header-bg);
                border-bottom: 1px solid var(--border-color);
                font-size: 16px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .badge {
                background-color: rgba(110, 118, 129, 0.4);
                border-radius: 10px;
                padding: 0 6px;
                font-size: 12px;
                font-weight: 500;
                min-width: 20px;
                text-align: center;
            }
            
            .pr-list-container {
                flex: 1;
                overflow-y: auto;
            }
            
            .pr-list {
                list-style: none;
                margin: 0;
                padding: 0;
            }
            
            .pr-item {
                padding: 16px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                gap: 10px;
            }
            
            .pr-item:last-child {
                border-bottom: none;
            }
            
            .pr-icon {
                font-size: 16px;
                color: var(--accent-color);
                min-width: 16px;
            }
            
            .pr-content {
                flex: 1;
            }
            
            .pr-title {
                font-weight: 600;
                margin-bottom: 4px;
            }
            
            .pr-title a {
                color: var(--text-color);
                text-decoration: none;
            }
            
            .pr-title a:hover {
                color: var(--accent-color);
                text-decoration: underline;
            }
            
            .pr-meta {
                font-size: 12px;
                color: #8b949e;
            }
            
            .empty-state {
                padding: 40px;
                text-align: center;
                color: #8b949e;
            }
            
            .github-icon {
                width: 24px;
                height: 24px;
                fill: currentColor;
            }
            
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #8b949e;
                border-top: 1px solid var(--border-color);
            }
            
            /* Custom scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
            }
            
            ::-webkit-scrollbar-track {
                background: var(--bg-color);
            }
            
            ::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: #666;
            }
            
            @media (prefers-color-scheme: light) {
                :root {
                    --bg-color: #ffffff;
                    --text-color: #24292f;
                    --border-color: #d0d7de;
                    --header-bg: #f6f8fa;
                    --card-bg: #f6f8fa;
                    --accent-color: #0969da;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="dashboard-header">
                <h1>
                    <svg class="github-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                    GitHub Dashboard
                </h1>
                <div class="actions">
                    <a href="https://github.com/pulls" target="_blank" class="btn">Open GitHub</a>
                    <button onclick="window.location.reload()" class="btn btn-primary">Refresh</button>
                    <button onclick="window.close()" class="btn">Close</button>
                </div>
            </div>
            
            <div class="content-area">
                <!-- My Pull Requests -->
                <div class="column">
                    <div class="section">
                        <div class="section-header">
                            <span>My Pull Requests</span>
                            <span class="badge">${openPRs.length}</span>
                        </div>
                        <div class="pr-list-container">
                            ${renderPrList(openPRs)}
                        </div>
                    </div>
                </div>
                
                <!-- Pending Reviews -->
                <div class="column">
                    <div class="section">
                        <div class="section-header">
                            <span>Review Requests</span>
                            <span class="badge">${pendingReviews.length}</span>
                        </div>
                        <div class="pr-list-container">
                            ${renderPrList(pendingReviews)}
                        </div>
                    </div>
                </div>
                
                <!-- Assigned PRs -->
                <div class="column">
                    <div class="section">
                        <div class="section-header">
                            <span>Assigned Pull Requests</span>
                            <span class="badge">${assignedPRs.length}</span>
                        </div>
                        <div class="pr-list-container">
                            ${renderPrList(assignedPRs)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>Last updated: ${new Date().toLocaleString()}</p>
            </div>
        </div>
        
        <script>
            // Refresh the page every 5 minutes
            setTimeout(() => window.location.reload(), 5 * 60 * 1000);
            
            // Handle keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                // Close on Escape key
                if (e.key === 'Escape') {
                    window.close();
                }
                
                // Refresh on F5 or Ctrl+R
                if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                    e.preventDefault();
                    window.location.reload();
                }
            });
            
            // Open links in external browser
            document.addEventListener('click', function(e) {
                const target = e.target.closest('a');
                if (target && target.href && target.href.startsWith('http')) {
                    e.preventDefault();
                    window.open(target.href, '_blank');
                }
            });
        </script>
    </body>
    </html>
    `
}

/**
 * Create error page HTML template
 * @param {string} errorMessage - Error message to display
 * @returns {string} - HTML for error page
 */
export function errorTemplate(errorMessage) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitHub Dashboard Error</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                background-color: #0d1117;
                color: #c9d1d9;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .error-container {
                text-align: center;
                padding: 2rem;
                max-width: 500px;
                background-color: #161b22;
                border-radius: 6px;
                border: 1px solid #30363d;
            }
            .error-icon {
                font-size: 48px;
                margin-bottom: 1rem;
                color: #f85149;
            }
            .error-message {
                margin-bottom: 2rem;
            }
            .btn {
                padding: 0.5rem 1rem;
                background-color: #21262d;
                color: #c9d1d9;
                border: 1px solid #30363d;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                margin: 0 5px;
            }
            .btn:hover {
                background-color: #30363d;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h2>Error</h2>
            <div class="error-message">${errorMessage}</div>
            <button onclick="window.location.reload()" class="btn">Try Again</button>
            <button onclick="window.close()" class="btn">Close</button>
        </div>
        <script>
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    window.close();
                }
            });
        </script>
    </body>
    </html>
    `
}
