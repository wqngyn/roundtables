import styles from './Playlist.module.scss'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleMinus } from '@fortawesome/free-solid-svg-icons'

const PlaylistTrack = ({
    track,
    index,
    playlist,
    setPlaylist,
    filters,
}) => {

    const [isHovered, setIsHovered] = useState(false);
    const handleRowHover = () => setIsHovered(isHovered => !isHovered);

    const deleteFromPlaylist = (track) => {
        let arr = [...playlist];
        arr.splice(arr.indexOf(track), 1);
        setPlaylist(arr);
    }

    const getFilterIcon = (key) => {
        const filter = filters.find(filter => filter.type === key);
        return filter.icon
    }

    return (
        <div className={styles['row-playlist']} onMouseEnter={handleRowHover} onMouseLeave={handleRowHover}>
            <div className={styles.track}>

                <div className={styles['track-number']}>{index+1}</div>

                <div className="track-image">
                    <img src={track.album.images[2].url} className={styles.Album}></img>
                </div>

                <div className={styles['track-text']}>
                    <h4 className="Name">{track.name}</h4>
                    <h5 className="Artist">{track.artists[0].name}</h5>
                </div>
                </div>

                <div className={styles['track-icons__min']}>
                    {track.keyMatch && getFilterIcon(track.keyMatch)}
                    <div className={`icon ${styles['icon-delete']}`} onClick={() => deleteFromPlaylist(track)}>
                            <FontAwesomeIcon icon={faCircleMinus} size='xl' />
                    </div>
                </div>

                <div className={styles['track-icons__max']}>
                    {!isHovered && 
                        <div className='track-icon no-hover' onClick={() => deleteFromPlaylist(track)}>
                            {track.keyMatch && getFilterIcon(track.keyMatch)}
                        </div>
                    }

                    {isHovered &&
                        <div className="track-icon">
                            <div className={!isHovered ? `icon removed ${styles['icon-delete']}` : `icon ${styles['icon-delete']}`} onClick={() => deleteFromPlaylist(track)}>
                                <FontAwesomeIcon icon={faCircleMinus} size='xl' />
                            </div>
                        </div>
                    }
                </div>
        </div>
    )
}

export default PlaylistTrack