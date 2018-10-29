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

// These are the elements needed by this element.
//import { plusIcon, minusIcon } from './../my-icons.js';

// These are the shared styles needed by this element.
//import { ButtonSharedStyles } from './../button-shared-styles.js';
import  'evejs/dist/eve.min.js';
import { CatchurlAgent } from './agents/CatchurlAgent.js'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SpoggyCatchurl extends LitElement {
  render() {
      const { _endpoint, _query, _graph, _source, _mode } = this;
    return html`

    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>
    <div>
    <p>
    CATCH URL </br>
    Params are <br>
    Endpoint : ${_endpoint}   ou    ${this._endpoint}</br>
     Query : ${_query}</br>
     Graph : ${_graph}</br>
     Source : ${_source}</br>
MODE : ${_mode}
    </p>
    <p>test : http://127.0.0.1:8081/?endpoint=http://127.0.0.1:3030&source=http://test.json&graph=plop&query=SELECT * WHERE {?s ?p ?o}</p>
    </div>
    `;
  }

  static get properties() { return {
    _params: Object,
    _endpoint: String,
    _query: String,
    _graph: String,
    _source: String,
    _mode: String
  }};

  constructor() {
    super();

    this.params = this.recupParams();
    console.log(this.params)

    if (this.params.hasOwnProperty("endpoint") && this.params.endpoint != undefined && this.params.endpoint.length > 0){
      this._endpoint = this.params.endpoint;
      this._mode = "global";
      console.log('Connexion au endpoint ', this._endpoint);
    }
    if (this.params.hasOwnProperty("query") && this.params.query != undefined && this.params.query.length > 0){
      this._query = this.params.query;

      console.log('Execution de la requete ', this._query);
    }
    if (this.params.hasOwnProperty("graph") && this.params.graph != undefined && this.params.graph.length > 0){
      this._graph = this.params.graph;
      this._mode = "collab";
      console.log('Mode Collaboratif connexion au graphe', this._graph);
    }
    if (this.params.hasOwnProperty("source") && this.params.source != undefined && this.params.source.length > 0){
      this._source  = this.params.source;
      this._mode = "solo";
      console.log('Import & Chargement du fichier source', this._source);
    }
  }

  firstUpdated(){
    console.log("update");
    //  console.log("eve",eve);
    this.agentCatchurl = new CatchurlAgent('agentCatchurl', this);
    //  console.log(this.agentCatchurl);
    this.agentCatchurl.send('agentApp', {type: 'dispo', name: 'agentCatchurl' });
    console.log("catchurl");
  }




  recupParams(){
    var params = (function(a) {
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i)
      {        var p=a[i].split('=', 2);
      if (p.length == 1)
      b[p[0]] = "";
      else
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'));
  return params;
}
/*LIFECYCLE


    render() (protected): Implement to describe the element's DOM using lit-html. Ideally, the render implementation is a pure function using only the element's current properties to describe the element template. This is the only method that must be implemented by subclasses. Note, since render() is called by update(), setting properties does not trigger an update, allowing property values to be computed and validated.

    shouldUpdate(changedProperties) (protected): Implement to control if updating and rendering should occur when property values change or requestUpdate() is called. The changedProperties argument is a Map with keys for the changed properties pointing to their previous values. By default, this method always returns true, but this can be customized as an optimization to avoid updating work when changes occur, which should not be rendered.

    update(changedProperties) (protected): This method calls render() and then uses lit-html in order to render the template DOM. It also updates any reflected attributes based on property values. Setting properties inside this method will not trigger another update.

    firstUpdated(changedProperties): (protected) Called after the element's DOM has been updated the first time, immediately before updated() is called. This method can be useful for capturing references to rendered static nodes that must be directly acted upon, for example in updated(). Setting properties inside this method will trigger the element to update.

    updated(changedProperties): (protected) Called whenever the element's DOM has been updated and rendered. Implement to perform post updating tasks via DOM APIs, for example, focusing an element. Setting properties inside this method will trigger the element to update.

    updateComplete: Returns a Promise that resolves when the element has completed updating. The Promise value is a boolean that is true if the element completed the update without triggering another update. The Promise result is false if a property was set inside updated(). This getter can be implemented to await additional state. For example, it is sometimes useful to await a rendered element before fulfilling this Promise. To do this, first await super.updateComplete then any subsequent state.

    requestUpdate(name?, oldValue?): Call to request the element to asynchronously update regardless of whether or not any property changes are pending. This should be called when an element should update based on some state not triggered by setting a property. In this case, pass no arguments. It should also be called when manually implementing a property setter. In this case, pass the property name and oldValue to ensure that any configured property options are honored. Returns the updateComplete Promise which is resolved when the update completes.

    createRenderRoot() (protected): Implement to customize where the element's template is rendered by returning an element into which to render. By default this creates a shadowRoot for the element. To render into the element's childNodes, return this.

*/

}

window.customElements.define('spoggy-catchurl', SpoggyCatchurl);
