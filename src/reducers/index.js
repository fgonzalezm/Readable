import {
  RECEIVE_POSTS,
  GET_CATEGORIES,
  SORT_POSTS,
  VOTE
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

      posts.allIds = sortPosts(state.sortBy, posts)
      posts.sortBy = sortOptions.by.score
      return posts
    case SORT_POSTS:
      const allIds = sortPosts(action.sortBy, state)
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
      }
      newState.allIds = sortPosts(state.sortBy, newState)
      return newState
    default:
      return state
  }
}

function sortPosts (sortBy, posts) {
  const allIds = Array.from(posts.allIds)
  allIds.sort((a,b) => {
    const aPost = posts.byId[a]
    const bPost = posts.byId[b]
    switch (sortBy) {
      case sortOptions.by.score:
        return bPost.voteScore - aPost.voteScore
      case sortOptions.by.date:
        return bPost.timestamp - aPost.timestamp
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

export default combineReducers({
  posts,
  categories
})