import Skeleton from 'react-loading-skeleton'

export default function ListsSkeleton({ count }) {
  return Array(count)
    .fill(0)
    .map((_, i) => {
      return (
        <div
          className="list-preview-container"
          key={i}
        >
          <Skeleton
            containerClassName="list-preview-name"
            width={'33%'}
          />
          <Skeleton
            width={'20%'}
            containerClassName="review-header"
          />
          <Skeleton
            width={'90%'}
            height={'9.25rem'}
            style={{
              marginTop: '1rem',
            }}
          />
          <Skeleton
            width={'10%'}
            containerClassName="review-disc-footer"
          />
        </div>
      )
    })
}
