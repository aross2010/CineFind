import React, { useContext, useState } from 'react'
import ReviewForm from '../forms/ReviewForm'
import DiscussionForm from '../forms/DiscussionForm'
import { UserContext } from '../../context/userContext'
import usePopupHook from '../../hooks/popupHook'

export default function CreatePost({ film, setReviews, setDiscussions }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false)
  const { user } = useContext(UserContext)

  const { setPopup } = usePopupHook()

  const handleReviewOpen = () => {
    if (user) {
      setIsReviewOpen(true)
      return
    }
    setPopup('Must be signed in to leave a review.')
  }

  const handleDiscussionOpen = () => {
    if (user) {
      setIsDiscussionOpen(true)
      return
    }
    setPopup('Must be signed in to create a post.')
  }

  const content = (
    <div className="create-post-container">
      <button
        onClick={handleReviewOpen}
        className="create-post-btn"
      >
        <span className="uppercase">Review</span>
      </button>
      <button
        onClick={handleDiscussionOpen}
        className="create-post-btn"
      >
        <span className="uppercase">Discuss</span>
      </button>
    </div>
  )

  return (
    <>
      {content}
      <ReviewForm
        open={isReviewOpen}
        setOpen={setIsReviewOpen}
        film={film}
        setReviews={setReviews}
      />

      <DiscussionForm
        open={isDiscussionOpen}
        setOpen={setIsDiscussionOpen}
        film={film}
        setDiscussions={setDiscussions}
      />
    </>
  )
}
