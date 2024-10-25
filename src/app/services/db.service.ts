import { Injectable } from '@angular/core';

//importacion para sqlite
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  //definir una instancia de la db para poder inicializarla en nulo
  dbInstancia: SQLiteObject | null = null;

  //inyectar sqlite
  constructor(private sqlite: SQLite) { }

  //abrir la instancia de db
  async abrirDB() {
    try {
      this.dbInstancia = await this.sqlite.create({
        name: 'datos.db',
        location: 'default'
      });
      console.log('DGZ: BASE DE DATOS OK');
    } catch (e) {
      console.log('DGZ - PROBLEMA AL INICIAR LA BASE DE DATOS: ' + JSON.stringify(e));
    }
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
    try {
      await this.dbInstancia?.executeSql('INSERT INTO USUARIO_LOGUEADO VALUES(?, ?, ?, ?)', [correo, nombre, apellido, carrera]);
      console.log('DGZ: USUARIO LOGUEADO [correo: ' + correo + ', nombre: ' + nombre + ', apellido: ' + apellido + ', carrera: ' + carrera + '] GUARDADO OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //mostrar usuario logueado
  async mostrarUsuarioLogueado() {
    await this.abrirDB();

    try {
      let data = await this.dbInstancia?.executeSql('SELECT CORREO, NOMBRE, APELLIDO, CARRERA FROM USUARIO_LOGUEADO', []);

      if (data?.rows.length > 0) {
        return {
          correo: data.rows.item(0).CORREO,
          nombre: data.rows.item(0).NOMBRE,
          apellido: data.rows.item(0).APELLIDO,
          carrera: data.rows.item(0).CARRERA
        };
      }
      return null;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
      return null;
    }
  }

  //eliminar usuario logueado
  async eliminarUsuarioLogueado(correo: string) {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('DELETE FROM USUARIO_LOGUEADO WHERE CORREO = ?', [correo]);
      console.log('DGZ: USUARIO LOGUEADO ' + correo + ' BORRADO OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //IMPLEMENTARE UNA NUEVA FUNCIONALIDAD LIGADA A LA BASE DE DATOS LOCAL SQLITE
  //LA IDEA ES PODER DARLE ME GUSTA A CADA SEDE, Y QUE ESTOS ME GUSTA PERSISTAN POR USUARIO Y SEDE,
  //PARA PODER CONTAR CUANTOS ME GUSTA LLEVA CADA SEDE

  //crear tabla me gusta
  async crearTablaMeGusta () {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('CREATE TABLE IF NOT EXISTS ME_GUSTA (USUARIO VARCHAR(30), SEDE VARCHAR(50))', []);
      console.log('DGZ: TABLA ME_GUSTA CREADA OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //guardar me gusta
  async guardarMeGusta(usuario: string, sede: string) {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('INSERT INTO ME_GUSTA VALUES(?, ?)', [usuario, sede]);
      console.log('DGZ: ME GUSTA GUARDADO ' + usuario + ' ' + sede);
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //eliminar me gusta
  async eliminarMeGusta(usuario: string, sede: string) {
    await this.abrirDB();

    try {
      await this.dbInstancia?.executeSql('DELETE FROM ME_GUSTA WHERE USUARIO = ? AND SEDE = ?', [usuario, sede]);
      console.log('DGZ: ME GUSTA DEL USUARIO ' + usuario + ' BORRADO OK');
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
    }
  }

  //verificar si existe un me gusta
  async existeMeGusta(usuario: string, sede: string): Promise<boolean> {
    await this.abrirDB();

    try {
      let resultado = await this.dbInstancia?.executeSql('SELECT USUARIO, SEDE FROM ME_GUSTA WHERE USUARIO = ? AND SEDE = ?', [usuario, sede]);
      console.log('DGZ: HAY UN ME GUSTA GUARDADO');
      return resultado?.rows.length > 0;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
      return false;
    }
  }

  //contar me gusta por sede
  async contarMeGustaPorSede(sede: string): Promise<number> {
    await this.abrirDB();

    try {
      let resultado = await this.dbInstancia?.executeSql('SELECT COUNT(SEDE) AS total FROM ME_GUSTA WHERE SEDE = ?', [sede]);

      //si hay filas con el nombre de la sede
      if (resultado?.rows.length > 0) {
        //entonces cuenta la cantidad de filas
        let contador = resultado.rows.item(0).total;
        console.log('DGZ: TOTAL ME GUSTA PARA SEDE ' + sede + ' ES ' + contador);
        return contador; //me devuelve el total
      }
      return 0;
    } catch (e) {
      console.log('DGZ: ' + JSON.stringify(e));
      return 0;
    }
  }

}
