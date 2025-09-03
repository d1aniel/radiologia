import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [PanelMenuModule],
  templateUrl: './aside.html',
  styleUrl: './aside.css'
})
export class Aside {
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      // ===== Agenda =====
      {
        label: 'Agenda',
        icon: 'pi pi-fw pi-calendar',
        items: [
          { label: 'Por Modalidad', icon: 'pi pi-list', routerLink: '/agenda/show-bymodality' },
          { label: 'Por Equipo', icon: 'pi pi-list', routerLink: '/agenda/show-byteam' },
        ]
      },

      // ===== Estudios =====
      {
        label: 'Estudios',
        icon: 'pi pi-fw pi-images',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/studies/show' },
          { label: 'Nuevo estudio', icon: 'pi pi-plus', routerLink: '/studies/create' }
        ]
      },

      // ===== Pacientes =====
      {
        label: 'Pacientes',
        icon: 'pi pi-fw pi-users',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/patients/show' },
          { label: 'Nuevo paciente', icon: 'pi pi-user-plus', routerLink: '/patients/create' }
        ]
      },

      // ===== Citas (Quotes) =====
      {
        label: 'Citas',
        icon: 'pi pi-fw pi-clock',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/quotes/show' },
          { label: 'Programar cita', icon: 'pi pi-plus', routerLink: '/quotes/create' }
        ]
      },

      // ===== Equipos =====
      {
        label: 'Equipos',
        icon: 'pi pi-fw pi-cog',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/teams/show' },
          { label: 'Nuevo equipo', icon: 'pi pi-plus', routerLink: '/teams/create' }
        ]
      },

      // ===== Modalidades =====
      {
        label: 'Modalidades',
        icon: 'pi pi-fw pi-clone',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/modalities/show' },
          { label: 'Nueva modalidad', icon: 'pi pi-plus', routerLink: '/modalities/create' }
        ]
      },

      // ===== Médicos =====
      {
        label: 'Médicos',
        icon: 'pi pi-fw pi-id-card',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/doctors/show' },
          { label: 'Nuevo médico', icon: 'pi pi-user-plus', routerLink: '/doctors/create' }
        ]
      },

      // ===== Tecnólogos =====
      {
        label: 'Tecnólogos',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/technologists/show' },
          { label: 'Nuevo tecnólogo', icon: 'pi pi-user-plus', routerLink: '/technologists/create' }
        ]
      },

      // ===== Etiquetas =====
      {
        label: 'Etiquetas',
        icon: 'pi pi-fw pi-tag',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/labels/show' },
          { label: 'Nueva etiqueta', icon: 'pi pi-plus', routerLink: '/labels/create' }
        ]
      },

      // ===== Pagos =====
      {
        label: 'Pagos',
        icon: 'pi pi-fw pi-credit-card',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/payments/show' },
          { label: 'Nuevo pago', icon: 'pi pi-plus', routerLink: '/payments/create' }
        ]
      },

      // ===== Administración =====
      {
        label: 'Administración',
        icon: 'pi pi-fw pi-sliders-h',
        items: [
          {
            label: 'Usuarios y Roles',
            icon: 'pi pi-users',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: '/administration/usersroles/show' },
            ]
          },
          {
            label: 'Parámetros',
            icon: 'pi pi-sliders-h',
            items: [
              { label: 'Listado', icon: 'pi pi-list', routerLink: '/administration/parameters/show' },

            ]
          }
        ]
      }
    ];
  }
}
  