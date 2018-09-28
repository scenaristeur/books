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
import { Network, DataSet, Node, Edge, IdType } from 'vis';
//import '../book-image.js';
import  'evejs/dist/eve.min.js';
import { GraphAgent } from './agents/GraphAgent.js'

class SpoggyGraph extends LitElement {
  render() {
    return html`
    <style>
    :host {
      display: block;
    }

    .books-bg {
      height: 300px;
      max-width: 570px;
      margin: 0 auto;
    }

    .books-desc {
      padding: 24px 16px 0;
      text-align: center;
    }

    /* Wide Layout */
    @media (min-width: 648px) {
      .books-desc {
        padding: 96px 16px 0;
      }
    }

    /* Network style */
    #mynetwork {
      top: 0;
      left: 0;
      width: 100%;
      height: 90vh;
      bottom: 0px  !important;;
      border: 1px solid lightgray;
      background: linear-gradient(to bottom, rgba(55, 55, 255, 0.2), rgba(200, 200, 10, 0.2));
    }

    #operation {
      font-size:28px;
    }
    #node-popUp {
      display:none;
      position:absolute;
      top:350px;
      left:170px;
      z-index:299;
      width:250px;
      height:120px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }
    #edge-popUp {
      display:none;
      position:absolute;
      top:350px;
      left:170px;
      z-index:299;
      width:250px;
      height:90px;
      background-color: #f9f9f9;
      border-style:solid;
      border-width:3px;
      border-color: #5394ed;
      padding:10px;
      text-align: center;
    }

    div.vis-network div.vis-manipulation {
      box-sizing: content-box;

      border-width: 0;
      border-bottom: 1px;
      border-style:solid;
      border-color: #d6d9d8;
      background: #ffffff; /* Old browsers */
      background: -moz-linear-gradient(top,  #ffffff 0%, #fcfcfc 48%, #fafafa 50%, #fcfcfc 100%); /* FF3.6+ */
      background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(48%,#fcfcfc), color-stop(50%,#fafafa), color-stop(100%,#fcfcfc)); /* Chrome,Safari4+ */
      background: -webkit-linear-gradient(top,  #ffffff 0%,#fcfcfc 48%,#fafafa 50%,#fcfcfc 100%); /* Chrome10+,Safari5.1+ */
      background: -o-linear-gradient(top,  #ffffff 0%,#fcfcfc 48%,#fafafa 50%,#fcfcfc 100%); /* Opera 11.10+ */
      background: -ms-linear-gradient(top,  #ffffff 0%,#fcfcfc 48%,#fafafa 50%,#fcfcfc 100%); /* IE10+ */
      background: linear-gradient(to bottom,  #ffffff 0%,#fcfcfc 48%,#fafafa 50%,#fcfcfc 100%); /* W3C */
      filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#fcfcfc',GradientType=0 ); /* IE6-9 */

      padding-top:4px;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 28px;
    }

    div.vis-network div.vis-edit-mode {
      position:absolute;
      left: 0;
      top: 5px;
      height: 30px;
    }

    /* FIXME: shouldn't the vis-close button be a child of the vis-manipulation div? */

    div.vis-network div.vis-close {
      position:absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;

      background-position: 20px 3px;
      background-repeat: no-repeat;
      background-image: url("../../images/network/cross.png");
      cursor: pointer;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    div.vis-network div.vis-close:hover {
      opacity: 0.6;
    }

    div.vis-network div.vis-manipulation div.vis-button,
    div.vis-network div.vis-edit-mode div.vis-button {
      float:left;
      font-family: verdana;
      font-size: 12px;
      -moz-border-radius: 15px;
      border-radius: 15px;
      display:inline-block;
      background-position: 0px 0px;
      background-repeat:no-repeat;
      height:24px;
      /*  margin-left: 10px; */
      /*vertical-align:middle;*/
      cursor: pointer;
      padding: 0px 8px 0px 8px;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    div.vis-network div.vis-manipulation div.vis-button:hover {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.20);
    }

    div.vis-network div.vis-manipulation div.vis-button:active {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.50);
    }

    div.vis-network div.vis-manipulation div.vis-button.vis-back {
      background-image: url("../../images/network/backIcon.png");
    }

    div.vis-network div.vis-manipulation div.vis-button.vis-none:hover {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.0);
      cursor: default;
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-none:active {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.0);
    }
    div.vis-network div.vis-manipulation div.vis-button.vis-none {
      padding: 0;
    }
    div.vis-network div.vis-manipulation div.notification {
      margin: 2px;
      font-weight: bold;
    }

    div.vis-network div.vis-manipulation div.vis-button {
      background-color:#0D578B;
      color:white;
    }

    div.vis-network div.vis-manipulation div.vis-button.vis-add {
      background-image: url("../../images/network/addNodeIcon.png");
    }

    div.vis-network div.vis-manipulation div.vis-button.vis-edit,
    div.vis-network div.vis-edit-mode div.vis-button.vis-edit {
      background-image: url("../../images/network/editIcon.png");
    }

    div.vis-network div.vis-edit-mode div.vis-button.vis-edit.vis-edit-mode {
      background-color: #fcfcfc;
      border: 1px solid #cccccc;
    }

    div.vis-network div.vis-manipulation div.vis-button.vis-connect {
      background-image: url("../../images/network/connectIcon.png");
    }

    div.vis-network div.vis-manipulation div.vis-button.vis-delete {
      background-image: url("../../images/network/deleteIcon.png");
    }
    /* top right bottom left */
    div.vis-network div.vis-manipulation div.vis-label,
    div.vis-network div.vis-edit-mode div.vis-label {
      margin: 0 0 0 23px;
      line-height: 25px;
    }
    div.vis-network div.vis-manipulation div.vis-separator-line {
      float:left;
      display:inline-block;
      width:1px;
      height:21px;
      background-color: #bdbdbd;
      margin: 0px 1px 0 1px;
      /*  margin: 0px 7px 0 15px;*/ /*top right bottom left*/
    }


    div.vis-network div.vis-navigation div.vis-button {
      width:34px;
      height:34px;
      -moz-border-radius: 17px;
      border-radius: 17px;
      position:absolute;
      display:inline-block;
      background-position: 2px 2px;
      background-repeat:no-repeat;
      cursor: pointer;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    div.vis-network div.vis-navigation div.vis-button:hover {
      box-shadow: 0 0 3px 3px rgba(56, 207, 21, 0.30);
    }

    div.vis-network div.vis-navigation div.vis-button:active {
      box-shadow: 0 0 1px 3px rgba(56, 207, 21, 0.95);
    }

    div.vis-network div.vis-navigation div.vis-button.vis-up {
      background-image: url("../../images/network/upArrow.png");
      bottom:50px;
      left:55px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-down {
      background-image: url("../../images/network/downArrow.png");
      bottom:10px;
      left:55px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-left {
      background-image: url("../../images/network/leftArrow.png");
      bottom:10px;
      left:15px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-right {
      background-image: url("../../images/network/rightArrow.png");
      bottom:10px;
      left:95px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-zoomIn {
      background-image: url("../../images/network/plus.png");
      bottom:10px;
      right:15px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-zoomOut {
      background-image: url("../../images/network/minus.png");
      bottom:10px;
      right:55px;
    }
    div.vis-network div.vis-navigation div.vis-button.vis-zoomExtends {
      background-image: url("../../images/network/zoomExtends.png");
      bottom:50px;
      right:15px;
    }
    </style>
    <div id="node-popUp">
    <span id="node-operation">node</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>id</td><td><input id="node-id" value="" /></td>
    </tr>
    <tr>
    <td>Label</td><td><input id="node-label" value="" autofocus /></td>
    </tr>
    </table>
    <input type="button" value="save" id="node-saveButton" />
    <input type="button" value="cancel" id="node-cancelButton" />
    </div>

    <div id="edge-popUp">
    <span id="edge-operation">edge</span> <br>
    <table style="margin:auto;">
    <tr>
    <td>Label</td><td><input id="edge-label" value="" autofocus /></td>
    </tr></table>
    <input type="button" value="save" id="edge-saveButton" />
    <input type="button" value="cancel" id="edge-cancelButton" />
    </div>

    <div id="mynetwork"></div>
    `;
  }



