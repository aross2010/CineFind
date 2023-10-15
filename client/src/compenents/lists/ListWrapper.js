import React from 'react'
import { useState, useEffect } from 'react'
import ReviewList from './ReviewList'
import DiscussionsList from './DiscussionsList'
import ListsList from './ListsList'
import FilmList from './FilmList'

export default function ListWrapper({
  film,
  list,
  maxDisplayed,
  topContainer,
  reviews,
  setReviews,
  discussions,
  setDiscussions,
  lists,
  setLists,
  films,
  sortMethod,
  isUserPage,
  isHomePage,
}) {
  const [displayed, setDisplayed] = useState([0, maxDisplayed])
  const [activePage, setActivePage] = useState(1)

  const pages = Math.ceil(list.length / maxDisplayed)

  const handlePageSelection = (page) => {
    setActivePage(page)
    setDisplayed([
      (page - 1) * maxDisplayed,
      (page - 1) * maxDisplayed + maxDisplayed,
    ])
    if (topContainer.current) {
      const scrollPosition = topContainer.current.offsetTop - 15
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      })
    }
  }

  let backDots = false
  let frontDots = false

  const renderedPageCount = Array(pages)
    .fill(0)
    .map((_, i) => {
      const page = i + 1
      if (page !== 1 && activePage - 1 > page) {
        if (!backDots) {
          backDots = true
          return <span>...</span>
        } else return
      } else if (page !== pages && activePage + 2 < page) {
        if (!frontDots) {
          frontDots = true
          return <span>...</span>
        } else return
      }

      return (
        <span
          key={i}
          className={`page-count-num ${activePage === page && 'active'}`}
          onClick={() => handlePageSelection(page)}
        >
          {page}
        </span>
      )
    })

  const newList = list.slice(displayed[0], displayed[1])

  return (
    <>
      {reviews ? (
        <ReviewList
          reviews={newList}
          sortMethod={sortMethod}
          isUserPage={isUserPage}
          isHomePage={isHomePage}
          setReviews={setReviews}
        />
      ) : discussions ? (
        <DiscussionsList
          discussions={newList}
          sortMethod={sortMethod}
          isUserPage={isUserPage}
          isHomePage={isHomePage}
          setDiscussions={setDiscussions}
        />
      ) : lists ? (
        lists && (
          <ListsList
            film={film}
            sortMethod={sortMethod}
            lists={newList}
            isUserPage={isUserPage}
            isHomePage={isHomePage}
            setLists={setLists}
          />
        )
      ) : (
        films && <FilmList films={newList} />
      )}
      <div className="rendered-list-page-count">
        {list.length > maxDisplayed && renderedPageCount}
      </div>
    </>
  )
}

// wrap other lists with this wrapper next
