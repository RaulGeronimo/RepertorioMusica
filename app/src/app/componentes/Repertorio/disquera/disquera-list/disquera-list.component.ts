import { Component, OnInit } from '@angular/core';
//Importamos el archivo de .service.ts
import { DisqueraService } from 'src/app/servicios/disquera.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Router } from '@angular/router';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import {
  FechaActual,
  FuncionesService,
  TransformarFecha,
} from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-disquera-list',
  templateUrl: './disquera-list.component.html',
  styleUrls: ['./disquera-list.component.css'],
})
export class DisqueraListComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Disqueras';
  //Creamos el arreglo vacio llamado Grupos
  Disqueras: any = [];
  total: number = 0;
  search: any;
  show: boolean = false;
  Usuario: string = '';

  constructor(
    private Service: DisqueraService,
    private alerta: AlertasService,
    private router: Router,
    private funcion: FuncionesService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      this.obtenerDatos();
      if (this.servidor == 1) {
        // Llamar a la función cada 10 segundos (10,000 milisegundos)
        setInterval(() => {
          this.obtenerDatos();
        }, environment.refrescarLista);
      }
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerLista();
    }
  }

  obtenerLista() {
    this.Service.getDisqueras().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Disqueras = res;
        this.total = this.Disqueras.length;
      },
      (err) => console.error(err)
    );
  }

  borrar(idDisquera: string) {
    this.alerta.borrarDisquera(idDisquera, this.obtenerDatos.bind(this));
  }

  export() {
    this.alerta.reporte(this.Archivo);
    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Disqueras));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }

  toLocalDate(dateString: string) {
    return TransformarFecha(dateString);
  }
}
