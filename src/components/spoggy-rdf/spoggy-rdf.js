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
import  './lib/rdf-ext-all-latest.min.js';
import { RdfAgent } from './agents/RdfAgent.js'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SpoggyRdf extends LitElement {
  render() {
    //  const { _endpoint, _query, _graph, _source, _mode } = this;
    return html`

    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>
    <div>
    <p>
    RDF
    </p>

    </div>
    `;
  }

  static get properties() { return {
    _params: Object,

  }};

  constructor() {
    super();

  }

  firstUpdated(){
    this.agentRdf = new RdfAgent('agentRdf', this);
    console.log(this.agentRdf);
    this.agentRdf.send('agentApp', {type: 'dispo', name: 'agentRdf' });
    console.log("#####################",rdf)

    let subject = rdf.namedNode('http://example.org/subject')
    let predicate = rdf.namedNode('http://example.org/predicate')
    let object = rdf.literal('object')

    let quad = rdf.quad(subject, predicate, object)

    // log the triples to console with toString()
    // note that this is N-Triples serialization by defiition
    console.log(quad.toString())
    ///////////////////////

    // create a new SPARQL store instance pointing to the dbpedia endpoint
 const store = new SparqlStore({
   factory: rdf,
   endpointUrl: 'https://dbpedia.org/sparql'
 })
 // fetch all triples for the Eiffel Tower subject and opening date predicate
 const stream = store.match(
   rdf.namedNode('http://dbpedia.org/resource/Eiffel_Tower'),
   rdf.namedNode('http://dbpedia.org/ontology/openingDate')
 )
 // forward errors to the console
 stream.on('error', (err) => {
   console.error(err.stack || err.message)
 })
 // write the object value of the matching triple to the console
 stream.on('data', (quad) => {
   console.log('The Eiffel Tower opened on: ' + quad.object.value)
 })

    /*rdfFetch('http://dbpedia.org/resource/Amsterdam').then((res) => {
      return res.dataset()
    }).then((dataset) => {
      const partQuads = dataset.match(null, rdf.namedNode('http://dbpedia.org/ontology/part'))
      console.log(partQuads.length + ' parts found')
    }*/


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

  window.customElements.define('spoggy-rdf', SpoggyRdf);
