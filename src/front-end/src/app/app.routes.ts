import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ListUrls } from './pages/list-urls/list-urls';
import { prefetchingResolver } from './url/resolvers/prefecthing-resolver';

export const routes: Routes = [
    {
        path:"home",
        component:Home
    },
    {
        path:"list",
        component:ListUrls,
        resolve:{
            urls:prefetchingResolver
        }
    },
    {
        path:"**",
        redirectTo:"home"        
    }
];
