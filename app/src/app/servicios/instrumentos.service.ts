import { Injectable } from '@angular/core';
//Llamar al modulo de Angular http
import { HttpClient } from '@angular/common/http';
//Importamos la interfaz
import { Observable } from 'rxjs';
import { Instrumentos } from '../modelos/Instrumentos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstrumentosService {
  //Crear una propiedad donde este la ruta
  API_URI = environment.apiUrl;
  //Hacer una instancia para poder ocupar la propiedad http

  constructor(private http: HttpClient) {}

  getInstrumentos() {
    return this.http.get(`${this.API_URI}/instrumento`);
  }

  getInstrumento(idInstrumento: String) {
    return this.http.get(`${this.API_URI}/instrumento/${idInstrumento}`);
  }

  create(instrumentos: Instrumentos) {
    return this.http.post(`${this.API_URI}/instrumento`, instrumentos);
  }

  delete(idInstrumento: string, Usuario: string) {
    return this.http.delete(`${this.API_URI}/instrumento/${idInstrumento}/${Usuario}`);
  }

  updateInstrumento(
    idInstrumento: string,
    updateInstrumentos: Instrumentos
  ): Observable<Instrumentos> {
    return this.http.put(
      `${this.API_URI}/instrumento/${idInstrumento}`,
      updateInstrumentos
    );
  }
}
