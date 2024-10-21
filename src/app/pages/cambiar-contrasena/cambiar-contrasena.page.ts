import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage implements OnInit {

  //modelos para el cambio de contraseña
  mdl_contrasenaNueva: string = '';
  mdl_confirmarContrasenaNueva: string = '';
  //correo
  correo: string = '';
  //spinner de recarga
  spinnerRecarga: boolean = false;
  //spinner boton
  spinnerVisible: boolean = false;
  //boton de registro deshabilitado
  botonDeshabilitado: boolean = false;

  constructor(
    private router: Router,
    private toastControlador: ToastController
  ) { }

  ngOnInit() {}

  //funcion del toast
  async mostrarToast(mensaje: string, color: string, duracion: number) {
    let toast = await this.toastControlador.create({
      message: mensaje,
      color: color,
      duration: duracion,
      position: 'bottom',
      mode: 'md', //diseño de material design
      cssClass: 'toast' //clase del global.scss
    });
    toast.present();
  }

  //funcion para cambiar contraseña
  async cambiarContrasena() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    setTimeout(() => {
      this.spinnerRecarga = true;

      this.mostrarToast('Cambio de contraseña correcto, redirigiendo a la pantalla principal...', 'success', 1500);

      //redirigir al principal
      let extras: NavigationExtras = {
        state: {
          alertReinicio: true
        },
        replaceUrl: true
      };

      setTimeout(() => {
        this.router.navigate(['principal'], extras);
        this.spinnerRecarga = false;
      }, 2000);

      this.spinnerVisible = false;
    }, 1000);
  }

}
