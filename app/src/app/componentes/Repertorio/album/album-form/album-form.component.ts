import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
/* ENTIDAD */
import { Album } from 'src/app/modelos/Album';
import { AlbumService } from 'src/app/servicios/album.service';
/* LLAVE FORANEA */
import { GruposService } from 'src/app/servicios/grupos.service';
import { DisqueraService } from 'src/app/servicios/disquera.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-album-form',
  templateUrl: './album-form.component.html',
  styleUrls: ['./album-form.component.css'],
})
export class AlbumFormComponent implements OnInit {
  servidor = environment.servidor;
  form: FormGroup;

  album: Album = {
    idAlbum: 0,
    idGrupo: '',
    idDisquera: '',
    Nombre: '',
    Duracion: '',
    Lanzamiento: '',
    Grabacion: '',
    Genero: '',
    Portada: '',
  };
  edit: boolean = false;

  idGrupo: any;

  Grupo: any = [];
  Disquera: any = [];

  search: any;
  searchDisquera: any;

  constructor(
    private Service: AlbumService,
    private GruposService: GruposService,
    private DisqueraService: DisqueraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService
  ) {
    this.form = this.fb.group({
      Grupo: [''],
      Disquera: [''],
      idGrupo: ['', Validators.required],
      idDisquera: ['', Validators.required],
      Nombre: ['', Validators.required],
      Duracion: ['', Validators.required],
      Lanzamiento: ['', Validators.required],
      Grabacion: ['', Validators.required],
      Genero: ['', Validators.required],
      Portada: ['', [Validators.pattern('https?://.*'), Validators.required]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      if (localStorage.getItem('idGrupo') != null) {
        this.idGrupo = localStorage.getItem('idGrupo');
        //console.log('Grupo: ' + this.idGrupo)
      }
      this.obtenerDatos();

      const params = this.activatedRoute.snapshot.params;
      if (params['idAlbum']) {
        this.Service.getAlbum(params['idAlbum']).subscribe(
          (res) => {
            //console.log(res); //Muestra en consola
            this.album = res; //Muestra en el navegador
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
          }, 10000);
        }
      }
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null){
    this.obtenerDisquera();
    this.obtenerGrupo();}
  }

  add() {
    this.album.Usuario = localStorage.getItem('Correo') || '';
    this.Service.create(this.album).subscribe(
      (res) => {
        //Llenamos el arreglo con la respuesta
        //console.log(res);
        if (this.idGrupo != null) {
          this.router.navigate(['repertorio/buscaAlbum_Grupo/' + this.idGrupo]);
          localStorage.removeItem('idGrupo');
        } else {
          this.router.navigate(['repertorio/album']);
        }
        this.alerta.successtroast(`El álbum '${this.album.Nombre}' fue agregado con éxito`,'Álbum Agregado');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  actualiza() {
    this.album.Usuario = localStorage.getItem('Correo') || '';
    const params = this.activatedRoute.snapshot.params;

    this.Service.update(params['idAlbum'], this.album).subscribe(
      (res) => {
        //console.log(res);
        if (this.idGrupo != null) {
          this.router.navigate(['repertorio/buscaAlbum_Grupo/' + this.idGrupo]);
          localStorage.removeItem('idGrupo');
        } else {
          this.router.navigate(['repertorio/album']);
        }
        this.alerta.infotroast(`El álbum '${this.album.Nombre}' fue actualizado con éxito`,'Álbum Actualizado');
      },
      (err) => console.error(err)
    );
  }

  obtenerGrupo() {
    this.GruposService.getGrupos().subscribe(
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

  obtenerDisquera() {
    this.DisqueraService.getDisqueras().subscribe(
      (res) => {
        //Llena el arreglo con la respuesta que enviamos
        this.Disquera = res;
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

  getNombreDisquera(idDisquera: string): string {
    const disquera = this.Disquera.find(
      (disquera: any) => disquera.idDisquera == idDisquera
    );
    return disquera ? disquera.Nombre : 'Nombre de la disquera no encontrado';
  }
}
