import { User } from './User.js'

export class SearchResult {
  constructor(data) {
    this.items = data?.items?.map(item => ({
      number: item.number,
      title: item.title,
      url: item.html_url,
      repository: item.repository_url,
      state: item.state,
      user: new User(item.user)
    })) || []
  }
}
