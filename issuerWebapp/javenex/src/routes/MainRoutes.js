import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const Events = Loadable(lazy(() => import('pages/Events')));
const Gallery = Loadable(lazy(() => import('pages/Gallery')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: 'eventos',
            element: <Events />
        },
        {
            path: 'galeria',
            element: <Gallery />
        }
    ]
};

export default MainRoutes;
