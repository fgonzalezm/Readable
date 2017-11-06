import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import AddIcon from 'react-icons/lib/io/android-add'
import ComposeIcon from 'react-icons/lib/io/ios-compose'
import TrashIcon from 'react-icons/lib/io/ios-trash'

import {
  sortPosts,
  openModal,
  closeModal,
  deleteItem
} from '../actions/index'

import Vote from './Vote'
import EditItem from './EditItem'

import {
  voteOptions,
  sortOptions,
  modalOptions,
  itemTypes
} from '../utils/config'

import Modal from 'react-modal'

const changeIconSize='1.5rem'

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
          {filteredPosts.map((post, index) => {
            const evenListItem = index % 2 === 0 ? 'even-list-item' : null
            return (
              <li key={post.id} className={`post-list-item ${evenListItem}`}>
                <div className='post-list-item-main' >
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
                      <text
                        className='posted-by' >
                        Posted by: </text><text className='post-list-item-author' >{post.author}
                        </text>
                    </div>
                    <div className='post-list-item-date'>
                      <text
                        className='posted-on' >
                        {(new Date(post.timestamp)).toLocaleString()}
                      </text>
                    </div>
                  </div>
                </span>
                </div>
                <div className='change-buttons'>
                  <button
                    className='edit-button'
                    onClick={() => {
                      dispatch(openModal(modalOptions.type.editPost, category, post.id))}
                    } >
                    <ComposeIcon size={changeIconSize} />
                  </button>
                  <button
                    className='delete-button'
                    onClick={() => {
                      dispatch(deleteItem(post.id, itemTypes.post))
                    }} >
                    <TrashIcon size={changeIconSize} color='red'/>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="post-add">
          <button
            onClick={() => dispatch(openModal(modalOptions.type.newPost, category))} >
            <AddIcon size={30} color='#8c38ff' />
          </button>
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