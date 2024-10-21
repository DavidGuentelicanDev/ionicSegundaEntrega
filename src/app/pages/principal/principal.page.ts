import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  //lista para las sedes
  lista_sedes: any[] = [];
  //skeletons
  skeletons = Array(3);
  skeletonsCargando: boolean = true; 
  //variables para mostrar usuario
  correo: string = '';
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';
  //spinner de recarga
  spinnerRecarga: boolean = false;

  //inyectar dependencias
  constructor(
    private router: Router,
    private api: ApiService,
    private db: DbService,
    private alertControlador: AlertController
  ) { }

  async ngOnInit() {
    this.skeletonsCargando = true; //activar skeletons

    //extras para reiniciar luego de cambiar contraseña
    let extras = this.router.getCurrentNavigation()?.extras;

    if (extras?.state) {
      this.reiniciar();
    }

    await this.mostrarUsuarioLogueado(); //mostrar usuario logueado guardado en db

    setTimeout(async () => {
      //mostrar sedes y desactivar skeletons despues de 1 segundo
      await this.mostrarSedes();
      this.skeletonsCargando = false;
    }, 1000); //mantener skeletons 1 seg.
  }

  //funcion para mostrar sedes
  async mostrarSedes() {
    let datos = this.api.mostrarSedes();
    let respuesta = await lastValueFrom(datos);
    let json_texto = JSON.stringify(respuesta);
    let json = JSON.parse(json_texto);

    //limpiar lista
    this.lista_sedes = [];

    //recorrer primer arreglo
    for (let i = 0; i < json.length; i++) {
      //recorrer segundo arreglo
      for (let j = 0; j < json[i].length; j++) {
        let sede: any = {};
        sede.nombre = json[i][j].NOMBRE;
        sede.direccion = json[i][j].DIRECCION;
        sede.telefono = json[i][j].TELEFONO;
        sede.horario = json[i][j].HORARIO_ATENCION;
        sede.imagen = json[i][j].IMAGEN;

        //guardar en la lista
        this.lista_sedes.push(sede);
      }
    }
  }

  //mostrar usuarios logueados
  async mostrarUsuarioLogueado() {
    let usuario = await this.db.mostrarUsuarioLogueado();
    
    if (usuario) {
      this.correo = usuario.correo;
      this.nombre = usuario.nombre;
      this.apellido = usuario.apellido;
      this.carrera = usuario.carrera;
    }
  }

  //funcion para borrar usuario logueado
  async eliminarUsuarioLogueado(correo: string) {
    await this.db.eliminarUsuarioLogueado(correo);
  }

  //navegar a cambiar contraseña
  navegarCambiarContrasena() {
    let extras: NavigationExtras = {
      replaceUrl: true
    };

    this.router.navigate(['cambiar-contrasena'], extras);
  }

  //funcion cerrar sesion
  async logout() {
    //primero borrar el usuario logueado
    await this.eliminarUsuarioLogueado(this.correo);

    //extras
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    
    this.router.navigate(['login'], extras);
  }

  //funcion para abrir el mensaje de cerrar sesion
  async cerrarSesion() {
    let alert = await this.alertControlador.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('DGZ: Cierre de sesión cancelado');
          }
        },
        {
          text: 'Cerrar',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  //funcion para reiniciar cuando se cambie contraseña
  async reiniciar() {
    let alert = await this.alertControlador.create({
      header: 'Reiniciar aplicación',
      message: 'Para aplicar el cambio de contraseña, es necesario reiniciar la aplicación. ¿Deseas cerrar sesión ahora?',
      backdropDismiss: false, //evita que el alert se cierre al presionar fuera
      buttons: [
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

}