  static get properties() {
    return {
      name: String,
      amount: String,
      price: String
    }
  }

  constructor(){
    super();
  }

  editNode(data, cancelAction, callback) {
    this.shadowRoot.getElementById('node-label').value = data.label ;
    this.shadowRoot.getElementById('node-saveButton').onclick = this.saveNodeData.bind(this, data, callback);
    this.shadowRoot.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
    this.shadowRoot.getElementById('node-popUp').style.display = 'block';
  }

  // Callback passed as parameter is ignored
  clearNodePopUp() {
    this.shadowRoot.getElementById('node-saveButton').onclick = null;
    this.shadowRoot.getElementById('node-cancelButton').onclick = null;
    this.shadowRoot.getElementById('node-popUp').style.display = 'none';
  }

  cancelNodeEdit(callback) {
    this.clearNodePopUp();
    callback(null);
  }

  saveNodeData(data, callback) {
    data.label =  this.shadowRoot.getElementById('node-label').value;
    this.clearNodePopUp();
    callback(data);
  }
  
  editEdgeWithoutDrag(data, callback) {
    // filling in the popup DOM elements
    this.shadowRoot.getElementById('edge-label').value = data.label || "";
    this.shadowRoot.getElementById('edge-saveButton').onclick = this.saveEdgeData.bind(this, data, callback);
    this.shadowRoot.getElementById('edge-cancelButton').onclick = this.cancelEdgeEdit.bind(this,callback);
    this.shadowRoot.getElementById('edge-popUp').style.display = 'block';
  }

