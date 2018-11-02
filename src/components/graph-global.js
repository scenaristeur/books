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


    <iron-ajax
    id="fusekiPing"
    url=""
    method="GET"
    content-type="application/text"
    handle-as="text"
    on-response="_handleFusekiPing"
    on-error="_handleFusekiPingError"
    ></iron-ajax>

    <iron-ajax
    id="server_req"
    url=""
    method="GET"
    content-type="application/text"
    handle-as="text"
    on-response="_handleFusekiServer"
    on-error="_handleFusekiServerError"
    ></iron-ajax>



    ${this.endpointType}
    <spoggy-graph
    id="jsonsparql"
    name="jsonsparql"
    data="${this.jsonData}"
    >Chargement...</spoggy-graph>


    <h2>Connexion à un endpoint Sparql</h2>

    <paper-input
    id="inputEndpointType"
    label="Endpoint Type (ex: fuseki, virtuoso):"
    value=${this.endpointType}>
    </paper-input>
    <paper-input
    id="inputEndpoint"
    label="Endpoint (ex: http://127.0.0.1:3030):"
    value=${this.endpoint}>
    </paper-input>
    <paper-input
    id="inputDataset"
    label="Dataset (ex: ds) :"
    value=${this.dataset}>
    </paper-input>
    <paper-input
    id="inputQuery"
    label="Query / Requête (ex: SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object} LIMIT 25):"
    value=${this.query}>
    </paper-input>


    <paper-button raised @click="${() =>  this._load_sparql()}">Charger</paper-button>

    <div>
    Exemples :
    <fieldset><legend> Fuseki local</legend>
    <a href="http://jena.apache.org/documentation/fuseki2/" target="_blank">Documentation Fuseki</a>
    endpointType : String<br>
    endpoint : Url / String<br>
    dataset : String<br>
    query : String<br>
    http://127.0.0.1:8081/global?endpointType=fuseki&endpoint=http://127.0.0.1:3030&dataset=bidule&query=SELECT%20?subject%20?predicate%20?object%20WHERE%20{?subject%20?predicate%20?object}%20LIMIT%2025<br>
    </fieldset>
    <fieldset><legend> Solid</legend>
    TODO<br>
    <a href="https://solid.mit.edu/" target="_blank">Documentation Solid</a>
    http://127.0.0.1:8081/global?endpointType=solid&pod=..<br>
    </fieldset>
    <fieldset><legend> Virtuoso</legend>
    TODO<br>
    http://127.0.0.1:8081/global?endpointType=virtuoso&endpoint=https://dbpedia.org/sparql&query=SELECT%20?subject%20?predicate%20?object%20WHERE%20{?subject%20?predicate%20?object}%20LIMIT%2025<br>
    </fieldset>
    <fieldset><legend> Semantic Forms</legend>
    TODO<br>
    <a href="https://www.virtual-assembly.org/semantic-forms/" target="_blank">Documentation Semantic Forms</a>

    http://127.0.0.1:8081/global?endpointType=semanticForms&endpoint=http://163.172.179.125:9111/&query=SELECT%20?subject%20?predicate%20?object%20WHERE%20{?subject%20?predicate%20?object}%20LIMIT%2025<br>
    </fieldset>


    </div>

    `;
  }

  static get properties() { return {
    jsonData: {type: Object},
    endpointType: {type:String},
    endpoint: { type: String },
    query: { type: String },
    dataset: { type: String },
    endpointParam: { type: Object}
  }};

  constructor() {
    super();

  }


  firstUpdated(){
    this._ajax = this.shadowRoot.getElementById('request');
    this._fusekiPing = this.shadowRoot.getElementById('fusekiPing');
    this._inputEndpoint = this.shadowRoot.getElementById('inputEndpoint');
    this._inputEndpointType = this.shadowRoot.getElementById('inputEndpointType');
    this._inputQuery = this.shadowRoot.getElementById('inputQuery');
    this._inputDataset = this.shadowRoot.getElementById('inputDataset');

    console.log(this.endpointType)
    console.log(this.endpoint)
    console.log(this.dataset)
    console.log(this.query)


    /*if (this.endpoint == "undefined" ){
    //  this.endpoint = "http://127.0.0.1:3030";
    //  this.query = "SELECT ?subject ?predicate ?object WHERE {?subject ?predicate ?object} LIMIT 25";
    //  this.dataset = "ds";
  }else{
  this._inputEndpointType.value = this.endpointType;
  this._inputEndpoint.value = this.endpoint;
  this._inputQuery.value = this.query;
  this._inputDataset.value = this.dataset;
  //  this.endpointParam =  this.testEndpoint(this.endpoint);

}*/


switch(this.endpointType) {
  case "fuseki":
  console.log("endpoint fuseki")
  break;
  case "solid":
  console.log("endpoint SOLID")
  break;
  case "virtuoso":
  console.log("endpoint Virtuoso")
  break;
  case "semanticForms":
  console.log("endpoint semanticForms")
  break;
  default:
  console.log("endpointType inconnu -> test Virtuoso")
}

}



testEndpoint(endpoint){
  //test if fuseki
  //test if solid
  //test if virtuoso
  //  if (this.type == undefined)
  this.ping_Fuseki(this.endpoint)
}

ping_Fuseki(endpoint){
  //this.fusekiPing.url = endpoint.url;
  this._fusekiPing.url = endpoint+"/$/ping";
  //  this.$.status_req.body = { "email": "abc@gmail.com", "password": "password" };
  //  console.log(this.url_fuseki_ping);
  let request = this._fusekiPing.generateRequest();
  request.completes.then(function(request) {
    // succesful request, argument is iron-request element
    var rep = request.response;
    console.log(rep);
    app._handleFusekiPing(rep);
  }, function(rejected) {
    // failed request, argument is an object
    let req = rejected.request;
    let error = rejected.error;
    console.log("error", error);
    app._handleFusekiPingError(rejected)
  });
}


//PING
_handleFusekiPing(data){
  console.log("ping  Fuseki ok");

  this.pingFuseki = data;
  console.log(data);
  this.status = data.detail.response;
  console.log(this.status);
  this.url_server = this.url_fuseki+"/$/server";
  //  this.$.status_req.body = { "email": "abc@gmail.com", "password": "password" };
  console.log(this.url_server);
  this.$.server_req.generateRequest();
  //this.$.fusekiPopup.toggle();
  this.agentFuseki.send('agentGlobal', {type: "updateEndpointData", ping: this.status})

  //  this.$.labelEndpoint.label = "Endpoint : ping Fuseki OK";
}
_handleFusekiPingError(data){
  console.log("error ping  Fuseki");
  //  this.$.labelEndpoint.label = "Endpoint : ping Erreur"
  this.pingFuseki = "";
  console.log(data);
  console.log(data.detail);
  console.log(data.detail.error);
  console.log(data.detail.error.message);
  console.log(data.detail.request);
  console.log(data.detail.response);
  console.log(data.detail.request.response);
  this.status = data.detail.error.type + ", Impossible d'atteindre l'endpoint";
  console.log(this.status);
  this.agentFuseki.send('agentGlobal', {type: "updateEndpointData", error: this.status});
  //  this.server = data.detail.error.type + ", Veuillez vérifier l'accès au endpoint "+this.url_status;
}





/* LOAD_SPARQL */
_load_sparql(){
  this.endpointParam =  this.testEndpoint(this.endpoint);
  this._ajax.url = this._inputEndpoint.value+"/"+this._inputDataset.value+"/query";
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
