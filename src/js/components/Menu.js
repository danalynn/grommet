// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var merge = require('lodash/object/merge');
var pick = require('lodash/object/pick');
var keys = require('lodash/object/keys');
var KeyboardAccelerators = require('../mixins/KeyboardAccelerators');
var Drop = require('../utils/Drop');
var Box = require('./Box');
var MoreIcon = require('./icons/More');
var DropCaretIcon = require('./icons/DropCaret');

var CLASS_ROOT = "menu";

// We have a separate module for the drop component so we can transfer the router context.
var MenuDrop = React.createClass({

  propTypes: merge({
    control: React.PropTypes.node,
    dropAlign: Drop.alignPropType,
    id: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    router: React.PropTypes.func
  }, Box.propTypes),

  childContextTypes: {
    router: React.PropTypes.func
  },

  getChildContext: function () {
    return { router: this.props.router };
  },

  render: function () {
    var classes = [CLASS_ROOT + "__drop"];
    var other = pick(this.props, keys(Box.propTypes));

    var first = this.props.control;
    var second = (
      <Box tag="nav" {...other} >
        {this.props.children}
      </Box>
    );
    if (this.props.dropAlign.bottom) {
      first = second;
      second = this.props.control;
    }
    if (this.props.dropAlign.right) {
      classes.push(CLASS_ROOT + "__drop--align-right");
    }

    return (
      <div id={this.props.id} className={classes.join(' ')}
        onClick={this.props.onClick}>
        {first}
        {second}
      </div>
    );
  }
});

var Menu = React.createClass({

  propTypes: merge({
    closeOnClick: React.PropTypes.bool,
    collapse: React.PropTypes.bool,
    dropAlign: Drop.alignPropType,
    icon: React.PropTypes.node,
    label: React.PropTypes.string,
    primary: React.PropTypes.bool,
    small: React.PropTypes.bool
  }, Box.propTypes),

  contextTypes: {
    router: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      align: 'stretch',
      closeOnClick: true,
      direction: 'column',
      dropAlign: {top: 'top', left: 'left'},
      pad: 'none',
      small: false
    };
  },

  mixins: [KeyboardAccelerators],

  _onOpen: function (event) {
    event.preventDefault();
    this.setState({active: true});
  },

  _onClose: function () {
    this.setState({active: false});
  },

  _onFocusControl: function () {
    this.setState({controlFocused: true});
  },

  _onBlurControl: function () {
    this.setState({controlFocused: false});
  },

  _onSink: function (event) {
    event.stopPropagation();
    // need to go native to prevent closing via document
    event.nativeEvent.stopImmediatePropagation();
  },

  getInitialState: function () {
    return {
      controlFocused: false,
      active: false,
      inline: (! this.props.label && ! this.props.icon && ! this.props.collapse)
    };
  },

  componentDidMount: function () {
    if (this.refs.control) {
      var controlElement = this.refs.control.getDOMNode();
      this.setState({
        dropId: 'menu-drop-' + controlElement.getAttribute('data-reactid')
      });
    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    // Set up keyboard listeners appropriate to the current state.

    var activeKeyboardHandlers = {
      esc: this._onClose,
      space: this._onClose,
      tab: this._onClose
    };
    var focusedKeyboardHandlers = {
      space: this._onOpen,
      down: this._onOpen
    };

    // the order here is important, need to turn off keys before turning on

    if (! this.state.controlFocused && prevState.controlFocused) {
      this.stopListeningToKeyboard(focusedKeyboardHandlers);
    }

    if (! this.state.active && prevState.active) {
      document.removeEventListener('click', this._onClose);
      this.stopListeningToKeyboard(activeKeyboardHandlers);
      this._drop.remove();
      this._drop = null;
    }

    // re-arm the space key in case we used it when active
    if (this.state.controlFocused && (! prevState.controlFocused ||
      (! this.state.active && prevState.active))) {
      this.startListeningToKeyboard(focusedKeyboardHandlers);
    }

    if (this.state.active && ! prevState.active) {
      document.addEventListener('click', this._onClose);
      this.startListeningToKeyboard(activeKeyboardHandlers);
      this._drop = Drop.add(this.refs.control.getDOMNode(),
        this._renderDrop(), this.props.dropAlign);
    }

    if (this.state.active) {
      this._drop.render(this._renderDrop());
    }
  },

  componentWillUnmount: function () {
    document.removeEventListener('click', this._onClose);
    if (this._drop) {
      this._drop.remove();
    }
  },

  _renderControl: function () {
    var result = null;
    var icon = null;
    var controlClassName = CLASS_ROOT + "__control";

    var classes = [controlClassName];

    if (this.props.icon) {
      classes.push(controlClassName + "--labelled");
      icon = this.props.icon;
    } else {
      classes.push(controlClassName + "--fixed-label");
      icon = <MoreIcon />;
    }

    if (this.props.label) {
      result = (
        <div className={classes.join(' ')}>
          <div className={controlClassName + "-icon"}>
            {icon}
          </div>
          <span className={controlClassName + "-label"}>{this.props.label}</span>
          <DropCaretIcon className={controlClassName + "-drop-icon"} />
        </div>
      );
    } else {
      result = (
        <div className={controlClassName}>
          {icon}
        </div>
      );
    }
    return result;
  },

  _renderDrop: function() {
    var other = pick(this.props, keys(Box.propTypes));

    var controlContents = (
      <div onClick={this._onClose}>
        {this._renderControl()}
      </div>
    );

    var onClick;
    if (this.props.closeOnClick) {
      onClick = this._onClose;
    } else {
      onClick = this._onSink;
    }

    return (
      <MenuDrop router={this.context.router}
        dropAlign={this.props.dropAlign}
        {...other}
        onClick={onClick}
        id={this.state.dropId}
        control={controlContents}>
        {this.props.children}
      </MenuDrop>
    );
  },

  _classes: function (prefix) {
    var classes = [prefix];

    if (this.props.direction) {
      classes.push(prefix + "--" + this.props.direction);
    }
    if (this.props.align) {
      classes.push(prefix + "--align-" + this.props.align);
    }
    if (this.props.small) {
      classes.push(prefix + "--small");
    }
    if (this.props.primary) {
      classes.push(prefix + "--primary");
    }

    return classes;
  },

  render: function () {
    var classes = this._classes(CLASS_ROOT);
    if (this.state.inline) {
      classes.push(CLASS_ROOT + "--inline");
    } else {
      classes.push(CLASS_ROOT + "--controlled");
      if (this.props.label) {
        classes.push(CLASS_ROOT + "--labelled");
      }
    }
    if (this.props.className) {
      classes.push(this.props.className);
    }

    if (this.state.inline) {
      var other = pick(this.props, keys(Box.propTypes));

      return (
        <Box tag="nav" {...other} className={classes.join(' ')} onClick={this._onClose}>
          {this.props.children}
        </Box>
      );

    } else {

      var controlContents = this._renderControl();

      return (
        <div ref="control" className={classes.join(' ')}
          tabIndex="0"
          onClick={this._onOpen}
          onFocus={this._onFocusControl}
          onBlur={this._onBlurControl}>
          {controlContents}
        </div>
      );

    }
  }

});

module.exports = Menu;
