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

import  'evejs/dist/eve.min.js';
import { InputAgent } from './agents/InputAgent.js'

import '@polymer/paper-input/paper-input.js';

class SpoggyInput extends LitElement {
  render() {
    return html`
    <!--

    Vide pour l'instant mais doit remplacer
    input dans book-input-decorator
    -->


    <!--<paper-input id="inputMessage"
    class="inputMessage"
    label="3 mots, une virgule et Entrée"
    autofocus

    @keydown="${(e) => this._onKeyDown(e)}">
    </paper-input>-->

    `;
  }

  static get properties() { return {
    commandHistory : Array,
  }}

  constructor() {
    super();

    this.commandHistory = [];
    this.agentInput = new InputAgent('agentInput', this);
    console.log(this.agentInput);
    this.agentInput.send('agentApp', {type: 'dispo', name: 'agentInput' });
  }


  _onKeyDown(e) {
    if (e.keyCode === 13) {
      var inputMessage = this.shadowRoot.getElementById('inputMessage');
      //  var message = this.$.inputMessage.value;
      var message=inputMessage.value.trim();
      this._processInput(message);
    }
  }

  _processInput(message){
    console.log(message)

    let firstChar = message.charAt(0);
    switch(firstChar){
      case '/':
      //    let commande = rdf.quad(rdf.blankNode(), rdf.namedNode('commande'),rdf.literal(message))
      //  this.catchCommande(message,this.network,this);
      this.catchCommande(message, this.network, this);
      inputMessage.value = "";
      break;

      case '.':
      var last = this.commandHistory[this.commandHistory.length-1];
      inputMessage.value = last.s+" "+last.p+" "+last.o;
      break;

      case ';':
      var last = this.commandHistory[this.commandHistory.length-1];
      inputMessage.value = last.s+" "+last.p+" ";
      break;

      case ',':
      var last = this.commandHistory[this.commandHistory.length-1];
      inputMessage.value = last.s+" ";
      break;

      default:

      let lastChar = message.slice(-1);
      let messageCut = message.slice(0,-1).split(" ");
      let isTriplet = true;
      //  console.log(messageCut);

      let detectLiteral = "";
      let messageCutTemp = [];
      messageCut.forEach(function(part){
        part = part.trim();
        //  console.log(part);
        if (part.startsWith('"')){
          detectLiteral ="debut";
          //  console.log(detectLiteral);
          messageCutTemp.push(part.substr(1));
        }else if (part.endsWith('"')){
          detectLiteral = "fin";
          //console.log(detectLiteral);
          messageCutTemp.push(messageCutTemp.pop()+" "+part.slice(0,-1));
        }else if (detectLiteral == "debut"){
          //  console.log("recupere le dernier et lui ajoute part" )
          messageCutTemp.push(messageCutTemp.pop()+" "+part)
        }else {
          messageCutTemp.push(part);
        }
      });
      if (messageCutTemp.length > 0){
        messageCut = messageCutTemp;
      }

      switch(lastChar){
        case '.':
        inputMessage.value = "";
        break;
        case ';':
        if (messageCut[0].indexOf(" ") > -1){
          inputMessage.value = '"'+messageCut[0]+'"'+' ';
        }else{
          inputMessage.value = messageCut[0]+' ';
        }
        break;
        case ',':
        if (messageCut[0].indexOf(" ") > -1){
          inputMessage.value = '"'+messageCut[0]+'" ';
        }else{
          inputMessage.value = messageCut[0]+' ';
        }
        if (messageCut[1].indexOf(" ") > -1){
          this.$.inputMessage.value += '"'+messageCut[1]+'" ';
        }else{
          inputMessage.value += messageCut[1]+' ';
        }
        break;
        case '-':
        if (messageCut[2].indexOf(" ") > -1){
          inputMessage.value = '"'+messageCut[2]+'"'+' ';
        }else{
          inputMessage.value = messageCut[2]+' ';
        }
        break;
        default:
        console.log("message to chat "+message)
        //this.sendMessage(message);
        this.agentInput.send('agentSocket', {type: "sendMessage", message:message});
        //  this.catchTriplet(message.slice(0,-1), this.network); // A REMPLACER PAR CATCHTRIPLETS V2
        inputMessage.value = "";
        isTriplet = false;
      }
      if (isTriplet){
        let t = {};
        this.agentInput.send('agentGraph', {type: "catchTriplet", triplet:messageCut});
        t.s = messageCut.shift();
        t.p = messageCut.shift();
        t.o = messageCut.join(" ");
        if (this.commandHistory.length > 10){
          this.shift('commandHistory');
        }
        //  console.log(messageCut)
        this.commandHistory = [...this.commandHistory, t];
        //  console.log(this.commandHistory);
        /*this.push('commandHistory',t);
        let triplets = [];
        triplets.push(t)*/
        // utiliser addActions
        //  this.catchTripletsV2(triplets, this.network);

        //      this.catchTriplet(messageCut, this.network);
        //
        //        this.agentInput.send('agentSparqlUpdate', {type: "catchTriplet", triplet:messageCut});
      }
    }
  }





}

window.customElements.define('spoggy-input', SpoggyInput);
