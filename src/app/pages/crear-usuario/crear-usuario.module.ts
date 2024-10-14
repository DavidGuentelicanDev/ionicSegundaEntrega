import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearUsuarioPageRoutingModule } from './crear-usuario-routing.module';

import { CrearUsuarioPage } from './crear-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearUsuarioPageRoutingModule
  ],
  declarations: [CrearUsuarioPage]
})
export class CrearUsuarioPageModule {}
