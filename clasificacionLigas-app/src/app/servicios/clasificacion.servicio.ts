import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { ILeague } from '../modelos/liga.model';
import { from } from 'rxjs';
import { ISeason } from '../modelos/temporada.model';
import { IClasification } from '../modelos/clasificacion.model';
import { CODE_LEAGUES } from '../constantes';

@Injectable({
  providedIn: 'root'
})
export class ClasificationService {

  getFootballLeagues() {
    return from(CapacitorHttp.get({
      url: `${environment.apiURL}/all_leagues.php`
    }).then((response: HttpResponse) => {
      const leagues = response.data['leagues'] as ILeague[];
      if (!leagues) {
        return [];
      }
      return leagues
        .filter(league => CODE_LEAGUES.includes(league.idLeague))
        .sort((a, b) => {
          const nameA = a.strLeagueAlternate || a.strLeague || '';
          const nameB = b.strLeagueAlternate || b.strLeague || '';
          return nameA < nameB ? -1 : 1;
        });
    }).catch((error) => {
      return [];
    }));
  }

  getSeasons(idLeague: string) {
    return from(CapacitorHttp.get({
      url: `${environment.apiURL}/search_all_seasons.php?id=${idLeague}`
    }).then((response: HttpResponse) => {
      const seasons = response.data['seasons'] as ISeason[];
      if (!seasons) {
        return [];
      }
      return seasons.reverse();
    }).catch((error) => {
      return [];
    }));
  }

  getTableClasification(idLeague: string, season: string) {
    return from(CapacitorHttp.get({
      url: `${environment.apiURL}/lookuptable.php?l=${idLeague}&s=${season}`
    }).then((response: HttpResponse) => {
      const clasification = response.data['table'] as IClasification[];
      if (!clasification) {
        return [];
      }
      return clasification;
    }).catch((error) => {
      return [];
    }));
  }
}
