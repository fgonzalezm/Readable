import {
  RECEIVE_POSTS,
  GET_CATEGORIES,
  SORT_POSTS,
  VOTE,
  RECEIVE_COMMENTS,
  LOADING,
  OPEN_MODAL,
  CLOSE_MODAL,
  RECEIVE_NEW_POST,
  RECEIVE_EDIT_POST,
  RECEIVE_NEW_COMMENT,
  RECEIVE_EDIT_COMMENT,
  RECEIVE_DELETE_COMMENT,
  RECEIVE_DELETE_POST, ITEM_NOT_VALID
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
      const newState2 = handleReceiveItem(state, action)
      newState2.allIds =  sort(state.sortBy, newState2.byId, state.allIds, action.item.id)
      return newState2
    }
    case RECEIVE_EDIT_POST:
      return handleReceiveItem(state, action)
    case RECEIVE_DELETE_POST:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.response.id]: null
        },
        allIds: state.allIds.filter(id => id !== action.response.id)
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
        comments.byPostId[parentId] = sort(state.sortBy, comments.byId, comments.byPostId[parentId])
      })
      comments.received = true
      comments.sortBy = sortOptions.by.score
      return comments
    case RECEIVE_NEW_COMMENT: {
      const newState2 = handleReceiveItem(state, action)
      const parentId = action.item.parentId
      if (newState2.byPostId[parentId]) {
        newState2.byPostId[parentId] = sort(state.sortBy, newState2.byId, state.byPostId[parentId], action.item.id)
      } else {
        newState2.byPostId[parentId] = [action.item.id]
      }
      return newState2
    }
    case RECEIVE_EDIT_COMMENT:
      return handleReceiveItem(state, action)
    case VOTE:
      return handleVote(state, action, voteOptions.type.comment)
    case RECEIVE_DELETE_POST:
      const postId = action.response.id
      const commentIdsOfPost = state.byPostId[postId]
      const newState3 = {
        ...state,
        byId: {
          ...state.byId
        },
        byPostId: {
          ...state.byPostId,
          [postId]: null
        }
      }
      commentIdsOfPost && commentIdsOfPost.forEach(id => {
        newState3.byId[id] = null
      })
      return newState3
    case RECEIVE_DELETE_COMMENT:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.response.id]: null
        },
        byPostId: {
          ...state.byPostId,
          [action.response.parentId]: filterComment(state, action)
        }
      }
    default:
      return state
  }
}

function filterComment (state, action) {
  const parentId = action.response.parentId
  const itemId = action.response.id
  const ids = state.byPostId[parentId]
  return ids.filter(id => id !== itemId)
}

function handleReceiveItem (state, action) {
  return {
    ...state,
    byId: {
      ...state.byId,
      [action.item.id]: action.item
    }
  }
}

// function handleEditItem (state, action) {
//   return {
//     ...state,
//     byId: {
//       ...state.byId,
//       [action.item.id]: action.item
//     }
//   }
// }

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
      const {id, modalType, category, parentId} = action
      return {
        open: true,
        id,
        modalType,
        category,
        parentId
      }
    case ITEM_NOT_VALID:
      return {
        ...state,
        validation: action.validation
      }
    case CLOSE_MODAL:
    case RECEIVE_NEW_POST:
    case RECEIVE_NEW_COMMENT:
    case RECEIVE_EDIT_COMMENT:
    case RECEIVE_EDIT_POST:
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