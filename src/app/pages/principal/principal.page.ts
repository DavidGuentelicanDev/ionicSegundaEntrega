import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

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

  //inyectar dependencias
  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
    //iniciar el mostrar sedes
    this.mostrarSedes();
    //extras
    let extras = this.router.getCurrentNavigation()?.extras;

    if (extras?.state) {
      this.correo = extras?.state['correo'];
      this.nombre = extras?.state['nombre'];
      this.apellido = extras?.state['apellido'];
      this.carrera = extras?.state['carrera'];
      console.log(this.correo + ' ' + this.nombre + ' ' + this.apellido + ' ' + this.carrera);
    }
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

  //funcion cerrar sesion
  logout() {
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    
    this.router.navigate(['login'], extras)
  }

}
