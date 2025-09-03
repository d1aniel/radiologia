import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PacientsI } from '../../../models/pacients';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Route } from '@angular/router';
@Component({
  selector: 'app-showpatients',
  imports: [CommonModule, TableModule, ButtonModule, RouterModule],
  templateUrl: './showpatients.html',
  styleUrl: './showpatients.css'
})
export class Showpatients {
  pacients: PacientsI [] = [
    {
    id: 1,
    nombre: 'Camilo',
    apellido: 'rodriguez',
    tpdocumento: 'cedula',
    documento: 1193354149,
    telefono: 3113644663,
    eps: 'sanitas',
    correo: 'crodriguez@gmail.com',
    status: "ACTIVATE"
    },
    {
    id: 2,
    nombre: 'Maria',
    apellido: 'Brito',
    tpdocumento: 'cedula',
    documento: 56059451,
    telefono: 3014962256,
    eps: 'sanitas',
    correo: 'mbrito@gmail.com',
    status: "ACTIVATE"
    },
    {
    id: 3,
    nombre: 'Mario',
    apellido: 'rodriguez',
    tpdocumento: 'cedula',
    documento: 11210345675,
    telefono: 3022147494,
    eps: 'sanitas',
    correo: 'mariorodriguez@gmail.com',
    status: "ACTIVATE"
    }
  ];


}
