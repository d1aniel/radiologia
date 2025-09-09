import { Routes } from '@angular/router';


// crud agenda
import { Createagendabymodality } from './components/agenda/createagendabymodality/createagendabymodality';
import { Createagendabyteam } from './components/agenda/createagendabyteam/createagendabyteam'; 
import { Showagendabymodality } from './components/agenda/showagendabymodality/showagendabymodality';
import { Showagendabyteam } from './components/agenda/showagendabyteam/showagendabyteam';
import { Updateagendabymodality } from './components/agenda/updateagendabymodality/updateagendabymodality';
import { Updateagendabyteam } from './components/agenda/updateagendabyteam/updateagendabyteam';
// crud doctor
import { Createdoctors } from './components/doctors/createdoctors/createdoctors';
import { Showdoctors } from './components/doctors/showdoctors/showdoctors';
import { Updatedoctors } from './components/doctors/updatedoctors/updatedoctors';
//crud labels
import { Createlabels } from './components/labels/createlabels/createlabels';
import { Showlabels } from './components/labels/showlabels/showlabels';
import { Updatelabels } from './components/labels/updatelabels/updatelabels';
//crud modalities
import { Createmodalities } from './components/modalities/createmodalities/createmodalities';
import { Showmodalities } from './components/modalities/showmodalities/showmodalities';
import { Updatemodalities } from './components/modalities/updatemodalities/updatemodalities';
//crud patients
import { Createpatients } from './components/patients/createpatients/createpatients';
import { Showpatients } from './components/patients/showpatients/showpatients';
import { Updatepatients } from './components/patients/updatepatients/updatepatients';
//crud payments
import { Createpayments } from './components/payments/createpayments/createpayments';
import { Showpayments } from './components/payments/showpayments/showpayments';
import { Updatepayments } from './components/payments/updatepayments/updatepayments';
//crud quotes
import { Createquotes } from './components/quotes/createquotes/createquotes';
import { Showquotes } from './components/quotes/showquotes/showquotes';
import { Updatequotes } from './components/quotes/updatequotes/updatequotes';
//crud stdudies
import { Createstudies } from './components/studies/createstudies/createstudies';
import { Showstudies } from './components/studies/showstudies/showstudies';
import { Updatestuies } from './components/studies/updatestuies/updatestuies';
//crud teams
import { Createteams } from './components/teams/createteams/createteams';
import { Showteams } from './components/teams/showteams/showteams';
import { Updateteams } from './components/teams/updateteams/updateteams';
//crud technologists
import { Createtechnologists } from './components/technologists/createtechnologists/createtechnologists';
import { Showtechnologists } from './components/technologists/showtechnologists/showtechnologists';
import { Updatetechnologists } from './components/technologists/updatetechnologists/updatetechnologists';
//crud administration
import { Createparameters } from './components/administration/createparameters/createparameters';
import { Showparameters } from './components/administration/showparameters/showparameters';
import { Updateparameters } from './components/administration/updateparameters/updateparameters';
import { Createuserandroles } from './components/administration/createuserandroles/createuserandroles';
import { Showuserandroles } from './components/administration/showuserandroles/showuserandroles';
import { Updateuserandroles } from './components/administration/updateuserandroles/updateuserandroles';


export const routes: Routes = [
  // ===== Agenda =====
  { path: 'agenda/create-bymodality', component: Createagendabymodality },
  { path: 'agenda/show-bymodality', component: Showagendabymodality },
  { path: 'agenda/update-bymodality/:id', component: Updateagendabymodality },

  { path: 'agenda/create-byteam', component: Createagendabyteam },
  { path: 'agenda/show-byteam', component: Showagendabyteam },
  { path: 'agenda/update-byteam/:id', component: Updateagendabyteam },

  // ===== Doctors =====
  { path: 'doctors/create', component: Createdoctors },
  { path: 'doctors/show', component: Showdoctors },
  { path: 'doctors/update/:id', component: Updatedoctors },

  // ===== Labels =====
  { path: 'labels/create', component: Createlabels },
  { path: 'labels/show', component: Showlabels },
  { path: 'labels/update/:id', component: Updatelabels },

  // ===== Modalities =====
  { path: 'modalities/create', component: Createmodalities },
  { path: 'modalities/show', component: Showmodalities },
  { path: 'modalities/update/:id', component: Updatemodalities },

  // ===== Patients =====
  { path: 'patients/create', component: Createpatients },
  { path: 'patients/show', component: Showpatients },
  { path: 'patients/update/:id', component: Updatepatients },

  // ===== Payments =====
  { path: 'payments/create', component: Createpayments },
  { path: 'payments/show', component: Showpayments },
  { path: 'payments/update/:id', component: Updatepayments },

  // ===== Quotes =====
  { path: 'quotes/create', component: Createquotes },
  { path: 'quotes/show', component: Showquotes },
  { path: 'quotes/update/:id', component: Updatequotes },

  // ===== Studies =====
  { path: 'studies/create', component: Createstudies },
  { path: 'studies/show', component: Showstudies },
  { path: 'studies/update/:id', component: Updatestuies }, 

  // ===== Teams =====
  { path: 'teams/create', component: Createteams },
  { path: 'teams/show', component: Showteams },
  { path: 'teams/update/:id', component: Updateteams },

  // ===== Technologists =====
  { path: 'technologists/create', component: Createtechnologists },
  { path: 'technologists/show', component: Showtechnologists },
  { path: 'technologists/update/:id', component: Updatetechnologists },

  // ===== Administration - Parameters =====
  { path: 'administration/parameters/create', component: Createparameters },
  { path: 'administration/parameters/show', component: Showparameters },
  { path: 'administration/parameters/update/:id', component: Updateparameters },

  // ===== Administration - Users and Roles =====
  { path: 'administration/usersroles/create', component: Createuserandroles },
  { path: 'administration/usersroles/show', component: Showuserandroles },
  { path: 'administration/usersroles/update/:id', component: Updateuserandroles },

  // ===== Default =====
  { path: '', redirectTo: 'patients/show', pathMatch: 'full' }, // ruta por defecto
  { path: '**', redirectTo: '' } // rutas no encontradas
];

