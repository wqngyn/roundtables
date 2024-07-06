import styles from './Playlist.module.scss'
import PlaylistTrack from './PlaylistTrack'
import { useState, useEffect, useContext } from 'react'
import { TokenAuthContext } from '../contexts/TokenAuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { KeyConversionContext } from '../contexts/KeyConversionContext'
import { useCollapse } from 'react-collapsed'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

const Playlist = ({ 
    playlist,
    setPlaylist,
    filters,
    trackFeatures
}) => {
    const [userId, setUserId] = useState(null);
    const [playlistId, setPlaylistId] = useState(null);
    const [buttonText, setButtonText] = useState('Save Playlist to Spotify')
    const [defaultExpanded] = useState(true);
    const [playlistOrder, setPlaylistOrder] = useState(playlist);
    const [isSaving, setIsSaving] = useState(false);
    const { compareCamelotKey, convertToCamelotKey } = useContext(KeyConversionContext);
    const { getRefreshToken } = useContext(TokenAuthContext);
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
        setPlaylistOrder(playlist);
    }, [playlist])

    useEffect(() => {
      localStorage.setItem('userId', JSON.stringify(userId));
      localStorage.setItem('playlistId', JSON.stringify(playlistId));
      localStorage.setItem('playlist', JSON.stringify(playlist));
    }, [userId, playlistId, playlist])
    
    useEffect(() => {
        (isSaving) && setButtonText('Saving...');
    }, [isSaving])

    const handleSavePlaylist = (e) => {
        e.preventDefault();

        // Users > Get Current User's Profile
        const initializePlaylist =  async() => {
            try {
                setIsSaving(true);
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token')}
                })
                const data = await response.json();
                // pass callback to createEmptyPlaylist
                (data.error && data.error.status === 401) ? getRefreshToken() : setUserId(data.id, createEmptyPlaylist(data.id));;
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
                        'name': 'Roundtables',
                        'description': '',
                        'public': true
                    })
                })
                const data = await response.json();
                 // pass callback to addTracksToPlaylist (as state doesn't update immediately)
                (data.error && data.error.status === 401) ? getRefreshToken() :  setPlaylistId(data.id, addTracksToPlaylist(data.id));;
               
               
            } catch(err) {
                console.error(err);
            }
        }
        const addTracksToPlaylist = async(playlistId) => {
            let urisArr = [];
            playlistOrder.forEach(track => urisArr.push(track.uri));

            try {   
                await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token')},
                    body: JSON.stringify({
                        uris: urisArr,
                        position: 0
                    })
                })  
                // Button theme change on setTimeout
                handleSuccessfulSave();
            } catch(err) {
                console.error(err);
            }
        }

        initializePlaylist();
    }

    const handleSuccessfulSave = () => {
        setButtonText('Playlist Saved!')
        setTimeout(() => {
            setPlaylist([]);
            setIsSaving(false);
            setButtonText('Save Playlist to Spotify');
        }, 2500)
    }

    const handleOnDragEnd = (result) => {
        if(!result.destination) return;
        const playlist = Array.from(playlistOrder);
        // Splice array item at source index and save as temp item
        const [reorderedPlaylist] = playlist.splice(result.source.index, 1);
        // Inject temp item into array at destination index
        playlist.splice(result.destination.index, 0, reorderedPlaylist);
        setPlaylistOrder(playlist);
    }

    return(
        <div className={styles.playlist}>
            <div {...getCollapseProps()} className='container-collapsible'>
                {playlist && 
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="tracks">
                            {(provided) => {
                                return (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {playlistOrder.map((track, index) =>
                                            <PlaylistTrack 
                                                key={track.id}
                                                track={track}
                                                index={index}
                                                playlist={playlist}
                                                setPlaylist={setPlaylist}
                                                filters={filters} 
                                            />
                                        )} 
                                        {provided.placeholder}
                                    </div>
                                );
                            }}  
                        </Droppable>
                    </DragDropContext>
                }
            </div>

            <button 
                id='save' 
                className={`btn ${styles['btn-save']} ${playlist.length === 0 ? 'removed': ''} ${isSaving ? 'saving' :''}`} 
                disabled={isSaving}
                onClick={(e) => handleSavePlaylist(e)}>
                    <h4>{buttonText}</h4>
            </button>

            {playlist.length !== 0 &&
                 <div className={styles.expandCollapse}>
                    <FontAwesomeIcon {...getToggleProps()} icon={!isExpanded ? faCaretUp : faCaretDown} size='2xl' className={styles['icon-expand']} />
                </div>
            }
        </div>
    )
}

export default Playlist


