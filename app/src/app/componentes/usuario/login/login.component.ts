import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; //Para enviar a una ruta Especifica
/* ENTIDAD */
import { User } from 'src/app/modelos/User';
import { UserService } from 'src/app/servicios/user.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  fieldTextType: boolean = false;
  form: FormGroup;

  user: User = {
    IdUsuario: 0,
    Nombre: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    Usuario: '',
    Correo: '',
    Password: '',
    Rol: 0,
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private alerta: AlertasService
  ) {
    this.form = this.fb.group({
      Usuario: ['', Validators.required],
      Password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') != null) {
      this.router.navigate(['repertorio/']);
    }
  }

  login() {
    this.userService.login(this.user.Usuario!, this.user.Password!).subscribe(
      (res: any) => {
        if (res[0] != null) {
          this.router.navigate(['repertorio/']);
          this.user = res[0];
          //console.log(res[0]);

          localStorage.setItem('Rol', this.user.Rol.toString());

          localStorage.setItem('Usuario', this.user.Usuario!);
          localStorage.setItem('Correo', this.user.Correo!);
          this.alerta.successtroast(`Bienvenido '${this.user.Usuario}'`,'Usuario Logeado');
        } else {
          this.router.navigate(['login']);
          this.alerta.success('No se encontro al usuario','Usuario no encontrado');
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
