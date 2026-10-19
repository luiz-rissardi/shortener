import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Home } from './pages/home';
import { UrlList } from './pages/url-list';

export const routes = createBrowserRouter([
    {
        path: "/",          // O path raiz deve ser "/"
        element: <App />,   // Sempre utilize JSX (<App />)
        children: [
            {
                path: "home", 
                element: <Home />
            },
            {
                path: "urls", 
                element: <UrlList /> 
            }
        ]
    }
]);
