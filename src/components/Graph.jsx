import React, { Component } from 'react';
import * as d3 from 'd3';
import Dimensions from 'react-dimensions';

const key_set = ['danceability','energy','valence','acousticness','speechiness','liveness','instrumentalness']

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
            .attr("height", 680);
    this.setState({
      graph: svg,
      height: 680, 
      width: this.props.containerWidth - 40
    })
  }

  __parseData(data) {
    let result_arr = [];
    let result_keys = {}; 
    for (let key in key_set) {
      result_arr.push({value: data[key_set[key]], title: key_set[key], index: key})
      result_keys[key] = key_set[key];
    }
    this.setState({
      result_set: result_arr, 
      result_keys: result_keys
    })
    this.__drawGraph(result_arr); 
  }

  __drawGraph(data) { 
    if(!this.state.simulation) {
      var simulation = d3.forceSimulation(data)
      .velocityDecay(0.8)
      .alphaDecay(0.01)
      .force("charge", d3.forceManyBody().distanceMin(200).strength([-1000]))
      .force("x", d3.forceX(0))
      .force("y", d3.forceY(0))
      .on("tick", function() {
        d3.selectAll("g").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })
      })
    } else {
      d3.forceSimulation(data)
      .velocityDecay(0.55)
      .force("charge", d3.forceManyBody().strength([-800]))
      .force("x", d3.forceX(0))
      .force("y", d3.forceY(0))
      .on("tick", function() {
        d3.selectAll("g").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })
      })
    }
    
    var scaleRadius = d3.scaleLinear()
      .domain([0,1])
      .range([50,150]);

    var colorCircles = d3.scaleOrdinal(['white']);

    let node = this.state.graph.selectAll("g")
      .data(data)
    
    node.exit().remove() 

    let nodeEnter = node.enter()
      .append("g")

    nodeEnter.append("circle")
      .attr('r', function(d) { return scaleRadius(d.value)})
      .style("fill", function(d) { return colorCircles(d.title)})
      .style("stroke", "black")
      .attr('transform', 'translate(' + [this.state.width / 2, this.state.height / 2] + ')')

    nodeEnter.append("text")
      .attr("text-anchor", "middle")
      .attr('transform', 'translate(' + [this.state.width / 2, this.state.height / 2] + ')')
      .attr('font-size', '8pt')
      .text(function(d){return d.title})
    
    nodeEnter.append("text")
      .attr("text-anchor", "middle")
      .attr("class", "value")
      .attr('transform', 'translate(' + [this.state.width / 2, this.state.height / 2] + ')')
      .attr('font-size', '8pt')
      .attr("dy", "2em") 
      .text(function(d){ return d.value.toFixed(2)})

    node.select("circle").transition().duration(500)
        .ease(d3.easeCircleOut).attr('r', function(d) { return scaleRadius(d.value)});
    node.select(".value").text(function(d){ return d.value.toFixed(2)})
    
    if(!this.state.simulation) this.setState({simulation: simulation})
  }

  render() {
    return (
      <div id="graph" className="graph">
        <div>
          <h1>{this.props.track.name}</h1>
          {this.props.track.artists ? <h3>{this.props.track.artists[0].name}</h3> : null}
        </div>
      </div>
    );
  }
}

export default Dimensions()(Graph);
