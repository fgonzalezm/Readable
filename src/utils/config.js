const post = 'post'
const comment = 'comment'

export const itemTypes = {
  post,
  comment
}

export const errorTypes = {
  isEmpty: 'cannot be empty'
}

export const voteOptions = {
  value: {
    up: 'upVote',
    down: 'downVote'
  },
  type: {
    post,
    comment
  }
}

export const sortOptions = {
  by: {
    score: 'score',
    date: 'date'
  }
}

const fields = {
  title: {
    newPost: true,
    editPost: true
  },
  author: {
    newPost: true,
    newComment: true
  },
  category: {
    newPost: true
  }
}

export const validationOptions = {
  fields
}

export const modalOptions = {
  type: {
    newPost: 'newPost',
    newComment: 'newComment',
    editPost: 'editPost',
    editComment: 'editComment'
  },
  title: {
    newPost: 'Add a post',
    newComment: 'Add a commnet',
    editPost: 'Edit your post',
    editComment: 'Edit comment'
  },
  showInputs: fields
}
