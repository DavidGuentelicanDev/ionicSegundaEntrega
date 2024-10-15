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

  //inyectar router, api
  constructor(private router: Router, private api: ApiService, private toastControlador: ToastController) { }

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

  //funcion para crear o registrar un usuario
  async crearUsuario() {
    //extras
    let extras: NavigationExtras = {
      replaceUrl: true
    }

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
    console.log(json);

    if (this.mdl_confirmarContrasena == '') { //valida que el usuario ingrese la confirmacion de contraseña, envia mensaje plano
      //console.log('Todos los campos son obligatorios');
      this.mostrarToast('Todos los campos son obligatorios', 'warning', 3000);
      this.mdl_contrasena = '';
    } else if (this.mdl_contrasena != this.mdl_confirmarContrasena) { //valida que contraseña y confirmar contraseña sean distintas, envia mensaje plano
      //console.log('Las contraseñas no coinciden');
      this.mostrarToast('Las contraseñas no coinciden', 'warning', 3000);
      this.mdl_contrasena = '';
      this.mdl_confirmarContrasena = '';
    } else if (this.mdl_contrasena == this.mdl_confirmarContrasena) { //si contraseña y confirmar contraseña son iguales, sigue el proceso de la api
      if (json.status == 'error') {
        //console.log('mensaje: ' + json.message);
        this.mostrarToast(json.message, 'warning', 3000);
        this.mdl_correo = '';
        this.mdl_contrasena = '';
      } else {
        //console.log('mensaje: ' + json.message);
        this.mostrarToast(json.message, 'success', 2000);
        this.router.navigate(['login'], extras);
      }
    }
  }

}
