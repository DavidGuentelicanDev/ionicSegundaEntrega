import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

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
  //boton de inicio deshabilitado
  botonDeshabilitado: boolean = false;
  //spinner de recarga
  spinnerRecarga: boolean = false;

  //inyectar dependencias
  constructor(
    private router: Router,
    private api: ApiService,
    private toastControlador: ToastController,
    private db: DbService
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
      this.router.navigate(['crear-usuario']);
      this.mdl_correo = '';
      this.mdl_contrasena = '';
  }

  //funcion para login
  async login() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    if (this.mdl_correo == '' || this.mdl_contrasena == '') { //validacion campos vacios, texto plano
      this.mostrarToast('Debes indicar un usuario y una contraseña para poder ingresar', 'warning', 3000);
      this.spinnerVisible = false;
      this.botonDeshabilitado = false;
    } else {
      //logueo a traves de la api
      let datos = this.api.login(this.mdl_correo, this.mdl_contrasena);
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
      console.log('DGZ: ' + json_texto);

      setTimeout(async () => {
        //validacion
        if (json.status == 'error') {
          this.mostrarToast(json.message, 'danger', 3000); //mensaje parametrizado en la api
          this.mdl_correo = '';
          this.mdl_contrasena = '';
          this.botonDeshabilitado = false;
        } else if (json.status == 'success') {
          //guardando usuario que se loguea
          await this.db.guardarUsuarioLogueado(
            json.usuario.correo,
            json.usuario.nombre,
            json.usuario.apellido,
            json.usuario.carrera
          );

          //extras
          let extras: NavigationExtras = {
            replaceUrl: true
          }

          this.mostrarToast('Navegando a la página principal...', 'success', 2000); //texto plano
          this.spinnerRecarga = true; //carga un spinner que ocupa toda la pantalla mientras navega al principal

          setTimeout(() => {
            this.router.navigate(['principal'], extras);
            this.spinnerRecarga = false;
          }, 2000);
        }

        this.spinnerVisible = false;
      }, 1000);
    }
  }

}
