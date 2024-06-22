import { Component, OnInit } from '@angular/core';
//Exportar
import * as XLSX from 'xlsx';
//Tablas
import { environment } from 'src/environments/environment';
import { AlbumService } from 'src/app/servicios/album.service';
import { ArtistaService } from 'src/app/servicios/artista.service';
import { ArtistaGrupoService } from 'src/app/servicios/artista-grupo.service';
import { CancionesService } from 'src/app/servicios/canciones.service';
import { DisqueraService } from 'src/app/servicios/disquera.service';
import { GruposService } from 'src/app/servicios/grupos.service';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
import { PaisService } from 'src/app/servicios/pais.service';
import { UserService } from 'src/app/servicios/user.service';
import { AuditoriaService } from 'src/app/servicios/auditoria.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { FechaActual, FuncionesService } from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  proyecto = environment.proyecto;
  servidor = environment.servidor;
  //Proyectos
  URL_Anime = environment.urlAnime;
  URL_Musica = environment.urlMusica;
  URL_Series = environment.urlSeries;

  logeado: boolean = false;
  user: any;
  rol: any;

  Albums: any = [];
  Artistas: any = [];
  ArtistaGrupo: any = [];
  Canciones: any = [];
  Disqueras: any = [];
  Grupos: any = [];
  Auditorias: any = [];
  Usuarios: any = [];
  Instrumentos: any = [];
  Pais: any = [];

  //Exportar
  Archivo: string = 'Repertorio Música';

  constructor(
    private funcion: FuncionesService,
    private ServiceAlbum: AlbumService,
    private ServiceArtista: ArtistaService,
    private ServiceArtistaGrupo: ArtistaGrupoService,
    private ServiceCanciones: CancionesService,
    private ServiceDisqueraService: DisqueraService,
    private ServiceGrupo: GruposService,
    private ServiceAuditoria: AuditoriaService,
    private ServiceUsuario: UserService,
    private ServiceInstrumento: InstrumentosService,
    private ServicePais: PaisService,
    private alerta: AlertasService,
  ) {}

  ngOnInit() {
    this.alerta.startSessionCheck();
    this.user = localStorage.getItem('Usuario');
    this.rol = localStorage.getItem('Rol');

    if (this.servidor != 1) {
      this.alerta.handleWindowClose(this.servidor);
    } else {
      this.obtenerDatos();
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerAlbums();
      this.obtenerArtistas();
      this.obtenerCanciones();
      this.obtenerDisquera();
      this.obtenerGrupos();
      this.obtenerAuditoria();
      this.obtenerUsuarios();
      this.obtenerPais();
      this.obtenerInstrumentos();
    }
  }

  obtenerAlbums() {
    this.ServiceAlbum.getAlbums().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Albums = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerArtistas() {
    this.ServiceArtista.getArtistas().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Artistas = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerArtistaGrupo() {
    this.ServiceArtistaGrupo.getArtistas().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.ArtistaGrupo = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerCanciones() {
    this.ServiceCanciones.getCanciones().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Canciones = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerDisquera() {
    this.ServiceDisqueraService.getDisqueras().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Disqueras = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerGrupos() {
    this.ServiceGrupo.getGrupos().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Grupos = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerAuditoria() {
    this.ServiceAuditoria.getLista().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Auditorias = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerUsuarios() {
    this.ServiceUsuario.lista().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Usuarios = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerPais() {
    this.ServicePais.getPaises().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Pais = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerInstrumentos() {
    this.ServiceInstrumento.getInstrumentos().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Instrumentos = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  Salir() {
    this.alerta.Salir();
  }

  export() {
    this.alerta.reporte(this.Archivo);
    
    const wsAlbum = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Albums));
    const wsArtista = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Artistas));
    const wsCanciones = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Canciones));
    const wsDisqueras = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Disqueras));
    const wsGrupo = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Grupos));
    const wsAuditorias = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Auditorias));
    const wsUsuarios = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Usuarios));
    const wsPais = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Pais));
    const wsInstrumentos = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Instrumentos));
    const wb = XLSX.utils.book_new();
    
    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, wsAlbum, 'Albums');
    XLSX.utils.book_append_sheet(wb, wsArtista, 'Artistas');
    XLSX.utils.book_append_sheet(wb, wsCanciones, 'Canciones');
    XLSX.utils.book_append_sheet(wb, wsDisqueras, 'Disqueras');
    XLSX.utils.book_append_sheet(wb, wsGrupo, 'Grupos');
    XLSX.utils.book_append_sheet(wb, wsInstrumentos, 'Instrumentos');
    XLSX.utils.book_append_sheet(wb, wsPais, 'Pais');

    XLSX.utils.book_append_sheet(wb, wsUsuarios, 'Usuarios');
    XLSX.utils.book_append_sheet(wb, wsAuditorias, 'Auditorias');
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
