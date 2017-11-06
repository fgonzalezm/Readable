import React, { Component } from 'react';
import {connect} from 'react-redux'

import {Route, Switch, Link, withRouter} from 'react-router-dom'
import Loading from 'react-loading'

import {
  getPosts,
  getCategories,
  getComments,
  loading
} from './actions/index'

import './App.css'
import PostsList from './components/PostsList'
import Post from './components/Post'

class App extends Component {
  componentDidMount () {
    if (this.props.posts) {
      this.props.dispatch(getCategories())
      this.props.dispatch(getPosts())
    }
  }

  componentWillReceiveProps (nextProps) {
    const {posts, comments} = nextProps
    if (posts.length > 0 && !comments.received) {
      this.props.dispatch(getComments(posts))
    }

    if (comments.received && !this.props.comments.received) {
      this.props.dispatch(loading(false))
    }
  }

  render() {
    const {loading} = this.props
    return (
      <div className="App">
        <div className="title">
          <Link to='/' ><h1 className='title-h1' >Postmaster</h1></Link>
        </div>
        {loading.isLoading ? <Loading delay={200} type='spin' />
        : <div className='app-body' >
            <Switch >
              <Route path='/:category/:postId' component={Post} />
              <Route exact path='/:category' component={PostsList} />
              <Route exact path='/' component={PostsList} />
            </Switch>
          </div>}
      </div>
    );
  }
}

function mapStateToProps ({posts, categories, comments, loading}, ownProps) {
  // let mappedPosts = []
  // mappedPosts = posts.allIds && posts.allIds.map(id => {
  //   if (comments.received) {
  //     posts.byId[id].commentCount = Object.keys(comments).reduce((acc, comment) => {
  //       acc =
  //     }, 0)
  //   }
  //   return posts.byId[id]
  // })

  return {
    posts: posts.allIds ? posts.allIds.map(id => posts.byId[id]) : [],
    categories: Object.keys(categories),
    comments: comments,
    loading,
    ...ownProps
  }
}

export default withRouter(connect(mapStateToProps)(App))
