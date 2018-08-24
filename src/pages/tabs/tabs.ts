import { Component } from '@angular/core';

import { GuardadosPage, HomePage } from '../index.paginas';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = GuardadosPage;

  constructor() {

  }
}
