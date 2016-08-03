/* eslint-env react, browser*/
'use strict'
window.onload = function () {
  const React = require('react')
  var ReactDOM = require('react-dom')
  var Page = require('./view/Page')

  ReactDOM.render(
    <Page></Page>,
  document.getElementById('top')
  )
}
/* eslint-disable */
if(location.hostname == 'localhost'){
  document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
  ':35729/livereload.js?snipver=1"> </' + 'script>')
}
