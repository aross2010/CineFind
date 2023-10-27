import ReviewPost from './elements/ReviewPost'

export default function ReviewList({
  reviews,
  setReviews,
  sortMethod,
  isUserPage,
  isHomePage,
}) {
  const renderedReviews = reviews.map((review) => {
    return (
      <li key={review._id}>
        <ReviewPost
          sortMethod={sortMethod}
          review={review}
          setReviews={setReviews}
          isUserPage={isUserPage}
          isHomePage={isHomePage}
        />
      </li>
    )
  })

  return (
    <>
      {reviews.length > 0 ? (
        <ul>{renderedReviews}</ul>
      ) : (
        <span>No reviews.</span>
      )}
    </>
  )
}
