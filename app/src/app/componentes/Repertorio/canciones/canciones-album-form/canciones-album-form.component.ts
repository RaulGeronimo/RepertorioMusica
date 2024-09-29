import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
/* ENTIDAD */
import { CancionesAlbum } from 'src/app/modelos/CancionesAlbum';
import { CancionesAlbumService } from 'src/app/servicios/canciones-album.service';
/* LLAVE FORANEA */
import { CancionesService } from 'src/app/servicios/canciones.service';
import { AlbumService } from 'src/app/servicios/album.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { GruposService } from 'src/app/servicios/grupos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-canciones-album-form',
  templateUrl: './canciones-album-form.component.html',
  styleUrls: ['./canciones-album-form.component.css'],
})
export class CancionesAlbumFormComponent implements OnInit {
  servidor = environment.servidor;
  form: FormGroup;

  cancionesAlbum: CancionesAlbum = {
    Codigo: 0,
    idAlbum: '',
    idCancion: '',
    Numero: '',
  };

  idGrupo: any;
  idAlbum: any;
  id: number = 0;

  edit: boolean = false;

  /* LLAVE FORANEA */
  Canciones: any = [];
  Album: any = [];
  Grupo: any = [];
  search: any;

  constructor(
    private Service: CancionesAlbumService,
    private CancionesService: CancionesService,
    private AlbumService: AlbumService,
    private GrupoService: GruposService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService
  ) {
    this.form = this.fb.group({
      Grupo: [''],
      idAlbum: ['', Validators.required],
      idCancion: ['', Validators.required],
      Numero: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      if (localStorage.getItem('idGrupo') != null) {
        this.idGrupo = localStorage.getItem('idGrupo');
        this.id = parseInt(localStorage.getItem('idGrupo')!) || 0;
        console.log('Grupo: ' + this.idGrupo);
      }
      if (localStorage.getItem('idAlbum') != null) {
        this.idAlbum = localStorage.getItem('idAlbum');
        this.id = parseInt(localStorage.getItem('idAlbum')!) || 0;
        console.log('Album: ' + this.idAlbum);
      }
      this.obtenerDatos();

      const params = this.activatedRoute.snapshot.params;
      if (params['Codigo']) {
        this.Service.getCancion(params['Codigo']).subscribe(
          (res) => {
            //console.log(res); //Muestra en consola
            this.cancionesAlbum = res; //Muestra en el navegador
            this.edit = true; //Asignamos que es verdadero
          },
          (err) => {
            console.error(err);
            this.alerta.errorServidor();
          }
        );
      } else {
        if (this.servidor == 1) {
          // Llamar a la función cada 10 segundos (10,000 milisegundos)
          setInterval(() => {
            this.obtenerDatos();
          }, environment.refrescarLista);
        }
      }
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerCancion();
      this.obtenerAlbum();
      this.obtenerGrupo();
    }
  }

  add() {
    this.Service.create(this.cancionesAlbum).subscribe(
      (res) => {
        //Llenamos el arreglo con la respuesta
        //console.log(res);
        if (this.idAlbum != null) {
          this.router.navigate([
            'repertorio/buscaCancion_Album/' + this.idAlbum,
          ]);
          localStorage.removeItem('idAlbum');
        } else if (this.idGrupo != null) {
          this.router.navigate([
            'repertorio/buscaCancion_Grupo/' + this.idGrupo,
          ]);
          localStorage.removeItem('idGrupo');
        } else {
          this.router.navigate(['repertorio/canciones_Album']);
        }
        this.alerta.successtroast('La canción fue agregada al álbum con éxito','Canción Agregada');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;

    this.Service.update(params['Codigo'], this.cancionesAlbum).subscribe(
      (res) => {
        //console.log(res);
        if (this.idAlbum != null) {
          this.router.navigate([
            'repertorio/buscaCancion_Album/' + this.idAlbum,
          ]);
          localStorage.removeItem('idAlbum');
        } else if (this.idGrupo != null) {
          this.router.navigate([
            'repertorio/buscaCancion_Grupo/' + this.idGrupo,
          ]);
          localStorage.removeItem('idGrupo');
        } else {
          this.router.navigate(['repertorio/canciones_Album']);
        }
        this.alerta.infotroast('La canción fue actualizada con éxito','Canción Actualizada');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerCancion() {
    this.CancionesService.getCanciones().subscribe(
      (res) => {
        //Llena el arreglo con la respuesta que enviamos
        this.Canciones = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerAlbum() {
    this.AlbumService.getAlbums().subscribe(
      (res) => {
        //Llena el arreglo con la respuesta que enviamos
        this.Album = res;
        console.log(this.Album);
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerGrupo() {
    this.GrupoService.getGrupos().subscribe(
      (res) => {
        //Llena el arreglo con la respuesta que enviamos
        this.Grupo = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  getNombreGrupo(idGrupo: string): string {
    const grupo = this.Grupo.find((grupo: any) => grupo.idGrupo == idGrupo);
    return grupo ? grupo.Nombre : 'Nombre de Grupo no encontrado';
  }

  getIdGrupo(idAlbum: string): string {
    const album = this.Album.find((album: any) => album.idAlbum == idAlbum);
    //return album ? album.idGrupo : 'Nombre del álbum no encontrado';
    return this.getNombreGrupo(album.idGrupo);
  }

  getNombreCancion(idCancion: string): string {
    const cancion = this.Canciones.find(
      (cancion: any) => cancion.idCancion == idCancion
    );
    return cancion ? cancion.Nombre : 'Nombre de la Canción no encontrada';
  }

  getNombreAlbum(idAlbum: string): string {
    const album = this.Album.find((album: any) => album.idAlbum == idAlbum);
    return album ? album.Nombre : 'Nombre del álbum no encontrado';
  }

  getImgAlbum(idAlbum: string): string {
    const album = this.Album.find((album: any) => album.idAlbum == idAlbum);
    return album ? album.Portada : 'Portada del álbum no encontrada';
  }
}
