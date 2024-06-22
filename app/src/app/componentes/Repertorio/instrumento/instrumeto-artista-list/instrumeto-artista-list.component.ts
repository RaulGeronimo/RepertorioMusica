import { Component, OnInit } from '@angular/core';
import { InstrumentoArtistaService } from 'src/app/servicios/instrumento-artista.service';
//ALERTAS
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Router } from '@angular/router';
//Exportar
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { FechaActual, FuncionesService } from 'src/app/servicios/funciones.service';

@Component({
  selector: 'app-instrumeto-artista-list',
  templateUrl: './instrumeto-artista-list.component.html',
  styleUrls: ['./instrumeto-artista-list.component.css'],
})
export class InstrumetoArtistaListComponent implements OnInit {
  servidor = environment.servidor;
  Archivo: string = 'Artistas';
  //Creamos el arreglo vacio llamado artistas
  artistas: any = [];
  total: number = 0;
  search: any;
  show: boolean = false;

  constructor(
    private Service: InstrumentoArtistaService,
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
        }, 10000);
      }
      localStorage.removeItem('idGrupo');
    }
  }

  obtenerDatos() {
    if (localStorage.getItem('Usuario') != null) {
      this.obtenerLista();
    }
  }

  obtenerLista() {
    this.Service.getArtistas().subscribe(
      (res) => {
        //console.log(res); //Muestra en consola
        //Llena el arreglo con la respuesta que enviamos
        this.artistas = res;
        this.total = this.artistas.length;
      },
      (err) => {
        console.error(err);
        this.alerta.errorServidor();
      }
    );
  }

  borrar(Codigo: string) {
    this.alerta.borrarInstrumentoArtista(Codigo, this.obtenerDatos.bind(this));
  }

  export() {
    this.alerta.reporte(this.Archivo);
    
    const ws = XLSX.utils.json_to_sheet(this.funcion.exportar(this.artistas));
    const wb = XLSX.utils.book_new();

    const nombreArchivo = `${this.Archivo}_${FechaActual()}.xlsx`;
    XLSX.utils.book_append_sheet(wb, ws, this.Archivo);
    // Guardar el archivo con el nombre que incluye la fecha
    XLSX.writeFile(wb, nombreArchivo);
  }
}
