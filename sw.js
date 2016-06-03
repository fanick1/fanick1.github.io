/* jshint esnext: true */
/* jshint curly: true */
/* jshint asi:true */

self.onnotificationclick = function(event) {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll(
    /*{
      type: "window"
    }*/

  ).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if ('focus' in client){
        var msg_chan = new MessageChannel();
        client.postMessage({clicked:true}, [msg_chan.port2]);
        return client.focus();
      }
    }
    //if (clients.openWindow)
    //  return clients.openWindow('/');
  }));
};

self.onmessage = function(messageEvent){
  console.debug('serviceWorker received message:', messageEvent)
  if(messageEvent.data.type == 'SHOW_NOTIFICATION'){
    var {title, notification, timeout} = messageEvent.data;
    setTimeout(function(){
      registration.showNotification(title, notification)
    }, timeout)
  }
}
