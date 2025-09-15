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
      // ===== Estudios =====
      {
        label: 'Estudios',
        icon: 'pi pi-fw pi-images',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/studies/show' },
        ]
      },

      // ===== Imágenes =====
      {
        label: 'Imágenes',
        icon: 'pi pi-fw pi-image',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/images/show' },
        ]
      },

      // ===== Informes =====
      {
        label: 'Informes',
        icon: 'pi pi-fw pi-file',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/reports/show' },
        ]
      },


      // ===== Pacientes =====
      {
        label: 'Pacientes',
        icon: 'pi pi-fw pi-users',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/patients/show' },
        ]
      },

      // ===== Citas =====
      {
        label: 'Citas',
        icon: 'pi pi-fw pi-clock',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/quotes/show' },
        ]
      },

      // ===== Equipos =====
      {
        label: 'Equipos',
        icon: 'pi pi-fw pi-cog',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/teams/show' },
        ]
      },

      // ===== Modalidades =====
      {
        label: 'Modalidades',
        icon: 'pi pi-fw pi-clone',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/modalities/show' },
        ]
      },

      // ===== Médicos =====
      {
        label: 'Médicos',
        icon: 'pi pi-fw pi-id-card',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/doctors/show' },
        ]
      },

      // ===== Tecnólogos =====
      {
        label: 'Tecnólogos',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/technologists/show' },
        ]
      },

      // ===== Etiquetas =====
      {
        label: 'Etiquetas',
        icon: 'pi pi-fw pi-tag',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/labels/show' },
        ]
      },

      // ===== Pagos =====
      {
        label: 'Pagos',
        icon: 'pi pi-fw pi-credit-card',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/payments/show' },
        ]
      }
    ];
  }
}
  