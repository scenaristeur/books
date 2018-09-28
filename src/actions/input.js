

export const processInput = (message) => {
  console.log("process :", message)
  return {
    newValue : message
  };
};

export const updateInput = (message) => {
  console.log("up : ", message)
  return {
    newValue : message
  };
}

const   catchCommande(commande){
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
