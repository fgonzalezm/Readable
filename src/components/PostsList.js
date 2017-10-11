import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import {
  getPosts,
  getCategories,
  sortPosts,
  saveVote
} from '../actions/index'

import {voteOptions, sortOptions} from '../utils/config'

class PostsList extends React.Component {

  componentDidMount () {
    if (this.props.posts.length === 0) {
      this.props.dispatch(getCategories())
      this.props.dispatch(getPosts())
    }
  }

  filterPostsByCategory = (category) => {
    const {posts} = this.props
    return posts.filter(post => post.category === category)
  }

  vote = (id, value) => {
    this.props.dispatch(saveVote(voteOptions.type.post, id, value))
  }

  render () {
    const {posts, categories, dispatch, match} = this.props
    let filteredPosts
    if (match.path === '/:category') {
      const {category} = match.params
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
          <select onChange={event => dispatch(sortPosts(event.target.value))}>
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
              <span>
                <button
                  onClick={() => this.vote(post.id, voteOptions.value.up)}
                >
                  ^
                </button>
                <div className='voteScore'>{post.voteScore}</div>
                <button
                  onClick={() => this.vote(post.id, voteOptions.value.down)}
                >
                  V
                </button>
              </span>
              <span className='post-list-item-title'>
                <Link to={`${post.category}/${post.id}`}>
                  <div>
                  {post.title}
                  </div>
                </Link>
                <div className="post-list-item-posted-by">
                  <text className='posted-by'>Posted by: </text><text className='post-list-item-author'>{post.author}</text>
                </div>
                <div className='post-list-item-date'>
                  <text className='posted-on'>{(new Date(post.timestamp)).toDateString()}</text>
                </div>
              </span>
              <div>
                <button>edit</button>
                <button>delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

function mapStateToProps ({posts, categories}) {
  return {
    posts: posts.allIds ? posts.allIds.map(id => posts.byId[id]) : [],
    categories: Object.keys(categories)
  }
}

export default connect(mapStateToProps)(PostsList)