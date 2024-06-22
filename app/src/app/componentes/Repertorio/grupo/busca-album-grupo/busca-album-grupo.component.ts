import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
//Entidad
import { BuscaGrupoService } from 'src/app/servicios/busca-grupo.service';
//Album
import { BuscaAlbumGrupoService } from 'src/app/servicios/busca-album-grupo.service';
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
  selector: 'app-busca-album-grupo',
  templateUrl: './busca-album-grupo.component.html',
  styleUrls: ['./busca-album-grupo.component.css'],
})
export class BuscaAlbumGrupoComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Albumes';
  //Creamos el arreglo vacio llamado Canciones
  Album: any = [];
  Grupo: any = [];
  total: number = 0;
  Usuario: string = '';

  //Busqueda
  search: any;
  show: boolean = false;
  tabla: boolean = true;

  //Ordenamiento
  order: string = 'id';
  reverse: boolean = false;
  caseInsensitive: boolean = false;
  sortedCollection: any[];

  OcultarAlerta: boolean = false;

  constructor(
    private Service: BuscaAlbumGrupoService,
    private activatedRoute: ActivatedRoute,
    private GrupoService: BuscaGrupoService,
    private alerta: AlertasService,
    private router: Router,
    private orderPipe: OrderPipe,
    private funcion: FuncionesService
  ) {
    this.sortedCollection = orderPipe.transform(this.Album, 'Lanzamiento');
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
        }, 10000);
      }
      localStorage.removeItem('idAlbum');
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerLista();
      this.obtenerGrupo();
    }
  }

  obtenerLista() {
    const params = this.activatedRoute.snapshot.params;
    if (params['idGrupo']) {
      this.Service.getAlbum(params['idGrupo']).subscribe(
        (res) => {
          //console.log(res); //Muestra en consola
          this.Album = res; //Muestra en el navegador
          this.total = this.Album.length;
        },
        (err) => {
          console.error(err);
          this.alerta.errorServidor();
        }
      );
    }
  }

  obtenerGrupo() {
    const params = this.activatedRoute.snapshot.params;
    if (params['idGrupo']) {
      this.GrupoService.getGrupo(params['idGrupo']).subscribe(
        (res) => {
          //console.log(res); //Muestra en consola
          this.Grupo = res; //Muestra en el navegador
          if (!this.OcultarAlerta) {
            this.alerta.successtroast(
              `Álbums del grupo '${this.Grupo.Nombre}'`,
              'Lista de Álbums'
            );
            this.OcultarAlerta = true;
          }
          this.Archivo = this.Grupo.Nombre;
          localStorage.setItem('idGrupo', this.Grupo.idGrupo!);
        },
        (err) => {
          console.error(err);
          this.alerta.errorServidor();
        }
      );
    }
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
    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Album));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, 'Albumes');
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
