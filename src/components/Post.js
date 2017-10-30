import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {
  getPosts,
  getCategories,
  sortPosts,
  saveVote
} from '../actions/index'
import Vote from './Vote'
import {voteOptions, sortOptions} from '../utils/config'

class Post extends React.Component {

  render () {
    const {match, posts, comments} = this.props
    const post = posts && posts[match.params.postId]
    let postComments = comments.byPostId[post.id]
    if (!postComments) {
      postComments = []
    }

    return (
      <div>
        <h2>{post.title}</h2>
        <div className="post-list-item-posted-by">
          <text className='posted-by'>Posted by: </text><text className='post-list-item-author'>{post.author}</text>
        </div>
        <div className='post-list-item-date'>
          <text className='posted-on'>{(new Date(post.timestamp)).toDateString()}</text>
        </div>
        <Vote type={voteOptions.type.post} item={post}/>
        <div>
          {post.body}
        </div>
        <h3>Comments ({postComments.length})</h3>
        <ul>
          {postComments.map(commentId => {
            const comment = comments.byId[commentId]
            return (
              <li key={commentId}>
                <Vote type={voteOptions.type.comment} item={comment}/>
                {comment.body} - by <text className='post-list-item-author' >{comment.author}</text>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

function mapStateToProps ({posts, categories, comments}) {
  return {
    posts: posts.byId ? posts.byId : null,
    categories: Object.keys(categories),
    comments,
  }
}

export default connect(mapStateToProps)(Post)