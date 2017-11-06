import {
  fetchPosts,
  fetchCategories,
  vote,
  fetchComments,
  saveNewItem,
  saveEdit,
  saveDeleteItem
} from '../utils/api'
import {
  validationOptions,
  modalOptions,
  itemTypes,
  errorTypes
} from '../utils/config'

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
export const RECEIVE_EDIT_POST = 'RECEIVE_EDIT_POST'
export const RECEIVE_NEW_COMMENT = 'RECEIVE_NEW_COMMENT'
export const RECEIVE_EDIT_COMMENT = 'RECEIVE_EDIT_COMMENT'
export const RECEIVE_DELETE_POST = 'RECEIVE_DELETE_POST'
export const RECEIVE_DELETE_COMMENT = 'RECEIVE_DELETE_COMMENT'

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

export const openModal = (type, category, id, parentId) => ({
  type: OPEN_MODAL,
  modalType: type,
  id,
  category,
  parentId
})

export  const closeModal = () => ({
  type: CLOSE_MODAL
})

export const newItem = (item, modalType, id, parentId) => dispatch => {
  const {author, title, body} = item

  const validation = {}
  let isValid = true
  if (validationOptions.fields.title[modalType] && !title) {
    isValid = false
    validation.title = errorTypes.isEmpty
  }
  if (validationOptions.fields.author[modalType] && !author) {
    isValid = false
    validation.author = errorTypes.isEmpty
  }
  if (!body) {
    isValid = false
    validation.body = errorTypes.isEmpty
  }

  if (!isValid) {
    dispatch(itemNotValid(validation))
  } else {
    const {type} = modalOptions
    switch (modalType) {
      case type.newPost:
        item.id = uuidv4()
        item.timestamp = Date.now().valueOf()
        saveNewItem(item).then((response) => dispatch(receiveNewPost(response)))
        break
      case type.editPost:
        saveEdit(item, id).then(response => dispatch(receiveEditPost(response)))
        break
      case type.newComment:
        item.id = uuidv4()
        item.timestamp = Date.now().valueOf()
        item.parentId = parentId
        saveNewItem(item).then(response => dispatch(receiveNewComment(response)))
        break
      case type.editComment:
        saveEdit(item, id).then(response => dispatch(receiveEditComment(response)))
        break
      default:
        break
    }
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

export const receiveEditPost = (item) => ({
  type: RECEIVE_EDIT_POST,
  item
})

export const receiveNewComment = (item) => ({
  type: RECEIVE_NEW_COMMENT,
  item
})

export const receiveEditComment = (item) => ({
  type: RECEIVE_EDIT_COMMENT,
  item
})

export const deleteItem = (id, itemType) => dispatch => {
  saveDeleteItem(id, itemType).then(response => {
    dispatch(receiveDeleteItem(response, itemType))
  })
}

const receiveDeleteItem = (response, itemType) => ({
  type: itemType === itemTypes.post ? RECEIVE_DELETE_POST : RECEIVE_DELETE_COMMENT,
  response
})