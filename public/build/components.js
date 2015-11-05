var ClickBox = React.createClass({displayName: "ClickBox",
  loadClicksFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleClickSubmit: function(doodad){
    var doodads = this.state.data;
    var newDoodad = doodads.concat([doodad]);
    this.setState({data: newDoodad});

    //submit to server and refresh
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: doodad,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function(){
    return {data: []};
  },
  componentDidMount: function() {
    this.loadClicksFromServer();
    setInterval(this.loadClicksFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      React.createElement("div", {className: "clickBox"}, 
        React.createElement(ClickableForm, {onClickSubmit: this.handleClickSubmit}), 
        React.createElement(ClickableList, {data: this.state.data})
      )
    );
  }
});

var ClickableList = React.createClass({displayName: "ClickableList",
  render: function() {
    var clickableNodes = this.props.data.map(function(clickable){
      return (
        React.createElement("li", {className: "flex-container"}, 
          React.createElement(Clicker, {doodad: clickable.doodad}, 
              clickable.hits
          )
        )
      )
    });
    return (
      React.createElement("ul", {className: "x"}, 
        clickableNodes
      )
    );
  }
});

var Clicker = React.createClass({displayName: "Clicker",
  render: function() {
    var doodad = this.props.doodad;
    var hits = this.props.children;
    return (
      React.createElement("div", {className: "flex-item"}, 
        React.createElement("div", {className: "doodad"}, 
          doodad
        ), 
        React.createElement("div", {className: "hits"}, 
          hits
        )
      )
    );
  }
});

var ClickableForm = React.createClass({displayName: "ClickableForm",
  handleSubmit: function(e) {
    e.preventDefault();
    var doodad = React.findDOMNode(this.refs.doodad).value.trim();
    // start all new doodads with zero hits
    var hits = 0;
    if(!doodad){
      return;
    }
    // send to server
    this.props.onClickSubmit({doodad: doodad, hits: hits});

    React.findDOMNode(this.refs.doodad).value='';

    return;
  },

  render: function(){
    return (
      React.createElement("form", {className: "clickableForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "hits", placeholder: "Add a clickable ...", ref: "doodad"}), 
        React.createElement("input", {type: "submit", value: "Submit"})
      )
    );
  }
});

React.render(
  React.createElement(ClickBox, {url: "data.json", pollInterval: 50000}),
  document.getElementById('content')
);
