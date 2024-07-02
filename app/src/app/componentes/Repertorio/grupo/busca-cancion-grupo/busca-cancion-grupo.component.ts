import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
//Entidad
import { BuscaGrupoService } from 'src/app/servicios/busca-grupo.service';
//Canciones
import { BuscaCancionGrupoService } from 'src/app/servicios/busca-cancion-grupo.service';
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
  selector: 'app-busca-cancion-grupo',
  templateUrl: './busca-cancion-grupo.component.html',
  styleUrls: ['./busca-cancion-grupo.component.css'],
})
export class BuscaCancionGrupoComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Canciones';
  //Creamos el arreglo vacio llamado Canciones
  Canciones: any = [];
  Grupo: any = [];
  Usuario: string = '';

  //Busqueda
  search: any;

  //Ordenamiento
  order: string = 'id';
  reverse: boolean = false;
  caseInsensitive: boolean = false;
  sortedCollection: any[];

  OcultarAlerta: boolean = false;

  constructor(
    private Service: BuscaCancionGrupoService,
    private activatedRoute: ActivatedRoute,
    private GrupoService: BuscaGrupoService,
    private alerta: AlertasService,
    private router: Router,
    private orderPipe: OrderPipe,
    private funcion: FuncionesService
  ) {
    this.sortedCollection = orderPipe.transform(this.Canciones, 'Nombre');
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    localStorage.setItem('idGrupo', params['idGrupo']);

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
      this.Service.getCancion(params['idGrupo']).subscribe(
        (res) => {
          console.log(res); //Muestra en consola
          this.Canciones = res; //Muestra en el navegador
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
              `Canciones del grupo '${this.Grupo.Nombre}'`,
              'Lista de Canciones'
            );
            this.OcultarAlerta = true;
          }
          this.Archivo = this.Grupo.Nombre;
        },
        (err) => {
          console.error(err);
          this.alerta.errorServidor();
        }
      );
    }
  }

  borrar(idCancion: string) {
    this.alerta.borrarCancion(idCancion, this.obtenerDatos.bind(this));
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

    XLSX.utils.book_append_sheet(wb, ws, 'Canciones');
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
