import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; //Para enviar a una ruta Especifica
/* ENTIDAD */
import { User } from 'src/app/modelos/User';
import { UserService } from 'src/app/servicios/user.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  fieldTextType: boolean = false;
  user: User = {
    IdUsuario: 0,
    Nombre: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    Usuario: '',
    Correo: '',
    Password: '',
    Rol: 0,
    FechaNacimiento: '',
  };

  constructor(
    private Service: UserService,
    private router: Router,
    private fb: FormBuilder,
    private alerta: AlertasService
  ) {
    this.form = this.fb.group({
      Nombre: ['', Validators.required],
      ApellidoPaterno: ['', Validators.required],
      ApellidoMaterno: ['', Validators.required],
      Usuario: ['', Validators.required],
      Correo: [
        '',
        [
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          Validators.required,
        ],
      ],
      Password: ['', Validators.required],
      FechaNacimiento: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') != null) {
      this.router.navigate(['repertorio/grupo']);
    }
  }

  add() {
    this.Service.create(this.user).subscribe(
      (res) => {
        //Llenamos el arreglo con la respuesta
        //console.log(res);
        this.router.navigate(['login']);
        this.alerta.success(`El usuario '${this.user.Usuario}' fue agregado con éxito`,'Usuario Agregado');
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  validateUser() {
    this.Service.validarUsuario(this.user.Usuario!).subscribe(
      (res: any) => {
        if (res.length == 0) {
          this.add();
        } else {
          this.alerta.warning('El usuario ya fue registrado','Ingrese otro usuario');
        }
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  validateEmail() {
    this.Service.validarCorreo(this.user.Correo!).subscribe(
      (res: any) => {
        if (res.length == 0) {
          this.validateUser();
        } else {
          this.alerta.warning('El correo ya fue registrado','Ingrese otro correo');
        }
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
