const post = 'post'
const comment = 'comment'

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

export const modalOptions = {
  type: {
    newPost: 'newPost',
    newComment: 'newComment',
    editPost: 'editPost',
    editComment: 'editComment'
  }
}