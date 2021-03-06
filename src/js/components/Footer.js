// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var merge = require('lodash/object/merge');
var pick = require('lodash/object/pick');
var keys = require('lodash/object/keys');
var Box = require('./Box');

var CLASS_ROOT = "footer";

var Footer = React.createClass({

  propTypes: merge({
    large: React.PropTypes.bool,
    separator: React.PropTypes.bool,
    small: React.PropTypes.bool
  }, Box.propTypes),

  getDefaultProps: function () {
    return {
      pad: 'none',
      direction: 'row',
      responsive: false
    };
  },

  render: function() {
    var classes = [CLASS_ROOT];
    var other = pick(this.props, keys(Box.propTypes));
    if (this.props.large) {
      classes.push(CLASS_ROOT + "--large");
    }
    if (this.props.separator) {
      classes.push(CLASS_ROOT + "--separator");
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <Box tag="footer" {...other} className={classes.join(' ')}>
        {this.props.children}
      </Box>
    );
  }

});

module.exports = Footer;
