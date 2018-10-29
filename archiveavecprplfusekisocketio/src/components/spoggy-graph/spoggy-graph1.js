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
import { plusIcon, minusIcon } from './../my-icons.js';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './../button-shared-styles.js';
import { Network, DataSet, Node, Edge, IdType } from 'vis';
import  'evejs/dist/eve.min.js';
import { GraphAgent } from './agents/GraphAgent.js'
//import  'agents/graph-agent.js'
// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class SpoggyGraph extends LitElement {
  _render(props) {
    return html`
    ${ButtonSharedStyles}
    <style>
    span { width: 20px; display: inline-block; text-align: center; font-weight: bold;}
    #mynetwork {
  top: 0;
  left: 0;
  width: 100%;
  height: 90vh;
  bottom: 0px  !important;;
  border: 1px solid lightgray;
  background: linear-gradient(to bottom, rgba(55, 55, 255, 0.2), rgba(200, 200, 10, 0.2));
}
    </style>
    <div>
    <p>
    Graph
    Clicked: <span>${props.clicks}</span> times.
    Value is <span>${props.value}</span>.
    <button on-click="${() => this._onIncrement()}" title="Add 1">${plusIcon}</button>
    <button on-click="${() => this._onDecrement()}" title="Minus 1">${minusIcon}</button>
    </p>
    </div>
     <div id="mynetwork"></div>

    `;
  }

  static get properties() { return {
    /* The total number of clicks you've done. */
    clicks: Number,
    /* The current value of the counter. */
    value: Number,
    network : {
        type: Object,
        notify: true
      },
      centralGravityValueDefault :{
        type : Number,
        value: 0.0001
      },
      springLengthValueDefault :{
        type : Number,
        value:  127
      },
      springConstantValueDefault :{
        type : Number,
        value: 0.04 // 0.05
      },
      nodeDistanceValueDefault :{
        type : Number,
        value: 100 //120
      },
      dampingValueDefault :{
        type : Number,
        value: 0.08 // 0,08
      }
  }};

  constructor() {
    super();
    this.clicks = 0;
    this.value = 0;
    console.log("vis",vis);
    console.log("eve",eve);
    this.agentGraph = new GraphAgent('agentGraph', this);
    console.log(this.agentGraph);
    //console.log(this.$.mynetwork);
    var app = this;
    this.renderComplete.then(()=>{
     console.log("network", this._root.querySelector('#mynetwork'));
      this.network = this.networkDivInitialize(this._root.querySelector('#mynetwork'), app);
   })
  }

  _onIncrement() {
    this.value++;
    this.clicks++;
    //  this.dispatchEvent(new CustomEvent('counter-incremented'));
    this.agentGraph.send('agentInput', {type: 'inc' });
  }

  _onDecrement() {
    this.value--;
    this.clicks++;
    //  this.dispatchEvent(new CustomEvent('counter-decremented'));
    this.agentGraph.send('agentInput', {type: 'dec' });
  }

  firstUpdated () {

//console.log("network",document.getElementById("mynetwork"));
// this.network = this.networkDivInitialize(this.$.mynetwork, this);
 //console.log(th)
    /*
    installRouter((location) => store.dispatch(navigate(window.decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`,
    (matches) => store.dispatch(updateLayout(matches)));*/
  }




  //////////////////////////////////////////////////////////////////
  networkDivInitialize(container, app){
    //console.log(app.centralGravityValueDefault)
    // create an array with nodes
    var nodes = new vis.DataSet([
      {id: "node1", label: 'Spoggy', color: 'rgb(195,238,0)'},
      {id: "node2", label: 'Application Web', color: 'rgba(97,238,195)'},
      {id: "node3", label: 'David'},
      /*  {id: "node4", label: 'Bob'},*/
      {id: "node5", label: 'Graph', color: 'rgba(195,238,97)', cid:2},
      {id: "node6", label: 'Spoggy est une application permettant la création de graphes.', color: 'rgba(238,97,195)', shape: 'box', cid:1},
      /*    {id: "node7", label: 'Description', color: 'rgba(238,97,195,0.5)', cid:1},*/
      {id: "node8", label: 'Un graphe est un ensemble de noeuds\n et de liens entre ces noeuds.', color: 'rgba(238,97,195)', shape: 'box', cid:1},
      /*  {id: "node9", label: 'graph0', color: 'rgba(238,97,195,0.5)', type: 'graph', name: 'graph0'},
      {id: "node10", label: 'graph1', color: 'rgba(238,97,195,0.5)', type: 'graph', name: 'graph1'},
      {id: "node11", label: 'graph2', color: 'rgba(238,97,195,0.5)', type: 'graph', name: 'graph2'},
      {id: "node12", label: 'Input', color: 'rgba(195,238,97,0.5)', cid:2},*/
    ]);
    // create an array with edges
    var edges = new vis.DataSet([
      {from: "node1", to: "node2", label: "type", array:"to"},
      {from: "node1", to: "node3", label: "developpeur", array:"to"},
      //  {from: "node3", to: "node4", label: "connait", array:"to"},
      {from: "node1", to: "node5", label: "utilise", array:"to"},
      //  {from: "node1", to: "node12", label: "hasPart", array:"to"},
      {from: "node1", to: "node6", label: "description", array:"to"},
      //   {from: "node6", to: "node7", label: "type", array:"to"},
      {from: "node5", to: "node8", label: "description", array:"to"},
      /*  {from: "node8", to: "node7", label: "type", array:"to"},
      /    {from: "node9", to: "node5", label: "type", array:"to"},
      {from: "node10", to: "node5", label: "type", array:"to"},
      {from: "node11", to: "node5", label: "type", array:"to"},
      {from: "node1", to: "node9", label: "first", array:"to"},*/

    ]);
    /*var data = {
    nodes: nodes,
    edges: edges
  };*/
  //  var data = this.init;
  var data = {};
  var options = {
    locale: 'fr',
    /*configure: {
    enabled: true,
    filter: 'nodes,edges',
    container: settings,
    showButton: true
  },*/
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
        data.label = "";
        //  console.log(this);
        app.editNode(data, callback);
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        //document.getElementById('nodeOperation').innerHTML = "Edit Node";
        data.edit = true; // signalement d'une edition pour sparql
        console.log(data);
        app.$.nodeOperation.innerHTML = "Editer le noeud";
        app.editNode(data, callback);
      },
      deleteNode: function (data, callback) {
        // filling in the popup DOM elements
        app.deleteNode(data, callback);
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm("Êtes-vous certain de vouloir connecter le noeud à lui-même?");
          if (r != true) {
            callback(null);
            return;
          }
        }
        //document.getElementById('edgeOperation').innerHTML = "Add Edge";
        app.$.edgeOperation.innerHTML = "Ajouter un lien";
        app.editEdgeWithoutDrag(data, callback);
      },
      editEdge: {
        editWithoutDrag: function(data, callback) {
          //document.getElementById('edgeOperation').innerHTML = "Edit Edge";
          data.edit = true; // signalement d'une edition pour sparql
          console.log(data);
          data.oldLabel = data.label;
          app.$.edgeOperation.innerHTML = "Editer le lien";
          app.editEdgeWithoutDrag(data,callback);
        }
      },
      deleteEdge: function(data,callback){
        app.deleteEdge(data,callback);
      }
    },
    physics:{
      enabled: true,
      barnesHut: {
        gravitationalConstant: -1,
        centralGravity: 0.3,
        springLength: 95,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 1
      },
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springConstant: 0.08,
        springLength: 100,
        damping: 0.4,
        avoidOverlap: 0
      },
      repulsion: {
        centralGravity:0.0001, // app.centralGravityValueDefault,  //0.001, //0.001 ? A quoi sert cette valeur ?
        springLength: 127,//app.springLengthValueDefault,   // 220, //220 (//200 //300)
        springConstant: 0.04, //app.springConstantValueDefault, //0.01, //0.01
        nodeDistance:  100, //app.nodeDistanceValueDefault, //150, //100 //350
        damping: 0.08, //app.dampingValueDefault, ///0.08
      },
      hierarchicalRepulsion: {
        centralGravity: 0.0,
        springLength: 100,
        springConstant: 0.01,
        nodeDistance: 120,
        damping: 0.09
      },
      maxVelocity: 500, //50
      minVelocity: 1, //0.1
      solver: 'repulsion',
      stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 100,
        onlyDynamicEdges: false,
        fit: true
      },
      timestep: 0.5,
      adaptiveTimestep: true
    }
  };
  console.log(options)
  return new vis.Network(container, data, options);
  }














}

window.customElements.define('spoggy-graph', SpoggyGraph);
