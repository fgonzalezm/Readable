import {fetchPosts} from '../utils/api'

export const GET_POSTS = 'GET_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

export const getPosts = () => dispatch => (
  fetchPosts().then(posts => dispatch(receivePosts(posts)))
)

export const receivePosts = posts => ({
  type: RECEIVE_POSTS,
  posts
})
