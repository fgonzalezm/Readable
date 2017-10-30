import React from 'react'
import {connect} from 'react-redux'

import {newItem} from '../actions/index'

import serializeForm from 'form-serialize'

class EditItem extends React.Component {
  handleAdd = (event) => {
    event.preventDefault()
    const {dispatch} = this.props
    const values = serializeForm(event.target, {hash: true})
    dispatch(newItem(values))
  }



  render () {
    const {categories, modal, dispatch} = this.props
    const category = modal.category ? modal.category : categories[0]
    return (
      <div>
        <form onSubmit={this.handleAdd} >
          <input type='text' name='title' placeholder='Title' />
          <input type='text' name='author' placeholder='Author' />
          <select
            name='category'
            defaultValue={category}
          >
            {categories.map(category => {
              return (
                <option key={category} value={category}>{category}</option>
              )
            })}
          </select>
          <textarea name='body' rows={5} ></textarea>
          <button >Add post</button>
        </form>
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

export default connect(mapStateToProps)(EditItem)