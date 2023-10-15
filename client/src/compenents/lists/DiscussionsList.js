import React, { useState, useEffect } from 'react'
import DiscussionPost from './elements/DiscussionPost'
import '../../styles/discussion.css'
import CommentForm from '../forms/CommentForm'

export default function DiscussionsList({
  discussions,
  setDiscussions,
  sortMethod,
  isUserPage,
  isHomePage,
}) {
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false)
  const [discussionToComment, setDiscussionToComment] = useState(null)
  const [comment, setComment] = useState(null)
  const [commentBody, setCommentBody] = useState(comment ? comment.body : '')

  useEffect(() => {
    if (comment) {
      setCommentBody(comment.body)
    } else {
      setCommentBody('')
    }
  }, [isCommentFormOpen])

  const renderedPosts = discussions.map((post, i) => {
    return (
      <DiscussionPost
        key={i}
        discussion={post}
        setDiscussions={setDiscussions}
        sortMethod={sortMethod}
        isUserPage={isUserPage}
        isHomePage={isHomePage}
        sortedDiscussions={discussions}
        setIsCommentFormOpen={setIsCommentFormOpen}
        setDiscussionToComment={setDiscussionToComment}
        setComment={setComment}
      />
    )
  })

  return discussions.length > 0 ? (
    <>
      {renderedPosts}
      {discussionToComment && (
        <CommentForm
          open={isCommentFormOpen}
          setOpen={setIsCommentFormOpen}
          body={commentBody}
          setBody={setCommentBody}
          setDiscussions={setDiscussions}
          discussionToComment={discussionToComment}
          comment={comment}
          isUserPage={isUserPage}
          isHomePage={isHomePage}
        />
      )}
    </>
  ) : (
    <span>No Discussions.</span>
  )
}
