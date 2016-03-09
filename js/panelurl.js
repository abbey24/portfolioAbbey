// $('body').on('panelsnap:activate', function($panel) {
//   var new_url = '/' + $panel.data('panel');
//   if(History.getState().url !== new_url) {
//     History.pushState(null, null, new_url);
//   }
// });
//
// // Snap to panel when a state is present:
// jQuery(function($) {
//   var current_url = History.getState().url;
//   if(current_url !== '') {
//     $target = $('body').panelSnap('getPanel', '[data-panel=' + current_url.replace('/','') + ']');
//     $('body').panelSnap('snapToPanel', $target);
//   }
// });
