import {fetchPosts, fetchCategories, vote} from '../utils/api'

export const GET_POSTS = 'GET_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const GET_CATEGORIES = 'GET_CATEGORIES'
export const SORT_POSTS = 'SORT_POSTS'
export const VOTE = 'VOTE'

export const getPosts = () => dispatch => (
  fetchPosts().then(posts => dispatch(receivePosts(posts)))
)

const receivePosts = posts => ({
  type: RECEIVE_POSTS,
  posts
})

export const getCategories = () => dispatch => (
  fetchCategories().then(categories => dispatch(receiveCategories(categories)))
)

const receiveCategories = categories => ({
  type: GET_CATEGORIES,
  categories
})

export const sortPosts = sortBy => ({
  type: SORT_POSTS,
  sortBy
})

export const saveVote = (type, id, value) => dispatch => (
  vote(type, id, value).then(() => dispatch(receiveVote(type, id, value)))
)

const receiveVote = (type, id, value) => ({
  type: VOTE,
  id,
  value,
  voteType: type
})