import  { useContext, useEffect } from 'react'
import { KeyConversionContext } from '../contexts/KeyConversionContext';
import styles from './CurrentTrack.module.scss'
 
const CurrentTrack = ({ currentTrack, trackFeatures }) => {
      
    useEffect(() => {
        localStorage.setItem('currentTrack', JSON.stringify(currentTrack));
        localStorage.setItem('trackFeatures', JSON.stringify(trackFeatures));
    }, [currentTrack, trackFeatures])
  
    const { convertToKey, convertToCamelotKey } = useContext(KeyConversionContext);

    return (
        <div className={styles.currentTrack}>
            {(currentTrack && trackFeatures) && 
                <>
               
                    <div className='image'>
                        <img className={styles['image-album']} src={currentTrack.album.images[1].url}></img>
                    </div>

                    <div className={styles.text}>
                        <div className='info'>
                            <h1 className='info-track'>{currentTrack.name}</h1>
                            <h2 className='info-artist'>{currentTrack.artists[0].name}</h2>
                            <h3 className='info-album'>{currentTrack.album.name}</h3>
                        </div>
                        <div className={styles.features}>
                            <h3 className="features-camelot">{convertToCamelotKey([trackFeatures.key, trackFeatures.mode])}</h3>
                            <h3 className="features-key">{convertToKey([trackFeatures.key, trackFeatures.mode])}</h3>
                            <h3 className="features-bpm">{Math.round(trackFeatures.tempo)} BPM</h3>
                        </div>
                    </div>
            
                </>
            }
        </div>
    )
}

export default CurrentTrack