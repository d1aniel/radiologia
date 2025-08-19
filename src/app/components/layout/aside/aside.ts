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
      {
        label: 'Agenda',
        icon: 'pi pi-fw pi-calendar',
        routerLink: '/agenda',
        items: [
          { label: 'Por Modalidad', icon: 'pi pi-clone', routerLink: '/agenda?vista=modalidad' },
          { label: 'Por Equipo', icon: 'pi pi-cog', routerLink: '/agenda?vista=equipo' }
        ]
      },
      {
        label: 'Estudios',
        icon: 'pi pi-fw pi-images',
        routerLink: '/estudios',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/estudios' },
          { label: 'Nuevo estudio', icon: 'pi pi-plus', routerLink: '/estudios/nuevo' }
        ]
      },
      {
        label: 'Pacientes',
        icon: 'pi pi-fw pi-users',
        routerLink: '/pacientes',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/pacientes' },
          { label: 'Nuevo paciente', icon: 'pi pi-user-plus', routerLink: '/pacientes/nuevo' }
        ]
      },
      {
        label: 'Citas',
        icon: 'pi pi-fw pi-clock',
        routerLink: '/citas',
        items: [
          { label: 'Programar', icon: 'pi pi-calendar-plus', routerLink: '/citas/nueva' },
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/citas' }
        ]
      },
      {
        label: 'Equipos',
        icon: 'pi pi-fw pi-cog',
        routerLink: '/equipos'
      },
      {
        label: 'Modalidades',
        icon: 'pi pi-fw pi-clone',
        routerLink: '/modalidades'
      },
      {
        label: 'Médicos',
        icon: 'pi pi-fw pi-id-card',
        routerLink: '/medicos',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/medicos' },
          { label: 'Nuevo médico', icon: 'pi pi-user-plus', routerLink: '/medicos/nuevo' }
        ]
      },
      {
        label: 'Tecnólogos',
        icon: 'pi pi-fw pi-briefcase',
        routerLink: '/tecnologos',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: '/tecnologos' },
          { label: 'Nuevo tecnólogo', icon: 'pi pi-user-plus', routerLink: '/tecnologos/nuevo' }
        ]
      },
      {
        label: 'Etiquetas',
        icon: 'pi pi-fw pi-tag',
        routerLink: '/etiquetas'
      },
      {
        label: 'Pagos',
        icon: 'pi pi-fw pi-credit-card',
        routerLink: '/pagos'
      },
      {
        label: 'Administración',
        icon: 'pi pi-fw pi-sliders-h',
        items: [
          { label: 'Usuarios y Roles', icon: 'pi pi-users', routerLink: '/admin/usuarios' },
          { label: 'Parámetros', icon: 'pi pi-sliders-h', routerLink: '/admin/parametros' }
        ]
      }
    ];
  }
}
