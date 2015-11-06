var ClickBox = React.createClass({displayName: "ClickBox",
  loadFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        //!!
        // console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleClickSubmit: function(doodad){
    var doodadData = this.state.data;
    var newDoodad = doodadData.concat([doodad]);
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
    this.loadFromServer();
    setInterval(this.loadFromServer, this.props.pollInterval);
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
          React.createElement(Clickable, {
            clickableObj: clickable}
          )
        )
      )
    });
    return (
      React.createElement("ul", {className: "clickableList"}, 
        clickableNodes
      )
    );
  }
});

var Clickable = React.createClass({displayName: "Clickable",
  onItemClick: function (event) {
    console.log("Clicked!!!");
    event.currentTarget.style.backgroundColor = '#CCC';
  },

  renderCopyButton: function(doodadId) {
    return (
      React.createElement("button", {onclick: "console.log('clicked!!!')"}, "Copy")
    );
  },

  render: function() {
    //!!!
    // debugger;
    var doodadId = this.props.clickableObj.id;
    var doodad = this.props.clickableObj.doodad;
    var hits = this.props.clickableObj.hits;

    return (
      React.createElement("div", {className: "flex-item", onClick: this.onItemClick}, 
        React.createElement("div", {className: "doodadId"}, 
          "Id: ", doodadId
        ), 
        React.createElement("div", {className: "doodad"}, 
          doodad
        ), 
        React.createElement("div", {className: "hits"}, 
          "Hits: ", hits
        )
      )
    );
  },

});

var ClickableForm = React.createClass({displayName: "ClickableForm",
  handleSubmit: function(e) {
    // console.log("Submit clicked!!");
    e.preventDefault();
    var doodad = React.findDOMNode(this.refs.doodad).value.trim();
    // create all new doodads with zero hits
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
  React.createElement(ClickBox, {url: "data.json", pollInterval: 100000}),
  document.getElementById('content')
);
