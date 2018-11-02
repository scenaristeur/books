export const sparqlToVis = (sparqlRes) => {
  console.log("CONVERTER", sparqlRes);
  var visRes = { edges:[], nodes:[]};
  var nodes = {};

  //let vars=data.head.vars;
  //let sparqlRes=data.results.bindings;
  //  console.log(this.head);
  console.log(sparqlRes);
  //  var visRes = {edges:[]};
  sparqlRes.forEach(function(sr){
    console.log(sr);

    //test du triplet sur predicate.value
    switch(sr.predicate.value){
      case "http://www.w3.org/2000/01/rdf-schema#label":
      let id = sr.subject.value.replace('http://smag0.blogspot.fr/NS#_', '')
      let node = {id: id, label: sr.object.value, y: 2*Math.random(), type: "node"};
      console.log("LABEL");
      console.log(node)
      if (!nodes.hasOwnProperty(id)){
        console.log("aucun noeud n'existe ->creation")
        nodes[id] = node;

      }else{
        console.log("un noeud existe --> maj du label")
        nodes[id].label = node.label;
        nodes[id].y = 2*Math.random();
        nodes[id].type = "node"
      }

      break;

      default:
    //  test du triplet sur object.value
      switch(sr.object.value){
        case 'http://smag0.blogspot.fr/NS#node':
        let id = sr.subject.value.replace('http://smag0.blogspot.fr/NS#_', '')
        let node = {id: id, type: "node"};
        console.log("NOEUD");
        console.log(node)
        if (!nodes.hasOwnProperty(id)){
          console.log("ce noeud n'est pas recensé -> creation")
          nodes[id] = node;
        }else{
          console.log("ce noeud existe -> update")
          nodes[id].id = id;
          nodes[id].type = "node"
        }

        break;

        default:
        if(sr.subject.value.startsWith("http://smag0.blogspot.fr/NS#_") && sr.object.value.startsWith("http://smag0.blogspot.fr/NS#_"))
        {
          console.log("Liens entre deux noeuds")
          let from =    sr.subject.value.replace('http://smag0.blogspot.fr/NS#_', '')
          let to =  sr.object.value.replace('http://smag0.blogspot.fr/NS#_', '')
          let label  = sr.predicate.value.replace('http://smag0.blogspot.fr/NS#', '').replace(/_/g, ' ');
          let edge = {from: from, to: to, label: label, type: "edge"};
          visRes.edges.push(edge);
        }else{
          console.log("NON PRIS EN CHARGE : ")
          console.log(sr);
        }
      }
    }
  });

  Object.entries(nodes).forEach(([key, node]) => {

    //  console.log(node)
    visRes.nodes.push(node)
  });


  console.log(visRes);
  return visRes;
};
