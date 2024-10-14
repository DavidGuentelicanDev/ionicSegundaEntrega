import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearUsuarioPage } from './crear-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: CrearUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearUsuarioPageRoutingModule {}
