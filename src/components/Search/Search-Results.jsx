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
    const isMounted = useRef(false);

    useEffect(() => {
        localStorage.setItem('trackIdArr', JSON.stringify(trackIdArr));
        localStorage.setItem('tracklistFeatures', JSON.stringify(tracklistFeatures));
        localStorage.setItem('renderedSearchResults', JSON.stringify(renderedSearchResults));
      }, [tracklistFeatures, renderedSearchResults, trackIdArr])

    // Fetch audio features for whole tracklist.
    useEffect(() => {

        // 1. Push trackId from each result in searchResult to trackIdArr.
        const idArr = [];
        const searchResultsClone = structuredClone(searchResults);
        if(searchResultsClone) {
            searchResultsClone.map(track => { idArr.push(track.id); });
            setTrackIdArr(idArr);
        }
        
        try {
            // 2. Using trackIdArr, fetch audio features for whole list.
            const fetchTracklistFeatures = async() => {
                console.log('fetch')
                const trackIdArrStr = idArr.join('%2C');
                const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIdArrStr}`, {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token')}
                });
                const data = await response.json();
                (data.error && data.error.status === 401) ? getRefreshToken() : setTracklistFeatures(data.audio_features, setCurrentAsFirst(data.audio_features));
            }

            const setCurrentAsFirst = (audioFeatures) => {
                setCurrentTrack(searchResults[0]);
                setTrackFeatures(audioFeatures[0]);
            }
            
            if(idArr.length !== 0) {
                if(!isMounted.current) {
                    const localTracklistFeatures = JSON.parse(localStorage.getItem('tracklistFeatures'));
                    (!localTracklistFeatures) ? fetchTracklistFeatures() : setTracklistFeatures(localTracklistFeatures);
                    isMounted.current = true;
                } else {
                    fetchTracklistFeatures();
                }   
            }
          
        } catch(err) {
            console.error(err);
        }
    }, [searchResults])

    // Add camelot, key, tempo, and key match properties to searchResults.
    useEffect(() => {
        const searchResultsWithFeatures = structuredClone(searchResults);
        if(tracklistFeatures) {
            searchResultsWithFeatures.forEach((result, index) => {
                result['removed'] = false;
                result['key'] = convertToKey([tracklistFeatures[index].key, tracklistFeatures[index].mode]);
                result['camelot'] = convertToCamelotKey([tracklistFeatures[index].key, tracklistFeatures[index].mode]);
                result['tempo'] = tracklistFeatures[index].tempo;
                if(trackFeatures)
                    result['keyMatch'] = compareCamelotKey(convertToCamelotKey([trackFeatures.key, trackFeatures.mode]), result.camelot); 
            });
        }
        setUnfilteredSearchResults(searchResultsWithFeatures);
        if(!filterActive) setRenderedSearchResults(searchResultsWithFeatures);
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
        <div className={styles.searchResults}>
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