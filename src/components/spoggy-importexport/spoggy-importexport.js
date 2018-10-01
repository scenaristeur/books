/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/*
Module pour attrapper les parametres d'url :
//http://127.0.0.1:8081/?endpoint=http://127.0.0.1:3030&source=http://test.json&graph=plop&query=SELECT * WHERE {?s ?p ?o}

*/

import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-dialog-behavior/paper-dialog-behavior.js';
//import '@polymer/paper-button/paper-button.js';
//import 'web-animations-js';
//import '@types/web-animations-js';

/*
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {NeonAnimatableBehavior} from '@polymer/neon-animation/neon-animatable-behavior.js';*/
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';

// These are the elements needed by this element.
//import { plusIcon, minusIcon } from './../my-icons.js';

// These are the shared styles needed by this element.
//import { ButtonSharedStyles } from './../button-shared-styles.js';
import  'evejs/dist/eve.min.js';
import { ImportexportAgent } from './agents/ImportexportAgent.js'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SpoggyImportexport extends LitElement {
  render() {
    return html`

    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    .popup {
      /*  position: absolute;
      z-index: 10;
      top: 2vw;
      left: 2vw;*/
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:1px;
    }
    </style>
    <div>
    <p>
    IMportExport </br>

    </div>

    <paper-dialog id="importPopUp" class="popup" backdrop transition="core-transition-bottom"><!--  on-iron-overlay-opened="_openImport"
    on-iron-overlay-closed="_closeImport"-->
    <div horizontal start-justified start layout >
    <core-icon icon="thumb-up" style="height: 150px; width:150px;color: #0D578B;"></core-icon>
    <div style="padding-left:20px" vertical start-justified start layout wrap>
    <h2 id="importOperation" style="margin: 0;color: #0D578B;">Import JSON (ou ttl) <paper-icon-button icon="clear" dialog-dismiss></paper-icon-button></h2>
    <p >
    <fieldset>
    <legend>Paramètres</legend>
    <paper-checkbox id="remplaceNetwork">Remplacer Network</paper-checkbox>
    <paper-checkbox id="partageImport" disabled >Partager Import</paper-checkbox>
    </fieldset>
    </p>
    <p>
    <fieldset>
    <legend>Fichier</legend>
    <input id="filepicker"
    type="file"
    multiple
    value="Importer"
    @change="${(e) => this._handleFileSelected(e)}">
    </input>
    <!--  on-change="handleFileSelected"-->
    </fieldset>
    </p>
    <div style="padding-top:10px" horizontal end-justified layout self-stretch>
    <paper-button id="importCancelButton" dialog-dismiss raised>Annuler</paper-button>
    <a href="https://github.com/scenaristeur/heroku-spoggy/tree/master/public/exemple_files" target="_blank"> exemples de fichiers spoggy </a>
    </div>
    </div>
    </div>
    </paper-dialog>


    <paper-dialog id="popupTtl" class="popup" backdrop transition="core-transition-bottom"  iron-overlay-opened="fillTextToSave"><!-- on-iron-overlay-opened="_myOpenFunction"
    on-iron-overlay-closed="_myClosedFunction" -->
    <h2  style="margin: 0;color: #0D578B;"> Export au format turtle (RDF)
    <!--<paper-button ontap="_pageAide">?</paper-button>-->
    <!--  <paper-button dialog-dismiss raised>X</paper-button> -->
    <paper-icon-button icon="clear" dialog-dismiss></paper-icon-button></h2>

    <paper-dialog-scrollable>
    <paper-textarea id="inputTextToSave" rows="10"></paper-textarea>
    </paper-dialog-scrollable>

    <div style="padding-top:10px" horizontal end-justified layout self-stretch>

    <!--<paper-button raised on-tap="creer" dialog-confirm>Créer</paper-button>
    <paper-button  dialog-dismiss raised>Fermer</paper-button>-->
    <paper-input id="inputFileNameToSaveAs" label="Nom du fichier à sauvegarder (.ttl)"></paper-input>
    <paper-button raised
    @click="${(e) => this._saveTextAsFile(e)}"
    dialog-confirm>Exporter le fichier Ttl</paper-button>
    <br>
    </div>



    </paper-dialog>


    `;
  }

  static get properties() { return {
    //  socket: Object
  }};

  constructor() {
    super();
    //  console.log("eve",eve);

  }
  firstUpdated() {
    this.agentImportexport = new ImportexportAgent('agentImportexport', this);
    console.log(this.agentImportexport);
    this.agentImportexport.send('agentApp', {type: 'dispo', name: 'agentImportexport' });

  }

  _openImportPopup() {
    console.log("open import")
    var importPopUp = this.shadowRoot.querySelector('#importPopUp');
    importPopUp.open();
    //scrollable.dialogElement = myDialog;

  }

  _handleFileSelected(evt) {
    var app = this;
    //  var partageImport = this.shadowRoot.getElementById('partageImport');
    //  console.log(partageImport)
    var partageImport = this.shadowRoot.getElementById('partageImport').checked;
    var remplaceNetwork = this.shadowRoot.getElementById('partageImport').checked;
    var files = evt.target.files; // FileList object
    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0; i < files.length; i++) {
      // Code to execute for every file selected
      var fichier = files[i];
      console.log(fichier);
      this.agentImportexport.send('agentGraph', {type: 'decortiqueFile', fichier: fichier, remplaceNetwork: remplaceNetwork});
      //    this.decortiqueFile(fichier, this.network, remplaceNetwork);
    }
    console.log("fin");
    // Code to execute after that
    evt.target.files = null;
    this.shadowRoot.querySelector('#importPopUp').toggle();
    //  app.$.dialogs.$.inputMessage.value = '';
  }

  _exportTtl(ttlData){
    console.log(ttlData)
    this.shadowRoot.getElementById('popupTtl').open();
    this.shadowRoot.getElementById('inputTextToSave').value = ttlData;
    this.shadowRoot.getElementById('inputFileNameToSaveAs').value ="Spoggy-exportTTL_"+Date.now();
  }

  _saveTextAsFile(){
    var textToWrite="";
    var fileNameToSaveAs="";
    var textFileAsBlob="";
    var extension="ttl";
    var nomFichier="";
    var data = this.shadowRoot.getElementById('inputTextToSave').value;
    console.log(data);
    if((typeof data != "undefined")&& (data.length>0)){
      textToWrite=data;
    }else{
      textToWrite = this.shadowRoot.getElementById('inputTextToSave').value;    //textToWrite = document.getElementById("inputTextToSave").value;
    }
    if ((typeof nomFichier != "undefined") && (nomFichier.length>0)){
      fileNameToSaveAs = nomFichier+"."+extension;
    }else{
      fileNameToSaveAs = this.shadowRoot.getElementById('inputFileNameToSaveAs').value+"."+extension; // fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value+"."+extension;
    }
    if ((typeof extension != "undefined") && (extension.length>0)){
      switch(extension){
        case "ttl" :
        textFileAsBlob = new Blob([textToWrite], {
          type:
          'text/turtle'
        }
      );
      break;
      case "rdf" :
      //pas implementé pour l'instant
      textFileAsBlob = new Blob([textToWrite], {
        type:
        'application/rdf+xml'
      }
    );
    break;
    default :
    console.log("non traite  , extension : "+extension);
    break;
  }
}
console.log(nomFichier+" : "+extension);
var downloadLink = document.createElement("a");
downloadLink.download = fileNameToSaveAs;
downloadLink.innerHTML = "Download File";
//console.log(window.URL);
//if (window.URL != null)
if(navigator.userAgent.indexOf("Chrome") != -1)
{
  // Chrome allows the link to be clicked
  // without actually adding it to the DOM.
  console.log("CHROME");
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
} else
{
  // Firefox requires the link to be added to the DOM
  // before it can be clicked.
  console.log("FF");
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.target="_blank";
  //downloadLink.onclick = destroyClickedElement;
  //downloadLink.onclick = window.URL.revokeObjectURL(downloadLink);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  //  console.log(this.$.popupTtl);
}
console.log(downloadLink);
/*downloadLink.click();*/
/* creation d'un event car download.click() ne fonctionne pas sous Firefox */
var event = document.createEvent("MouseEvents");
event.initMouseEvent(
  "click", true, false, window, 0, 0, 0, 0, 0
  , false, false, false, false, 0, null
);
downloadLink.dispatchEvent(event);
var app = this;
setTimeout(function(){
  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(downloadLink);
}, 100);
}

}

window.customElements.define('spoggy-importexport', SpoggyImportexport);
