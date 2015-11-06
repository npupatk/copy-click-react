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
        <li className="flex-container">
          <Clickable
            clickableObj={clickable}>
          </Clickable>
        </li>
      )
    });
    return (
      <ul className="clickableList">
        {clickableNodes}
      </ul>
    );
  }
});

var Clickable = React.createClass({
  onItemClick: function (event) {
    console.log("Clicked!!!");
    event.currentTarget.style.backgroundColor = '#CCC';
  },

  renderCopyButton: function(doodadId) {
    return (
      <button onclick="console.log('clicked!!!')">Copy</button>
    );
  },

  render: function() {
    //!!!
    // debugger;
    var doodadId = this.props.clickableObj.id;
    var doodad = this.props.clickableObj.doodad;
    var hits = this.props.clickableObj.hits;

    return (
      <div className="flex-item" onClick={this.onItemClick}>
        <div className="doodadId">
          Id: {doodadId}
        </div>
        <div className="doodad">
          {doodad}
        </div>
        <div className="hits">
          Hits: {hits}
        </div>
      </div>
    );
  },

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
  <ClickBox url="data.json" pollInterval={100000}/>,
  document.getElementById('content')
);
