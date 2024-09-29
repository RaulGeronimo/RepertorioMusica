import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
/* ENTIDAD */
import { Artista_Grupo } from 'src/app/modelos/ArtistaGrupo';
import { ArtistaGrupoService } from 'src/app/servicios/artista-grupo.service';
/* LLAVE FORANEA */
import { ArtistaService } from 'src/app/servicios/artista.service';
import { GruposService } from 'src/app/servicios/grupos.service';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-artista-grupo-form',
  templateUrl: './artista-grupo-form.component.html',
  styleUrls: ['./artista-grupo-form.component.css'],
})
export class ArtistaGrupoFormComponent implements OnInit {
  servidor = environment.servidor;
  form: FormGroup;

  artista_Grupo: Artista_Grupo = {
    Codigo: 0,
    idArtista: '',
    idGrupo: '',
    FechaInicio: '',
    FechaFin: '',
    /* idInstrumento: '', */
  };
  edit: boolean = false;

  /* LLAVE FORANEA */
  Artista: any = [];
  Grupo: any = [];
  Instrumentos: any = [];

  search: any;
  searchGrupo: any;

  constructor(
    private Service: ArtistaGrupoService,
    private ArtistaService: ArtistaService,
    private GruposService: GruposService,
    private InstrumentosService: InstrumentosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService
  ) {
    this.form = this.fb.group({
      Grupo: [''],
      Artista: [''],
      idArtista: ['', Validators.required],
      idGrupo: ['', Validators.required],
      FechaInicio: ['', Validators.required],
      FechaFin: [],
      /* idInstrumento: ['', Validators.required], */
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      this.obtenerDatos();

      const params = this.activatedRoute.snapshot.params;
      if (params['Codigo']) {
        this.Service.getArtista(params['Codigo']).subscribe(
          (res) => {
            //console.log(res); //Muestra en consola
            this.artista_Grupo = res; //Muestra en el navegador
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
    if (localStorage.getItem('Usuario') != null){
      this.obtenerArtista();
      this.obtenerGrupo();
      this.obtenerInstrumento();
    }
  }

  add() {
    this.obtenerArtista();
    this.Service.create(this.artista_Grupo).subscribe(
      (res) => {
        //Llenamos el arreglo con la respuesta
        //console.log(res);
        this.router.navigate(['repertorio/artista_Grupo']);
        this.alerta.successtroast('El artista fue agregado al grupo con éxito','Artista Agregado');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  actualiza() {
    this.artista_Grupo.FechaFin =
      this.artista_Grupo.FechaFin != null ? this.artista_Grupo.FechaFin : '';

    const params = this.activatedRoute.snapshot.params;
    this.Service.update(params['Codigo'], this.artista_Grupo).subscribe(
      (res) => {
        //console.log(res);
        this.router.navigate(['repertorio/artista_Grupo']);
        this.alerta.infotroast('El artista fue actualizado con éxito','Artista Actualizado');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerArtista() {
    this.ArtistaService.getArtistas().subscribe(
      (res) => {
        //Llena el arreglo con la respuesta que enviamos
        this.Artista = res;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerGrupo() {
    this.GruposService.getGrupos().subscribe(
      (res) => {
        //Llena el arreglo con la respuesta que enviamos
        this.Grupo = res;
        console.log(this.Grupo)
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerInstrumento() {
    this.InstrumentosService.getInstrumentos().subscribe(
      (res) => {
        //Llena el arreglo con la respuesta que enviamos
        this.Instrumentos = res;
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

  getNombreArtista(idArtista: string): string {
    const artista = this.Artista.find(
      (artista: any) => artista.idArtista == idArtista
    );
    return artista
      ? artista.NombreArtistico
      : 'Nombre del Artista no encontrado';
  }

  getImgGrupo(idGrupo: string): string {
    const grupo = this.Grupo.find((grupo: any) => grupo.idGrupo == idGrupo);
    return grupo ? grupo.Logo : 'Portada del grupo no encontrada';
  }
}