  clearEdgePopUp() {
    this.shadowRoot.getElementById('edge-saveButton').onclick = null;
    this.shadowRoot.getElementById('edge-cancelButton').onclick = null;
    this.shadowRoot.getElementById('edge-popUp').style.display = 'none';
  }

  cancelEdgeEdit(callback) {
    this.clearEdgePopUp();
    callback(null);
  }

  saveEdgeData(data, callback) {
    if (typeof data.to === 'object')
    data.to = data.to.id
    if (typeof data.from === 'object')
    data.from = data.from.id
    data.label = this.shadowRoot.getElementById('edge-label').value;
    this.clearEdgePopUp();
    callback(data);
  }

  setDefaultLocale() {
    var defaultLocal = navigator.language;
    var select = this.shadowRoot.getElementById('locale');
    select.selectedIndex = 0; // set fallback value
    for (var i = 0, j = select.options.length; i < j; ++i) {
      if (select.options[i].getAttribute('value') === defaultLocal) {
        select.selectedIndex = i;
        break;
      }
    }
  }
  /*
  init() {
  setDefaultLocale();
  draw();
}*/

firstUpdated() {
  console.log("vis",vis);
  console.log("eve",eve);
  this.agentGraph = new GraphAgent('agentGraph', this);
  console.log(this.agentGraph);
  this.agentGraph.send('agentApp', {type: 'dispo', name: 'agentGraph' });
  // create a network
  //  var container = document.getElementById('mynetwork');

  var seed = 2;
  var app = this;

  // create an array with nodes
  var nodes = new vis.DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
  ]);

  // create an array with edges
  var edges = new vis.DataSet([
    {from: 1, to: 3, arrows:'to'},
    {from: 1, to: 2, arrows:'to'},
    {from: 2, to: 4, arrows:'to'},
    {from: 2, to: 5, arrows:'to'},
    {from: 3, to: 3, arrows:'to'}
  ]);


  var data = {
    nodes: nodes,
    edges: edges
  };
  var defaultLocal = navigator.language;
  console.log(defaultLocal);
  //  app.setDefaultLocale();
  var container = this.shadowRoot.getElementById('mynetwork');

  var options = {
    layout: {randomSeed:seed}, // just to make sure the layout is the same when the locale is changed
    //  locale: this._root.querySelector('#locale').value,
    edges:{
      arrows: {
        to:     {enabled: true, scaleFactor:1, type:'arrow'},
        middle: {enabled: false, scaleFactor:1, type:'arrow'},
        from:   {enabled: false, scaleFactor:1, type:'arrow'}
      }},
      interaction:{
        navigationButtons: true,
        //  keyboard: true  //incompatible avec rappel de commande en cours d'implémentation
        multiselect: true,
      },
      manipulation: {
        addNode: function (data, callback) {
          // filling in the popup DOM elements
          app.shadowRoot.getElementById('node-operation').innerHTML = "Add Node";
          app.editNode(data, app.clearNodePopUp, callback);
        },
        editNode: function (data, callback) {
          // filling in the popup DOM elements
          app.shadowRoot.getElementById('node-operation').innerHTML = "Edit Node";
          app.editNode(data, app.cancelNodeEdit, callback);
        },
        addEdge: function (data, callback) {
          if (data.from == data.to) {
            var r = confirm("Do you want to connect the node to itself?");
            if (r != true) {
              callback(null);
              return;
            }
          }
          app.shadowRoot.getElementById('edge-operation').innerHTML = "Add Edge";
          app.editEdgeWithoutDrag(data, callback);
        },
        editEdge: {
          editWithoutDrag: function(data, callback) {
            app.shadowRoot.getElementById('edge-operation').innerHTML = "Edit Edge";
            app.editEdgeWithoutDrag(data,callback);
          }
        }
      }
    };

    app.network = new vis.Network(container, data, options);
    app.network.on("selectNode", function (params) {
      console.log('selectNode Event: ', params);
    });
    console.log(app.network)
  }


  catchTriplet(message){
    // A REVOIR ET REMPLACER PAR catchTripletsV2() ??
    //  console.log(message.length);
    //message=message.trim();
    //  var tripletString = message.substring(2).trim().split(" ");
    //  var tripletString = message.trim().split(" ");
    // les noeuds existent-ils ?
    var sujetNode = this.network.body.data.nodes.get({
      filter: function(node){
        //    console.log(node);
        return (node.label == message[0] );
      }
    });
    if (sujetNode.length == 0){
      this.network.body.data.nodes.add({label: message[0], type: "node", x:2*Math.random(), y:2*Math.random() });
    }
    var objetNode = this.network.body.data.nodes.get({
      filter: function(node){
        //    console.log(node);
        return (node.label == message[2]);
      }
    });
    //  console.log(sujetNode);
    //  console.log(objetNode);
    // sinon, on les créé

    if (objetNode.length == 0){
      this.network.body.data.nodes.add({ label: message[2], type: "node", x:-2*Math.random(), y:-2*Math.random() });
    }
    // maintenant ils doivent exister, pas très po=ropre comme méthode , à revoir
    sujetNode = this.network.body.data.nodes.get({
      filter: function(node){
        return (node.label == message[0] );
      }
    });
    objetNode = this.network.body.data.nodes.get({
      filter: function(node){
        return (node.label == message[2]);
      }
    });
    var actionSujet = {};
    actionSujet.type = "newNode";
    actionSujet.data = sujetNode[0];
    //  actionsToSendTemp.push(actionSujet);
    //    this.addAction(actionSujet);

    var actionObjet = {};
    actionObjet.type = "newNode";
    actionObjet.data = objetNode[0];
    //  actionsToSendTemp.push(actionObjet);
    //  this.addAction(actionObjet);


    // maintenant, on peut ajouter l'edge
    this.network.body.data.edges.add({
      label: message[1],
      from : sujetNode[0].id,
      to : objetNode[0].id,
      type: "edge",
    });

    //on récupère ce edge pour l'envoyer au serveur
    var edge = this.network.body.data.edges.get({
      filter: function(edge) {
        return (edge.from == sujetNode[0].id && edge.to == objetNode[0].id && edge.label == message[1]);
      }
    });
    var actionEdge = {};
    actionEdge.type = "newEdge";
    actionEdge.data = edge;
    //  this.addAction(actionEdge);
    let actionstosend = [];
    actionstosend.push(actionSujet);
    actionstosend.push(actionObjet);
    actionstosend.push(actionEdge);
    this.agentGraph.send('agentSocket', {type: "newActions", actions: actionstosend});
    this.agentGraph.send('agentSparqlUpdate', {type: "newActions", actions: actionstosend});
    console.log(sujetNode[0])
    //this.network.redraw();
    this.network.moveTo({    position: {x:0, y:0}});
    /*  this.network.moveTo({
    position: {x:sujetNode[0].x, y:sujetNode[0].y},
    scale: 1,
    offset: {x:20, y:20},
    animation: {
    duration: 3,
    easingFunction: 'easeInOutCubic'
  }
});*/

//  actionsToSendTemp.push(actionEdge);
//console.log(actionsToSendTemp);
//  return actionsToSendTemp;
}


