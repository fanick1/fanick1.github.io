/* jshint esnext: true */
/* jshint curly: true */
/* jshint asi:true */

(function(){
  "use strict";
var notifier = null;
window.onload = function(){

  navigator.serviceWorker.register('/sw.js')

  Notification.requestPermission(function(result) {
      document.getElementById('info').innerHTML = "Permission : '" + result + "'.";
    if(result === 'granted'){
                  navigator.serviceWorker.ready.then(function(registration){
                          notifier = registration
                  })
      }
  })
}

window.pauzetimer = function(timeout){
  console.debug(new Date().toLocaleTimeString(), ' new timeout: ', timeout);
  document.getElementById('info').insertAdjacentHTML('beforebegin', '<div> Timeout started at ' + Date().split(' ')[4] + '</div>');
  var notification = {
    type : 'SHOW_NOTIFICATION',
    timeout : (timeout * 60 * 1000) || 100,
    title : 'PAUSE',
    notification : {
                    body :' Have a break ! \r\n \r\nClick to restart ',
                    requireInteraction : true,
                    silent: false,
                    icon :'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAkFBMVEX///8EAgR0cnR8enz8/vxkZmT8+vxUVlT09vR0dnTU1tTk5uRsbmyUlpT08vRUUlQUEhRcXlwUFhTExsQcHhycmpykpqScnpzs6uzs7uy8urwMDgwsKiw0NjS8vrwkIiSEhoREQkSsqqx8fnxcWlxERkQkJiQ8Pjw0MjQsLixkYmTc2tyMioxMTkzMysxMSkx3av1DAAABoElEQVRYhcWWyXLCMBBENUbY8s5iYwhgdgiQkP//u0jyIYFEYxddqfTFF/ohzaYR4u8lfRQwAQHXEASEHuaf0hryyw+KIEBJhUT8N6Ie4lcroisCuBANkBtERJQjB+hrQAD45UADzgDAJ6MYOIEFIJV8sASgEtcW8Pp8ItXIEtLnjzCxgAEwkwJLeHkeMJsbANJPoQEkAMC0AyFT0VYjMpdNNc6Rl2GqASXgFxXRCRqKAc2BdhQig6pIK4VSqDVcgG/zscb8YgllQAuLoBa6nfyP3nqMqnZ/85o41Z6VDABI35ciZv0FY49y84vlkgW8M3cvaJXWQ/4C3Hi90THTt9jwgLUbsKVt82E1dgPGNDUfxQMyNyBrAGLE+dmN69BM/xMHYBemutkDcg6w4wByH5jmXXCAGwcQarOoYjYLbUun3HFu6rJvXdkIdNr4or3bP3QePfS+6ewE5N6dwq+IyLhs66JHXdL4IaIqZWvwTqP012mtko7+RLmCUa862AvutVNeq99z/n2jKGDtQYfNe1a5GEE5a7dbjZP+TyW/TqNPMPUSATnWmhsAAAAASUVORK5CYII=',
                  }
  }
  var x = notifier;
  navigator.serviceWorker.controller.postMessage( notification )
};

navigator.serviceWorker.onmessage = function(messageEvent){
  console.log("Received message: ", messageEvent.data);
  if(messageEvent.data.clicked){
    window.focus();
    setTimeout(function(){
      var _timeout = prompt('Timer restarted. Specify new timeout (in minutes).');
      pauzetimer(_timeout);
    },0);
  }
}
})()