import React from 'react'
import {connect} from 'react-redux'
import ArrowUpIcon from 'react-icons/lib/io/arrow-up-b'
import ArrowDownIcon from 'react-icons/lib/io/arrow-down-b'

import {voteOptions} from '../utils/config'
import {saveVote} from '../actions/index'

const defaultIconSize = '1.5rem'

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
    let {item, iconSize} = this.props
    iconSize = iconSize || defaultIconSize
    return (
      <div className="vote">
        <button
          onClick={this.voteUp}
        >
          <ArrowUpIcon size={iconSize} />
        </button>
        <div className='vote-score' style={{fontSize: iconSize}}>{item.voteScore}</div>
        <button
          onClick={this.voteDown}
        >
          <ArrowDownIcon size={iconSize} />
        </button>
      </div>
    )
  }
}

export default connect()(Vote)