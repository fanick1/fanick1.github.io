/* eslint-env browser */

'use strict'

function registerMainServiceWorker () {
  navigator.serviceWorker.register('/sw.js')
}
registerMainServiceWorker()

var getPauseTimer = function (timeoutIntervalProvider, onTick, onPermissionGranted, onTimerStarted) {
  var _onPermGranted = onPermissionGranted || function () {}
  var _onTimerStarted = onTimerStarted || function () {}
  var _onTick = onTick || function () {}
  var notifier = null

  Notification.requestPermission(function (result) {
    _onPermGranted(result)
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(function (registration) {
        notifier = registration
      })
    }
  })

  var requestStopTimer = () => {
    var notification = {
      type: 'STOP_TIMER',
      title: 'PAUSE',
      notification: {
        body: ' Timer stopped! ',
        requireInteraction: false,
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAkFBMVEX///8EAgR0cnR8enz8/vxkZmT8+vxUVlT09vR0dnTU1tTk5uRsbmyUlpT08vRUUlQUEhRcXlwUFhTExsQcHhycmpykpqScnpzs6uzs7uy8urwMDgwsKiw0NjS8vrwkIiSEhoREQkSsqqx8fnxcWlxERkQkJiQ8Pjw0MjQsLixkYmTc2tyMioxMTkzMysxMSkx3av1DAAABoElEQVRYhcWWyXLCMBBENUbY8s5iYwhgdgiQkP//u0jyIYFEYxddqfTFF/ohzaYR4u8lfRQwAQHXEASEHuaf0hryyw+KIEBJhUT8N6Ie4lcroisCuBANkBtERJQjB+hrQAD45UADzgDAJ6MYOIEFIJV8sASgEtcW8Pp8ItXIEtLnjzCxgAEwkwJLeHkeMJsbANJPoQEkAMC0AyFT0VYjMpdNNc6Rl2GqASXgFxXRCRqKAc2BdhQig6pIK4VSqDVcgG/zscb8YgllQAuLoBa6nfyP3nqMqnZ/85o41Z6VDABI35ciZv0FY49y84vlkgW8M3cvaJXWQ/4C3Hi90THTt9jwgLUbsKVt82E1dgPGNDUfxQMyNyBrAGLE+dmN69BM/xMHYBemutkDcg6w4wByH5jmXXCAGwcQarOoYjYLbUun3HFu6rJvXdkIdNr4or3bP3QePfS+6ewE5N6dwq+IyLhs66JHXdL4IaIqZWvwTqP012mtko7+RLmCUa862AvutVNeq99z/n2jKGDtQYfNe1a5GEE5a7dbjZP+TyW/TqNPMPUSATnWmhsAAAAASUVORK5CYII='
      }
    }

    if (notifier == null || notifier.active == null) {
      registerMainServiceWorker()
    } else {
      notifier.active.postMessage(notification)
    }
  }

  var requestDeferredNotification = (timeout) => {
    _onTimerStarted(timeout)

    var notification = {
      type: 'SHOW_NOTIFICATION',
      timeout: (timeout * 60 * 1000) || 100,
      title: 'PAUSE',
      notification: {
        body: ' Have a break ! \r\n \r\nClick to restart ',
        requireInteraction: true,
        silent: false,
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAkFBMVEX///8EAgR0cnR8enz8/vxkZmT8+vxUVlT09vR0dnTU1tTk5uRsbmyUlpT08vRUUlQUEhRcXlwUFhTExsQcHhycmpykpqScnpzs6uzs7uy8urwMDgwsKiw0NjS8vrwkIiSEhoREQkSsqqx8fnxcWlxERkQkJiQ8Pjw0MjQsLixkYmTc2tyMioxMTkzMysxMSkx3av1DAAABoElEQVRYhcWWyXLCMBBENUbY8s5iYwhgdgiQkP//u0jyIYFEYxddqfTFF/ohzaYR4u8lfRQwAQHXEASEHuaf0hryyw+KIEBJhUT8N6Ie4lcroisCuBANkBtERJQjB+hrQAD45UADzgDAJ6MYOIEFIJV8sASgEtcW8Pp8ItXIEtLnjzCxgAEwkwJLeHkeMJsbANJPoQEkAMC0AyFT0VYjMpdNNc6Rl2GqASXgFxXRCRqKAc2BdhQig6pIK4VSqDVcgG/zscb8YgllQAuLoBa6nfyP3nqMqnZ/85o41Z6VDABI35ciZv0FY49y84vlkgW8M3cvaJXWQ/4C3Hi90THTt9jwgLUbsKVt82E1dgPGNDUfxQMyNyBrAGLE+dmN69BM/xMHYBemutkDcg6w4wByH5jmXXCAGwcQarOoYjYLbUun3HFu6rJvXdkIdNr4or3bP3QePfS+6ewE5N6dwq+IyLhs66JHXdL4IaIqZWvwTqP012mtko7+RLmCUa862AvutVNeq99z/n2jKGDtQYfNe1a5GEE5a7dbjZP+TyW/TqNPMPUSATnWmhsAAAAASUVORK5CYII='
      }
    }

    if (notifier == null || notifier.active == null) {
      registerMainServiceWorker()
    } else {
      notifier.active.postMessage(notification)
    }
  }

  var stopTimer = function () {
    requestStopTimer()
  }
  var pauzetimer = function () {
    _timeoutIntervalProvider()
      .then(timeout => requestDeferredNotification(timeout))
      .catch(value => console.debug('Cannot set timeout to ', value))
  }

  var _timeoutIntervalProvider = timeoutIntervalProvider || function () {
    return new Promise(function (resolve, reject) {
      resolve(window.prompt('Timer restarted.  Specify new timeout (in minutes).'))
    })
  }

  navigator.serviceWorker.onmessage = function (messageEvent) {
    // console.log('Received message: ', messageEvent.data)
    if (messageEvent.data.clicked) {
      window.focus()
      pauzetimer()
    }

    if (messageEvent.data.tick) {
      _onTick(messageEvent.data.remainingTimeout)
    }
  }

  return {pauzeTimer:pauzetimer, stopTimer: stopTimer}
}

module.exports = getPauseTimer
