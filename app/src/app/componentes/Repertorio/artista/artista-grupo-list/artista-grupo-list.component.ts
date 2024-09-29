import { Component, OnInit } from '@angular/core';
//Importamos el archivo de Artista.service.ts
import { ArtistaGrupoService } from 'src/app/servicios/artista-grupo.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Router } from '@angular/router';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import {
  FechaActual,
  FuncionesService,
  TransformarFecha,
} from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-artista-grupo-list',
  templateUrl: './artista-grupo-list.component.html',
  styleUrls: ['./artista-grupo-list.component.css'],
})
export class ArtistaGrupoListComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Artistas';
  //Creamos el arreglo vacio llamado artistas
  artistas: any = [];
  search: any;
  show: boolean = false;
  total: number = 0;

  constructor(
    private Service: ArtistaGrupoService,
    private alerta: AlertasService,
    private router: Router,
    private funcion: FuncionesService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      this.obtenerDatos();
      if (this.servidor == 1) {
        // Llamar a la función cada 10 segundos (10,000 milisegundos)
        setInterval(() => {
          this.obtenerDatos();
        }, environment.refrescarLista);
      }
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerLista();
    }
  }

  obtenerLista() {
    this.Service.getArtistas().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.artistas = res;
        this.total = this.artistas.length;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  borrar(Codigo: string) {
    this.alerta.borrarArtistaGrupo(Codigo, this.obtenerDatos.bind(this));
  }

  export() {
    this.alerta.reporte(this.Archivo);
    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.artistas));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    XLSX.writeFile(wb, nombreArchivo);
  }

  toLocalDate(dateString: string) {
    return TransformarFecha(dateString);
  }
}
