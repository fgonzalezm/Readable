const AUTH_ID = 'ECHO-BRAVO'
const SERVER_URL = 'http://localhost:5001'

const headers = {
  Authorization: AUTH_ID
}

export function fetchPosts () {
  const url = SERVER_URL + '/posts'
  return fetch(url, {headers})
    .then((response) => response.json())
    .then(posts => posts)
}
