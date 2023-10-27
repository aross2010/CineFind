import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useWindowSizeHook from '../../hooks/widowSizeHook'

export default function DefaultFilmsSkeleton({ count }) {
  const { width } = useWindowSizeHook()
  return Array(count)
    .fill(0)
    .map((_, i) => (
      <Skeleton
        className={`poster ${width < 815 && 'default'} `}
        containerClassName={
          width < 815 ? 'skeleton-container' : 'default-skeleton-wrapper'
        }
        key={i}
      />
    ))
}
