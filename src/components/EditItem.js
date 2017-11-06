import React from 'react'
import {connect} from 'react-redux'

import {newItem} from '../actions/index'
import {modalOptions, errorTypes} from '../utils/config'

import serializeForm from 'form-serialize'

class EditItem extends React.Component {
  handleAdd = (event) => {
    event.preventDefault()
    const {dispatch, modal} = this.props
    const values = serializeForm(event.target, {hash: true})
    dispatch(newItem(values, modal.modalType, modal.id, modal.parentId))
  }

  isEdit = () => {
    const {modal} = this.props
    const {modalType} = modal

    let isEdit = false
    if (modalType && modalType.includes('edit')) {
      isEdit = true
    }

    return isEdit
  }

  componentWillReceiveProps (nextProps) {
    const {validation} = nextProps.modal
    if (validation) {
      let message = 'Error submitting:\n\n'
      Object.keys(validation).forEach(field => {
        message += `${field} ${validation[field]}\n`
      })
      alert(message)
    }
  }

  render () {
    const {categories, modal, posts, comments} = this.props
    const {showInputs} = modalOptions
    let category = modal.category ? modal.category : categories[0]
    let item = {}
    const {modalType, id} = modal
    let isEdit = this.isEdit()
    if (isEdit) {
      if (modalType === modalOptions.type.editPost) {
        item = posts[id]
        category = item.category
      } else {
        item = comments.byId[id]
      }
    }
    return (
      <div>
        <h4>{modalOptions.title[modalType]}</h4>
        <form onSubmit={this.handleAdd} className='form-edit'>
          {showInputs.title[modalType]
          && <div>
            <label className='form-label' htmlFor='title'>Title</label>
            <input
              id='title'
              type='text'
              name='title'
              placeholder='Title'
              defaultValue={item.title} />
          </div>}
          {showInputs.author[modalType]
          && <div>
            <label className='form-label' htmlFor='author'>Author</label>
            <input
              id='author'
              type='text'
              name='author'
              placeholder='Author'
              defaultValue={item.author} />
          </div> }
          {showInputs.category[modalType]
          && <div>
            <label className='form-label' htmlFor='category'>Categories</label>
            <select
              id='category'
              name='category'
              defaultValue={category} >
              {categories.map(category => {
                return (
                  <option key={category} value={category}>{category}</option>
                )
              })}
            </select>
          </div> }
          <label className='form-label' htmlFor='body'>Body</label>
          <textarea
            id='body'
            name='body'
            rows={5}
            defaultValue={item.body} ></textarea>
          <button className='submit-button' >Submit</button>
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