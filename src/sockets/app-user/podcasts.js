const socketAuthenticator = require('../../modules/common/interceptors/socket-interceptor');
const podcastSearchController = require('../../modules/podcasts/controllers/podcast-search');
const podcastsEvents = require('../../modules/podcasts/constants/podcast-events');

const { PODCAST_SEARCH, SUPER_ADMIN, ALL_ACCESS } = require('../../modules/common/constants/users/permissions')

module.exports = io => {

  // Listen for incoming socket connections on the 'so-podcasts' route
  let podcastsCon = io.of('/so-podcasts');
  podcastsCon.on('connect', socket => {
    socketAuthenticator.authenticateUser(socket, user => {
      // Check if user has permission
      const { privileges = [] } = user
      const hasPermission = [PODCAST_SEARCH, SUPER_ADMIN, ALL_ACCESS].some(perm => privileges.includes(perm))
      if (!hasPermission) {
        socket.emit(podcastsEvents.SEARCH_ERROR);
        socket.disconnect();
        return
      }

      privileges.includes(ALL_ACCESS)

      // Always disconnect whenever the search was sucessful or not
      if (user)
        podcastSearchController.performSearch(socket.handshake.query, socket, err => {
          if (err) {
            socket.emit(podcastsEvents.SEARCH_ERROR);
          }
          else {
            socket.emit(podcastsEvents.RESULTS_COMPLETE);
          }
          socket.disconnect();
        })
      else {
        socket.emit(podcastsEvents.SEARCH_ERROR);
        socket.disconnect();
      }
    })
  })
};