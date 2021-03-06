// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var keys = require('lodash/object/keys');

var CLASS_ROOT = "box";

var Box = React.createClass({

  propTypes: {
    align: React.PropTypes.oneOf(['start', 'center', 'between', 'end', 'stretch']),
    appCentered: React.PropTypes.bool,
    colorIndex: React.PropTypes.string,
    containerClassName: React.PropTypes.string,
    direction: React.PropTypes.oneOf(['row', 'column']),
    full: React.PropTypes.oneOf([true, 'horizontal', 'vertical', false]),
    onClick: React.PropTypes.func,
    justify: React.PropTypes.oneOf(['start', 'center', 'between', 'end']),
    pad: React.PropTypes.oneOfType([
      React.PropTypes.oneOf(['none', 'small', 'medium', 'large']),
      React.PropTypes.shape({
        horizontal: React.PropTypes.oneOf(['none', 'small', 'medium', 'large']),
        vertical: React.PropTypes.oneOf(['none', 'small', 'medium', 'large'])
      })
    ]),
    reverse: React.PropTypes.bool,
    responsive: React.PropTypes.bool,
    tag: React.PropTypes.string,
    texture: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      direction: 'column',
      pad: 'none',
      tag: 'div',
      responsive: true
    };
  },

  _addPropertyClass: function (classes, prefix, property) {
    var choice = this.props[property];
    if (choice) {
      if (typeof choice === 'string') {
        classes.push(prefix + '--' + property + '-' + choice);
      } else if (typeof choice === 'object') {
        keys(choice).forEach(function (key) {
          classes.push(prefix + '--' + property + '-' + key + '-' + choice[key]);
        });
      } else {
        classes.push(prefix + '--' + property);
      }
    }
  },

  render: function() {
    var classes = [CLASS_ROOT];
    var containerClasses = [CLASS_ROOT + "__container"];
    this._addPropertyClass(classes, CLASS_ROOT, 'flush');
    this._addPropertyClass(classes, CLASS_ROOT, 'full');
    this._addPropertyClass(classes, CLASS_ROOT, 'direction');
    this._addPropertyClass(classes, CLASS_ROOT, 'justify');
    this._addPropertyClass(classes, CLASS_ROOT, 'align');
    this._addPropertyClass(classes, CLASS_ROOT, 'reverse');
    this._addPropertyClass(classes, CLASS_ROOT, 'responsive');
    this._addPropertyClass(classes, CLASS_ROOT, 'pad');

    if (this.props.appCentered) {
      this._addPropertyClass(containerClasses, CLASS_ROOT + "__container", 'full');
      if (this.props.colorIndex) {
        containerClasses.push("background-color-index-" + this.props.colorIndex);
      }
      if (this.props.containerClassName) {
        containerClasses.push(this.props.containerClassName);
      }
    } else {
      if (this.props.colorIndex) {
        classes.push("background-color-index-" + this.props.colorIndex);
      }
    }

    if (this.props.className) {
      classes.push(this.props.className);
    }

    var style = {};
    if (this.props.texture) {
      style.backgroundImage = this.props.texture;
    }

    if (this.props.appCentered) {
      return (
        <div className={containerClasses.join(' ')} style={style}
          onClick={this.props.onClick}>
          <this.props.tag className={classes.join(' ')}>
            {this.props.children}
          </this.props.tag>
        </div>
      );
    } else {
      return (
        <this.props.tag className={classes.join(' ')} style={style}
          onClick={this.props.onClick}>
          {this.props.children}
        </this.props.tag>
      );
    }
  }

});

module.exports = Box;
