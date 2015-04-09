// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var ReactLayeredComponent = require('../mixins/ReactLayeredComponent');
var DropCaret = require('./icons/DropCaret');

var Title = React.createClass({

  propTypes: {
    nav: React.PropTypes.node
  },

  mixins: [ReactLayeredComponent],

  _onClick: function () {
    console.log('!!! Title _onClick');
    if (this.props.nav) {
      this.setState({active: true});
    }
  },

  _onClose: function () {
    this.setState({active: false});
  },

  getInitialState: function () {
    return {active: false};
  },

  renderLayer: function() {
    console.log('!!! Title renderLayer', this.state.active, this.props.nav);
    if (! this.state.active) {
      return <span />;
    } else {
      return <this.props.nav onRequestClose={this._onClose} />;
    }
  },

  render: function() {
    var classes = ["title"];
    var caret = null;

    if (this.props.nav) {
      classes.push("title--nav");
      caret = (
        <div className="title__caret control-icon">
          <DropCaret />
        </div>
      );
    }

    return (
      <div className={classes.join(' ')} onClick={this._onClick}>
        {this.props.children}
        {caret}
      </div>
    );
  }

});

module.exports = Title;