import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Elements
import Login from './pages/Landing'
import Home from './pages/Home'

// Contexts
import { TokenAuthContextProvider } from './contexts/TokenAuthContext'
import { KeyConversionContext, convertToKey, convertToCamelotKey, compareCamelotKey } from './contexts/KeyConversionContext'
import { UtilityContext, sortArr, filterState, columns } from './contexts/UtilityContext'

const Router = () => {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Login/>
        },
        {
            path: '/home',
            element: <Home/>
        },
    ])

    return (
        <TokenAuthContextProvider>
            <KeyConversionContext.Provider value={{convertToKey, convertToCamelotKey, compareCamelotKey }}>
                <UtilityContext.Provider value={{sortArr, filterState, columns}}>
                    <RouterProvider router={router}/>
                </UtilityContext.Provider>
            </KeyConversionContext.Provider>
        </TokenAuthContextProvider>
    )
}

export default Router