import { useContext } from 'react'
import { UtilityContext } from '../../contexts/UtilityContext'
import styles from './Search-Columns.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown, faCirclePlus, faHashtag } from '@fortawesome/free-solid-svg-icons'

const SearchColumns = ({
    setSort,
    renderedSearchResults,
    columnHeaders
}) => {
    
    const { sortArr } = useContext(UtilityContext);

    const handleColumnSort = (e) => {
        e.preventDefault();
        let targetColumn; 
        // If any other columns besides e.target have 'ascending' || 'descending',  clear all.
        columnHeaders.forEach(column => {   
            if(column.id === e.target.id) {
                targetColumn = column;
            } else {
                (column.sort === 'ascending' || column.sort === 'descending') && (column.sort, column.icon = undefined);
            }
        });

        let arr = structuredClone(renderedSearchResults);
        // Order of clicks is is 1. ascending 2. descending 3. no sort
        if(targetColumn.sort !== 'ascending' && targetColumn.sort !== 'descending') {
            targetColumn.sort ='ascending';
            targetColumn.icon = <i className='no-hover'><FontAwesomeIcon icon={faCaretUp} size='xl'/></i>;
            setSort({active: true, parameter: e.target.id, ascending: true});
        } else if(targetColumn.sort === 'ascending') {
            targetColumn.sort = 'descending';
            targetColumn.icon = <i className="no-hover"><FontAwesomeIcon icon={faCaretDown} size='xl'/></i>;
            setSort({active: true, parameter: e.target.id, ascending: false});
        } else {
            targetColumn.sort = undefined;
            targetColumn.icon = undefined;
            setSort({active: false, parameter: undefined, ascending: undefined});
        }
    }

    return(
        <div className={styles['searchColumnHeaders']}>
            <div className={styles['row-header']}>
                {columnHeaders.map((column, index) => {
                    if(index === 0)
                        return (
                            <div className={styles['col-first']} key={column.id}>
                               <h4 className={styles['col-header']} key={column.id} id={column.id} onClick={(e) => handleColumnSort(e)}>{column.title} {column.icon}</h4>
                            </div>
                        )
                    if(column.id) 
                        return <h4 className={styles['col-header']} key={column.id} id={column.id} onClick={(e) => handleColumnSort(e)}>{column.title} {column.icon}</h4>
                })}
        </div>
       </div>
    )
}

export default SearchColumns