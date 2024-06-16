import { useState } from 'react'
import styles from './Search-Results.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

const SearchResultsRow = ({
    track,
    index,
    filterActive,
    playlist,
    setPlaylist,
    filters,
    setCurrentTrack,
    setTrackFeatures,
    tracklistFeatures,
    removed
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleRowHover = () => setIsHovered(isHovered => !isHovered);

    const handleIconClick = (track, e) => {
        if(e.target.tagName === 'svg' || e.target.tagName === 'path') {
            // Use arr.find() to only add tracks that are not already in the playlist.
            const found = playlist.find((element) => element.id === track.id);
            if(found === undefined) {
                let temp = [...playlist, track];
                setPlaylist(temp);
            }
        }
    }

    const handleRowClick = (e, track, index) =>  {
        // prevents accidental setCurrentTrack when adding to playlist.
        if(e.target.tagName !== 'svg' && e.target.tagName !== 'path') {
            !filterActive && setCurrentTrack(track);
            setTrackFeatures(tracklistFeatures[index]); // Prevents redundant API call for single track's audio feature.
        }
    }

    const getFilterIcon = (key) => {
        const filter = filters.find(filter => filter.type === key);
        return filter.icon
    }

    return(
        <div className={removed ? `${styles['row-result']} removed` : `${styles['row-result']}`} key={track.id} onMouseEnter={handleRowHover} onMouseLeave={handleRowHover} style={{viewTransitionName: `row-${index+1}`}}>
            {/* Image/Text: Album, Track Title, Artist */}
            <div className={!filterActive ? styles['track-container'] : `no-cursor ${styles['track-container']}`} onClick={(e) => handleRowClick(e, track, index)}>   

                <div className={styles['track-info']}>
                    <div className={styles.image}>
                        <img src={track.album.images[1].url} className={styles['image-album']}></img>
                    </div>
                    
                    <div className={styles['text']}>
                        <div className={styles.nameArtist}>
                            <h4 className="name">{track.name}</h4>
                            <h5 className="artist">{track.artists[0].name}</h5>
                        </div>
                        <div className={styles['track-features']}>
                            <div className="features-key">
                                <h4 className={styles.label}>{track.key}</h4>
                                <h5 className={styles.feature}>Key</h5>
                            </div>
                            <div className="features-camelot">
                                <h4 className={styles.label}>{track.camelot}</h4>
                                <h5 className={styles.feature}>Camelot</h5>
                            </div>
                            <div className="features-bpm">
                                <h4 className={styles.label}>{track.tempo && Math.round(track.tempo)}</h4>
                                <h5 className={styles.feature}>BPM</h5>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div className={`${styles['track-icons__min']}`}>
                    {track.keyMatch && getFilterIcon(track.keyMatch)}
                    <div className={playlist.find((element) => element.id === track.id) === undefined ? styles['Track-Add'] : `${styles['Track-Add']} removed`} onClick={(e) => handleIconClick(track, e)}>
                        <FontAwesomeIcon icon={faCirclePlus} size='xl' />
                    </div>
                    <div className={playlist.find((element) => element.id === track.id) === undefined ? `${styles['Track-Added']} removed no-cursor` : `${styles['Track-Added']} no-hover`}>
                    <FontAwesomeIcon icon={faCircleCheck} size='xl' />
                </div>
            </div>
            </div>
            
            {/* Text: Track Audio Features */}
            <p className={`${styles['features-key']} no-cursor`}>{track.key}</p>
            <p className={`${styles['features-camelot']} no-cursor`}>{track.camelot}</p>
            <p className={`${styles['features-bpm']} no-cursor`}>{track.tempo && Math.round(track.tempo)}</p>

            {/* Icon: Key Match and Add/Added*/}
            <div className={`${styles['track-icons__max']}`}>
                
                {(!isHovered && track.keyMatch && getFilterIcon(track.keyMatch))}
                
                {(isHovered) &&
                    // Icon: Add Track
                    <div className={playlist.find((element) => element.id === track.id) === undefined ? styles['track-add'] : `${styles['track-add']} removed`} onClick={(e) => handleIconClick(track, e)}>
                        <FontAwesomeIcon icon={faCirclePlus} size='xl' />
                    </div>
                }   

                {(isHovered) && 
                // Icon: Track Added
                    <div className={playlist.find((element) => element.id === track.id) === undefined ? `${styles['track-added']} removed no-cursor` : `${styles['track-added']} no-hover`}>
                            <FontAwesomeIcon icon={faCircleCheck} size='xl' />
                    </div>
                }
            </div>
  
        </div>
    )
}

export default SearchResultsRow