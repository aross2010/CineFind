import '../styles/lists.css'
import { Link } from 'react-router-dom'
import Dropdown from '../compenents/Dropdown'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import ListWrapper from '../compenents/lists/ListWrapper'
import usePopupHook from '../hooks/popupHook'
import { listSortFunction } from '../functions/sorting-functions'

export default function ListsHub() {
  const [lists, setLists] = useState([])
  const [listSortMethod, setListSortMethod] = useState({
    label: 'Updated',
    value: 'updated',
    desc: true,
  })
  const [loading, setLoading] = useState(true)
  const { setPopup } = usePopupHook()
  useEffect(() => {
    handleListSort(listSortMethod)
  }, [listSortMethod])
  const topContainer = useRef()

  const handleListSort = (method) => {
    if (!method) return
    const sorted = [...lists].sort(listSortFunction(listSortMethod))
    setLists(sorted)
  }

  const handleListSelect = (method) => {
    setListSortMethod((prev) => {
      if (prev.value === method.value)
        return {
          ...prev,
          desc: !prev.desc,
        }
      else return method
    })
  }

  const data = {
    options: [
      { label: 'Date', value: 'updated', desc: true },
      { label: 'Likes', value: 'likes', desc: true },
      { label: 'Length', value: 'length', desc: true },
    ],
    handleSelect: handleListSelect,
    selected: listSortMethod,
  }

  const fetchLists = async () => {
    try {
      const { data } = await axios.get(
        'https://www.cinefindapi.vercel.app/lists'
      )
      setLists(data)
    } catch (e) {
      setPopup('Something went wrong fetching lists.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLists()
  }, [])

  const content = (
    <div className="lists-container">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          paddingBottom: '3rem',
        }}
      >
        <h1>Create & discover your cinematic experience.</h1>
        <Link to={'/lists/create'}>
          <button
            className="create-list-btn submit-btn square-btn"
            style={{ minWidth: '10rem' }}
          >
            Create List
          </button>
        </Link>
      </div>
      <section>
        <h5
          ref={topContainer}
          className="section-header"
          style={{ marginBottom: '0' }}
        >
          Lists from the Community
          <Dropdown
            headerDisplayed
            selected={data.selected}
            handleSelect={data.handleSelect}
            icons
            header={'sort'}
            options={data.options}
            alt
          />
        </h5>
        <div
          style={loading ? { opacity: 0 } : { opacity: 1 }}
          className="community-lists"
        >
          <ListWrapper
            lists
            sortMethod={listSortMethod}
            list={lists}
            setLists={setLists}
            maxDisplayed={10}
            topContainer={topContainer}
          />
        </div>
      </section>
    </div>
  )

  return content
}
