import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
  //variables para recibir extras
  correo: string = '';
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';
  //lista temporal para mostrar los datos del usuario logueado
  //lista_datos: any[] = [];

  //inyectar dependencias
  constructor(private router: Router, private api: ApiService, private db: DbService) { }

  ngOnInit() {
    //extras
    let extras = this.router.getCurrentNavigation()?.extras;

    if (extras?.state) {
      this.correo = extras?.state['correo'];
      this.nombre = extras?.state['nombre'];
      this.apellido = extras?.state['apellido'];
      this.carrera = extras?.state['carrera'];

      //para guardar el usuario logueado en la base de datos local
      this.guardarUsuarioLogueado();
    } else {
      //mostrar usuario logueado guardado en db
      this.mostrarUsuarioLogueado();
      //this.lista_datos = this.db.lista_datos;
    }

    //iniciar el mostrar sedes
    this.mostrarSedes();
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
    console.log(this.lista_sedes);
  }

  //funcion para guardar usuario logueado en la db
  async guardarUsuarioLogueado() {
    await this.db.guardarUsuarioLogueado(this.correo, this.nombre, this.apellido, this.carrera);
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
    //this.lista_datos = this.db.lista_datos;
  }

  //funcion para borrar usuario logueado
  async eliminarUsuarioLogueado(correo: string) {
    await this.db.eliminarUsuarioLogueado(correo);
    //this.mostrarUsuarioLogueado();
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

}
