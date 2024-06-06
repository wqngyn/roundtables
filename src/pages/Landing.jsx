import styles from './Landing.module.scss'

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

const ba64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const Landing = () => {
    // Auth URL and Parameters
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    const clientId = '8344bbb71e7d4419a75beba93f6b26e1'
    const redirectUri = 'https://roundtables.vercel.app/home'
    const scope = 'user-read-currently-playing playlist-read-private playlist-modify-public user-library-modify'
    
    const handleSpotifyLogin = async(e) => {
        const codeVerifier  = generateRandomString(64);
        const hashed = await sha256(codeVerifier)
        const codeChallenge = ba64encode(hashed);

        localStorage.clear();
        localStorage.setItem('code_verifier', codeVerifier);

        const params =  {
            response_type: 'code',
            client_id: clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    return (
        <div id={styles['Landing']} className="center-center">  
            <div className={styles['landing-container']}>
                <h1 className={styles['landing-header']}>Roundtables</h1>
                <h2 className={styles['landing-hook']}>Discover, sort, and arrange songs with melodically compatible key signatures and similar BPM for your next mix.</h2>
                <button className='btn' onClick={(e) => handleSpotifyLogin(e)}>Log in to Spotify</button>
            </div>
        </div>
    )
}

export default Landing