import { Component, OnInit } from '@angular/core';
//Importamos el archivo de Instrumentos.service.ts
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Router } from '@angular/router';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { FechaActual, FuncionesService } from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-instrumento-list',
  templateUrl: './instrumento-list.component.html',
  styleUrls: ['./instrumento-list.component.css'],
})
export class InstrumentoListComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Instrumentos';
  //Creamos el arreglo vacio llamado paises
  instrumentos: any = [];
  total: number = 0;
  search: any;
  show: boolean = false;
  Usuario: string = '';

  constructor(
    private instrumentosService: InstrumentosService,
    private alerta: AlertasService,
    private router: Router,
    private funcion: FuncionesService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('Usuario') == null) {
      this.router.navigate(['login']);
    } else {
      if (localStorage.getItem('Rol') == '1') {
        this.obtenerDatos();
        if (this.servidor == 1) {
          // Llamar a la función cada 10 segundos (10,000 milisegundos)
          setInterval(() => {
            this.obtenerDatos();
          }, environment.refrescarLista);
        }
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerInstrumentos();
    }
  }

  obtenerInstrumentos() {
    this.instrumentosService.getInstrumentos().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.instrumentos = res;
        this.total = this.instrumentos.length;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  borrar(idInstrumento: string) {
    this.alerta.borrarInstrumento(idInstrumento, this.obtenerDatos.bind(this));
  }

  export() {
    this.alerta.reporte(this.Archivo);
    
    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.instrumentos));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
