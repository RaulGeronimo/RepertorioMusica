import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
/* ENTIDAD */
import { Instrumento_Artista } from 'src/app/modelos/InstrumentoArtista';
import { InstrumentoArtistaService } from 'src/app/servicios/instrumento-artista.service';
/* LLAVE FORANEA */
import { ArtistaGrupoService } from 'src/app/servicios/artista-grupo.service';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-instrumeto-artista-form',
  templateUrl: './instrumeto-artista-form.component.html',
  styleUrls: ['./instrumeto-artista-form.component.css'],
})
export class InstrumetoArtistaFormComponent implements OnInit {
  servidor = environment.servidor;
  form: FormGroup;

  instrumento_Artista: Instrumento_Artista = {
    Codigo: 0,
    idArtista: '',
    idInstrumento: '',
  };
  edit: boolean = false;

  /* LLAVE FORANEA */
  Artista: any = [];
  Instrumentos: any = [];

  search: any;
  searchGrupo: any;
  idGrupo: any;

  constructor(
    private Service: InstrumentoArtistaService,
    private ArtistaService: ArtistaGrupoService,
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
      idInstrumento: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      if (localStorage.getItem('idGrupo') != null) {
        this.idGrupo = localStorage.getItem('idGrupo');
        //console.log('Grupo: ' + this.idGrupo)
        if (this.servidor == 1) {
          // Llamar a la función cada 10 segundos (10,000 milisegundos)
          setInterval(() => {
            this.obtenerDatos();
          }, 10000);
        }
      }
      this.obtenerDatos();

      const params = this.activatedRoute.snapshot.params;
      if (params['Codigo']) {
        this.Service.getArtista(params['Codigo']).subscribe(
          (res) => {
            //console.log(res); //Muestra en consola
            this.instrumento_Artista = res; //Muestra en el navegador
            this.edit = true; //Asignamos que es verdadero
          },
          (err) => {
            console.error(err);
            this.alerta.errorServidor();
          }
        );
      }
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerArtista();
      this.obtenerInstrumento();
    }
  }

  add() {
    this.obtenerArtista();
    this.Service.create(this.instrumento_Artista).subscribe(
      (res) => {
        //Llenamos el arreglo con la respuesta
        //console.log(res);
        if (this.idGrupo != null) {
          this.router.navigate([
            'repertorio/buscaIntegrante_Grupo/' + this.idGrupo,
          ]);
          localStorage.removeItem('idGrupo');
        } else {
          this.router.navigate(['repertorio/instrumento_Artista']);
        }
        this.alerta.successtroast('El instrumento fue agregado al artista con éxito','Instrumento Agregado');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  actualiza() {
    const params = this.activatedRoute.snapshot.params;
    this.Service.update(params['Codigo'], this.instrumento_Artista).subscribe(
      (res) => {
        //console.log(res);
        if (this.idGrupo != null) {
          this.router.navigate([
            'repertorio/buscaIntegrante_Grupo/' + this.idGrupo,
          ]);
          localStorage.removeItem('idGrupo');
        } else {
          this.router.navigate(['repertorio/instrumento_Artista']);
        }
        this.alerta.infotroast('El instrumento fue actualizado con éxito','Instrumento Actualizado');
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
        console.log(this.Artista);
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
        //console.log(this.Instrumentos);
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  getNombreArtista(Codigo: string): string {
    const artista = this.Artista.find(
      (artista: any) => artista.Codigo == Codigo
    );
    return artista
      ? artista.NombreArtistico
      : 'Nombre del Artista no encontrado';
  }

  getNombreGrupo(Codigo: string): string {
    const artista = this.Artista.find(
      (artista: any) => artista.Codigo == Codigo
    );
    return artista ? artista.Grupo : 'Nombre del Grupo no encontrado';
  }

  getNombreInstrumento(IdInstrumento: string): string {
    const instrumento = this.Instrumentos.find(
      (instrumento: any) => instrumento.idInstrumento == IdInstrumento
    );
    return instrumento
      ? instrumento.Nombre
      : 'Nombre del Instrumento no encontrado';
  }

  getImgArtista(Codigo: string): string {
    const artista = this.Artista.find((artista: any) => artista.Codigo == Codigo);
    return artista ? artista.Foto : 'Foto del artista no encontrada';
  }
}
