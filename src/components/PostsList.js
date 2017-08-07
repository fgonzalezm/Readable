import React from 'react'
import {connect} from 'react-redux'

import {getPosts} from '../actions/index'

class PostsList extends React.Component {

  componentDidMount () {
    this.props.dispatch(getPosts())
  }

  render () {
    const {posts} = this.props
    return (
      <ul className='post-list'>
        {posts.map((post) => (
          <li key={post.id} className='post-list-item'>
            <span>
              <button
              >
                ^
              </button>
              <div className='voteScore'>{post.voteScore}</div>
              <button>
                V
              </button>
            </span>
            <span className='post-list-item-title'>
              <div>
                {post.title}
              </div>
              <div className="post-list-item-posted-by">
                <text className='posted-by'>Posted by: </text><text className='post-list-item-author'>{post.author}</text>
              </div>
            </span>
          </li>
        ))}
      </ul>
    )
  }
}

function mapStateToProps ({posts}) {
  return {
    posts: posts.allIds ? posts.allIds.map(id => posts.byId[id]) : []
  }
}

export default connect(mapStateToProps)(PostsList)