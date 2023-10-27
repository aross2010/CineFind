import React, { useEffect, useState, useRef } from 'react'
import SwitchableHeader from './SwitchableHeader'
import ListWrapper from '../lists/ListWrapper'
import {
  discussionSortFunction,
  listSortFunction,
  reviewSortFunction,
} from '../../functions/sorting-functions'

export default function FilmSocial({
  loading,
  skeleton,
  film,
  reviews,
  setReviews,
  discussions,
  setDiscussions,
  lists,
  setLists,
  isUserPage,
  isHomePage,
}) {
  const [reviewSortMethod, setReviewSortMethod] = useState({
    label: 'Date',
    value: 'date',
    desc: true,
  })
  const [discussionSortMethod, setDiscussionSortMethod] = useState({
    label: 'Date',
    value: 'date',
    desc: true,
  })
  const [listSortMethod, setListSortMethod] = useState({
    label: 'Date',
    value: 'updated',
    desc: true,
  })
  const switchableContainer = useRef()

  useEffect(() => {
    handleReviewSort(reviewSortMethod)
  }, [reviewSortMethod])

  useEffect(() => {
    handleDiscussionSort(discussionSortMethod)
  }, [discussionSortMethod])

  useEffect(() => {
    handleListSort(listSortMethod)
  }, [listSortMethod])

  const reviewsOptions = [
    { label: 'Date', value: 'date', desc: true },
    { label: 'Likes', value: 'likes', desc: true },
    { label: 'Rating', value: 'rating', desc: true },
  ]

  const handleReviewSort = (method) => {
    if (!method) return
    const sorted = [...reviews].sort(reviewSortFunction(method))
    setReviews(sorted)
  }

  const handleReviewSelect = (method) => {
    setReviewSortMethod((prev) => {
      if (prev && prev.value === method.value)
        return {
          ...prev,
          desc: !prev.desc,
        }
      else return method
    })
  }

  const discussionsOptions = [
    { label: 'Date', value: 'date', desc: true },
    { label: 'Likes', value: 'likes', desc: true },
    { label: 'Comments', value: 'comments', desc: true },
  ]

  const handleDiscussionSort = (method) => {
    if (!method) return
    const sorted = [...discussions].sort(discussionSortFunction(method))
    setDiscussions(sorted)
  }

  const handleDiscussionSelect = (method) => {
    setDiscussionSortMethod((prev) => {
      if (prev.value === method.value)
        return {
          ...prev,
          desc: !prev.desc,
        }
      else return method
    })
  }

  const listsOptions = [
    { label: 'Updated', value: 'updated', desc: true },
    { label: 'Likes', value: 'likes', desc: true },
    { label: 'Length', value: 'length', desc: true },
  ]

  const handleListSort = (method) => {
    if (!method) return
    const sorted = [...lists].sort(listSortFunction(method))
    setLists(sorted)
  }

  const handleListSelect = (method) => {
    setListSortMethod((prev) => {
      if (prev.value === method.value)
        return {
          ...prev,
          desc: !prev.desc,
        }
      else return method
    })
  }

  const data = {
    reviews: {
      options: reviewsOptions,
      handleSelect: handleReviewSelect,
      selected: reviewSortMethod,
    },
    discussions: {
      options: discussionsOptions,
      handleSelect: handleDiscussionSelect,
      selected: discussionSortMethod,
    },
    lists: {
      options: listsOptions,
      handleSelect: handleListSelect,
      selected: listSortMethod,
    },
  }

  return (
    <>
      <div
        ref={switchableContainer}
        style={{ width: '100%' }}
      >
        <SwitchableHeader
          loading={loading}
          skeleton={skeleton}
          headers={['Reviews', 'Discussions', 'Lists']}
          content={[
            <ListWrapper
              isHomePage={isHomePage}
              sortMethod={reviewSortMethod}
              reviews
              setReviews={setReviews}
              isUserPage={isUserPage}
              list={reviews}
              maxDisplayed={8}
              topContainer={switchableContainer}
            />,
            <ListWrapper
              isHomePage={isHomePage}
              sortMethod={discussionSortMethod}
              discussions
              setDiscussions={setDiscussions}
              isUserPage={isUserPage}
              list={discussions}
              maxDisplayed={6}
              topContainer={switchableContainer}
            />,
            <ListWrapper
              isHomePage={isHomePage}
              lists
              sortMethod={listSortMethod}
              film={film}
              isUserPage={isUserPage}
              list={lists}
              setLists={setLists}
              maxDisplayed={8}
              topContainer={switchableContainer}
            />,
          ]}
          sortable
          data={data}
          sortedDiscussions={discussions}
          setSortedDiscussions={setDiscussions}
        />
      </div>
    </>
  )
}
