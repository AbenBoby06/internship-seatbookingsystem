import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Emp } from './pages/emp/emp';
import { Hr } from './pages/hr/hr';


export const routes: Routes = [

    {path: '',redirectTo: 'login', pathMatch:'full'},

    {path: 'login', component: Login},
    {path: 'emp', component:Emp},
    {path: 'hr', component:Hr}

];
