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
import { Preferences } from '@capacitor/preferences';
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
      next: async (data) => {
        this.ligas = data;
        this.cargando = false;
        await this.cargarSeleccionGuardada();
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  async cargarSeleccionGuardada() {
    const { value: savedLeague } = await Preferences.get({ key: 'liga' });
    const { value: savedSeason } = await Preferences.get({ key: 'temporada' });

    if (savedLeague) {
      this.ligaSeleccionada = savedLeague;
      this.cargando = true;
      this.service.getSeasons(savedLeague).subscribe({
        next: (seasonsData) => {
          this.temporadas = seasonsData;
          this.cargando = false;
          
          if (savedSeason && seasonsData.some(s => s.strSeason === savedSeason)) {
            this.temporadaSeleccionada = savedSeason;
            this.cargando = true;
            this.service.getTableClasification(savedLeague, savedSeason).subscribe({
              next: (tableData) => {
                this.tabla = tableData;
                this.cargando = false;
              },
              error: () => {
                this.cargando = false;
              }
            });
          }
        },
        error: () => {
          this.cargando = false;
        }
      });
    }
  }

  async cambioLiga(event: any) {
    const idLiga = event.detail.value;
    if (this.ligaSeleccionada === idLiga) return;
    
    this.ligaSeleccionada = idLiga;
    this.temporadas = [];
    this.tabla = [];
    this.temporadaSeleccionada = '';
    
    await Preferences.set({ key: 'liga', value: idLiga });
    await Preferences.remove({ key: 'temporada' });
    
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

  async cambioTemporada(event: any) {
    const season = event.detail.value;
    if (this.temporadaSeleccionada === season) return;
    
    this.temporadaSeleccionada = season;
    this.tabla = [];
    
    await Preferences.set({ key: 'temporada', value: season });
    
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
