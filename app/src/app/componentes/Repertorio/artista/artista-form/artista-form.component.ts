import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
/* ENTIDAD */
import { Artista } from 'src/app/modelos/Artista';
import { ArtistaService } from 'src/app/servicios/artista.service';
/* LLAVE FORANEA */
import { PaisService } from 'src/app/servicios/pais.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-artista-form',
  templateUrl: './artista-form.component.html',
  styleUrls: ['./artista-form.component.css'],
})
export class ArtistaFormComponent implements OnInit {
  servidor = environment.servidor;
  form: FormGroup;

  artista: Artista = {
    idArtista: 0,
    Nombre: '',
    NombreArtistico: '',
    Genero: '',
    FechaNacimiento: '',
    FechaFinado: '',
    Estatura: '',
    idNacionalidad: '',
    Instrumentos: '',
    TipoVoz: '',
    Foto: '',
  };
  Pais: any = [];
  edit: boolean = false;

  constructor(
    private Service: ArtistaService,
    private paisService: PaisService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService
  ) {
    this.form = this.fb.group({
      Nombre: ['', Validators.required],
      NombreArtistico: ['', Validators.required],
      Genero: ['', Validators.required],
      FechaNacimiento: ['', Validators.required],
      FechaFinado: [],
      Estatura: ['', Validators.required],
      idNacionalidad: ['', Validators.required],
      Instrumentos: ['', Validators.required],
      TipoVoz: ['', Validators.required],
      Foto: ['', [Validators.pattern('https?://.*'), Validators.required]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      this.obtenerDatos();

      const params = this.activatedRoute.snapshot.params;
      if (params['idArtista']) {
        this.Service.getArtista(params['idArtista']).subscribe(
          (res) => {
            //console.log(res); //Muestra en consola
            this.artista = res; //Muestra en el navegador
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
      this.obtenerPais();
    }
  }

  add() {
    this.artista.Usuario = localStorage.getItem('Correo') || '';
    this.Service.create(this.artista).subscribe(
      (res) => {
        //Llenamos el arreglo con la respuesta
        //console.log(res);
        this.router.navigate(['repertorio/artista']);
        this.alerta.successtroast(`El artista '${this.artista.NombreArtistico}' fue agregado con éxito`,'Artista Agregado');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  actualiza() {
    this.artista.Usuario = localStorage.getItem('Correo') || '';
    this.artista.FechaFinado =
      this.artista.FechaFinado != null ? this.artista.FechaFinado : '';

    const params = this.activatedRoute.snapshot.params;
    this.Service.update(params['idArtista'], this.artista).subscribe(
      (res) => {
        //console.log(res);
        this.router.navigate(['repertorio/artista']);
        this.alerta.infotroast(`El artista '${this.artista.NombreArtistico}' fue actualizado con éxito`,'Artista Actualizado');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  obtenerPais() {
    this.paisService.getPaises().subscribe(
      (res) => {
        //Llena el arreglo con la respuesta que enviamos
        this.Pais = res;
        console.log(this.Pais);
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  getNombrePais(idPais: string): string {
    const pais = this.Pais.find((pais: any) => pais.idPais == idPais);
    return pais ? pais.Nombre : 'Nombre del pais no encontrado';
  }

  getNombreGenero(genero: string): string {
    if (genero == 'H') return 'Masculino';
    else return 'Femenino';
  }
}
