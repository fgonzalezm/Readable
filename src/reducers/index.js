import {
  RECEIVE_POSTS,
  GET_CATEGORIES,
  SORT_POSTS,
  VOTE,
  RECEIVE_COMMENTS,
  LOADING,
  OPEN_MODAL,
  CLOSE_MODAL,
  RECEIVE_NEW_POST
} from '../actions/index'

import {voteOptions, sortOptions} from '../utils/config'

import {combineReducers} from 'redux'

function posts (state = {sortBy: sortOptions.by.score}, action) {

  switch (action.type) {
    case RECEIVE_POSTS:
      const posts = action.posts.reduce((posts, post) => {
        posts.byId[post.id] = post
        posts.allIds.push(post.id)
        return posts
      }, {byId: {}, allIds: []})

      posts.allIds = sort(state.sortBy, posts.byId, posts.allIds)
      posts.sortBy = sortOptions.by.score
      return posts
    case SORT_POSTS:
      const allIds = sort(action.sortBy, state.byId, state.allIds)
      return {
        ...state,
        sortBy: action.sortBy,
        allIds: allIds
      }
    case VOTE:
      let newState = state
      if (action.voteType === voteOptions.type.post) {
        let score = state.byId[action.id].voteScore
        if (action.value === voteOptions.value.up) {
          score++
        } else {
          score--
        }

        newState = {
          ...state,
          byId: {
            ...state.byId,
            [action.id]: {
              ...state.byId[action.id],
              voteScore: score
            }
          },
        }
        if (newState.sortBy === sortOptions.by.score) {
          newState.allIds = sort(newState.sortBy, newState.byId, newState.allIds)
        }
      }
      return newState
    case RECEIVE_NEW_POST: {
      const newState2 = {
        ...state,
        byId: {
          ...state.byId,
          [action.item.id]: action.item
        },
      }
      newState2.allIds =  sort(state.sortBy, newState2.byId, state.allIds, action.item.id)
      return newState2
    }
    default:
      return state
  }
}

function comments (state = {received: false, sortBy: sortOptions.by.score}, action) {
  switch (action.type) {
    case RECEIVE_COMMENTS:
      const comments = action.comments.reduce((accumulator, postComments) => {
        postComments.reduce((acc, comment) => {
          acc.byId[comment.id] = comment
          return acc
        }, accumulator)
        if (postComments.length > 0) {
          const parentId = postComments[0].parentId
          accumulator.byPostId[parentId] = postComments.map(comment => {
            return comment.id
          })
        }
        return accumulator
      }, {byId: {}, byPostId: {}})

      Object.keys(comments.byPostId).forEach(parentId => {
        sort(state.sortBy, comments.byId, comments.byPostId[parentId])
      })
      comments.received = true
      comments.sortBy = sortOptions.by.score
      return comments
    case VOTE:
      return handleVote(state, action, voteOptions.type.comment)
    default:
      return state
  }
}

function handleVote (state, action, type) {

  if (action.voteType !== type) {
    return state
  }
  const {id, voteType, value} = action

  let score = state.byId[id].voteScore
  if (value === voteOptions.value.up) {
    score++
  } else {
    score--
  }

  const newState = {
    ...state,
    byId: {
      ...state.byId,
      [id]: {
        ...state.byId[id],
        voteScore: score
      }
    },
  }

  if (newState.sortBy === sortOptions.by.score) {
    if (voteType === voteOptions.type.post) {
      newState.allIds = sort(newState.sortBy, newState.byId, newState.allIds)
    } else {
      const {parentId} = newState.byId[id]
      newState.byPostId[parentId] = sort(newState.sortBy, newState.byId, newState.byPostId[parentId])
    }
  }

  return newState
}

function sort (sortBy, object, idArray, newItem) {
  const allIds = Array.from(idArray)
  if (newItem) {
    allIds.push(newItem)
  }
  allIds.sort((idA,idB) => {
    const a = object[idA]
    const b = object[idB]
    switch (sortBy) {
      case sortOptions.by.score:
        return b.voteScore - a.voteScore
      case sortOptions.by.date:
        return b.timestamp - a.timestamp
      default:
        return allIds
    }
  })
  return allIds
}

function categories (state = {}, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return action.categories.categories.reduce((categories, category) => {
        categories[category.name] = category
        return categories
      }, {})
    default:
      return state
  }

}

function loading (state = {isLoading: true}, action) {
  switch (action.type) {
    case LOADING:
      return {isLoading: action.isLoading}
    default:
      return state
  }
}

function modal (state = {open: false}, action) {
  switch (action.type) {
    case OPEN_MODAL:
      const {id, modalType, category} = action
      return {
        open: true,
        id,
        modalType,
        category
      }
    case CLOSE_MODAL:
      return {open: false}
    case RECEIVE_NEW_POST:
      return {open: false}
    default:
      return state
  }
}

export default combineReducers({
  posts,
  categories,
  comments,
  loading,
  modal
})