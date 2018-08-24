import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage, GuardadosPage, MapaPage, TabsPage } from '../pages/index.paginas';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//InAppBrowser
import { InAppBrowser } from '@ionic-native/in-app-browser';

//Barcode Scanner
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

//Contactos
import { Contacts } from '@ionic-native/contacts';

//Mapas
import { AgmCoreModule } from '@agm/core';
import { HistorialProvider } from '../providers/historial/historial';

import { Clipboard } from '@ionic-native/clipboard';

//Wifi
//import { Hotspot } from '@ionic-native/hotspot';

@NgModule({
  declarations: [
    MyApp,
    GuardadosPage,
    MapaPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC0ssCmWISt3MYDnP567MKNxIjPznmjs6I'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GuardadosPage,
    HomePage,
    MapaPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    InAppBrowser,
    Contacts,
    Clipboard,
    //Hotspot,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HistorialProvider
  ]
})
export class AppModule {}
