import { createContext } from 'react'
export const TokenAuthContext = createContext({});

export const TokenAuthContextProvider = ({children}) => {
    
    // Auth URL and Parameters
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const clientId = '8344bbb71e7d4419a75beba93f6b26e1';
    // const redirectUri = 'https://roundtables.vercel.app/home'
    const redirectUri = 'https://localhost:5173/home' 

    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');

    const getToken = async() => {
        let codeVerifier = localStorage.getItem('code_verifier');
    
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        }
        
        const body = await fetch(tokenUrl, payload);
        const response = await body.json();
        
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    const getRefreshToken = async () => {
        // Refresh token that has been previously stored
        const refreshToken = localStorage.getItem('refresh_token'); 
        (refreshToken === undefined) && getToken();
        const url = "https://accounts.spotify.com/api/token";

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId
            }),
        }

        const body = await fetch(url, payload);
        const response = await body.json();

        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token); 
    }

    const tokenAuthContextStore = {
        getToken,
        getRefreshToken
    }
        
    return <TokenAuthContext.Provider value={tokenAuthContextStore}>{children}</TokenAuthContext.Provider>
}




