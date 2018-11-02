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


import {
  sparqlToVis
} from '../actions/vis_converter.js'

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class GraphGlobal extends LitElement {
  render() {

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
    <spoggy-graph
    id="jsonsparql"
    name="jsonsparql"
    data="${this.jsonData}"
    >Chargement...</spoggy-graph>


    <h2>Connexion à un endpoint Sparql</h2>
    <paper-input
    id="inputEndpoint"
    label="Endpoint :"
    value=${this.endpoint}>
    </paper-input>
    <paper-input
    id="inputQuery"
    label="Query / Requête :"
    value=${this.query}>
    </paper-input>


    <paper-button raised @click="${() =>  this._load_sparql()}">Charger</paper-button>



    `;
  }

  static get properties() { return {
    jsonData: {type: Object},
    endpoint: { type: String },
    query: { type: String }
  }};

  constructor() {
    super();

  }


  firstUpdated(){
    this._ajax = this.shadowRoot.getElementById('request');
    this._inputEndpoint = this.shadowRoot.getElementById('inputEndpoint');
    this._inputQuery = this.shadowRoot.getElementById('inputQuery');

    console.log(this.endpoint)
    console.log(this.query)


    if (this.endpoint == "undefined" ){
      this.endpoint = "http://127.0.0.1:3030/bidule/query";
      this.query = "SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object}LIMIT 25";
    }else{
      this._inputEndpoint.value = this.endpoint;
      this._inputQuery.value = this.query;
      //this._load_sparql();

    }

  }

/* LOAD_SPARQL */
_load_sparql(){
  this._ajax.url = this._inputEndpoint.value;
  /*var output = {
  value: 'json',
  notify: true
};*/
var options = {};
options.output = "json";
options.query = this._inputQuery.value;

this._ajax.params = options;
var app = this;
let request = this._ajax.generateRequest();
console.log("run sparql", this._ajax);

request.completes.then(function(request) {
  // succesful request, argument is iron-request element
  var rep = request.response;
  //  console.log(rep);
  app._handleResponseSparql(rep);
}, function(rejected) {
  // failed request, argument is an object
  let req = rejected.request;
  let error = rejected.error;
  console.log("error", error);
  app._handleErrorResponseSparql(rejected)
}
)
}

_handleResponseSparql(data){
  console.log(data);
  let vars=data.head.vars;
  let results=data.results.bindings;
  console.log(vars)
  console.log(results)
  var result = sparqlToVis(results);
  console.log("RESULT",result);
  this.jsonData = JSON.stringify(result);

}

_handleErrorResponseSparql(data){
  console.log(data)
}
/* END LOAD_SPARQL */


}

window.customElements.define('graph-global', GraphGlobal);
