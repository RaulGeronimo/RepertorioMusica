import { Component, OnInit } from '@angular/core';
//Importamos el archivo de .service.ts
import { AlbumService } from 'src/app/servicios/album.service';
import { Router } from '@angular/router';
//Ordenamiento
import { OrderPipe } from 'ngx-order-pipe';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import {
  FechaActual,
  FuncionesService,
  TransformarFecha,
} from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css'],
})
export class AlbumListComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Albums';
  //Creamos el arreglo vacio llamado artistas
  Albums: any = [];
  total: number = 0;
  Usuario: string = '';

  //Busqueda
  search: any;
  show: boolean = false;
  tabla: boolean = true;

  //Ordenamiento
  order: string = 'Nombre';
  reverse: boolean = false;
  caseInsensitive: boolean = false;
  sortedCollection: any[];

  constructor(
    private Service: AlbumService,
    private alerta: AlertasService,
    private router: Router,
    private orderPipe: OrderPipe,
    private funcion: FuncionesService
  ) {
    this.sortedCollection = orderPipe.transform(this.Albums, 'Nombre');
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
    this.Service.getAlbums().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Albums = res;
        this.total = this.Albums.length;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  borrar(idAlbum: string) {
    this.alerta.borrarAlbum(idAlbum, this.obtenerDatos.bind(this));
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  export() {
    this.alerta.reporte(this.Archivo);

    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Albums));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    XLSX.writeFile(wb, nombreArchivo);
  }

  toLocalDate(dateString: string) {
    return TransformarFecha(dateString);
  }
}
