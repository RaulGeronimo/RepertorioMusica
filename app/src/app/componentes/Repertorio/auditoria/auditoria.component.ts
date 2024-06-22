import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { AuditoriaService } from 'src/app/servicios/auditoria.service';
import { OrderPipe } from 'ngx-order-pipe';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { FechaActual, FuncionesService } from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css'],
})
export class AuditoriaComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Auditoria';
  lista: any = [];
  search: any;

  p: number = 1;
  total: number = 0;

  order: string = 'id';
  reverse: boolean = true;
  caseInsensitive: boolean = false;
  sortedCollection: any[];

  constructor(
    private service: AuditoriaService,
    private router: Router,
    private orderPipe: OrderPipe,
    private alerta: AlertasService,
    private funcion: FuncionesService
  ) {
    this.sortedCollection = orderPipe.transform(this.lista, 'id');
    //console.log(this.sortedCollection);
  }

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      if (localStorage.getItem('Rol') == '1') {
        this.obtenerDatos();
        if (this.servidor == 1) {
          /// Llamar a la función cada 10 segundos (10,000 milisegundos)
          setInterval(() => {
            this.obtenerDatos();
          }, 10000);
        }
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerLista();
    }
  }

  obtenerLista() {
    this.service.getLista().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.lista = res;
        this.total = this.lista.length;
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

    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.lista));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
