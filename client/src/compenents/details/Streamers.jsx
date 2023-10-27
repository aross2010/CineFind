import { TiMediaPlay } from 'react-icons/ti'

export default function Streamers({ streamers, renters, trailer }) {
  const renderedStreamers = streamers.map((streamer, i) => {
    if (i > 2) return
    return (
      <li
        key={i}
        className="streamer"
      >
        <div>
          <img
            className="streamer-logo"
            src={streamer.logo}
          />
          {streamer.name.includes('Sling') ? 'Sling TV' : streamer.name}
        </div>
      </li>
    )
  })

  const renderedRenters = renters.map((renter, i) => {
    return (
      <li
        key={i}
        className="streamer"
      >
        <div>
          <img
            className="streamer-logo"
            src={renter.logo}
          />
          {renter.name}
        </div>
      </li>
    )
  })

  const notStreamingText = (
    <span className="not-streaming-txt">Not streaming in the US.</span>
  )

  return (
    <div className="streamers-container">
      <div className="now-playing-container">
        <span>
          {streamers.length > 0
            ? 'Now Streaming...'
            : renters.length > 0
            ? 'Now Renting...'
            : 'Where to Watch'}
        </span>
        {trailer && (
          <a
            className="link-text trailer"
            href={`https://www.youtube.com/watch?v=${trailer}`}
            taget="_blank"
          >
            <TiMediaPlay style={{ fontSize: '0.95rem' }} />
            Trailer
          </a>
        )}
      </div>
      <ul className="streamers-list-container">
        {streamers.length > 0
          ? renderedStreamers
          : renters.length > 0
          ? renderedRenters
          : notStreamingText}
      </ul>
    </div>
  )
}
