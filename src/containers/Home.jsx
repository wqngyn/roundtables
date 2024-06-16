import { useEffect, useState, useContext } from 'react'
import SearchBar from '../components/Search/Search-Bar'
import CurrentTrack from '../components/CurrentTrack'
import SearchFilters from '../components/Search/Search-Filters'
import SearchColumns from '../components/Search/Search-Columns'
import SearchResults from '../components/Search/Search-Results'
import Playlist from '../components/Playlist' 
import styles from './Home.module.scss'
import { TokenAuthContext } from '../contexts/TokenAuthContext'
import { UtilityContext } from '../contexts/UtilityContext'

const Home = () => {
    const { getRefreshToken, getToken } = useContext(TokenAuthContext);
    const { filterState, columns } = useContext(UtilityContext);
    const [currentTrack, setCurrentTrack] = useState(JSON.parse(localStorage.getItem('currentTrack')));
    const [trackFeatures, setTrackFeatures] = useState(JSON.parse(localStorage.getItem('trackFeatures')));
    const [searchResults, setSearchResults] = useState(JSON.parse(localStorage.getItem('searchResults')));
    const [playlist, setPlaylist] = useState(localStorage.getItem('playlist') ? JSON.parse(localStorage.getItem('playlist')) : []);
    const [unfilteredSearchResults, setUnfilteredSearchResults] = useState([]); 
    const [renderedSearchResults, setRenderedSearchResults] = useState(JSON.parse(localStorage.getItem('renderedSearchResults')));
    const [selectedFilterType, setSelectedFilterType] = useState(JSON.parse(localStorage.getItem('selectedFilter')));
    const [columnHeaders, setColumnHeaders] = useState(columns)
    const [filters, setFilters] = useState(filterState);
    const [filterActive, setFilterActive] = useState(false);
    const [sort, setSort] = useState({ active: false, parameter: undefined, ascending: undefined});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      if(searchResults) setMounted(true);
      localStorage.setItem('searchResults', JSON.stringify(searchResults));
    }, [searchResults])

    useEffect(() => {
      if(!localStorage.getItem('access_token') && !localStorage.getItem('refresh_token')) {
        localStorage.setItem('access_token', undefined)
        localStorage.setItem('refresh_token', undefined)
        getToken();
      }
      
    }, [])
  
    return (
      <div className={styles['container-body']}>
          <div className={mounted ? `${styles['container-left']}` : `${styles['container-left']} removed`}>
            <div className={styles['left-top']}>
              <CurrentTrack
                currentTrack={currentTrack}
                trackFeatures={trackFeatures}
              />
              <div className='container-header'>
                <SearchFilters               
                    filters={filters}
                    setFilterActive={setFilterActive}
                    selectedFilterType={selectedFilterType}
                    setSelectedFilterType={setSelectedFilterType}
                />
                <SearchColumns
                    setRenderedSearchResults={setRenderedSearchResults}
                    setSort={setSort}
                    columnHeaders={columnHeaders}
             
                />
              </div>
            </div>
            <div className={styles['left-bottom']}>
              <SearchResults
                  searchResults={searchResults}
                  filterActive={filterActive}
                  selectedFilterType={selectedFilterType}
                  trackFeatures={trackFeatures}
                  setTrackFeatures={setTrackFeatures}
                  setCurrentTrack={setCurrentTrack}
                  playlist={playlist}
                  setPlaylist={setPlaylist}
                  filters={filters}
                  setFilters={setFilters}
                  renderedSearchResults={renderedSearchResults}
                  setRenderedSearchResults={setRenderedSearchResults}
                  unfilteredSearchResults={unfilteredSearchResults}
                  setUnfilteredSearchResults={setUnfilteredSearchResults}
                  sort={sort}
              />
            </div>
          </div>
 
          <div className={mounted ? `${styles['container-right']}` : `${styles['container-right']} center-center ${styles['solo-right']}`}>
            <SearchBar 
              setSearchResults={setSearchResults}
              getRefreshToken={getRefreshToken}
            />
            <Playlist
              playlist={playlist}
              setPlaylist={setPlaylist}
              filters={filters}
              trackFeatures={trackFeatures}
            />
          </div>
        </div>

    )
}

export default Home
