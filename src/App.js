import React, { Component } from 'react';
import logo from './logo.svg';
import {connect} from 'react-redux'

import {Route, Switch, Link, withRouter} from 'react-router-dom'
import Loading from 'react-loading'

import {
  getPosts,
  getCategories,
  sortPosts,
  saveVote,
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
        <Link to='/' ><h1 className='title'>Postmaster</h1></Link>
        {loading.isLoading ? <Loading delay={200} type='spin' />
        : <Switch>
          <Route path='/:category/:postId' component={Post} />
          <Route exact path='/:category' component={PostsList} />
          <Route exact path='/' component={PostsList} />
        </Switch> }
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
