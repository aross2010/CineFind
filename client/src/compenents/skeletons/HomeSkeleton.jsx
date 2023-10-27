import Skeleton from 'react-loading-skeleton'

export default function HomeSkeleton({ count }) {
  return Array(count)
    .fill(0)
    .map((_, i) => {
      return (
        <div
          className="review-container"
          key={i}
        >
          <div className="review-poster-wrapper">
            <Skeleton
              className="film-skeleton"
              width={'7rem'}
              height={'10.5rem'}
              containerClassName="review-poster"
            />
          </div>
          <div className="review-content">
            <Skeleton containerClassName="review-film-title" />

            <Skeleton
              width={'33%'}
              containerClassName="review-header"
            />

            <Skeleton
              width={'50%'}
              containerClassName="review-disc-body"
            />

            <Skeleton
              width={'10%'}
              containerClassName="review-disc-footer"
            />
          </div>
        </div>
      )
    })
}
