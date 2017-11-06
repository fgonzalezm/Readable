import {voteOptions, itemTypes} from './config'

const AUTH_ID = 'ECHO-BRAVO'
const SERVER_URL = 'http://localhost:5001'

const headers = {
  Authorization: AUTH_ID
}

const headersJson = {...headers, 'Content-Type': 'application/json'}

export function fetchPosts (category) {
  let url
  if (category) {
    url = SERVER_URL + `/${category}/posts`
  } else {
    url = SERVER_URL + '/posts'
  }
  return readableFetch(url, {headers})
}

export function fetchCategories () {
  const url = SERVER_URL + '/categories'
  return readableFetch(url, {headers})
}

export function fetchComments (posts) {
  const baseUrl = SERVER_URL + '/posts/'
  const promises = posts.map(post => {
    const url = baseUrl + post.id + '/comments'
    return readableFetch(url, {headers})
  })

  return Promise.all(promises)
}

export function vote (type, id, value) {
  let url = SERVER_URL
  if (type === voteOptions.type.post) {
    url += '/posts/' + id
  } else {
    url += '/comments/' + id
  }

  const body = JSON.stringify({option: value})
  const method = 'post'

  return readableFetch(url, {headers: headersJson, body, method})
}

export function saveNewItem (item) {
  let url
  if (item.parentId) {
    url = SERVER_URL + '/comments'
  } else {
    url = SERVER_URL + '/posts'
  }
  const method = 'post'
  const body = JSON.stringify(item)
  return readableFetch(url, {headers: headersJson, body, method})
}

export function saveEdit (item, id) {
  let url = SERVER_URL
  if (item.title) {
    url += `/posts/${id}`
  } else {
    url += `/comments/${id}`
  }
  const method = 'put'
  const body = JSON.stringify(item)
  return readableFetch(url, {headers: headersJson, body, method })
}

export function saveDeleteItem (id, itemType) {
  let url = SERVER_URL
  if (itemType === itemTypes.post) {
    url += `/posts/${id}`
  } else {
    url += `/comments/${id}`
  }

  const method = 'delete'
  return readableFetch(url, {headers, method})
}

function readableFetch (url, params) {
  return fetch(url, params)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      console.log('Response failed. Status: ', response.status, ' Text: ', response.statusText)
      throw new Error('Network error')
    })
    .then(json => {
      return json
    })
}