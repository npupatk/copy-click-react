var ClickBox = React.createClass({displayName: "ClickBox",
  loadFromServer: function() {
    $.ajax({
      url: this.props.url,
      // url: 'http://localhost:4000/clickables',
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
    // debugger;
    var doodadData = this.state.data;
    var newDoodad = doodadData.concat([doodad]);
    this.setState({data: newDoodad});

    //submit to server and refresh
    $.ajax({
      url: this.props.url,
      // url: 'http://localhost:4000/clickables',
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
        React.createElement("li", {className: "clickable-item"},
          React.createElement(Clickable, {
            clickableObj: clickable}
          )
        )
      )
    });
    return (
      React.createElement("ul", {className: "clickable-item-container"},
        clickableNodes
      )
    );
  }
});

var CopyButton = React.createClass({displayName: "CopyButton",
  onItemClick: function (doodadId, doodadName, event) {
    // console.log("The doodadId is: " + doodadId);
    // console.log("The doodadName is: " + doodadName);
    // event.currentTarget.style.backgroundColor = '#FF0000';

    var tempInputField = $("<input>");
    tempInputField.addClass("xyz");
    $("body").append(tempInputField);
    tempInputField.val(doodadName).select();
    document.execCommand("copy");
    tempInputField.remove();

  },
  render: function(doodadId, doodadName) {
    var doodadId = this.props.identifyDoodad;
    var doodadName = this.props.doodadName;
    return (
      React.createElement("button", {className: "copy-button", onClick: this.onItemClick.bind(this, doodadId, doodadName)}, doodadName)
    );
  }
});

var Clickable = React.createClass({displayName: "Clickable",
  render: function () {
    //!!!
    // debugger;
    var doodadId = this.props.clickableObj.id;
    var doodadName = this.props.clickableObj.doodad;
    var hits = this.props.clickableObj.hits;

    return (
      React.createElement("div", null,
        React.createElement(CopyButton, {
          identifyDoodad: doodadId, doodadName: doodadName}
        ),
        React.createElement("span", {className: "hits"}

        )
      )
    );
  }

// Test: saved for reference -- change thi div's color
// In Clickable Class:
  // !! located before render function:
  // onClickColorDiv: function (event) {
  //   console.log('event: ', event);
  //   event.currentTarget.style.backgroundColor = '#FF0000';
  // },

  // !! located in return:
        // <div className="colorDivTest" onClick={this.onClickColorDiv}>
          // colorDivTest
        // </div>

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
  React.createElement(ClickBox, {url: "data.json", pollInterval: 5000}),
  // React.createElement(ClickBox, {url: "http://localhost:4000/clickables", pollInterval: 5000}),
  document.getElementById('content')
);
