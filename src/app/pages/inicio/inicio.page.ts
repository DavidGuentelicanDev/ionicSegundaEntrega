import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  //inyectar dependencias necesarias
  constructor(private router: Router, private db: DbService) { }

  async ngOnInit() {
    //para la base de datos local
    this.db.abrirDB();
    this.db.crearTablaUsuarioLogueado();

    let extras: NavigationExtras = {
      replaceUrl: true
    }

    //para validar que el usuario este logueado
    let usuario = await this.db.mostrarUsuarioLogueado();

    if (usuario) { //si hay usuario logueado, navega al principal
      setTimeout(() => {
        this.router.navigate(['principal'], extras);
      }, 2000);
    } else { //si no hay usuario logueado, navega al login
      setTimeout(() => {
        this.router.navigate(['login'], extras);
      }, 2000);
    }
  }

}
