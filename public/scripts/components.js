var ClickBox = React.createClass({
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
          <Clicker doodad={clickable.doodad}>
              {clickable.hits}
          </Clicker>
        </li>
      )
    });
    return (
      <ul className="x">
        {clickableNodes}
      </ul>
    );
  }
});

var Clicker = React.createClass({
  render: function() {
    var doodad = this.props.doodad;
    var hits = this.props.children;
    return (
      <div className="flex-item">
        <div className="doodad">
          {doodad}
        </div>
        <div className="hits">
          {hits}
        </div>
      </div>
    );
  }
});

var ClickableForm = React.createClass({
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
      <form className="clickableForm" onSubmit={this.handleSubmit}>
        <input type="hits" placeholder="Add a clickable ..." ref="doodad" />
        <input type="submit" value="Submit" />
      </form>
    );
  }
});

React.render(
  <ClickBox url="data.json" pollInterval={50000}/>,
  document.getElementById('content')
);
