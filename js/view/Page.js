'use strict'
var React = require('react')
var getPauseTimer = require('../pause_timer')

var defaultTime = 10 // 10 minutes

let intervalProvider = function () {
  return new Promise(function (resolve, reject) {
    let timeout = 10 // parseInt(window.prompt('Timer restarted.  Specify new timeout (in minutes).', defaultTime))
    if (timeout > 0) {
      defaultTime = timeout
      resolve(timeout)
    } else {
      reject(timeout)
    }
  })
}

var pageInstance = null

let onTick = function (remainingTimeout) {
  if (pageInstance != null) {
    pageInstance.onTick(remainingTimeout)
  }
}
var {pauzeTimer, stopTimer} = getPauseTimer(intervalProvider, onTick)

var Page = React.createClass({
  getInitialState () {
    return {remainingTimeout: 0}
  },
  onTick (remainingTimeout) {
    this.setState({remainingTimeout: remainingTimeout})
  },
  componentWillUnmount () {
    pageInstance = null
  },
  componentDidMount () {
    pageInstance = this
  },
  render: function () {
    let timeout = this.state.remainingTimeout
    let hours = Math.floor(timeout / 1000 / 3600)
    let minutes = Math.floor(timeout / 1000 / 60) % 60
    let seconds = Math.floor(timeout / 1000) % 60

    const f = (t) => {
      return t < 1 ? '00' : t < 10 ? '0' + t : '' + t
    }
    let sH = f(hours)
    let sM = f(minutes)
    let sS = f(seconds)

    return (<div className="main">
              <div className="button-wrap">
                 <button onClick={pauzeTimer} className="start-button">Start timer</button>
              </div>
              <div className="button-wrap">
                 <button onClick={stopTimer} className="start-button">Stop  the timer</button>
              </div>

              <div className="info-wrap">
                 <div id="info"> Time remaining: {sH} : {sM} : {sS} </div>
              </div>
            </div>
            )
  }

})

module.exports = Page
