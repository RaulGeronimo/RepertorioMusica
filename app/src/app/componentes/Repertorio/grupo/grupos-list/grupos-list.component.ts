import { Component, OnInit } from '@angular/core';
//Importamos el archivo de Artista.service.ts
import { GruposService } from 'src/app/servicios/grupos.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Router } from '@angular/router';
//Ordenamiento
import { OrderPipe } from 'ngx-order-pipe';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { FechaActual, FuncionesService } from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-grupos-list',
  templateUrl: './grupos-list.component.html',
  styleUrls: ['./grupos-list.component.css'],
})
export class GruposListComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Grupos';
  //Creamos el arreglo vacio llamado Grupos
  Grupos: any = [];
  total: number = 0;
  Usuario: string = '';

  //Busqueda
  search: any;
  show: boolean = false;
  tabla: boolean = true;

  //Ordenamiento
  order: string = 'Nombre';
  reverse: boolean = false;
  caseInsensitive: boolean = false;
  sortedCollection: any[];

  constructor(
    private Service: GruposService,
    private alerta: AlertasService,
    private router: Router,
    private orderPipe: OrderPipe,
    private funcion: FuncionesService
  ) {
    this.sortedCollection = orderPipe.transform(this.Grupos, 'Nombre');
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
    this.Service.getGrupos().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.Grupos = res;
        this.total = this.Grupos.length;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  borrar(idGrupo: string) {
    this.alerta.borrarGrupo(idGrupo, this.obtenerDatos.bind(this));
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  export() {
    this.alerta.reporte(this.Archivo);
    
    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.Grupos));
    const wb = XLSX.utils.book_new();
    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;
    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
