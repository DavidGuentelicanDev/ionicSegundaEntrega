import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage implements OnInit {

  //modelos para el cambio de contraseña
  mdl_correo: string = '';
  mdl_contrasenaNueva: string = '';
  mdl_carrera: string = '';
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
    private toastControlador: ToastController,
    private api: ApiService
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
  async actualizarUsuario() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    let datos = this.api.actualizarUsuario(
      this.mdl_correo,
      this.mdl_contrasenaNueva,
      this.mdl_carrera
    );
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);
    console.log('DGZ: ' + json_texto);

    setTimeout(() => {
      if (json.status == 'error') {
        this.mostrarToast(json.message, 'danger', 3000);
        this.botonDeshabilitado = false;
        this.mdl_correo = '';
        this.mdl_contrasenaNueva = '';
        this.mdl_carrera = '';
      } else {
        this.mostrarToast(json.message, 'success', 1500);
        this.spinnerRecarga = true;

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
      }

      this.spinnerVisible = false;
    }, 1000);
  }

}
