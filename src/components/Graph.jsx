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
            .attr("height", 480);
    this.setState({
      graph: svg,
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
    let w = this.props.containerWidth - 200;
    let h = 400; 
    let barPadding = 10;
    console.log(data) 

    d3.select('svg')
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return i * (w / data.length);
      })
      .attr("y", function(d) {
        return h - d.value*400;;  //Height minus data value
      })
      .attr("width", w / data.length - barPadding)
      .attr("height", function(d) {
        return d.value*400;
      })    
  }

  render() {
    return (
      <div id="graph" className="graph">
      </div>
    );
  }
}

export default Dimensions()(Graph);
