import { User } from './User.js'

export class PullRequest {
  constructor(data) {
    this.number = data.number
    this.title = data.title
    this.url = data.html_url
    this.requestedReviewers = data.requested_reviewers?.map(reviewer => new User(reviewer)) || []
    this.comments = data.comments
    this.review_comments = data.review_comments
    this.author = new User(data.user)
    this.createdAt = new Date(data.created_at)
    this.updatedAt = new Date(data.updated_at)
  }
}
