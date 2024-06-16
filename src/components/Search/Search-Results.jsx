import { useState, useEffect, useContext, useRef } from 'react'
import SearchResultsRow from './SearchResultsRow'
import { KeyConversionContext, compareCamelotKey } from '../../contexts/KeyConversionContext'
import { UtilityContext } from '../../contexts/UtilityContext'
import { TokenAuthContext } from '../../contexts/TokenAuthContext'

import styles from './Search-Results.module.scss'

const searchResults = ({ 
    searchResults, 
    filterActive,
    selectedFilterType,
    trackFeatures,
    setTrackFeatures,
    setCurrentTrack,
    playlistActive,
    playlist,
    setPlaylist,
    filters,
    setFilters,
    renderedSearchResults,
    setRenderedSearchResults,
    unfilteredSearchResults,
    setUnfilteredSearchResults,
    sort,
}) => {

    const [tracklistFeatures, setTracklistFeatures] = useState(JSON.parse(localStorage.getItem('tracklistFeatures')));
    const [trackIdArr, setTrackIdArr] = useState(JSON.parse(localStorage.getItem('trackIdArr')));
    const { convertToKey, convertToCamelotKey } = useContext(KeyConversionContext);
    const { getRefreshToken } = useContext(TokenAuthContext);
    const { sortArr } = useContext(UtilityContext);

    useEffect(() => {
        localStorage.setItem('trackIdArr', JSON.stringify(trackIdArr));
        localStorage.setItem('tracklistFeatures', JSON.stringify(tracklistFeatures));
        localStorage.setItem('renderedSearchResults', JSON.stringify(renderedSearchResults));
      }, [tracklistFeatures, renderedSearchResults, trackIdArr])

    // This prevents fetch on first render (i.e. refresh) to prevent unneeded API calls. It becomes true after first fetch.
    const didMount = useRef(false); 
    const table = useRef();

    // Fetch audio features for whole tracklist.
    useEffect(() => {

        // 1. Push trackId from each result in searchResult to trackIdArr.
        const arr = [];
        const searchResultsClone = structuredClone(searchResults);
        if(searchResultsClone) {
            searchResultsClone.map(track => { arr.push(track.id); });
            setTrackIdArr(arr);
        }
        
        try {
            // 2. Using trackIdArr, fetch audio features for whole list.
            const fetchTracklistFeatures = async() => {
                const trackIdArrStr = arr.join('%2C');
                const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIdArrStr}`, {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token')}
                });
                const data = await response.json();
                if(data.error && data.error.status === 401) {
                    getRefreshToken();
                } else {
                    setTracklistFeatures(data.audio_features, setInitialValues(data.audio_features));
                } 
            }

            const setInitialValues = (audioFeatures) => {
                if(!didMount.current) {
                    setCurrentTrack(searchResults[0]);
                    setTrackFeatures(audioFeatures[0]);
                    didMount.current = true;
                }
            }

            if(arr.length !== 0 && !didMount.current) {
                const localTracklistFeatures = JSON.parse(localStorage.getItem('tracklistFeatures'));
                if(!localTracklistFeatures) {
                    fetchTracklistFeatures();
                } else {
                    setTracklistFeatures(localTracklistFeatures);
                    didMount.current = true;
                }
            }

        } catch(err) {
            console.error(err);
        }
    }, [searchResults])

    // Add camelot, key, tempo, and key match properties to searchResults.
    useEffect(() => {
        const searchResultsWithAudioFeatures = structuredClone(searchResults);
      
        if(tracklistFeatures) {
            searchResultsWithAudioFeatures.forEach((result, index) => {
                result['removed'] = false;
                result['key'] = convertToKey([tracklistFeatures[index].key, tracklistFeatures[index].mode]);
                result['camelot'] = convertToCamelotKey([tracklistFeatures[index].key, tracklistFeatures[index].mode]);
                result['tempo'] = tracklistFeatures[index].tempo;
                if(trackFeatures)
                    result['keyMatch'] = compareCamelotKey(convertToCamelotKey([trackFeatures.key, trackFeatures.mode]), result.camelot); 
            });
        }

        setUnfilteredSearchResults(searchResultsWithAudioFeatures);
        if(!filterActive) setRenderedSearchResults(searchResultsWithAudioFeatures);

    }, [trackFeatures, tracklistFeatures, searchResults])



     // Set unique key match filters.
     useEffect(() => {
        if(trackFeatures && tracklistFeatures) {
            let filtersClone = [...filters];
            if(renderedSearchResults.length >= 1) {
                filtersClone.map((filter, index) => {
                    // Look in renderedSearchResults to see if there is a result that matches selectedFilterType and is not removed.
                    const match = renderedSearchResults.find(result => (result.keyMatch === filter.type && result.removed === false));
                    // If there is a match, set filter to active, if not false.
                    match !== undefined ? (filtersClone[index].active = true) : (filtersClone[index].active = false);
                });
                setFilters(filtersClone);
            }
        }
    }, [tracklistFeatures, renderedSearchResults])

    // Handle sorting and filtering, then setRenderedSearchResults.
    useEffect(() => {
        let unfilteredSearchResultsCopy = structuredClone(unfilteredSearchResults);

        if(sort.active) sortArr(unfilteredSearchResultsCopy, sort.parameter, sort.ascending);

        if(filterActive) {
            unfilteredSearchResultsCopy.forEach((result) => {
                (selectedFilterType !== result.keyMatch) ? result.removed = true : result.removed = false;
            });
        } else { 
            unfilteredSearchResultsCopy.forEach(result => { result.removed = false; }); 
        }       
        
        setRenderedSearchResults(unfilteredSearchResultsCopy);
    }, [sort, filterActive])


    return (
        <div className={styles.searchResults} ref={table}>
            {/* Make tracklistFeatures required to prevent premature re-render (i.e., NaN BPM) */}
            {(renderedSearchResults && tracklistFeatures) && renderedSearchResults.map((track, index) => 
                <SearchResultsRow key={track.id}
                    track={track}
                    index={index}
                    filterActive={filterActive}
                    playlist={playlist}
                    setPlaylist={setPlaylist}
                    playlistActive={playlistActive}
                    filters={filters}
                    setCurrentTrack={setCurrentTrack}
                    setTrackFeatures={setTrackFeatures}
                    tracklistFeatures={tracklistFeatures}
                    removed={track.removed}
                />
            )}
        </div>

    )
}

export default searchResults