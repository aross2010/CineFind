import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function FilmsSkeleton({ count }) {
  return Array(count)
    .fill(0)
    .map((_, i) => (
      <div
        className="film-skeleton-container"
        key={i}
      >
        <div className="poster-col">
          <Skeleton
            className="film-skeleton"
            height={'7.25rem'}
          />
        </div>
        <div className="info-col">
          <Skeleton
            className="film-skeleton-title"
            style={{ marginBottom: '0.5rem', width: '30%' }}
          />
          <Skeleton
            count={2}
            className="film-skeleton-synopsis"
          />
        </div>
      </div>
    ))
}
