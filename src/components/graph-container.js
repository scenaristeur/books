/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';

// These are the elements needed by this element.
import { plusIcon, minusIcon } from './my-icons.js';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles.js';

import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import 'spoggy-graph/spoggy-graph';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class GraphContainer extends LitElement {
  render() {
    const { source ,jsonData} = this;
    return html`
    ${ButtonSharedStyles}
    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>

    <iron-ajax
    id="request"
    url="unknown"
    handle-as="json"
    debounce-duration="300">
    </iron-ajax>
    <spoggy-graph id="jsongraph" name="jsongraph" data="${jsonData}">Chargement...</spoggy-graph>


    <h2>Chargement d'un fichier source au format vis / spoggy (json)</h2>
    <table>
    <tr>
    <td>
    <paper-input
    id="inputJson"
    label="Fichier source au format vis / spoggy (json) :"
    value=${source}>
    </paper-input>
    </td>
    <td>
    <paper-button raised @click="${(e) =>  this._load_json(e)}">Charger</paper-button>
    </tr>
    </table>



    `;
  }

  static get properties() { return {
    source: String,
    jsonData: {type: Object},
  }};

  constructor() {
    super();
  }


  firstUpdated(){
    this.source = "https://raw.githubusercontent.com/scenaristeur/heroku-spoggy/master/public/exemple_files/Spoggy_init2.json";
    this._ajax = this.shadowRoot.getElementById('request');
    this._inputJson = this.shadowRoot.getElementById('inputJson');
  }

  _load_json(e){
    this._ajax.url = this._inputJson.value;
    var app = this;
    let request = this._ajax.generateRequest();
    request.completes.then(function(request) {
      // succesful request, argument is iron-request element
      var rep = request.response;
      //  console.log(rep);
      app._handleResponse(rep);
    }, function(rejected) {
      // failed request, argument is an object
      let req = rejected.request;
      let error = rejected.error;
      console.log("error", error)
    }
  )
}

_handleResponse(data){
  console.log(data);
  this.jsonData = JSON.stringify(data);
}

_handleErrorResponse(data){
  console.log(data)
}


}

window.customElements.define('graph-container', GraphContainer);
