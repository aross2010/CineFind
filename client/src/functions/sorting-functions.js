const reviewSortFunction = (method) => {
  return (a, b) => {
    const compareValue = method.desc ? -1 : 1

    if (method.value === 'date') {
      return compareValue * (new Date(a.created) - new Date(b.created))
    } else if (method.value === 'likes') {
      return compareValue * (a.likes.length - b.likes.length)
    } else if (method.value === 'rating') {
      return compareValue * (a.rating - b.rating)
    }
  }
}

const discussionSortFunction = (method) => {
  return (a, b) => {
    const compareValue = method.desc ? -1 : 1

    if (method.value === 'date') {
      return compareValue * (new Date(a.created) - new Date(b.created))
    } else if (method.value === 'likes') {
      return compareValue * (a.likes.length - b.likes.length)
    } else if (method.value === 'comments') {
      return compareValue * (a.comments.length - b.comments.length)
    }
  }
}

const listSortFunction = (method) => {
  return (a, b) => {
    const compareValue = method.desc ? -1 : 1

    if (method.value === 'updated') {
      return compareValue * (new Date(a.updated) - new Date(b.updated))
    } else if (method.value === 'likes') {
      return compareValue * (a.likes.length - b.likes.length)
    } else if (method.value === 'length') {
      return compareValue * (a.films.length - b.films.length)
    }
  }
}

export { reviewSortFunction, discussionSortFunction, listSortFunction }
