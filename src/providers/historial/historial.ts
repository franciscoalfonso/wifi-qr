import { Injectable } from '@angular/core';
import { ScanData } from "../../models/scan-data.model";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { ModalController, Platform, ToastController, AlertController } from "ionic-angular";
import { MapaPage } from "../../pages/mapa/mapa";

import { Clipboard } from '@ionic-native/clipboard';

//import { Hotspot } from '@ionic-native/hotspot';
/*
  Generated class for the HistorialProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HistorialProvider {
  private _historial:ScanData[] = [];
  to: any;
  subject: any;
  body: any;

  constructor( private iab: InAppBrowser,
               private modalCtrl: ModalController,
               private contacts: Contacts,
               private platform:Platform,
               private toastCtrl:ToastController,
               private alert:AlertController,
               private portapapeles:Clipboard
               /*private hotspot:Hotspot*/) { }


  agregar_historial( texto:string ){

    let data = new ScanData( texto );



    this._historial.unshift( data );

    console.table( this._historial );

    //this.abrir_scan(0);

  }

  
  abrir_scan( index:number){

    let scanData = this._historial[index];
    console.log( scanData );

    switch( scanData.tipo ){

      case "http":
        this.iab.create( scanData.info, "_system" );
      break;

      case "mapa":
        this.modalCtrl.create( MapaPage, { coords: scanData.info })
            .present();
      break;

      case "contacto":
        this.crear_contacto(  scanData.info );
      break;

      case "email":
        this.crear_email(  scanData.info );
      break;

      case "wifi":
        this.mostrar_datos_red( scanData.info );
      break;

      default:
        console.error("Tipo no soportado");
      break;

    }

  }

  private mostrar_datos_red(texto:string){
    let datosRed = texto.split(";");

    let ssid = datosRed[0].replace("SSID:", "");
    let ecpt = datosRed[1].replace("ENCRYPTION:", "");
    let pass = datosRed[2].replace("PASSWORD:", "");

    let alertTxt;

    console.log("SSID:" + ssid);
    console.log("ENCRYPTION:" + ecpt);
    console.log("PASSWORD:" + pass);

    alertTxt = "SSID: " + ssid + "\n";
    alertTxt += "ENCRIPTACIÓN: " + ecpt + "\n";
    alertTxt += "CONTRASEÑA: " + pass + "\n";

    this.alert.create({
      title: 'Datos de la red',
      subTitle: alertTxt,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Copiar',
          handler: () => {
            this.portapapeles.copy(pass);
            this.crear_toast("Contraseña copiada al portapapeles");
          }
        }
      ]
    }).present();

    /*
    // Intentando conectar a red Wifi con Wifi Hotspot
    this.hotspot.isWifiSupported().then(isSupported => {
      if(isSupported){
        this.hotspot.isWifiOn().then(isOn => {
          if(isOn){
            this.hotspot.removeWifiNetwork(ssid).then(() => {
              this.hotspot.connectToWifi(ssid, pass).then(() => {
                this.crear_toast("Conectado a: " + ssid);
              }).catch(error => {
                console.log(error);
                this.crear_toast("La red " + ssid + " se encuentra fuera de rango.");
              });
            });
          }else{
            this.crear_toast("Encienda el Wi Fi para continuar.");
          }
        });
      }else{
        this.crear_toast("La tecnología Wi Fi no esta soportada por el dispositivo.");
      }
    });
    */
  }

  private crear_email(texto:string){
    let correo = texto.split(";");

    this.to = correo[0].replace("MATMSG:TO:","");
    this.subject = correo[1].replace("SUB:","");
    this.body = correo[2].replace("BODY:","");

    this.iab.create("mailto:" + this.to + "?subject=" + this.subject + "&body=" + this.body, "_system");
  }

  private crear_contacto( texto:string ){

    let campos:any = this.parse_vcard( texto );
    console.log( campos );

    let nombre = campos['fn'];
    let tel    = campos.tel[0].value[0];


    if( !this.platform.is('cordova') ){
      console.warn("Estoy en la computadora, no puedo crear contacto.");
      return;
    }

    let contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, nombre );
    contact.phoneNumbers = [ new ContactField('mobile', tel ) ];

    contact.save().then(
      ()=> this.crear_toast("Contacto " + nombre + " creado!"),
      (error) => this.crear_toast( "Error: " + error )
    );


  }

  private crear_toast( mensaje:string ){

    this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    }).present();

  }


  private parse_vcard( input:string ) {

    var Re1 = /^(version|fn|title|org):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
        var results, key;

        if (Re1.test(line)) {
            results = line.match(Re1);
            key = results[1].toLowerCase();
            fields[key] = results[2];
        } else if (Re2.test(line)) {
            results = line.match(Re2);
            key = results[1].replace(ReKey, '').toLowerCase();

            var meta = {};
            results[2].split(';')
                .map(function (p, i) {
                var match = p.match(/([a-z]+)=(.*)/i);
                if (match) {
                    return [match[1], match[2]];
                } else {
                    return ["TYPE" + (i === 0 ? "" : i), p];
                }
            })
                .forEach(function (p) {
                meta[p[0]] = p[1];
            });

            if (!fields[key]) fields[key] = [];

            fields[key].push({
                meta: meta,
                value: results[3].split(';')
            })
        }
    });

    return fields;
};



  cargar_historial(){
    return this._historial;
  }
}
