import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
//Entidad
import { BuscaAlbumService } from 'src/app/servicios/busca-album.service';
//Canciones
import { BuscaCancionAlbumService } from 'src/app/servicios/busca-cancion-album.service';
//Ordenamiento
import { OrderPipe } from 'ngx-order-pipe';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import {
  FechaActual,
  FuncionesService,
} from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-busca-cancion-album',
  templateUrl: './busca-cancion-album.component.html',
  styleUrls: ['./busca-cancion-album.component.css'],
})
export class BuscaCancionAlbumComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Canciones';
  //Creamos el arreglo vacio llamado Canciones
  Canciones: any = [];
  Album: any = [];
  idGrupo: number = 0;
  

  //Busqueda
  search: any;

  //Ordenamiento
  order: string = 'id';
  reverse: boolean = false;
  caseInsensitive: boolean = false;
  sortedCollection: any[];

  OcultarAlerta: boolean = false;

  constructor(
    private Service: BuscaCancionAlbumService,
    private activatedRoute: ActivatedRoute,
    private AlbumService: BuscaAlbumService,
    private alerta: AlertasService,
    private router: Router,
    private orderPipe: OrderPipe,
    private funcion: FuncionesService
  ) {
    this.sortedCollection = orderPipe.transform(this.Canciones, 'Codigo');
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    localStorage.setItem('idAlbum', params['idAlbum']);
    
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      this.obtenerDatos();
      if (this.servidor == 1) {
        // Llamar a la función cada 10 segundos (10,000 milisegundos)
        setInterval(() => {
          this.obtenerDatos();
        }, 10000);
      }
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerLista();
      this.obtenerAlbum();
    }
  }

  obtenerLista() {
    const params = this.activatedRoute.snapshot.params;
    if (params['idAlbum']) {
      this.Service.getCancion(params['idAlbum']).subscribe(
        (res) => {
          //console.log(res); //Muestra en consola
          this.Canciones = res; //Muestra en el navegador
          this.idGrupo = parseInt(localStorage.getItem('idGrupo')!) || 0;
          //console.log(this.idGrupo)
        },
        (err) => {
          console.error(err);
          this.alerta.errorServidor();
        }
      );
    }
  }

  obtenerAlbum() {
    const params = this.activatedRoute.snapshot.params;
    if (params['idAlbum']) {
      this.AlbumService.getAlbum(params['idAlbum']).subscribe(
        (res) => {
          //console.log(res); //Muestra en consola
          this.Album = res; //Muestra en el navegador
          if (!this.OcultarAlerta) {
            this.alerta.successtroast(
              `Canciones del álbum '${this.Album.Nombre}'`,
              'Lista de Canciones'
            );
            this.OcultarAlerta = true;
          }
          this.Archivo = this.Album.Nombre;
        },
        (err) => {
          console.error(err);
          this.alerta.errorServidor();
        }
      );
    }
  }

  borrar(idCancion: string) {
    this.alerta.borrarCancionAlbum(idCancion, this.obtenerDatos.bind(this));
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  export() {
    this.alerta.reporte('Album - ' + this.Archivo);
    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Canciones));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Canciones');
    XLSX.writeFile(wb, nombreArchivo);
  }
}
