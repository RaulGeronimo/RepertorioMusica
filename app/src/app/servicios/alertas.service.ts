import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//SERVICES
import { AlbumService } from './album.service';
import { CancionesAlbumService } from './canciones-album.service';
import { ArtistaGrupoService } from './artista-grupo.service';
import { ArtistaService } from './artista.service';
import { CancionesService } from './canciones.service';
import { DisqueraService } from './disquera.service';
import { GruposService } from './grupos.service';
import { InstrumentosService } from './instrumentos.service';
import { InstrumentoArtistaService } from './instrumento-artista.service';
import { PaisService } from './pais.service';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  timeOut: number = 2500;
  Usuario: string = localStorage.getItem('Correo') || '';

  sessionTimeout: number = 3600000; // 1h para que este activa la sesion
  alertResponseTime: number = 5000; // 10 segundos para responder a la alerta

  //Mensajes eliminacion
  Titulo: string = '¿Estas seguro de eliminar el registro?';
  Mensaje: string = '¡No podrás revertir esto!';
  MsjConfirmacion: string = '¡Sí, bórralo!';
  MsjCancelacion: string = 'Cancelar';

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private albumService: AlbumService,
    private artistaService: ArtistaService,
    private artistaGrupoService: ArtistaGrupoService,
    private cancionesService: CancionesService,
    private cancionesAlbumService: CancionesAlbumService,
    private disqueraService: DisqueraService,
    private gruposService: GruposService,
    private instrumentosService: InstrumentosService,
    private instrumentoArtistaService: InstrumentoArtistaService,
    private paisService: PaisService
  ) {}

  public errorServidor() {
    localStorage.removeItem('Usuario');
    localStorage.removeItem('Correo');
    this.router.navigate(['login']);

    Swal.fire({
      title: 'Error de Servidor',
      text: 'Espere un momento',
      icon: 'question',
      showConfirmButton: false,
      timerProgressBar: true,
      /* confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK', */
      timer: this.timeOut,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public mostrarAlertaConfirmacion(
    titulo: string,
    msg: string,
    msjConfirm: string,
    msjCancel: string
  ): Promise<boolean> {
    return Swal.fire({
      title: titulo,
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: msjConfirm,
      cancelButtonText: msjCancel,
      timer: this.alertResponseTime,
      timerProgressBar: true,
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  public error(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'error',
      showConfirmButton: false,
      /* confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK', */
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public info(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'info',
      showConfirmButton: false,
      /* confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK', */
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public question(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'question',
      showConfirmButton: false,
      /* confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK', */
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public success(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'success',
      showConfirmButton: false,
      /* confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK', */
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  public warning(titulo: string, texto: string) {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showConfirmButton: false,
      /* confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK', */
      timer: this.timeOut,
      timerProgressBar: true,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });
  }

  /* TROAST -> Mensajes pequeños */
  public successtroast(titulo: string, mensaje: string) {
    this.toastr.success(titulo, mensaje, { timeOut: this.timeOut });
  }

  public errortroast(titulo: string, mensaje: string) {
    this.toastr.error(titulo, mensaje, { timeOut: this.timeOut });
  }

  public infotroast(titulo: string, mensaje: string) {
    this.toastr.info(titulo, mensaje, { timeOut: this.timeOut });
  }

  public warningtroast(titulo: string, mensaje: string) {
    this.toastr.warning(titulo, mensaje, { timeOut: this.timeOut });
  }

  //CERRAR SESION
  startSessionCheck() {
    setInterval(() => {
      this.checkUserSession();
    }, this.sessionTimeout);
  }

  private isSessionActive(): boolean {
    return !!localStorage.getItem('Usuario');
  }

  private checkUserSession() {
    if (!this.isSessionActive()) {
      return;
    }

    this.mostrarAlertaConfirmacion(
      '¿Deseas continuar en la sesión?',
      '',
      '¡Continuar!',
      'Salir'
    )
      .then((confirmed) => {
        if (confirmed) {
          console.log('El usuario sigue en el sistema.');
        } else {
          this.logout();
        }
      })
      .catch(() => {
        this.logout();
      });
  }

  logout() {
    localStorage.removeItem('Usuario');
    localStorage.removeItem('Correo');
    localStorage.removeItem('Rol');
    localStorage.removeItem('sessionStartTime');
    this.router.navigate(['login']);
  }

  handleWindowClose(server: number) {
    if (server != 1) {
      window.addEventListener('beforeunload', () => {
        this.logout();
      });
    }
  }

  Salir() {
    this.mostrarAlertaConfirmacion(
      '¿Estas seguro de salir de la aplicación?',
      '',
      '¡Salir!',
      'Cancelar'
    )
      .then((confirmed) => {
        if (confirmed) {
          this.logout();
        }
      })
      .catch(() => {
        this.logout();
      });
  }

  public reporte(archivo: string) {
    Swal.fire({
      title: 'Reporte Generado Correctamente',
      text: 'Reporte de ' + archivo,
      icon: 'success',
      showConfirmButton: false,
      /* confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK', */
      timer: this.timeOut,
      showClass: {
        popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
      },
      hideClass: {
        popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
      },
    });
  }

  //ALBUM
  public borrarAlbum(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.albumService.delete(id, this.Usuario).subscribe(
          (res) => {
            // Llena el arreglo con la respuesta que enviamos
            callback();
            this.warningtroast(
              'El álbum fue eliminado con éxito',
              'Álbum eliminado'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
  //ARTISTA
  public borrarArtista(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.artistaService.delete(id, this.Usuario).subscribe(
          (res) => {
            callback();
            this.warningtroast(
              'El artista fue eliminado con éxito',
              'Artista eliminado'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
  //ARTISTA GRUPO
  public borrarArtistaGrupo(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.artistaGrupoService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast(
              'El artista fue eliminado con éxito',
              'Artista eliminado'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
  //CANCIONES
  public borrarCancion(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.cancionesService.delete(id, this.Usuario).subscribe(
          (res) => {
            callback();
            this.warningtroast(
              'La canción fue eliminada con éxito',
              'Canción eliminada'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
  //CANCION ALBUM
  public borrarCancionAlbum(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.cancionesAlbumService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast(
              'La canción fue eliminada con éxito',
              'Canción eliminada'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
  //DISQUERA
  public borrarDisquera(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.disqueraService.delete(id, this.Usuario).subscribe(
          (res) => {
            callback();
            this.warningtroast(
              'La disquera fue eliminada con éxito',
              'Disquera eliminada'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
  //GRUPOS
  public borrarGrupo(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.gruposService.delete(id, this.Usuario).subscribe(
          (res) => {
            callback();
            this.warningtroast(
              'El grupo fue eliminado con éxito',
              'Grupo eliminado'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
  //INSTRUMENTOS
  public borrarInstrumento(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.instrumentosService.delete(id, this.Usuario).subscribe(
          (res) => {
            callback();
            this.warningtroast(
              'El instrumento fue eliminado con éxito',
              'Instrumento eliminado'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
  //INSTRUMENTO ARTISTA
  public borrarInstrumentoArtista(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.instrumentoArtistaService.delete(id).subscribe(
          (res) => {
            callback();
            this.warningtroast(
              'El instrumento fue eliminado con éxito',
              'Instrumento eliminado'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
  //PAIS
  public borrarPais(id: string, callback: () => void) {
    this.mostrarAlertaConfirmacion(
      this.Titulo,
      this.Mensaje,
      this.MsjConfirmacion,
      this.MsjCancelacion
    ).then((confirmed) => {
      if (confirmed) {
        this.Usuario = localStorage.getItem('Correo') || '';
        this.paisService.delete(id, this.Usuario).subscribe(
          (res) => {
            callback();
            this.warningtroast(
              'El pais fue eliminado con éxito',
              'Pais eliminado'
            );
          },
          (err) => {
            console.error(err);
            this.errorServidor();
          }
        );
      }
    });
  }
}
