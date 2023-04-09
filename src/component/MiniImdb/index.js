/* eslint-disable import/no-extraneous-dependencies */
import {useState, useEffect} from 'react'

import StarRatingComponent from 'react-star-rating-component'

import {v4} from 'uuid'

import './index.css'

const tagsList = [
  {
    optionId: 'HINDI',
    displayText: 'Hindi',
  },
  {
    optionId: 'TELUGU',
    displayText: 'Telugu',
  },
  {
    optionId: 'ENGLISH',
    displayText: 'English',
  },
]

const MiniImdb = () => {
  const [inputTitle, setInputTitle] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [inputImage, setInputImage] = useState('')
  const [inputTag, setInputTag] = useState(tagsList[0].optionId)
  const [taskList, setTaskList] = useState([])
  const [activeTag, setActiveTag] = useState('INITIAL')
  const [sortBy, setSortBy] = useState('')
  const [rating, setRating] = useState(0)

  const changeInputTitle = event => {
    setInputTitle(event.target.value)
  }

  const changeInputDescription = event => {
    setInputDescription(event.target.value)
  }

  const changeInputImage = event => {
    setInputImage(event.target.value)
  }

  const onChangeTag = event => {
    setInputTag(event.target.value)
  }

  const onClickActiveTag = event => {
    setActiveTag(prevState =>
      prevState === event.target.value ? 'INITIAL' : event.target.value,
    )
  }

  const submitForm = event => {
    event.preventDefault()

    const newTask = {
      id: v4(),
      inputTitle,
      inputImage,
      inputDescription,
      inputTag,
      rating,
    }

    setTaskList(prevState => [...prevState, newTask])
    setInputTitle('')
    setRating(0)
    setInputDescription('')
    setInputImage('')
  }
  const sortMovies = sort => {
    if (sort === 'titleAscending') {
      taskList.sort((a, b) => a.inputTitle.localeCompare(b.inputTitle))
    } else if (sort === 'titleDescending') {
      taskList.sort((a, b) => b.inputTitle.localeCompare(a.inputTitle))
    } else if (sort === 'ratingAscending') {
      taskList.sort((a, b) => a.rating - b.rating)
    } else if (sort === 'ratingDescending') {
      taskList.sort((a, b) => b.rating - a.rating)
    }
    setTaskList(taskList)
  }

  const handleDropdownChange = event => {
    const sort = event.target.value
    setSortBy(sort)
    sortMovies(sort)
  }

  useEffect(() => {
    const taskLists = JSON.parse(localStorage.getItem('taskList'))
    if (taskLists) {
      setTaskList(taskLists)
    }
  }, [])

  const onClearButton = () => {
    localStorage.removeItem('taskList')
    setTaskList([])
  }

  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(taskList))
  }, [taskList])

  const filterTaskList =
    activeTag === 'INITIAL'
      ? taskList
      : taskList.filter(each => each.inputTag === activeTag)

  return (
    <div className="app-container">
      <div className="my-movie-container">
        <h1>My Movies</h1>
        <ul className="lang-list">
          {tagsList.map(each => {
            const active = activeTag === each.optionId
            const isActive = active ? 'tab-button active' : 'tab-button'
            return (
              <li key={each.optionId}>
                <button
                  type="button"
                  value={each.optionId}
                  onClick={onClickActiveTag}
                  className={isActive}
                >
                  {each.displayText}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="title-rating-container">
          <select
            id="sort-by"
            name="sort-by"
            value={sortBy}
            onChange={handleDropdownChange}
          >
            <option>Title</option>
            <option value="titleAscending">Title (A-Z)</option>
            <option value="titleDescending">Title (Z-A)</option>
          </select>
          <select
            id="sort-by"
            name="sort-by"
            value={sortBy}
            onChange={handleDropdownChange}
          >
            <option>Rating</option>
            <option value="ratingAscending">Rating (Low to High)</option>
            <option value="ratingDescending">Rating (High to Low)</option>
          </select>
        </div>
        <ul className="movies-list">
          {filterTaskList.map(each => (
            <li key={each.id} className="title-img-list">
              <div className="title-section">
                <img src={each.inputImage} className="image" alt="img" />
                <div>
                  <p className="title-name">{each.inputTitle}</p>
                  <p>{each.inputDescription}</p>
                </div>
              </div>
              <div>
                <StarRatingComponent
                  name="rate1"
                  starCount={5}
                  value={each.rating}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form className="form-container" onSubmit={submitForm}>
        <h1 className="form-heading">Movie form</h1>
        <div className="form">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="input"
            onChange={changeInputTitle}
            value={inputTitle}
            required
          />
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            id="description"
            className="input-des"
            onChange={changeInputDescription}
            value={inputDescription}
            rows="5"
            required
          />
          <label htmlFor="image">Image Url</label>
          <input
            type="text"
            id="image"
            className="input"
            onChange={changeInputImage}
            value={inputImage}
            required
          />
          <label htmlFor="file" className="file-label">
            OR
          </label>
          <input
            type="file"
            id="file"
            name="filename"
            onChange={changeInputImage}
          />
        </div>
        <div className="rating">
          <p className="rate">Rating</p>
          <StarRatingComponent
            name="rate1"
            starCount={5}
            value={rating}
            onStarClick={() => setRating(prevState => prevState + 1)}
          />
        </div>

        <label htmlFor="language" className="lang">
          Language
        </label>
        <select
          name="language"
          id="language"
          onChange={onChangeTag}
          value={inputTag}
        >
          <option value="">select lang</option>
          {tagsList.map(each => (
            <option value={each.optionId} key={each.optionId}>
              {each.displayText}
            </option>
          ))}
        </select>
        <div className="button-container">
          <button type="button" className="button" onClick={onClearButton}>
            Clear
          </button>
          <button type="submit" className="button">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
export default MiniImdb
