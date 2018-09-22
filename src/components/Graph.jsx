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
      result_keys: null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.audio_feature != this.props.audio_feature) {
      this.__parseData(this.props.audio_feature[0]); 
      this.setState({feature: this.props.audio_feature})
    }
    if(this.state.result_set != null) {
      this.__drawGraph(); 
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
  }

  __drawGraph() { 
    d3.select('svg').selectAll('*').remove();

    let data = this.state.result_set;

    var scaleRadius = d3.scaleLinear()
      .domain([0,1])
      .range([50,150]);

    var colorCircles = d3.scaleOrdinal(['white']);

    let node = this.state.graph.selectAll("g")
      .data(data)
      .enter()
      .append("g")

    node.append("circle")
      .attr('r', function(d) { return scaleRadius(d.value)})
      .style("fill", function(d) { return colorCircles(d.title)})
      .attr('transform', 'translate(' + [this.state.width / 2, this.state.height / 2] + ')')

    node.append("text")
      .attr("text-anchor", "middle")
      .attr('transform', 'translate(' + [this.state.width / 2, this.state.height / 2] + ')')
      .attr('font-size', '12pt')
      .text(function(d){return d.title})

    d3.forceSimulation(data)
      .velocityDecay(0.8)
      .alphaDecay(0.001)
      .force("charge", d3.forceManyBody().distanceMin(150).strength([-1000]))
      .force("x", d3.forceX(0))
      .force("y", d3.forceY(0))
      .on("tick", function() {
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })
      })
  }

  render() {
    return (
      <div id="graph" className="graph">
        <h1>{this.props.track.name}</h1>
      </div>
    );
  }
}

export default Dimensions()(Graph);
