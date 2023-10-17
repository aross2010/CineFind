import React, { useEffect, useState, useRef, useContext } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import TextInput from '../compenents/TextInput'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import CheckBox from '../compenents/CheckBox'
import Sort from '../compenents/find/Sort'
import sortFilms from '../functions/sort-films'
import { useNavigate, useParams } from 'react-router-dom'
import { ThreeDots } from 'react-loader-spinner'
import axios from 'axios'
import DeleteWarning from '../compenents/DeleteWarning'
import Loading from '../compenents/LoadingSpinner'
import { UserContext } from '../context/userContext'
import usePopupHook from '../hooks/popupHook'
import useWindowSizeHook from '../hooks/widowSizeHook'

export default function ListCreate() {
  const [films, setFilms] = useState([])
  const [ranked, setRanked] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sort, setSort] = useState({})
  const [postersLoaded, setPostersLoaded] = useState([false])
  const [filmRankInput, setFilmRankInput] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [list, setList] = useState(null)
  const [deleteWarning, setDeleteWarning] = useState(false)

  const { user } = useContext(UserContext)
  const { width } = useWindowSizeHook()
  const { setPopup } = usePopupHook()

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchListDetails = async (id) => {
      setPageLoading(true)
      const list = await axios.get(`https://cinefindapi.vercel.app/lists/${id}`)
      setList(list.data)
    }
    if (id) fetchListDetails(id)
  }, [])

  useEffect(() => {
    if (list) {
      if (user.name !== list.user.name) {
        navigate('/lists')
        setPopup('You do not have access to edit this list.')
      }
      setName(list.name)
      setDescription(list.description)
      setFilms(list.films)
      setRanked(list.ranked)
      setIsPrivate(list.private)
      let arr = []
      setFilmRankInput(
        list.films.map((_, index) => {
          arr.push(true)
          return index + 1
        })
      )
      setPostersLoaded(arr)
      setPageLoading(false)
    }
  }, [list])

  function handleOnDragEnd(result) {
    if (!result.destination) return
    const items = Array.from(films)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFilms(items)
    setIsDragging(false)
  }

  const handleRemoveFilm = (index) => {
    const updated = [...films.slice(0, index), ...films.slice(index + 1)]
    setFilms(updated)
  }

  const handleFilmSelection = (film) => {
    const { id, poster, title, year } = film
    const adjustedFilm = {
      tmdbID: id,
      poster,
      title,
      year: parseInt(year),
    }
    if (films) {
      if (films.some((film) => parseInt(film.tmdbID) === adjustedFilm.tmdbID))
        return
      const current = [...films]
      current.push(adjustedFilm)
      setFilms(current)
      setFilmRankInput(
        current.map((movie, i) => {
          return i + 1
        })
      )
    } else {
      let arr = []
      arr.push(adjustedFilm)
      setFilms(arr)
      setFilmRankInput(
        arr.map((movie, i) => {
          return i + 1
        })
      )
    }
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handlePosterLoad = (index) => {
    const newPostersLoaded = [...postersLoaded]
    newPostersLoaded[index] = true
    newPostersLoaded.push(false)
    setPostersLoaded(newPostersLoaded)
  }

  const handleRankChange = (e, index) => {
    const newFilmRanks = [...filmRankInput]
    const newPosition = e.target.value
    newFilmRanks[index] = newPosition
    setFilmRankInput(newFilmRanks)
  }

  const handleEndEdit = (index) => {
    const newFilms = [...films]
    const newPosition = filmRankInput[index]
    const [movieToInsert] = newFilms.splice(index, 1)
    newFilms.splice(newPosition - 1, 0, movieToInsert)
    setFilms(newFilms)

    setFilmRankInput(
      films.map((movie, i) => {
        return i + 1
      })
    )
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') e.target.blur()
  }

  const renderedList = films && (
    <DragDropContext
      onDragEnd={handleOnDragEnd}
      onDragStart={() => setIsDragging(true)}
    >
      <Droppable droppableId="list">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`movie-list ${isDragging && 'dragging'} ${
              postersLoaded.length >= 2 && 'active'
            }`}
            style={
              films.length > 6
                ? { overflowY: 'scroll', maxHeight: '30rem' }
                : {}
            }
          >
            {films.map((film, index) => {
              return (
                <Draggable
                  key={film.tmdbID}
                  draggableId={film.title}
                  bounds="parent"
                  scroll={{ x: 0, y: 200 }}
                  index={index}
                >
                  {(provided) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className={`preview-container ${
                        !postersLoaded[index] ? 'not-loaded' : 'loaded'
                      }`}
                    >
                      {ranked && (
                        <div className="rank-display">
                          <input
                            type="number"
                            className="rank"
                            value={filmRankInput[index]}
                            onChange={(e) => handleRankChange(e, index)}
                            onBlur={() => handleEndEdit(index)}
                            onKeyUp={(e) => handleEnter(e)}
                          />
                        </div>
                      )}
                      <div
                        style={{
                          width: '2.75rem',
                          marginRight: '1rem',
                        }}
                      >
                        <img
                          className="preview-poster poster"
                          src={film.poster}
                          onLoad={() => handlePosterLoad(index)}
                        />
                      </div>

                      <h5 className="preview-title">{film.title}</h5>
                      <RiDeleteBin5Fill
                        className="trash-icon"
                        onClick={() => handleRemoveFilm(index)}
                      />
                    </li>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )

  const noMoviesContainer = (
    <div className="no-movies-container">
      Films from your list will appear here.
    </div>
  )

  const handleSort = (method) => {
    if (!films) return
    setFilms(sortFilms(films, method))
  }

  const handleCancel = (e) => {
    e.preventDefault()
    navigate('/lists')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      name,
      description,
      films,
      ranked,
      user,
      isPrivate,
      updated: new Date(),
    }

    try {
      const postedList = await axios.post(
        'https://cinefindapi.vercel.app/lists',
        data
      )
      setLoading(false)
      navigate(`/list/${postedList.data._id}`)
      setPopup('List created!', true)
    } catch (e) {
      setLoading(false)
      setPopup(e.response.data.error)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      name,
      description,
      films,
      ranked,
      private: isPrivate,
      updated: new Date(),
    }

    try {
      const updatedList = await axios.put(
        `https://cinefindapi.vercel.app/lists/${list._id}`,
        data
      )
      setLoading(false)
      setPopup('Successfully updated list!', true)
      navigate(`/list/${list._id}`)
    } catch (e) {
      setLoading(false)
      setPopup(e.response.data.error)
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    setPageLoading(true)

    try {
      const deletedList = await axios.delete(
        `https://cinefindapi.vercel.app/lists/${list._id}`
      )
      setPageLoading(false)
      setPopup('Successfully deleted list!', true)
      navigate(-1)
    } catch (e) {
      setPageLoading(false)
      setPopup(e.response.data.error)
    }
  }

  const handleDeleteWarning = (e) => {
    e.preventDefault()
    setDeleteWarning(true)
  }

  const checkboxes = (
    <>
      <div
        className="checkbox-wrapper"
        onClick={() => setRanked(!ranked)}
      >
        <CheckBox checked={ranked} />
        Ranked
      </div>

      <div
        className="checkbox-wrapper"
        onClick={() => setIsPrivate(!isPrivate)}
      >
        <CheckBox checked={isPrivate} />
        Private
      </div>
    </>
  )

  const formBtns = (
    <div
      className="list-form-btns"
      style={width <= 750 ? { marginTop: '2rem' } : {}}
    >
      <button
        onClick={handleCancel}
        className="cancel-btn square-btn"
        disabled={loading}
      >
        Cancel
      </button>
      <button
        className={`square-btn ${
          width < 750 ? 'submit-btn' : 'delete-btn-list'
        }`}
        onClick={!list ? handleSubmit : handleDeleteWarning}
        type={!list ? 'submit' : ''}
        disabled={loading}
      >
        {!loading && list && width > 750 ? (
          'Delete'
        ) : !loading && width <= 750 ? (
          'Submit'
        ) : (
          <ThreeDots
            height={26}
            width={26}
            color="var(--primary-text)"
          />
        )}
      </button>
      {width <= 750 && (
        <button
          style={{ marginLeft: 'auto' }}
          className="square-btn delete-btn-list"
          disabled={loading}
          onClick={handleDeleteWarning}
        >
          delete
        </button>
      )}
    </div>
  )

  const form = (
    <form onSubmit={list ? handleEdit : handleSubmit}>
      <div className="create-list-container">
        <h3>{list ? 'Edit' : 'Create'} List</h3>

        <div className="form-container">
          <div className="left-col">
            <div>
              <label htmlFor="list-title-input">Name</label>
              <input
                type="text"
                id="list-title-input"
                className="list-title-input"
                value={name}
                onChange={handleNameChange}
                autoComplete="off"
              />
            </div>
            {width > 750 && checkboxes}
          </div>
          <div className="right-col">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {width <= 750 && checkboxes}
        </div>

        <div className="preview-list-container">
          <label>Add Films</label>
          <div className="list-query-container">
            <div className="list-text-input-container">
              <TextInput
                handleFilmSelection={handleFilmSelection}
                moreInfo={true}
              />
            </div>
            <div style={{ display: 'flex', height: '100%' }}>
              <Sort
                alt={true}
                handleSort={handleSort}
                setSort={setSort}
                sort={sort}
              />
            </div>
            {width > 750 && formBtns}
          </div>

          {films.length > 0 ? renderedList : noMoviesContainer}
          {list && width > 750 && (
            <button
              className="square-btn submit-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              Submit
            </button>
          )}
        </div>
        {width <= 750 && formBtns}
      </div>
    </form>
  )

  return pageLoading ? (
    <Loading />
  ) : (
    <>
      {' '}
      {form}
      <DeleteWarning
        handleDelete={handleDelete}
        open={deleteWarning}
        setOpen={setDeleteWarning}
      />
    </>
  )
}
