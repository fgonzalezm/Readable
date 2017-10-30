import {fetchPosts, fetchCategories, vote, fetchComments, saveNewItem} from '../utils/api'

const uuidv4 = require('uuid/v4')

export const GET_POSTS = 'GET_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const GET_CATEGORIES = 'GET_CATEGORIES'
export const SORT_POSTS = 'SORT_POSTS'
export const VOTE = 'VOTE'
export const SELECT_POST = 'SELECT_POST'
export const GET_COMMENTS = 'GET_COMMENTS'
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS'
export const LOADING = 'LOADING'
export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const NEW_ITEM = 'NEW_ITEM'
export const ITEM_NOT_VALID = 'ITEM_NOT_VALID'
export const RECEIVE_NEW_POST = 'RECEIVE_NEW_POST'

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

export const getComments = (posts) => dispatch => {
  fetchComments(posts).then(comments => dispatch(receiveComments(comments)))
}

const receiveComments = comments => {
  return {
    type: RECEIVE_COMMENTS,
    comments
  }
}

export const saveVote = (type, id, value) => dispatch => (
  vote(type, id, value).then(() => dispatch(receiveVote(type, id, value)))
)

const receiveVote = (type, id, value) => ({
  type: VOTE,
  id,
  value,
  voteType: type
})

export const loading = (isLoading) => ({
  type: LOADING,
  isLoading
})

export const openModal = (type, category, id) => ({
  type: OPEN_MODAL,
  modalType: type,
  id,
  category
})

export  const closeModal = () => ({
  type: CLOSE_MODAL
})

const errorTypes = {
  isEmpty: 'isEmpty'
}

export const newItem = (item) => dispatch => {
  const {author, title, body, category} = item
  const validation = {}
  let isValid = true
  if (author === '') {
    isValid = false
    validation.author = errorTypes.isEmpty
  }
  if (body === '') {
    isValid = false
    validation.body = errorTypes.isEmpty
  }

  if (!isValid) {
    dispatch(itemNotValid(validation))
  } else {
    item.id = uuidv4()
    item.timestamp = Date.now().valueOf()
    saveNewItem(item).then((response) => dispatch(receiveNewPost(response)))
  }
}

export const itemNotValid = (validation) => ({
  type: ITEM_NOT_VALID,
  validation
})

export const receiveNewPost = (item) => ({
  type: RECEIVE_NEW_POST,
  item
})