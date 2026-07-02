import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabla-clasificacion',
  templateUrl: './tabla-clasificacion.page.html',
  styleUrls: ['./tabla-clasificacion.page.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar
  ]
})
export class TablaClasificacionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
