import { Component, OnInit } from '@angular/core';
//Importamos el archivo de .service.ts
import { UserService } from 'src/app/servicios/user.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Router } from '@angular/router';
//Ordenamiento
import { OrderPipe } from 'ngx-order-pipe';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import {
  FechaActual,
  FuncionesService,
} from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Usuarios';
  Usuarios: any = [];
  total: number = 0;

  //Busqueda
  search: any;

  //Ordenamiento
  order: string = 'Nombre';
  reverse: boolean = false;
  caseInsensitive: boolean = false;
  sortedCollection: any[];

  constructor(
    private Service: UserService,
    private alerta: AlertasService,
    private router: Router,
    private orderPipe: OrderPipe,
    private funcion: FuncionesService
  ) {
    this.sortedCollection = orderPipe.transform(this.Usuarios, 'Nombre');
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      this.obtenerDatos();
      if (this.servidor == 1) {
        // Llamar a la función cada 10 segundos (10,000 milisegundos)
        setInterval(() => {
          this.obtenerDatos();
        }, 10000);
      }
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerLista();
    }
  }

  obtenerLista() {
    this.Service.lista().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Usuarios = res;
        this.total = this.Usuarios.length;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  export() {
    this.alerta.reporte(this.Archivo);
    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Usuarios));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
