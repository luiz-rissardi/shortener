import { Routes } from '@angular/router';
import { ListUrls } from './pages/list-urls/list-urls';
import { prefetchingResolver } from './url/resolvers/prefecthing-resolver';

export const routes: Routes = [
    {
        path: "home",
        loadComponent: () => import("./pages/home/home").then(c => c.Home)
    },
    {
        path: "list",
        component: ListUrls,
        resolve: {
            urls: prefetchingResolver
        }
    },
    {
        path: "**",
        redirectTo: "home"
    }
];
