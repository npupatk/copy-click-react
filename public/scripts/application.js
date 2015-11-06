var ClickBox = React.createClass({
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
      <div className = "clickBox">
        <ClickableForm onClickSubmit={this.handleClickSubmit} />
        <ClickableList data={this.state.data} />
      </div>
    );
  }
});

var ClickableList = React.createClass({
  render: function() {
    var clickableNodes = this.props.data.map(function(clickable){
      return (
        <li className="clickable-item">
          <Clickable
            clickableObj={clickable}>
          </Clickable>
        </li>
      )
    });
    return (
      <ul className="clickable-item-container">
        {clickableNodes}
      </ul>
    );
  }
});

var CopyButton = React.createClass({
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
      <button className="copy-button" onClick={this.onItemClick.bind(this, doodadId, doodadName)}>{doodadName}</button>
    );
  }
});

var Clickable = React.createClass({
  render: function () {
    //!!!
    // debugger;
    var doodadId = this.props.clickableObj.id;
    var doodadName = this.props.clickableObj.doodad;
    var hits = this.props.clickableObj.hits;

    return (
      <div>
        <CopyButton
          identifyDoodad={doodadId} doodadName={doodadName}>
        </CopyButton>
        <span className="hits">

        </span>
      </div>
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

var ClickableForm = React.createClass({
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
      <form className="clickableForm" onSubmit={this.handleSubmit}>
        <input type="hits" placeholder="Add a clickable ..." ref="doodad" />
        <input type="submit" value="Submit" />
      </form>
    );
  }
});

React.render(
  <ClickBox url="data.json" pollInterval={5000}/>,
  document.getElementById('content')
);
