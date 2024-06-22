import { Injectable } from '@angular/core';
//Llamar al modulo de Angular http
import { HttpClient } from '@angular/common/http';
//Importamos la interfaz
import { Pais } from '../modelos/Pais';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaisService {
  //Crear una propiedad donde este la ruta
  API_URI = environment.apiUrl;
  //Hacer una instancia para poder ocupar la propiedad http

  constructor(private http: HttpClient) {}

  getPaises() {
    return this.http.get(`${this.API_URI}/pais`);
  }

  getPais(idPais: String) {
    return this.http.get(`${this.API_URI}/pais/${idPais}`);
  }

  create(pais: Pais) {
    return this.http.post(`${this.API_URI}/pais`, pais);
  }

  delete(idPais: string, Usuario: string) {
    return this.http.delete(`${this.API_URI}/pais/${idPais}/${Usuario}`);
  }

  update(idPais: string, updatePais: Pais): Observable<Pais> {
    return this.http.put(`${this.API_URI}/pais/${idPais}`, updatePais);
  }
}
