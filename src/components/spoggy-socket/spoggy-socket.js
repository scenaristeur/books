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
import { SocketAgent } from './agents/SocketAgent.js'
//import io from 'socket.io-client'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SpoggySocket extends LitElement {
  render() {
    return html`

    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    </style>
    <div>
    <p>
    SOCKET ${this.status}</br>

    </div>
    `;
  }

  static get properties() { return {
    socket: Object,
    status : String
  }};

  constructor() {
    super();
    //  const urlSocket = window.location.host+'8080'; //name+':3000'
    //  let io = ioClient(urlSocket)
    console.log("#################",io,"###############")


  //  console.log(this.socket)
    this.status = "statut inconnu";
    const urlSocket = window.location.hostname+':8080'; //name+':3000'
    console.log(urlSocket)

    this.connectSocket(urlSocket);
  }
  firstUpdated() {
    //  console.log("eve",eve);
    this.agentSocket = new SocketAgent('agentSocket', this);
    //  console.log(this.agentCatchurl);
    this.agentSocket.send('agentApp', {type: 'dispo', name: 'agentSocket' });

  }


  connectSocket(connectUri, token) {
    var app = this;
    /*this.socket = io(connectUri, {
    'query': `token=${token}`,
    timeout: 2000,
  });*/
  //this.socket = io();
  this.socket = io(connectUri)
    console.log("#################",this.socket,"###############")
  // Parse response messages retrieving 'type'
  this.socket.on('message', message => {
    // Execute all handlers that are registered for this namespace
    for (let handler of this._handlers) {
      if (message.type.startsWith(handler.messageType)) {
        handler.handler(message);
      }
    }
  });
  // Register listeners to expose connection status
  this.socket.on('connect', () => this.status = 'connected');
  this.socket.on('disconnect', () => this.status = 'disconnected');
  this.socket.on('connect_error', () => this.status = 'disconnected');
  this.socket.on('reconnecting', () => this.status = 'reconnecting');
  this.socket.on('reconnect', () => this.status = 'connected');
  this.socket.on('error', e => {
    console.warn(`WebSocket error: ${JSON.stringify(e)}`);
  });
  this.socket.on('updatechat', function (username, data) {
    console.log('update chat '+ username +" - "+ data)
    console.log(app.room)
    console.log(app.socket.room)
    app.agentSocket.send('agentChat', {type: "updateChat", username: username, data: data, room: app.room});
  });
  this.socket.on('initrooms', function (rooms) {
    console.log('initrooms ')
    //app.agentSocket.send('agentDialogs', {type: "initrooms", rooms: rooms});
    app.agentSocket.send('agentCollaboratif', {type: "initrooms", rooms: rooms});
  });
  this.socket.on('updaterooms', function(rooms, current_room) {
    app.agentSocket.send('agentDialogs', {type: "updaterooms", rooms: rooms, current_room: current_room});
    app.agentSocket.send('agentChat', {type: "updaterooms", rooms: rooms, current_room: current_room});
  });

  this.socket.on('tick', function(data){
    console.log(data);
    console.log("N'EST plus  utilisé ??? voir avec tick/snapshot du serveur ?")
    //  app.set('addToGraph',data);
    app.agentSocket.send('agentGraph', {type: "addToGraph", data: data});
  });

  this.socket.on('initDb', function(data){
    console.log(data);
    app.agentSocket.send('agentGraph', {type: "populateVis", data: data});
  });
}


}

window.customElements.define('spoggy-socket', SpoggySocket);
