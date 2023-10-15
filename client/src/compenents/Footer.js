import React from 'react'
import '../styles/footer.css'
import { FaLinkedin, FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>
          Film data courtesy of{' '}
          <a
            className="link-text alt"
            href="https://www.themoviedb.org/"
            target="_blank"
          >
            TMDB
          </a>
          . Rotten Tomatoes, IMDB scores, and MPAA ratings courtesy of{' '}
          <a
            className="link-text alt"
            href="https://www.omdbapi.com/"
            target="_blank"
          >
            OMDb
          </a>
          . Logo and home graphic made by{' '}
          <a
            className="link-text alt"
            href="https://www.linkedin.com/in/leta-pham-ba85a3136/"
            target="_blank"
          >
            Leta Pham
          </a>
          .
        </p>

        <p>
          &#169; 2023 by Alex Ross.{' '}
          <a
            href="mailto:adross1027@gmail.com"
            className="link-text alt"
          >
            Contact Me
          </a>
          !
        </p>
        <div className="icon-container">
          <a
            className="link-no-text icon"
            href="https://github.com/aross2010"
            target="_blank"
          >
            <FaGithub className="footer-icon git" />
          </a>
          <a
            className="link-no-text icon"
            href="https://www.linkedin.com/in/alex-ross-32b278236/"
            target="_blank"
          >
            <FaLinkedin className="footer-icon linked" />
          </a>
        </div>
      </div>
    </footer>
  )
}
