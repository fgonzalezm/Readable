import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {
  sortPosts,
  openModal,
  closeModal
} from '../actions/index'

import Vote from './Vote'
import EditItem from './EditItem'

import {voteOptions, sortOptions, modalOptions} from '../utils/config'

import Modal from 'react-modal'

class PostsList extends React.Component {

  filterPostsByCategory = (category) => {
    const {posts} = this.props
    return posts.filter(post => post.category === category)
  }

  getCommentsCount = (postId) => {
    const {comments} = this.props
    if (!comments || !comments.received) {
      return 0
    }

    const postComments = this.props.comments.byPostId[postId]
    return postComments ? postComments.length : 0
  }

  render () {
    const {posts, categories, dispatch, match, sortBy, modal} = this.props
    let filteredPosts
    let category = null
    if (match.path === '/:category') {
      category = match.params.category
      filteredPosts = this.filterPostsByCategory(category)
    } else {
      filteredPosts = posts
    }

    return (
      <div>
        <div className='categories'>
          Categories: {categories.map(category => (
            <Link to={`/${category}`} key={category}>{category + ' '}</Link>
        ))}
        </div>
        <div className='post-list-sort-by'>
          <span>Sort by: </span>
          <select
            value={sortBy}
            onChange={event => dispatch(sortPosts(event.target.value))} >
            {Object.keys(sortOptions.by).map(sortBy => {
              return (
                <option key={sortBy} value={sortBy}>{sortBy}</option>
              )
            })}
        </select>
        </div>
        <ul className='post-list'>
          {filteredPosts.map((post) => (
            <li key={post.id} className='post-list-item'>
              <Vote type={voteOptions.type.post} item={post} />
              <span className='post-list-item-title'>
                <Link to={`${post.category}/${post.id}`}>
                  <div>
                  {post.title}
                  </div>
                </Link>
                <div>
                  <div>Comments: {this.getCommentsCount(post.id)} </div>
                  <div className="post-list-item-posted-by">
                    <text className='posted-by'>Posted by: </text><text className='post-list-item-author'>{post.author}</text>
                  </div>
                  <div className='post-list-item-date'>
                    <text className='posted-on'>{(new Date(post.timestamp)).toLocaleString()}</text>
                  </div>
                </div>
              </span>
              <div>
                <button>edit</button>
                <button>delete</button>
              </div>
            </li>
          ))}
        </ul>
        <div>
          <button onClick={() => dispatch(openModal(modalOptions.type.newPost, category))} >Add post</button>
        </div>
        <Modal
          isOpen={modal.open}
          onRequestClose={() => dispatch(closeModal())}
        >
          <EditItem/>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps ({posts, categories, comments, modal}) {

  return {
    posts: posts.allIds ? posts.allIds.map(id => posts.byId[id]) : [],
    categories: Object.keys(categories),
    comments: comments,
    sortBy: posts.sortBy,
    modal
  }
}

export default connect(mapStateToProps)(PostsList)