import { Injectable } from '@angular/core';

//importar para activar este servicio de APIs
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //url general
  URL_DUOC: string = 'https://www.s2-studio.cl';

  //inyectar http para consumo de APIs
  constructor(private http: HttpClient) { }

  //funcion de creacion de usuario
  crearUsuario(
    correo: string,
    contrasena: string,
    nombre: string,
    apellido: string,
    carrera: string
  ) {
    let usuario: any = {};
    usuario.correo = correo;
    usuario.contrasena = contrasena;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.carrera = carrera;

    //api POST
    return this.http.post(this.URL_DUOC + '/api_duoc/usuario/usuario_almacenar', usuario).pipe();
  }

  //funcion para loguearse
  login(correo: string, contrasena: string) {
    let usuario: any = {};
    usuario.correo = correo;
    usuario.contrasena = contrasena;

    //api POST
    return this.http.post(this.URL_DUOC + '/api_duoc/usuario/usuario_login', usuario).pipe();
  }

  //mostrar sedes
  mostrarSedes() {
    return this.http.get(this.URL_DUOC + '/api_duoc/usuario/sedes_obtener').pipe();
  }

  //actualizar contraseña y carrera
  actualizarUsuario(correo: string, contrasena: string, carrera: string) {
    let usuario: any = {};
    usuario.correo = correo;
    usuario.contrasena = contrasena;
    usuario.carrera = carrera;

    //api PATCH
    return this.http.patch(this.URL_DUOC + '/api_duoc/usuario/usuario_modificar', usuario).pipe();
  }

}
