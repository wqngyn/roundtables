import { useState } from 'react' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faHouse, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import styles from './Search-Bar.module.scss'

const SearchBar = ({ 
    setSearchResults, 
    getRefreshToken,
}) => {

    const [input, setInput] = useState('');

    const handleInput = (e) => {
        setInput(e.target.value);
    }

    const handleClick = (e) => {
        handleSubmit(e);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(input !== '') {
            try {
                // Search > Search for Item
                const response = await fetch(`https://api.spotify.com/v1/search?q=${input}&type=track&limit=20`, {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token')}
                }) 
                const data = await response.json();
                if(data.error && data.error.status === 401) {
                    getRefreshToken();
                }
                setSearchResults(data.tracks.items);
                setInput('');
            } catch(err) {
                console.error(err);
            }
        }
    }

    return (
        <div className={`${styles['container-search']}`}>
            <div className={`${styles['search']} box-shadow`}>
                <form onSubmit={handleSubmit}>
                    <i 
                        className={input === '' ? `${styles['icon-search']} ${styles.inactive} no-hover` : `${styles['icon-search']} ${styles.active}`}
                        onClick={(e) => handleClick(e)}
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </i>
                    <input 
                        type="text" 
                        onChange={e => handleInput(e)}
                        value={input}
                        className={styles['search-input']}
                        placeholder="Search by track, artist, or album." 
                    />
                </form>
            </div>
            <i><FontAwesomeIcon icon={faCircleInfo} size='2xl' /></i>
        </div>
  
    )
}

export default SearchBar