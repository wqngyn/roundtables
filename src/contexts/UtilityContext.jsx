import { createContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faAngleUp, faAnglesUp, faAngleDown, faBan, faUpRightAndDownLeftFromCenter, faScaleUnbalanced } from '@fortawesome/free-solid-svg-icons'
export const UtilityContext = createContext({});

export const sortArr = (arr, criterion, ascending) => {
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    if(ascending) { 
        return arr.sort((a, b) => collator.compare(a[criterion], b[criterion]));
    } else {
        return arr.sort((a, b) => collator.compare(b[criterion], a[criterion]));
    }
}

export const filterState = [
    {
        type: 'Perfect',
        active: false,
        icon: <i className="icon-filter no-hover"><FontAwesomeIcon id='filter' icon={faWandMagicSparkles} size='xl'/></i>
    },
    {
        type: 'Plus One',
        active: false,
        icon: <i className="icon-filter no-hover"><FontAwesomeIcon icon={faAngleUp} size='xl'/></i>
    },
    {
        type: 'Plus Two',
        active: false,
        icon: <i className="icon-filter no-hover"><FontAwesomeIcon icon={faAnglesUp} size='xl'/></i>
    },
    {
        type: 'Minus One',
        active: false,
        icon: <i className="icon-filter no-hover"><FontAwesomeIcon icon={faAngleDown} size='xl'/></i>
    },
    {
        type: 'No Match',
        active: false,
        icon: <i className="icon-filter no-hover"><FontAwesomeIcon icon={faBan} size='xl'/></i>,
    },
    {
        type: 'Diagonal',
        active: false,
        icon: <i className="icon-filter no-hover"><FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} size='xl/></i>
    },
    {
        type: 'Scale Change',
        active: false,
        icon: <i className="icon-filter no-hover"><FontAwesomeIcon icon={faScaleUnbalanced} size='xl'/></i>
    },
];

export const columns = [
    {
        title: 'Title',
        id: 'name',
        icon: undefined,
        sort: undefined,
    },
    {
        title: 'Key',
        id: 'key',
        icon: undefined,
        sort: undefined,
    },
    {
        title: 'Camelot',
        id: 'camelot',
        icon: undefined,
        sort: undefined,
    },
    {
        title: 'BPM',
        id: 'tempo',
        icon: undefined,
        sort: undefined,
    },
]

