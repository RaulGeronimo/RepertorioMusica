import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
//Entidad
import { BuscaGrupoService } from 'src/app/servicios/busca-grupo.service';
//Integrantes
import { BuscaIntegrantesGrupoService } from 'src/app/servicios/busca-integrantes-grupo.service';
import { ArtistaGrupoService } from 'src/app/servicios/artista-grupo.service';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import {
  FechaActual,
  FuncionesService,
} from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-busca-integrantes-grupo',
  templateUrl: './busca-integrantes-grupo.component.html',
  styleUrls: ['./busca-integrantes-grupo.component.css'],
})
export class BuscaIntegrantesGrupoComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Integrantes';
  //Creamos el arreglo vacio llamado Canciones
  artistas: any = [];
  total: number = 0;
  Grupo: any = [];
  search: any;
  show: boolean = false;

  OcultarAlerta: boolean = false;

  constructor(
    private Service: BuscaIntegrantesGrupoService,
    private activatedRoute: ActivatedRoute,
    private ArtistaGrupoService: ArtistaGrupoService,
    private GrupoService: BuscaGrupoService,
    private alerta: AlertasService,
    private router: Router,
    private funcion: FuncionesService
  ) {}

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
      this.Service.getIntegrante(params['idGrupo']).subscribe(
        (res) => {
          //console.log(res); //Muestra en consola
          this.artistas = res; //Muestra en el navegador
          this.total = this.artistas.length;
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
              `Integrantes del grupo '${this.Grupo.Nombre}'`,
              'Lista de Integrantes'
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

  borrar(idArtista: string) {
    this.alerta.borrarArtistaGrupo(idArtista, this.obtenerDatos.bind(this));
  }

  export() {
    this.alerta.reporte(this.Archivo);

    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.artistas));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, 'Integrantes');
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
