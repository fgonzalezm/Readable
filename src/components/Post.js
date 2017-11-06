import React from 'react'
import {connect} from 'react-redux'
import ComposeIcon from 'react-icons/lib/io/ios-compose'
import TrashIcon from 'react-icons/lib/io/ios-trash'

import EditItem from './EditItem'

import {
  openModal,
  closeModal,
  deleteItem
} from '../actions/index'
import Vote from './Vote'
import {voteOptions, modalOptions, itemTypes} from '../utils/config'

import Modal from 'react-modal'

const changeIconSize = '1.5rem'

class Post extends React.Component {

  componentWillMount () {
    const {match, posts, history} = this.props
    const post = posts && posts[match.params.postId]
    if (!post) {
      history.push('/')
    }
  }

  render () {
    const {match, posts, comments, dispatch, modal, history} = this.props
    const post = posts && posts[match.params.postId]
    if (!post) {
      return (
        <div>No post with given id found.</div>
      )
    }
    let postComments = comments.byPostId[post.id]
    if (!postComments) {
      postComments = []
    }

    return (
      <div className='post-detail'>
        <h2>{post.title}</h2>
        <div className="post-list-item-posted-by">
          <text className='posted-by'>Posted by: </text><text className='post-list-item-author'>{post.author}</text>
        </div>
        <div className='post-list-item-date'>
          <text className='posted-on'>{(new Date(post.timestamp)).toDateString()}</text>
        </div>
        <div className='post-detail-body'>
          <div className="post-detail-body-main" >
            <Vote type={voteOptions.type.post} item={post}/>
            <text>{post.body}</text>
            {/*<textarea className='post-detail-body-text' value={post.body} ></textarea>*/}
          </div>
          <div className='change-buttons'>
            <button
              className='edit-button'
              onClick={() => {
                dispatch(openModal(modalOptions.type.editPost, post.category, post.id))}
              } >
              <ComposeIcon size={changeIconSize} />
            </button>
            <button
              className='delete-button'
              onClick={() => {
                dispatch(deleteItem(post.id, itemTypes.post))
                history.push('/')
              }} >
              <TrashIcon size={changeIconSize} color='red'/>
            </button>
          </div>
        </div>
        <h4 className='comments-heading' >Comments ({postComments.length})</h4>
        <ul className='comment-list'>
          {postComments.map(commentId => {
            const comment = comments.byId[commentId]
            return (
              <li key={commentId} className='comment-list-item' >
                <div className='comment-list-item-main'>
                  <Vote
                    iconSize={'1.2rem'}
                    type={voteOptions.type.comment}
                    item={comment} />
                  <text className='comment-body'>{comment.body} - by: <text className='post-list-item-author' >{` ${comment.author}`}</text></text>
                </div>
                <div className='change-buttons' >
                  <button
                    className='edit-button'
                    onClick={() => dispatch(openModal(modalOptions.type.editComment, null, commentId))} >
                    <ComposeIcon size={changeIconSize} />
                  </button>
                  <button
                    className='delete-button'
                    onClick={() => {
                      dispatch(deleteItem(commentId, itemTypes.comment))
                    }} >
                    <TrashIcon size={changeIconSize} color='red'/>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
        <div className='comment-add' >
          <button
            onClick={() => dispatch(openModal(modalOptions.type.newComment, null, null, post.id))} >
            Add comment
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
    posts: posts.byId ? posts.byId : null,
    categories: Object.keys(categories),
    comments,
    modal
  }
}

export default connect(mapStateToProps)(Post)