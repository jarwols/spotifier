import React, { Component } from 'react';
import * as d3 from 'd3';
import Dimensions from 'react-dimensions';

const key_set = ['danceability','energy','valence','acousticness','speechiness','liveness','instrumentalness']
const filter_keys = ['speechiness', 'instrumentalness']
const key_map = {
  'danceability': 'danceability',
  'energy': 'energy',
  'valence': 'happiness',
  'acousticness': 'acoustics',
  'speechiness': 'vocals',
  'liveness': 'liveness',
  'instrumentalness': 'instruments'
}

class Graph extends Component {

  constructor(props) {
    super(props)
    this.state = {
      graph: null,
      feature: props.audio_feature,
      result_set: null,
      result_keys: null,
      simulation: false 
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.audio_feature != this.props.audio_feature && this.props.audio_feature[0] != null) {
      this.__parseData(this.props.audio_feature[0]); 
      this.setState({feature: this.props.audio_feature})
    }
  }

  componentDidMount() {
    let svg = d3.select("#graph")
            .append("svg")
            .attr("width", this.props.containerWidth - 40)
            .attr("height", 800);
    this.setState({
      graph: svg,
      height: 800, 
      width: this.props.containerWidth - 40
    })
  }

  __parseData(data) {
    let result_arr = [];
    let result_keys = {}; 
    for (let key in key_set) {
      if(data[key_set[key]].toFixed(2) == 0 || filter_keys.includes(key_set[key])) continue; 
      result_arr.push({value: data[key_set[key]], title: key_set[key], index: key})
      result_keys[key] = key_set[key];
    }
    this.setState({
      result_set: result_arr, 
      result_keys: result_keys
    })
    this.__drawGraph(result_arr); 
  }

  __generateForce(data, scaleRadius) {
    var simulation = d3.forceSimulation(data)
    .velocityDecay(0.8)
    .alphaDecay(0.01)
    .force("charge", d3.forceManyBody().strength([-100]))
    .force("x", d3.forceX(0))
    .force("y", d3.forceY(0))
    .force('collision', d3.forceCollide().radius(function(d) {
      return scaleRadius(d.value); 
    }))
    .on("tick", function() {
      d3.selectAll("g").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })
    })
    if(!this.state.simulation) this.setState({simulation: simulation, data: data})
    return data; 
  }

  __checkTraits() {
    if(!this.state.result_set) return; 
    return (this.state.result_set.map((item, index) => {
      if(item.value > 0.66) {
        return (
          <h4 key={"trait-" + index}>{item.title}</h4>
        )
      }
    }));
  }
    
  __drawGraph(data) { 
    var scaleRadius = d3.scaleLinear()
      .domain([0,1])
      .range([50,220]);

    data = this.__generateForce(data, scaleRadius) 

    var colorCircles = d3.scaleOrdinal().domain(key_set).range(['#ef476f', '#06d6a0', '#118ab2', '#DB7F67', '#C4D6B0', '#54494B']);

    let node = this.state.graph.selectAll("g")
      .data(data)
    
    node.exit().transition().duration(2000)
      .attr('opacity', 0)
      .remove() 

    let nodeEnter = node.enter()
      .append("g")

    nodeEnter.append("circle")
      .attr('r', function(d) { return scaleRadius(d.value)})
      .style("fill", function(d) { return colorCircles(d.title)})
      .attr("stroke-width", "3px")
      .attr('transform', 'translate(' + [this.state.width / 2, this.state.height / 2] + ')')

    nodeEnter.append("text")
      .attr('fill', 'white') 
      .attr("text-anchor", "middle")
      .attr('transform', 'translate(' + [this.state.width / 2, this.state.height / 2] + ')')
      .attr('font-size', '12pt')
      .text(function(d){return key_map[d.title]})
    
    nodeEnter.append("text")
      .attr("text-anchor", "middle")
      .attr('fill', 'white') 
      .attr("class", "value")
      .attr('transform', 'translate(' + [this.state.width / 2, this.state.height / 2] + ')')
      .attr('font-size', '12pt')
      .attr("dy", "2em") 
      .text(function(d){ return d.value.toFixed(2)})

    node.select("circle").transition().duration(500)
        .ease(d3.easeCircleOut).attr('r', function(d) { return scaleRadius(d.value)});
    node.select(".value").text(function(d){ return d.value.toFixed(2)})
  }

  render() {
    return (
      <div id="graph" className="graph">
        <div>
          <h1>{this.props.track.name}</h1>
          {this.props.track.artists ? <h3>{this.props.track.artists[0].name}</h3> : null}
          {/* <div id="traits">
            {this.__checkTraits()}
          </div> */}
        </div>
      </div>
    );
  }
}

export default Dimensions()(Graph);
