/* eslint-env browser, serviceworker */
// if (false) { var self, clients, registration }

var pendingTimeout = null
var pendingInterval = null
var remainingTimeout = null

self.onnotificationclick = function (event) {
  // console.log('On notification click: ', event.notification.tag)
  event.notification.close()

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll(
    /*{
      type: "window"
    }*/
  ).then(function (clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i]
      if ('focus' in client) {
        var msgChan = new MessageChannel()
        client.postMessage({clicked: true}, [msgChan.port2])
        return client.focus()
      }
    }
    // if (clients.openWindow)
    //  return clients.openWindow('/');
  }))
}

var sendTick = function () {
  clients.matchAll(
    /*{
      type: "window"
    }*/
  ).then(function (clientList) {
    if (remainingTimeout < 0) {
      remainingTimeout = 0
      clearInterval(pendingInterval)
    }
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i]
      if ('focus' in client) {
        var msgChan = new MessageChannel()
        client.postMessage({tick: true, remainingTimeout: remainingTimeout}, [msgChan.port2])
        remainingTimeout -= 1000
        return
      }
    }
  })
}

var stopTimer = function () {
  remainingTimeout = 0
  sendTick()
  clearTimeout(pendingTimeout)
  clearInterval(pendingInterval)
}

self.onmessage = function (messageEvent) {
  // console.debug('serviceWorker received message:', messageEvent)
  if (messageEvent.data.type === 'STOP_TIMER') {
    stopTimer()
    var {title, notification} = messageEvent.data
    setTimeout(function () {
      registration.showNotification(title, notification)
    }, 0)
  }
  if (messageEvent.data.type === 'SHOW_NOTIFICATION') {
    stopTimer()
    var {title, notification, timeout} = messageEvent.data
    remainingTimeout = timeout
    pendingTimeout = setTimeout(function () {
      registration.showNotification(title, notification)
    }, timeout)
    pendingInterval = setInterval(sendTick, 1000)
  }
}
