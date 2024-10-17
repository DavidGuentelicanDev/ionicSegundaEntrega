//mi idea es que la base de datos solo se abra en el principal y traer los datos del login correcto como extras

import { Injectable } from '@angular/core';

//importacion para sqlite
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  //definir una instancia de la db para poder inicializarla en nulo
  dbInstancia: SQLiteObject | null = null;
  //lista temporal para poder mostrar los datos guardados y verificar que se guarden
  lista_datos: any[] = [];

  //inyectar sqlite
  constructor(private sqlite: SQLite) { }

  //abrir la instancia de db
  async abrirDB() {
    this.dbInstancia = await this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    });
    console.log('DGZ: BASE DE DATOS OK');
  }

  //crear tabla usuario logueado
  async crearTablaUsuarioLogueado() {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('CREATE TABLE IF NOT EXISTS USUARIO_LOGUEADO (CORREO VARCHAR(30), NOMBRE VARCHAR(30), APELLIDO VARCHAR(30), CARRERA VARCHAR(50))', []);
      console.log('DGZ: TABLA USUARIO_LOGUEADO CREADA OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //guardar el usuario que se loguee en la db
  async guardarUsuarioLogueado(
    correo: string,
    nombre: string,
    apellido: string,
    carrera: string
  ) {
    await this.abrirDB();

    //insertar datos
    await this.dbInstancia?.executeSql('INSERT INTO USUARIO_LOGUEADO VALUES(?, ?, ?, ?)', [correo, nombre, apellido, carrera]);
    console.log('DGZ: USUARIO LOGUEADO GUARDADO OK');
  }

  //mostrar usuario logueado
  async mostrarUsuarioLogueado() {
    await this.abrirDB();
    this.lista_datos = [];

    await this.dbInstancia?.executeSql('SELECT CORREO, NOMBRE, APELLIDO, CARRERA FROM USUARIO_LOGUEADO', [])
    .then((data) => {
      for (let x = 0; x < data.rows.length; x++) {
        let objeto: any = {};
        //obtener columnas
        objeto.correo = data.rows.item(x).CORREO;
        objeto.nombre = data.rows.item(x).NOMBRE;
        objeto.apellido = data.rows.item(x).APELLIDO;
        objeto.carrera = data.rows.item(x).CARRERA;

        //guardar en la lista
        this.lista_datos.push(objeto);
      }
    });
  }

  //eliminar usuario logueado
  async eliminarUsuarioLogueado(correo: string) {
    await this.abrirDB();

    await this.dbInstancia?.executeSql('DELETE FROM USUARIO_LOGUEADO WHERE CORREO = ?', [correo]);
    console.log('DGZ: USUARIO LOGUEADO BORRADO OK');
  }

}
