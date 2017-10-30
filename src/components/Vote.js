import React from 'react'
import {connect} from 'react-redux'

import {voteOptions} from '../utils/config'
import {saveVote} from '../actions/index'

class Vote extends React.Component {
  voteUp = () => {
    this.vote(voteOptions.value.up)
  }

  voteDown = () => {
    this.vote(voteOptions.value.down)
  }

  vote = (voteValue) => {
    const {dispatch, type, item} = this.props
    dispatch(saveVote(type, item.id, voteValue))
  }

  render () {
    const {item} = this.props
    return (
      <div>
        <button
          onClick={this.voteUp}
        >
          ^
        </button>
        <div className='voteScore'>{item.voteScore}</div>
        <button
          onClick={this.voteDown}
        >
          V
        </button>
      </div>
    )
  }
}

export default connect()(Vote)