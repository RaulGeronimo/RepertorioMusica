import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; //Para enviar a una ruta Especifica
/* ENTIDAD */
import { Instrumentos } from 'src/app/modelos/Instrumentos';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';

@Component({
  selector: 'app-instrumento-form',
  templateUrl: './instrumento-form.component.html',
  styleUrls: ['./instrumento-form.component.css'],
})
export class InstrumentoFormComponent implements OnInit {
  form: FormGroup;

  instrumentos: Instrumentos = {
    idInstrumento: 0,
    Nombre: '',
    Descripcion: '',
    Foto: '',
  };

  edit: boolean = false;

  constructor(
    private instrumentosService: InstrumentosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alerta: AlertasService
  ) {
    this.form = this.fb.group({
      Nombre: ['', Validators.required],
      Descripcion: ['', Validators.required],
      Foto: ['', [Validators.pattern('https?://.*'), Validators.required]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      if (localStorage.getItem('Rol') == '1') {
        const params = this.activatedRoute.snapshot.params;
        if (params['idInstrumento']) {
          this.instrumentosService
            .getInstrumento(params['idInstrumento'])
            .subscribe(
              (res) => {
                //console.log(res); //Muestra en consola
                this.instrumentos = res; //Muestra en el navegador
                this.edit = true; //Asignamos que es verdadero
              },
              (err) => {
                console.error(err);
                this.alerta.errorServidor();
              }
            );
        }
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  add() {
    this.instrumentos.Usuario = localStorage.getItem('Correo') || '';
    this.instrumentosService.create(this.instrumentos).subscribe(
      (res) => {
        //Llenamos el arreglo con la respuesta
        //console.log(res);
        this.router.navigate(['repertorio/instrumento']);
        this.alerta.successtroast(`El instrumento '${this.instrumentos.Nombre}' fue agregado con éxito`,'Instrumento Agregado');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  actualiza() {
    this.instrumentos.Usuario = localStorage.getItem('Correo') || '';
    const params = this.activatedRoute.snapshot.params;
    this.instrumentosService
      .updateInstrumento(params['idInstrumento'], this.instrumentos)
      .subscribe(
        (res) => {
          //console.log(res);
          this.router.navigate(['repertorio/instrumento']);
          this.alerta.infotroast(`El instrumento '${this.instrumentos.Nombre}' fue actualizado con éxito`,'Instrumento Actualizado');
        },
        (err) => {
          console.error(err);
          this.alerta.errorServidor();
        }
      );
  }
}
