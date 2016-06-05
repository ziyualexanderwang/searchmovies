$(function() {

  var configuration = {};

  (function() {
    $.ajax({
      url: 'https://api.themoviedb.org/3/configuration?api_key=b70d60ef448699c6a28a7ab57fcb71e2',
      dataType: 'json',
      success: successConfig
    });
  })();

  function successConfig(data) {
    configuration = data;
  }
});
