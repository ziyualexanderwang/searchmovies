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

    $( "#movies" ).autocomplete({
      source: getSource(),
      minLength: 2,
      select: getSelected
    });
  }

  function getSource() {
    var xhr;
    return function(request, response) {
      if (xhr) {
          xhr.abort();
      }
      xhr = $.ajax({
        url: 'https://api.themoviedb.org/3/search/multi',
        data: {
          query: request.term,
          api_key: "b70d60ef448699c6a28a7ab57fcb71e2"
        },
        dataType: 'json',
        success: function(data) {
          var lists = [];
          for (var i = 0; i < data.results.length; i++) {
            if (data.results[i].media_type === "movie") {
              data.results[i].label = data.results[i].title + '  -  ' + data.results[i].media_type;
              data.results[i].value = data.results[i].title + '  -  ' + data.results[i].media_type;
            } else if (data.results[i].media_type === "tv" || data.results[i].media_type === "person") {
              data.results[i].label = data.results[i].name + '  -  ' + data.results[i].media_type;
              data.results[i].value = data.results[i].name + '  -  ' + data.results[i].media_type;
              data.results[i].title = data.results[i].name;
            }

            lists.push(data.results[i]);
          }
          response(lists);
        },
        error: function() {
          response([]);
        }
      });
    }
  }

  function getSelected(event, ui) {
    if (ui.item) {
      var content = "";
      content += "<p style='text-align:center;'>" + ui.item.title + "</p>";
      if (ui.item.poster_path) {
        content += "<img src='" + configuration.images.secure_base_url + "original/" + ui.item.poster_path + "'></img>";
      }
      if (ui.item.media_type === "movie") {
        content += "<p>Release Date: " + ui.item.release_date + "</p>";
      } else if (ui.item.media_type === "tv") {
        content += "<p>First Air Date: " + ui.item.first_air_date + "</p>";
      } else if (ui.item.media_type === "person") {
        content += "<img style='width:200px;margin:auto;' src='" + configuration.images.secure_base_url + "original/" + ui.item.profile_path + "'></img>";
        for (var i = 0; i < ui.item.known_for.length; i++) {
          if (ui.item.known_for[i].media_type === "movie") {
            content += "<p style='text-align:center;'>Movie: " + ui.item.known_for[i].title + "  (" + ui.item.known_for[i].release_date + ")</p>";
          } else if (ui.item.known_for[i].media_type === "tv") {
            content += "<p style='text-align:center;'>TV: " + ui.item.known_for[i].name + "  (" + ui.item.known_for[i].first_air_date + ")</p>";
          }
        }
      }
      if (ui.item.overview) {
        content += "<p style='text-align:justify;'>" + ui.item.overview + "</p>";
      }
      $('#selectedMovie').empty().append(content); 
    }
  }

  $( "#movies" ).click(function() {
    $("#movies").val("");
  });

});