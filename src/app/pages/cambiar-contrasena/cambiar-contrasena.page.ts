import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage implements OnInit {

  //modelos para el cambio de contraseña
  mdl_contrasena: string = '';
  mdl_cambiarContrasena: string = '';
  //correo
  correo: string = '';
  //spinner de recarga
  spinnerRecarga: boolean = false;
  //spinner boton
  spinnerVisible: boolean = false;
  //boton de registro deshabilitado
  botonDeshabilitado: boolean = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  //funcion para cambiar contraseña
  async cambiarContrasena() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    setTimeout(() => {
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

      this.spinnerVisible = false;
    }, 1000);
  }

}
