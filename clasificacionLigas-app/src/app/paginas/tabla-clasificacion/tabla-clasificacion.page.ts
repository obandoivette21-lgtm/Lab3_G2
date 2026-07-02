import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonSelect, 
  IonSelectOption, 
  IonLabel, 
  IonItem, 
  IonList, 
  IonSpinner 
} from '@ionic/angular/standalone';
import { ClasificationService } from '../../servicios/clasificacion.servicio';
import { ILeague } from '../../modelos/liga.model';
import { ISeason } from '../../modelos/temporada.model';
import { IClasification } from '../../modelos/clasificacion.model';
import { ReversePipe } from '../../pipes/reversa.pipe';

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
    IonToolbar, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonSelect, 
    IonSelectOption, 
    IonLabel, 
    IonItem, 
    IonList, 
    IonSpinner,
    ReversePipe
  ]
})
export class TablaClasificacionPage implements OnInit {
  ligas: ILeague[] = [];
  temporadas: ISeason[] = [];
  tabla: IClasification[] = [];
  
  ligaSeleccionada: string = '';
  temporadaSeleccionada: string = '';
  cargando: boolean = false;

  constructor(private service: ClasificationService) { }

  ngOnInit() {
    this.cargarLigas();
  }

  cargarLigas() {
    this.cargando = true;
    this.service.getFootballLeagues().subscribe({
      next: (data) => {
        this.ligas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  cambioLiga(event: any) {
    const idLiga = event.detail.value;
    this.ligaSeleccionada = idLiga;
    this.temporadas = [];
    this.tabla = [];
    this.temporadaSeleccionada = '';
    
    if (idLiga) {
      this.cargando = true;
      this.service.getSeasons(idLiga).subscribe({
        next: (data) => {
          this.temporadas = data;
          this.cargando = false;
        },
        error: () => {
          this.cargando = false;
        }
      });
    }
  }

  cambioTemporada(event: any) {
    const season = event.detail.value;
    this.temporadaSeleccionada = season;
    this.tabla = [];
    
    if (this.ligaSeleccionada && season) {
      this.cargando = true;
      this.service.getTableClasification(this.ligaSeleccionada, season).subscribe({
        next: (data) => {
          this.tabla = data;
          this.cargando = false;
        },
        error: () => {
          this.cargando = false;
        }
      });
    }
  }
}
