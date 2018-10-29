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
//import { plusIcon, minusIcon } from './../my-icons.js';

// These are the shared styles needed by this element.
//import { ButtonSharedStyles } from '../button-shared-styles.js';
import  'evejs/dist/eve.min.js';
import { InputAgent } from './agents/InputAgent.js'

import '@polymer/paper-input/paper-input.js';
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SpoggyInput extends LitElement {
  _render(props) {
    return html`
  <!--  ${ButtonSharedStyles}-->
    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>
    <!--<paper-input always-float-label label="3 mots, une virgule et Entrée"></paper-input>-->
    <paper-input id="inputMessage"
    class="inputMessage"
    label="3 mots, une virgule et Entrée"
    autofocus
    style="text-align:left;  min-width: 70vw;"
    on-keydown="${(e) => this._onKeyDown(e)}">
    </paper-input>
    `;
  }

  static get properties() { return {
    /* The total number of clicks you've done. */
    clicks: Number,
    /* The current value of the counter. */
    value: Number,
    commandHistory : Array,
  }};

  constructor() {
    super();
    this.clicks = 0;
    this.value = 0;
    this.commandHistory = [];

  }
  _firstRendered() {
    //  console.log("eve",eve);
    this.agentInput = new InputAgent('agentInput', this);
    //console.log(this.agentInput);
    this.agentInput.send('agentApp', {type: 'dispo', name: 'agentInput' });
  }
  _onIncrement() {
    this.value++;
    this.clicks++;
    //  this.dispatchEvent(new CustomEvent('counter-incremented'));
    this.agentInput.send('agentGraph', {type: 'inc' });
  }

  _onDecrement() {
    this.value--;
    this.clicks++;
    //  this.dispatchEvent(new CustomEvent('counter-decremented'));
    this.agentInput.send('agentGraph', {type: 'dec' });
  }

  _onKeyDown(e) {
    if (e.keyCode === 13) {
      this._processInput();
    }
  }

  _processInput(){
    var inputMessage = this._root.querySelector('#inputMessage');
    //  var message = this.$.inputMessage.value;

    var message=inputMessage.value.trim();

    let firstChar = message.charAt(0);
    switch(firstChar){
      case '/':
      //    let commande = rdf.quad(rdf.blankNode(), rdf.namedNode('commande'),rdf.literal(message))
      //  this.catchCommande(message,this.network,this);
      this.catchCommande(message, this.network, this);
      inputMessage.value = "";
      break;

      case '.':
      console.log(this)
      console.log(this.value)
      console.log(this.commandHistory)
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

  catchCommande(commande){
    console.log(commande)
    switch(commande) {
      case "/h":
      case "/help":
      case "/aide":
      console.log(this.$.dialogs)
      //  this.$.dialogs.$.helpPopUp.toggle();
      this.agentInput.send('agentDialogs', {type:'toggle', popup: 'helpPopUp'})
      break;
      case "/e":
      case "/export":
      case "/exportJson":
      //this.exportJson();
      this.agentInput.send('agentImportexport', {type: 'exportJson'})
      break;
      case "/t":
      //  this.exportTtl(this.network,this);
      this.agentInput.send('agentImportexport', {type:'exportTtl'}); // , what: 'network', to: 'agentDialogs', where: 'inputTextToSave'
      //    this.agentInput.send('agentDialogs', {type:'toggle', popup: 'popupTtl'})
      break;
      case "/i":
      case "/import":
      case "/importJson":
      //  importJson(network,app);
      //this.$.dialogs.$.importPopUp.toggle();
      this.agentInput.send('agentImportexport', {type: 'toggle', popup:'importPopUp'})
      //  this.$.dialogs.$.dialogs.openImport(this.network)
      break;
      case "/n":
      console.log("new graph");
      //  this.newGraph(this.network, this);
      this.agentInput.send('agentGraph', {type: 'newGraph'})
      this.agentInput.send('agentSparqlUpdate', {type: "newGraph"});
      break;
      case "/b":
      console.log("connection a la base levelgraph");
      this.connectBase(this.network,this);
      break;
      /*
      case "/p":
      case "/t":
      // non traité ici , mais par le serveur
      console.log("triplet, predicat ou noeud");
      break;*/
      default:
      console.log("non traite"+ commande);
      //  return afficheCommandes();
    }
  }

}

window.customElements.define('spoggy-input', SpoggyInput);
