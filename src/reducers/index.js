import {GET_POSTS, RECEIVE_POSTS} from '../actions/index'

import {combineReducers} from 'redux'

function posts (state = {}, action) {

  switch (action.type) {
    case RECEIVE_POSTS:
      return action.posts.reduce((posts, post) => {
        posts.byId[post.id] = post
        posts.allIds.push(post.id)
        return posts
      }, {byId: {}, allIds: []})
    default:
      return state
  }
}

export default combineReducers({
  posts
})