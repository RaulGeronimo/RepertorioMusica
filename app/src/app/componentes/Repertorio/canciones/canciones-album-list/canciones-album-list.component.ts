import { Component, OnInit } from '@angular/core';
//Importamos el archivo de .service.ts
import { CancionesAlbumService } from 'src/app/servicios/canciones-album.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Router } from '@angular/router';
//Ordenamiento
import { OrderPipe } from 'ngx-order-pipe';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import {
  FechaActual,
  FuncionesService,
  formatearFecha,
} from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-canciones-album-list',
  templateUrl: './canciones-album-list.component.html',
  styleUrls: ['./canciones-album-list.component.css'],
})
export class CancionesAlbumListComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Canciones';
  //Creamos el arreglo vacio llamado Canciones
  Canciones: any = [];
  total: number = 0;

  //Busqueda
  search: any;

  //Ordenamiento
  order: string = 'id';
  reverse: boolean = false;
  caseInsensitive: boolean = false;
  sortedCollection: any[];

  constructor(
    private Service: CancionesAlbumService,
    private alerta: AlertasService,
    private router: Router,
    private orderPipe: OrderPipe,
    private funcion: FuncionesService
  ) {
    this.sortedCollection = orderPipe.transform(this.Canciones, 'Nombre');
  }

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
      localStorage.removeItem('idGrupo');
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerLista();
    }
  }

  obtenerLista() {
    this.Service.getCanciones().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Canciones = res;
        this.total = this.Canciones.length;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  borrar(Codigo: string) {
    this.alerta.borrarCancionAlbum(Codigo, this.obtenerDatos.bind(this));
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  export() {
    this.alerta.reporte(this.Archivo);

    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Canciones));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
