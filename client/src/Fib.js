import React from 'react';
import axios from "axios";

class Fib extends React.Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values  = await axios.get("/api/values/current")
    //console.log("fetchValues", values)    
    this.setState({values: values.data});
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get("/api/values/all");
    //console.log("fetchIndexes", seenIndexes)
    this.setState({seenIndexes: seenIndexes.data});
  }
  
  onSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/values", {index: this.state.index});
    this.setState({index: ''});
  }

  onChange = (e) => {
    this.setState({index: e.target.value});
  }

  renderSeenIndexes() {
    //postgres returns an array (rows) of objects (records)
    //we extract property "number" from each object to get the value of field "number"
    return this.state.seenIndexes.map( ({number}) => number).join(", ");
  }

  renderValues() {
    //redis returns an object of dynamic key/value pairs
    return Object.entries(this.state.values).map( ([index,value]) => (
      <div key={index}>
        {`For index ${index} I calculated ${value}`}
      </div>) 
    );
  }  

  render() {    
    return (
      <div className='fib'>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="">Enter your index:</label>
          <input type="number" 
            value={this.state.index} 
            onChange={this.onChange}
          />
          <button type="submit">Submit</button>
        </form>

        <h3>Indexes I have seen</h3>  
        {this.renderSeenIndexes()}        

        <h3>Calculated values</h3>
        {this.renderValues()}           
      </div>
    )};
}

export default Fib;;