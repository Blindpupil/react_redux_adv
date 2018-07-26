import React, { Component } from 'react';
import { connect } from 'react-redux';

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    // our component just got a new set of props
    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    shouldNavigateAway() {
      if (!this.props.auth) this.props.history.push('/');
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { auth: state.auth }
  }

  return connect(mapStateToProps)(ComposedComponent);
};