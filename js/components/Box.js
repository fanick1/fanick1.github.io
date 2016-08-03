'use strict'
var React = require('react')

var Box = React.createClass({
  render: function () {
    return (<div className="box">
              {this.props.children}
            </div>
            )
  }
})

var Vbox = React.createClass({
  render: function () {
    return (<div className="vbox">
              {this.props.children}
            </div>
            )
  }
})

var Hbox = React.createClass({
  render: function () {
    var content = <div className="hbox">
                    {this.props.children}
                  </div>
    return ({content})
  }
})

module.exports = Box
module.exports = Vbox
module.exports = Hbox
