import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-createpatients',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './createpatients.html',
  styleUrl: './createpatients.css'
})
export class Createpatients {

}
