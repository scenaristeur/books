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
inspire de https://github.com/Collaborne/iron-socket-io-client/blob/master/iron-socket-io-client.html

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
  collab:  ${this.status}
    `;
  }

  static get properties() { return {
    socket: Object,
    status : String,
    /**
					 * Registered _handlers by message type
					 * @type {<String, Function>[]}
					 */
					 _handlers: {
						type: Object,
						value: [],
					}
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
  //  console.log("#################",this.socket,"###############")
  // Parse response messages retrieving 'type'
  this.socket.on('message', message => {
    // Execute all handlers that are registered for this namespace
    /*for (let handler of app._handlers) {
      if (message.type.startsWith(handler.messageType)) {
        handler.handler(message);
      }
    }*/
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


  this.socket.on('endpoint', function (data) {
    console.log('endpoint', data)
    //app.agentSocket.send('agentDialogs', {type: "initrooms", rooms: rooms});
  //  app.agentSocket.send('agentCollaboratif', {type: "initrooms", rooms: rooms});
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

/**
			 * Registers a handler for a message type
			 *
			 * @param {String} messageType	Type of the message for which a handler should be registered.
			 * 	This can be a namespace.
			 * @param {Function} handler	Handler called when a message of a specific type arrives
			 */
			registerHandler(messageType, handler) {
				this._handlers.push({
					messageType,
					handler,
				});
			}


}

window.customElements.define('spoggy-socket', SpoggySocket);
