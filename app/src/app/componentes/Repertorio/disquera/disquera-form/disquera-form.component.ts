import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
/* ENTIDAD */
import { Disquera } from 'src/app/modelos/Disquera';
import { DisqueraService } from 'src/app/servicios/disquera.service';
/* LLAVE FORANEA */
import { PaisService } from 'src/app/servicios/pais.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-disquera-form',
  templateUrl: './disquera-form.component.html',
  styleUrls: ['./disquera-form.component.css'],
})
export class DisqueraFormComponent implements OnInit {
  servidor = environment.servidor;
  form: FormGroup;

  disquera: Disquera = {
    idDisquera: 0,
    Nombre: '',
    Fundacion: '',
    Fundador: '',
    Generos: '',
    idPais: '',
    Logo: '',
  };
  Pais: any = [];
  edit: boolean = false;

  constructor(
    private Service: DisqueraService,
    private paisService: PaisService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService
  ) {
    this.form = this.fb.group({
      Nombre: ['', Validators.required],
      Fundacion: ['', Validators.required],
      Fundador: ['', Validators.required],
      Generos: ['', Validators.required],
      idPais: ['', Validators.required],
      Logo: ['', [Validators.pattern('https?://.*')]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      this.obtenerDatos();

      const params = this.activatedRoute.snapshot.params;
      if (params['idDisquera']) {
        this.Service.getDisquera(params['idDisquera']).subscribe(
          (res) => {
            //console.log(res); //Muestra en consola
            this.disquera = res; //Muestra en el navegador
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
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerPais();
    }
  }

  add() {
    this.disquera.Usuario = localStorage.getItem('Correo') || '';
    this.Service.create(this.disquera).subscribe(
      (res) => {
        //Llenamos el arreglo con la respuesta
        //console.log(res);
        this.router.navigate(['repertorio/disquera']);
        this.alerta.successtroast(`La disquera '${this.disquera.Nombre}' fue agregada con éxito`,'Disquera Agregada');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  actualiza() {
    this.disquera.Usuario = localStorage.getItem('Correo') || '';
    const params = this.activatedRoute.snapshot.params;
    this.Service.update(params['idDisquera'], this.disquera).subscribe(
      (res) => {
        //console.log(res);
        this.router.navigate(['repertorio/disquera']);
        this.alerta.infotroast(`La disquera '${this.disquera.Nombre}' fue actualizada con éxito`,'Disquera Actualizada');
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
}
