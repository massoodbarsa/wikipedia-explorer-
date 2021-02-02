import React, { useEffect, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import './App.scss';
import Home from './components/Home';
import Header from './components/Header'


function App() {

  const [wikiList, setWikiList] = useState([])
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [wantedArticles, setWantedArticles] = useState([])


  const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&uselang=user&pr op=extracts%7Cpageprops%7Cinfo&generator=prefixsearch&redirects=1&exsentences=1&exi ntro=1&explaintext=1&inprop=url&gpssearch=STAR'


  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await fetch(url)
      const fetchedList = await response.json()
      const pages = fetchedList.query.pages
      const newList = []

      for (let item in pages) {
        newList.push(pages[item])

      }
      setLoading(false)
      setList(newList)

    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleDelete = (id) => {

    const copyWantedList = [...wantedArticles]
    const nnewWantedlist = copyWantedList.filter(item => item.pageId !== id)
    setWantedArticles(nnewWantedlist)

  }

  const getArticle = async (item) => {
    setWantedArticles(prev => [...prev, item])
  }

  const handleSubmit = async () => {
    const array = []

    for (let index = 0; index < wantedArticles.length; index++) {
      const element = wantedArticles[index];
      setLoading(true)
      try {
        const responseByPageId = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${element.pageId}&inprop=url&format=json`)
        const fetchedList = await responseByPageId.json()
        const wikiPage = fetchedList.query.pages

        const newList = { title: '', description: '', fullUrl: '' }

        for (let item in wikiPage) {

          Object.assign(newList, { fullUrl: wikiPage[item].fullurl });
          Object.assign(newList, { title: wikiPage[item].title });
        }

        const responseByTitle = await fetch(`https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&exintro=&titles=${element.title}`)
        const fetchedByTitle = await responseByTitle.json()
        const wikiTitle = fetchedByTitle.query.pages

        for (let item in wikiTitle) {
          Object.assign(newList, { description: wikiTitle[item].extract })

        }

        array.push(newList)
        setWikiList(array)
        setLoading(false)

      } catch (error) {
        console.log(error)
      }
    }

  }

  return (
    <div className="App">
      <Header
        title='Home View'
        label='My wiki List'
        width='60'

      />
      <div>

      </div>
      <div className='articles-container'>

        {
          wantedArticles.map((item, index) => {
            const { title, description, pageId } = item
            return (
              <div className='added-articles' key={index}>
                <span>{title}</span>
                <span>{description}</span>
                <button className='delete-btn' onClick={() => handleDelete(pageId)}>
                  Delete
                 </button>
              </div>
            )
          })
        }

      </div>
      <Home list={list} getArticle={getArticle} wikiList={wikiList} />
      <div className='count'>
        <p className={!wantedArticles.length?'count-zero':'count-not-zero'}>
          {wantedArticles.length} Items
        </p>
        <button className='submit-btn' onClick={handleSubmit}>Submit</button>

      </div>
      <Header
        title='Result View'
        label='My wiki List'
        width='50'

      />

      {wikiList.map((item, index) => {
        const { title, description, fullUrl } = item

        if (loading) {

          return (
            <div className='result'  key={index}>
              <CircularProgress color='secondary' />
            </div>
          )
        }
        return (
          <div className='result-container' key={index}>
            <div className='title'>
              <p >{title}</p>
            </div>
            <div className="result">
              {description && <p className="result__description" dangerouslySetInnerHTML={{ __html: description.slice(0, 300) }}></p>}
              <span ><a href={fullUrl} target="_blank">{fullUrl}</a></span>
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default App;
