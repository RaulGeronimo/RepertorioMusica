import { Component, OnInit } from '@angular/core';
//Importamos el archivo de Pais.service.ts
import { PaisService } from 'src/app/servicios/pais.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Router } from '@angular/router';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { FechaActual, FuncionesService } from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-pais-list',
  templateUrl: './pais-list.component.html',
  styleUrls: ['./pais-list.component.css'],
})
export class PaisListComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Paises';
  //Creamos el arreglo vacio llamado paises
  paises: any = [];
  total: number = 0;
  search: any;
  show: boolean = false;
  Usuario: string = '';

  constructor(
    private paisService: PaisService,
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
      this.obtenerPaises();
    }
  }

  obtenerPaises() {
    this.paisService.getPaises().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.paises = res;
        this.total = this.paises.length;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  borrar(idPais: string) {
    this.alerta.borrarPais(idPais, this.obtenerDatos.bind(this));
  }

  export() {
    this.alerta.reporte(this.Archivo);
    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.paises));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;

    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
