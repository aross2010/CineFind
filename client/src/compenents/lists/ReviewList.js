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
      <ReviewPost
        key={review._id}
        sortMethod={sortMethod}
        review={review}
        setReviews={setReviews}
        isUserPage={isUserPage}
        isHomePage={isHomePage}
      />
    )
  })

  return <>{reviews.length > 0 ? renderedReviews : <span>No reviews.</span>}</>
}
