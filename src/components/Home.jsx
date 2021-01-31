import React, { useState } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import './Home.scss'


export default function Home({ list, getArticle, wikiList }) {

    const [description, setDescription] = useState('')
    const [value, setValue] = useState({})


    const addArticle = () => {
        const { pageid, title } = value

        if (description&&title) {
            getArticle({
                title,
                description,
                pageId: pageid
            })
        }
        setDescription('')
        setValue({})
    }

    return (
        <div className='home-container'>


            <div className="home">
                <section className='home__search'>
                    <Autocomplete
                        id="free-solo-2-demo"
                        disableClearable
                        options={list}
                        getOptionLabel={(option) => option.title}
                        

                        onChange={(event, value) => setValue(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Article"
                                margin="normal"
                                variant="outlined"
                                InputProps={{ ...params.InputProps, type: 'search' }}
                            />
                        )}
                    />
                    <button onClick={() => addArticle()} className='submit-btn'>Add</button>
                </section>
                <section className='home__form'>
                    <form  >
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className='home__input' />
                    </form>
                </section>
            </div>
        </div>
    )
}
