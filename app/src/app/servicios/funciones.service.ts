import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FuncionesService {
  Lista: any = [];
  constructor() {}

  public exportar(lista: any) {
    this.Lista = lista;
    const List = this.Lista.map((registro: any) => {
      const formateado = { ...registro };
      formateado.FechaNacimiento = formatearFecha(formateado.FechaNacimiento);
      formateado.FechaFinado = formatearFecha(formateado.FechaFinado);
      formateado.Lanzamiento = formatearFecha(formateado.Lanzamiento);
      formateado.Publicacion = formatearFecha(formateado.Publicacion);
      formateado.Fundacion = formatearFecha(formateado.Fundacion);
      formateado.modificado = formatearFechaTime(formateado.modificado);
      formateado.Registro = formatearFechaTime(formateado.Registro);

      delete formateado.Codigo;
      delete formateado.idArtista;
      delete formateado.idCancion;
      delete formateado.idDisquera;
      delete formateado.idAlbum;
      delete formateado.idGrupo;
      delete formateado.idPais;
      delete formateado.idInstrumento;
      delete formateado.IdUsuario;
      delete formateado.SitioWeb;
      delete formateado.Foto;
      delete formateado.Logo;
      delete formateado.Portada;
      delete formateado.Bandera;

      if (formateado.FechaNacimiento == '') delete formateado.FechaNacimiento;
      if (formateado.FechaFinado == '') delete formateado.FechaFinado;
      if (formateado.Lanzamiento == '') delete formateado.Lanzamiento;
      if (formateado.modificado == '') delete formateado.modificado;
      if (formateado.Registro == '') delete formateado.Registro;
      if (formateado.Publicacion == '') delete formateado.Publicacion;
      if (formateado.Fundacion == '') delete formateado.Fundacion;

      return formateado;
    });
    return List;
  }
}

export function formatearFecha(fecha: string | number | Date): string {
  if (fecha == '' || fecha == null) {
    return '';
  } else {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
    return `${dia} de ${mes} de ${año}`;
  }
}

export function formatearFechaTime(fecha: string | number | Date): string {
  if (fecha == '' || fecha == null) {
    return '';
  } else {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0'); // Asegurar que tenga 2 dígitos
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();

    let horas = date.getHours();
    const minutos = date.getMinutes().toString().padStart(2, '0');
    const segundos = date.getSeconds().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'PM' : 'AM';

    // Convertir de formato 24 horas a 12 horas
    horas = horas % 12;
    horas = horas ? horas : 12; // El valor 0 debe ser 12
    const horasFormateadas = horas.toString().padStart(2, '0');

    return `${dia} de ${mes} de ${año} ${horasFormateadas}:${minutos}:${segundos} ${ampm}`;
  }
}

export function FechaActual() {
  const fechaActual = new Date();
  const dia = fechaActual.getDate().toString().padStart(2, '0'); // Asegurar que tenga 2 dígitos
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Asegurar que tenga 2 dígitos
  const año = fechaActual.getFullYear();
  const segundos = fechaActual.getMilliseconds();
  return `${año}${mes}${dia}${segundos}`;
}

export function TransformarFecha(dateString: string): string {
  let servidor: number;
  servidor = environment.servidor;
  if (servidor == 2) {
    if (dateString != null) {
      let date = new Date(dateString);
      return new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      ).toString();
    } else {
      return '';
    }
  } else {
    if (dateString != null) {
      let date = new Date(dateString);

      // Extraer la parte de la fecha (año, mes, día)
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1; // Los meses en JavaScript van de 0 a 11, así que sumamos 1
      const day = date.getUTCDate();

      // Extraer la parte de la hora (hora, minutos, segundos)
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const seconds = date.getUTCSeconds();

      // Formatear la fecha como una cadena
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}Z`;

      return formattedDate;
    } else {
      return '';
    }
  }
}
