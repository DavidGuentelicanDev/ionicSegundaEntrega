import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage implements OnInit {

  //modelos para crear usuario
  mdl_correo: string = '';
  mdl_contrasena: string = '';
  mdl_nombre: string = '';
  mdl_apellido: string = '';
  mdl_carrera: string = '';
  mdl_confirmarContrasena: string = '';
  //spinner boton
  spinnerVisible: boolean = false;
  //boton de registro deshabilitado
  botonDeshabilitado: boolean = false;
  //spinner de recarga
  spinnerRecarga: boolean = false;

  //inyectar router, api
  constructor(
    private router: Router,
    private api: ApiService,
    private toastControlador: ToastController
  ) { }

  ngOnInit() {}
  
  //funcion del toast
  async mostrarToast(mensaje: string, color: string, duracion: number) {
    let toast = await this.toastControlador.create({
      message: mensaje,
      color: color,
      duration: duracion,
      position: 'bottom'
    });
    toast.present();
  }

  //funcion para crear o registrar un usuario
  async crearUsuario() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    //extras
    let extras: NavigationExtras = {
      replaceUrl: true
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //constante para validar formato de correo

    if (this.mdl_confirmarContrasena == '') { //valida que el usuario ingrese la confirmacion de contraseña, envia mensaje plano
      setTimeout(() => {
        this.mostrarToast('Todos los campos son obligatorios', 'warning', 3000);
        this.mdl_contrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      }, 1000);
    } else if (!correoRegex.test(this.mdl_correo)) { //valida que correo tenga formato correo, mensaje plano
      setTimeout(() => {
        this.mostrarToast('Debes ingresar un formato válido de correo electrónico', 'warning', 3000);
        this.mdl_correo = '';
        this.mdl_contrasena = '';
        this.mdl_confirmarContrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      }, 1000); //carga de 1 segundo antes de arrojar el toast
    } else if (!this.mdl_correo.endsWith('duocuc.cl')) { //valida que el correo tenga dominio @duocuc.cl, mensaje plano
      setTimeout(() => {
        this.mostrarToast('Debes ingresar un correo válido de DUOC UC', 'warning', 3000);
        this.mdl_correo = '';
        this.mdl_contrasena = '';
        this.mdl_confirmarContrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      }, 1000); //carga de 1 segundo antes de arrojar el toast
    } else if (this.mdl_contrasena.length < 3) { //validar que contraseña tenga un largo minimo de n, mensaje plano
      setTimeout(() => {
        this.mostrarToast('La contraseña debe tener una extensión mínima de 3 caracteres', 'warning', 3000);
        this.mdl_contrasena = '';
        this.mdl_confirmarContrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      }, 1000); //carga de 1 segundo antes de arrojar el toast
    } else if (this.mdl_contrasena != this.mdl_confirmarContrasena) { //valida que contraseña y confirmar contraseña sean distintas, envia mensaje plano
      setTimeout(() => {
        this.mostrarToast('Las contraseñas no coinciden', 'warning', 3000);
        this.mdl_contrasena = '';
        this.mdl_confirmarContrasena = '';
        this.botonDeshabilitado = false;
        this.spinnerVisible = false;
      }, 1000); //carga de 1 segundo antes de arrojar el toast
    } else if (this.mdl_contrasena == this.mdl_confirmarContrasena) { //si contraseña y confirmar contraseña son iguales, sigue el proceso de la api
      //creacion de usuario a traves de la api
      let datos = this.api.crearUsuario(
        this.mdl_correo,
        this.mdl_contrasena,
        this.mdl_nombre,
        this.mdl_apellido,
        this.mdl_carrera
      );
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      console.log('DGZ: ' + json_texto);

      setTimeout(() => {
        if (json.status == 'error') {
          this.mostrarToast(json.message, 'warning', 3000); //mensaje parametrizado en la respuesta de la api
          this.mdl_correo = '';
          this.mdl_contrasena = '';
          this.mdl_confirmarContrasena = '';
          this.botonDeshabilitado = false;
        } else {
          this.mostrarToast(json.message, 'success', 1500); //mensaje parametrizado en la respuesta de la api
          this.spinnerRecarga = true;

          setTimeout(() => {
            this.router.navigate(['login'], extras);
            this.spinnerRecarga = false;
          }, 2000);
        }

        this.spinnerVisible = false;
      }, 1000); //carga de 1 segundo antes de arrojar el toast
    }
  }

}
