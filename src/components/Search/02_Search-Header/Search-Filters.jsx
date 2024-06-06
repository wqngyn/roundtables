import { useState } from 'react'
import styles from './Search-Filters.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

const SearchFilters = ({ 
    filters,
    setFilterActive,
    selectedFilterType,
    setSelectedFilterType,
    setSort,
    columnHeaders
}) => {
    
    const [hidden, setHidden] = useState(true);

    const handleClick = (e) => { 
        e.preventDefault();
        const filterId = e.target.closest('button').id;
        const filter = filters.find(filter => filter.type === filterId);
        // Only filter buttons have an ID that matches the key.
        if(filter) {
            setSelectedFilterType(filter.type)
        } else {
            setSelectedFilterType(undefined);
            columnHeaders.forEach(column => {
                column.sort = undefined;
                column.icon = undefined;
            })
            setSort({active: false, parameter: undefined, ascending: undefined});
        } 
        // filterActive is useEffect dependency in Search-Results to re-render the results.
        setFilterActive(filterActive => !filterActive);
        setHidden(hidden => !hidden);
        // document.startViewTransition(() => {
        //     // Hides and unhides 'icon-cancel' button.
        //     setHidden(hidden => !hidden);
        // })
        // if (!document.startViewTransition) {
        //     setHidden(hidden => !hidden);
        // }
    }

    return(
        <div className={styles.searchFilters}>
            <button className={!hidden ? styles['btn-cancel'] : `${styles['btn-cancel']} removed`} id={null} onClick={(e) => handleClick(e)}>
                <i className='icon-cancel'><FontAwesomeIcon icon={faCircleXmark} id='delete'  size='xl'/></i>
            </button>
            
            <div className="x-scroll">
                {filters && filters.map((filter, index) => 
                    <button 
                        style={{viewTransitionName: `filter-${index+1}`}}
                        className={filter.active ? `btn ${styles['btn-filter']}` : `btn removed ${styles['btn-filter']}`}
                        disabled={(filter.type === selectedFilterType)}
                        onClick={(e) => handleClick(e)} 
                        id={filter.type} 
                        key={filter.type}>
                            <h4>{filter.icon} {filter.type}</h4>
                    </button> 
                )}
            </div>
    
        </div>
    )
}

export default SearchFilters