import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage implements OnInit {

  //modelos para el cambio de contraseña
  mdl_correo: string = '';
  mdl_contrasenaNueva: string = '';
  mdl_confirmarContrasenaNueva: string = '';
  mdl_carrera: string = '';
  //correo
  correo: string = '';
  //correo logueado
  correoLogueado: string = '';
  //spinner de recarga
  spinnerRecarga: boolean = false;
  //spinner boton
  spinnerVisible: boolean = false;
  //boton de registro deshabilitado
  botonDeshabilitado: boolean = false;
  //contraseña visible
  verContrasena: boolean = false;
  verConfirmarContrasena: boolean = false;

  //inyectar dependencias necesarias
  constructor(
    private router: Router,
    private toastControlador: ToastController,
    private api: ApiService,
    private db: DbService
  ) { }

  async ngOnInit() {
    //validar que exista usuario al ingresar a la pantalla
    await this.mostrarUsuarioLogueado();
  }

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

  //mostrar usuarios logueados
  async mostrarUsuarioLogueado() {
    let usuario = await this.db.mostrarUsuarioLogueado();
    
    if (usuario) {
      this.correoLogueado = usuario.correo;
      console.log('DGZ: usuario en la db ' + this.correo);
    }
  }

  //funcion para cambiar contraseña
  async actualizarUsuario() {
    this.spinnerVisible = true;
    this.botonDeshabilitado = true;

    setTimeout(async() => {
      if (this.mdl_confirmarContrasenaNueva == '') { //validar adicionalmente el campo confirmar contraseña nueva con mensaje plano
        this.mostrarToast('Todos los campos son obligatorios', 'warning', 3000);
        this.spinnerVisible = false;
        this.botonDeshabilitado = false;
      } else if (this.mdl_correo != this.correoLogueado) {
        this.mostrarToast('El correo ingresado no corresponde al usuario logueado', 'warning', 3000);
        this.mdl_correo = '';
        this.mdl_contrasenaNueva = '';
        this.mdl_confirmarContrasenaNueva = '';
        this.spinnerVisible = false;
        this.botonDeshabilitado = false;
      } else if (this.mdl_contrasenaNueva.length < 3) { //validar largo de contraseña con min 3 caracteres, mensaje plano
        this.mostrarToast('La nueva contraseña debe tener un largo mínimo de 3 caracteres', 'warning', 3000);
        this.mdl_contrasenaNueva = '';
        this.mdl_confirmarContrasenaNueva = '';
        this.spinnerVisible = false;
        this.botonDeshabilitado = false;
      } else if (this.mdl_contrasenaNueva != this.mdl_confirmarContrasenaNueva) { //nueva contraseña y confirmar nueva contraseña distintas, mensaje plano
        this.mostrarToast('Las contraseñas no coinciden', 'warning', 3000);
        this.mdl_contrasenaNueva = '';
        this.mdl_confirmarContrasenaNueva = '';
        this.spinnerVisible = false;
        this.botonDeshabilitado = false;
      } else if (this.mdl_contrasenaNueva == this.mdl_confirmarContrasenaNueva) { //nueva contraseña y confirmar nueva contraseña iguales
        let datos = this.api.actualizarUsuario(
          this.mdl_correo,
          this.mdl_contrasenaNueva,
          this.mdl_carrera
        );
        let respuesta = await lastValueFrom(datos);
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);
        console.log('DGZ: ' + json.status);
        console.log('DGZ: ' + json.message);

        //se capturan los mensajes de la api segun la respuesta
        if (json.status == 'error') {
          this.mostrarToast(json.message, 'warning', 3000);
          this.botonDeshabilitado = false;
          this.mdl_correo = '';
          this.mdl_contrasenaNueva = '';
          this.mdl_carrera = '';
          this.mdl_confirmarContrasenaNueva = ''
        } else {
          this.mostrarToast(json.message, 'success', 1500);
          this.spinnerRecarga = true;

          //redirigir al principal
          let extras: NavigationExtras = {
            state: {
              alertReinicio: true //se envia extras para solicitar reiniciar app y volver a loguearse
            },
            replaceUrl: true
          };

          setTimeout(() => {
            this.router.navigate(['principal'], extras);
            this.spinnerRecarga = false;
          }, 2000);
        }

        this.spinnerVisible = false;
      }
    }, 1000);
  }

  //contraseña visible
  contrasenaVisible() {
    this.verContrasena = !this.verContrasena; //alterna la visibilidad de la contraseña
  }

  //confirmar contraseña visible
  confirmarContrasenaVisible() {
    this.verConfirmarContrasena = !this.verConfirmarContrasena; //alterna la visibilidad de la contraseña
  }

}
