import { Routes } from '@angular/router';


import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { AuthGuard } from './guard/authguard';


import { Createdoctors } from './components/doctors/createdoctors/createdoctors';
import { Showdoctors } from './components/doctors/showdoctors/showdoctors';
import { Updatedoctors } from './components/doctors/updatedoctors/updatedoctors';


import { Createlabels } from './components/labels/createlabels/createlabels';
import { Showlabels } from './components/labels/showlabels/showlabels';
import { Updatelabels } from './components/labels/updatelabels/updatelabels';


import { Createmodalities } from './components/modalities/createmodalities/createmodalities';
import { Showmodalities } from './components/modalities/showmodalities/showmodalities';
import { Updatemodalities } from './components/modalities/updatemodalities/updatemodalities';


import { Createpatients } from './components/patients/createpatients/createpatients';
import { Showpatients } from './components/patients/showpatients/showpatients';
import { Updatepatients } from './components/patients/updatepatients/updatepatients';


import { Createpayments } from './components/payments/createpayments/createpayments';
import { Showpayments } from './components/payments/showpayments/showpayments';
import { Updatepayments } from './components/payments/updatepayments/updatepayments';


import { Createquotes } from './components/quotes/createquotes/createquotes';
import { Showquotes } from './components/quotes/showquotes/showquotes';
import { Updatequotes } from './components/quotes/updatequotes/updatequotes';


import { Createstudies } from './components/studies/createstudies/createstudies';
import { ShowStudies } from './components/studies/showstudies/showstudies';
import { Updatestuies } from './components/studies/updatestuies/updatestuies';


import { Createteams } from './components/teams/createteams/createteams';
import { Showteams } from './components/teams/showteams/showteams';
import { Updateteams } from './components/teams/updateteams/updateteams';


import { Createtechnologists } from './components/technologists/createtechnologists/createtechnologists';
import { Showtechnologists } from './components/technologists/showtechnologists/showtechnologists';
import { Updatetechnologists } from './components/technologists/updatetechnologists/updatetechnologists';


import { Createimages } from './components/images/createimages/createimages';
import { Showimages } from './components/images/showimages/showimages';
import { Updateimages } from './components/images/updateimages/updateimages';


import { Createreports } from './components/reports/createreports/createreports';
import { Showreports } from './components/reports/showreports/showreports';
import { Updatereports } from './components/reports/updatereports/updatereports';

export const routes: Routes = [
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  
  { path: 'doctors/create', component: Createdoctors, canActivate: [AuthGuard] },
  { path: 'doctors/show', component: Showdoctors, canActivate: [AuthGuard] },
  { path: 'doctors/update/:id', component: Updatedoctors, canActivate: [AuthGuard] },

  
  { path: 'labels/create', component: Createlabels, canActivate: [AuthGuard] },
  { path: 'labels/show', component: Showlabels, canActivate: [AuthGuard] },
  { path: 'labels/update/:id', component: Updatelabels, canActivate: [AuthGuard] },

  
  { path: 'modalities/create', component: Createmodalities, canActivate: [AuthGuard] },
  { path: 'modalities/show', component: Showmodalities, canActivate: [AuthGuard] },
  { path: 'modalities/update/:id', component: Updatemodalities, canActivate: [AuthGuard] },

  
  { path: 'patients/create', component: Createpatients, canActivate: [AuthGuard] },
  { path: 'patients/show', component: Showpatients, canActivate: [AuthGuard] },
  { path: 'patients/update/:id', component: Updatepatients, canActivate: [AuthGuard] },

  
  { path: 'payments/create', component: Createpayments, canActivate: [AuthGuard] },
  { path: 'payments/show', component: Showpayments, canActivate: [AuthGuard] },
  { path: 'payments/update/:id', component: Updatepayments, canActivate: [AuthGuard] },

  
  { path: 'quotes/create', component: Createquotes, canActivate: [AuthGuard] },
  { path: 'quotes/show', component: Showquotes, canActivate: [AuthGuard] },
  { path: 'quotes/update/:id', component: Updatequotes, canActivate: [AuthGuard] },

  
  { path: 'studies/create', component: Createstudies, canActivate: [AuthGuard] },
  { path: 'studies/show', component: ShowStudies, canActivate: [AuthGuard] },
  { path: 'studies/update/:id', component: Updatestuies, canActivate: [AuthGuard] },

  
  { path: 'teams/create', component: Createteams, canActivate: [AuthGuard] },
  { path: 'teams/show', component: Showteams, canActivate: [AuthGuard] },
  { path: 'teams/update/:id', component: Updateteams, canActivate: [AuthGuard] },

  
  { path: 'technologists/create', component: Createtechnologists, canActivate: [AuthGuard] },
  { path: 'technologists/show', component: Showtechnologists, canActivate: [AuthGuard] },
  { path: 'technologists/update/:id', component: Updatetechnologists, canActivate: [AuthGuard] },

  
  { path: 'images/create', component: Createimages, canActivate: [AuthGuard] },
  { path: 'images/show', component: Showimages, canActivate: [AuthGuard] },
  { path: 'images/update/:id', component: Updateimages, canActivate: [AuthGuard] },

  
  { path: 'reports/create', component: Createreports, canActivate: [AuthGuard] },
  { path: 'reports/show', component: Showreports, canActivate: [AuthGuard] },
  { path: 'reports/update/:id', component: Updatereports, canActivate: [AuthGuard] },

  
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
