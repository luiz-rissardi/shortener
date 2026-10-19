import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Home } from './pages/home';

export const routes = createBrowserRouter([
    {
        path: "/",          // O path raiz deve ser "/"
        element: <App />,   // Sempre utilize JSX (<App />)
        children: [
            {
                path: "home", // Caminho relativo (vira /home)
                element: <Home /> // Sempre utilize JSX (<Home />)
            }
        ]
    }
]);