newGraph(){
  //network.body.data.nodes.clear();
  //network.body.data.edges.clear();
  let network = this.network;

  var graphname = prompt("Comment nommer ce nouveau graphe ?", "Spoggy-Graph_"+Date.now());
  var nodeName = {
    label: graphname,
    shape: "star",
    color: "green",
    type: "node"
  };
  var nodeGraph = {
    label: "Graph",
    /*    shape: "star",
    color: "red",*/
    type: "node"
  };
  network.body.data.nodes.clear();
  network.body.data.edges.clear();
  var nodes = network.body.data.nodes.add([nodeName, nodeGraph]);

  var edge = {
    from: nodes[0],
    to: nodes[1],
    arrows: "to",
    label: "type"
  }
  network.body.data.edges.add(edge);
  /* seulement en cas de synchro, mais difficile de newgrapher en synchro ?
  var action = {};
  action.type = "newNode";
  action.data = nodeName;
  this.addAction(action);

  action = {};
  action.type = "newNode";
  action.data = nodeGraph;
  this.addAction(action);

  action = {};
  action.type = "newEdge";
  action.data = edge;
  this.addAction(action);

  action = {};
  action.type = "changeGraph";
  action.data = graphname;
  this.addAction(action);
  if(app.socket != undefined){
  app.socket.graph = graphname;
  console.log(app.socket);
}
*/

//app.socket.emit('newGraph', graphname);
/*
//document.getElementById('importPopUp').style.display = 'block';
app.$.importPopUp.style.display = 'block';

var filepicker = app.$.filepicker;
filepicker.addEventListener('change', handleFileSelect.bind(app), false);
filepicker.network = network;*/
}


}

window.customElements.define('spoggy-graph', SpoggyGraph);