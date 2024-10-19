import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //modelos del login
  mdl_correo: string = '';
  mdl_contrasena: string = '';
  //spinner boton
  spinnerVisible: boolean = false;

  //inyectar router
  constructor(
    private router: Router,
    private api: ApiService,
    private toastControlador: ToastController
  ) { }

  ngOnInit() {
  }

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

  //funcion para navegar al crear usuario
  navegarCrearUsuario() {
    setTimeout(() => {
      this.router.navigate(['crear-usuario']);
      this.mdl_correo = '';
      this.mdl_contrasena = '';
    }, 300); //0,3 segundos para viajar
  }

  //funcion para login
  async login() {
    this.spinnerVisible = true;

    if (this.mdl_correo == '' || this.mdl_contrasena == '') { //validacion campos vacios, texto plano
      this.mostrarToast('Debes indicar un usuario y una contraseña para poder ingresar', 'warning', 3000);
      this.spinnerVisible = false;
    } else {
      //logueo a traves de la api
      let datos = this.api.login(this.mdl_correo, this.mdl_contrasena);
      let respuesta = await lastValueFrom(datos);

      setTimeout(() => {
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);
        console.log('DGZ: ' + json_texto);

        //validacion
        if (json.status == 'error') {
          this.mostrarToast(json.message, 'danger', 3000); //mensaje parametrizado en la api
          this.mdl_correo = '';
          this.mdl_contrasena = '';
        } else if (json.status == 'success') {
          //extras
          let extras: NavigationExtras = {
            state: {
              'correo': json.usuario.correo,
              'nombre': json.usuario.nombre,
              'apellido': json.usuario.apellido,
              'carrera': json.usuario.carrera
            },
            replaceUrl: true
          }

          this.mostrarToast('Navegando a la página principal...', 'success', 2000); //texto plano

          setTimeout(() => {
            this.router.navigate(['principal'], extras);
          }, 2000);
        }

        this.spinnerVisible = false;
      }, 1000);
    }
  }

}
