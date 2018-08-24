import { Component } from '@angular/core';
// Componentes
import { ToastController, Platform } from 'ionic-angular';
// Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
// servicios
import { HistorialProvider } from "../../providers/historial/historial";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private barcodeScanner: BarcodeScanner,
              private toastCtrl: ToastController,
              private platform: Platform,
              private _historialService:HistorialProvider) { 

  }

  scan(){
    console.log("Realizando scan...");

    if( !this.platform.is('cordova')){
    
     this._historialService.agregar_historial( "https://www.google.com");
     this._historialService.agregar_historial( "geo:9.976133040865312,-84.00677479055173" );
     this._historialService.agregar_historial( `BEGIN:VCARD
      VERSION:2.1
      N:Kent;Clark
      FN:Clark Kent
      ORG:
      TEL;HOME;VOICE:12345
      TEL;TYPE=cell:67890
      ADR;TYPE=work:;;;
      EMAIL:clark@superman.com
      END:VCARD`
     )

   this._historialService.agregar_historial("MATMSG:TO: ponch56@gmail.com;SUB:Asunto del mensaje;BODY:Texto del email.;;" );
  }

  this.barcodeScanner.scan().then(barcodeData => {
    console.log('Barcode data', barcodeData);
    this._historialService.agregar_historial(barcodeData.text);
    }).catch(err => {
      console.log('Error', err);
      this.mostrar_error('Error: '+err);
    });
  }

  mostrar_error( mensaje:string ){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    });

    toast.present();
  }

}
