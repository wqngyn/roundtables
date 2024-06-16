import styles from './Playlist.module.scss'
import PlaylistTrack from './PlaylistTrack'
import { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { KeyConversionContext } from '../contexts/KeyConversionContext'
import { useCollapse } from 'react-collapsed'

const Playlist = ({ 
    playlist,
    setPlaylist,
    filters,
    trackFeatures
}) => {
    const [userId, setUserId] = useState(null);
    const [playlistId, setPlaylistId] = useState(null);
    const [playlistName, setPlaylistName] = useState('Set Companion');
    const [buttonText, setButtonText] = useState('Save Playlist to Spotify')
    const [defaultExpanded] = useState(true);
    const { compareCamelotKey, convertToCamelotKey } = useContext(KeyConversionContext);
    const { getToggleProps, getCollapseProps, isExpanded } = useCollapse({ defaultExpanded });

    useEffect(() => {
        let arr = [...playlist];
        if(trackFeatures) {
            arr.forEach(track => {
                track.keyMatch = compareCamelotKey(convertToCamelotKey([trackFeatures.key, trackFeatures.mode]), track.camelot);
            });
        }
        setPlaylist(arr);
    }, [trackFeatures])

    useEffect(() => {
        setUserId(JSON.parse(localStorage.getItem('userId')));  
        setPlaylistId(JSON.parse(localStorage.getItem('playlistId')));  
    }, [])

    useEffect(() => {
      localStorage.setItem('userId', JSON.stringify(userId));
      localStorage.setItem('playlistId', JSON.stringify(playlistId));
      localStorage.setItem('playlist', JSON.stringify(playlist));
    }, [userId, playlistId, playlist])

    const handleSavePlaylist = (e) => {
        e.preventDefault();

        // Users > Get Current User's Profile
        const initializePlaylist =  async() => {
            try {
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token')}
                })
                const data = await response.json();
                // pass callback to createEmptyPlaylist
                setUserId(data.id, createEmptyPlaylist(data.id));
            } catch(err) {
                console.error(err);
            }
        }

        // Playlists > Create Playlist
        const createEmptyPlaylist = async(userId) => {
            try {
                const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token')},
                    body: JSON.stringify({
                        'name': playlistName,
                        'description': '',
                        'public': true
                    })
                })
                const data = await response.json();
                // pass callback to addTracksToPlaylist (as state doesn't update immediately)
                setPlaylistId(data.id, addTracksToPlaylist(data.id));
            } catch(err) {
                console.error(err);
            }
        }
        const addTracksToPlaylist = async(playlistId) => {
            let urisArr = [];
            playlist.forEach(track => urisArr.push(track.uri));

            try {   
                await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token')},
                    body: JSON.stringify({
                        uris: urisArr,
                        position: 0
                    })
                })
                
                setTimeout(() => {
                    setButtonText('Playlist Saved');
                }, 3000);

            } catch(err) {
                console.error(err);
            }
        }
        
        initializePlaylist();
        setPlaylist([]);
    }

    return(
        <div className={styles.playlist}>
            <div {...getCollapseProps()} className='container-playlist'>
                
                {playlist && playlist.map((track, index) =>
                    <PlaylistTrack key={track.id}
                        track={track}
                        index={index}
                        playlist={playlist}
                        setPlaylist={setPlaylist}
                        filters={filters}
                    />
                )}

                <button 
                    id='save' 
                    className={playlist.length === 0 ? `btn removed ${styles['btn-save']}` : `btn ${styles['btn-save']}`} 
                    onClick={(e) => handleSavePlaylist(e)}>
                        <h4>{buttonText}</h4>
                </button>

            </div>

            {playlist.length !== 0 &&
                 <div className={styles.expandCollapse}>
                     <FontAwesomeIcon {...getToggleProps()} icon={isExpanded ? faCaretUp : faCaretDown} size='2xl' className={styles['icon-expand']} />
                </div>
            }
        </div>
    )
}

export default Playlist


