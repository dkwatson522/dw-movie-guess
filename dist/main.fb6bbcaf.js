// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/main.js":[function(require,module,exports) {
$(function () {
  var questionList = [];
  var questionChoices = [];
  var answerArray = [];
  var apiKey = "768202ad02f0dc8a03660578ed2c5f4d";
  var trendingMovieUrl = "https://api.themoviedb.org/3/trending/movie/day";
  var trendingTvUrl = "https://api.themoviedb.org/3/trending/tv/day";
  var trendingPeopleUrl = "https://api.themoviedb.org/3/trending/person/day";
  var imageUrl = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/"; //let quizScore = 0
  //initial hide of quiz container

  $('.quiz-container').hide();
  $("#see-results").click(function () {
    $(".choices").each(function (index) {
      var $selectedChoice = $("input:checked"); // console.log($(this).find($selectedChoice).attr("id"))

      var currentId = $(this).find($selectedChoice).attr("id"); // console.log(`Current ID - ${currentId}`)

      var correctId = $(this).find("input").first().attr("name"); // console.log(`Correct ID - ${correctId}`)
      // console.log(currentId === correctId)

      if (currentId === correctId) {
        // console.log("selected correct answer")
        $(this).find($selectedChoice).parent().attr("class", "answer-choice fa fa-check fa-2x");
      } else {
        // console.log("selected incorrect answer")
        //adds CSS style to incorrect selection
        $(this).find($selectedChoice).parent().attr("class", "answer-choice fa fa-times fa-2x"); //adds CSS style to choice with correct ID

        $(this).find("#" + correctId).parent().attr("class", "answer-choice fa fa-check fa-2x");
      }
    });
  });
  $("#home").click(function () {
    window.location.reload(); // $('.home-container').show()
    // $('.quiz-container').hide()
  });
  $("#movie-link").click(function () {
    $('.home-container').hide();
    $('.quiz-container').hide();
    $('.quiz-container').show();
    trendingMovies();
  });
  $("#tv-link").click(function () {
    $('.home-container').hide();
    $('.quiz-container').hide();
    $('.quiz-container').show();
    trendingTvShows();
  });
  $("#people-link").click(function () {
    $('.home-container').hide();
    $('.quiz-container').hide();
    $('.quiz-container').show();
    trendingPeople();
  });
  $("#reset").click(function () {
    location.reload();
  });
  updateUi();

  function trendingMovies() {
    //console.log('making API call to movies')
    axios.get(trendingMovieUrl, {
      params: {
        api_key: apiKey
      }
    }).then(function (response) {
      //console.log(response)
      var movies = response.data.results;
      questionList = [];
      return createQuestions(movies, 'movie');
    });
  }

  function trendingTvShows() {
    //console.log('making API call to tv')
    axios.get(trendingTvUrl, {
      params: {
        api_key: apiKey
      }
    }).then(function (response) {
      //console.log(response)
      var shows = response.data.results;
      questionList = [];
      return createQuestions(shows, 'tv');
    });
  }

  function trendingPeople() {
    //console.log('making API call to people')
    axios.get(trendingPeopleUrl, {
      params: {
        api_key: apiKey
      }
    }).then(function (response) {
      //console.log(response)
      var people = response.data.results;
      questionList = [];
      return createQuestions(people, 'people');
    });
  }

  function createQuestions(results, quizType) {
    //lojack to shuffle the parameter passed into function
    var shuffledResults = _.shuffle(results); // console.log(shuffledResults)
    //iterate through the array
    //structure - [[],[],[],[],[]]


    var question = [];
    shuffledResults.forEach(function (result, index) {
      //create an empty question array and store 4 numbers in an inner array unitl all possibilities are in an array
      //group every 4 elements in their own array
      question.push(result);

      if ((index + 1) % 4 === 0) {
        questionList.push(question);
        question = [];
      }
    });
    updateUi(quizType);
    return questionList;
  }

  function updateUi(quizType) {
    $('.question-list').html(''); //4 choices for each question; 5 questions
    //loop through the questionList array to pull the 4 properties for title
    //prints the amount of arrays there are

    questionList.forEach(function (questions) {
      var questionHtml;

      if (quizType === 'people') {
        questionHtml = processPeopleQuestion(questions);
      } else if (quizType === 'movie') {
        questionHtml = processMovieQuestion(questions);
      } else if (quizType === 'tv') {
        questionHtml = processTvQuestion(questions);
      }

      $(".question-list").append(questionHtml);
    });
  } //****MOVIE quiz functions*****


  function processMovieQuestion(movies) {
    //select a random movie to be the correct movie
    var selectedMovie = _.sample(movies); //console.log(selectedMovie)


    answerArray.push(selectedMovie.id);
    var choicesHtml = movies.map(function (movie) {
      return buildMovieAnswerChoiceHtml(movie.title, movie.id, movie.poster_path, selectedMovie.id);
    }).join(''); //console.log(choicesHtml)

    return buildMovieQuestionHtml(selectedMovie.overview, choicesHtml);
  }

  function buildMovieAnswerChoiceHtml(movieTitle, movieId, movieImage, selectedMovieId) {
    return "<div class=\"answer-choice\">\n        <input type=\"radio\" class=\"choice-button\" name=\"".concat(selectedMovieId, "\" id=\"").concat(movieId, "\">\n        <span class='answer-choice-label'> <img class=\"choice-image\" src=\"").concat(imageUrl).concat(movieImage, "\"></img> ").concat(movieTitle, "</span>\n      </div>");
  }

  function buildMovieQuestionHtml(movieOverview, answerChoicesHtml) {
    return "<div class=\"question-container\">\n        <p class=\"question\">\n          Movie Overview -  ".concat(movieOverview, "\n        </p>\n\n        <div class=\"choices-container\">\n          <div class=\"choices-header\">\n            Select One Movie:\n              <div class=\"choices\">\n                ").concat(answerChoicesHtml, "\n              </div>\n          </div>\n        </div>\n      </div>");
  } //****TV quiz functions*****


  function processTvQuestion(shows) {
    //select a random movie to be the correct movie
    var selectedShow = _.sample(shows); //console.log(selectedMovie)


    answerArray.push(selectedShow.id);
    var choicesHtml = shows.map(function (show) {
      return buildTvAnswerChoiceHtml(show.name, show.id, show.poster_path, selectedShow.id);
    }).join(''); //console.log(choicesHtml)

    return buildTvQuestionHtml(selectedShow.overview, choicesHtml);
  }

  function buildTvAnswerChoiceHtml(showName, showId, showImage, selectedShowId) {
    return "<div class=\"answer-choice\">\n        <input type=\"radio\" class=\"choice-button\" name=\"".concat(selectedShowId, "\" id=\"").concat(showId, "\">\n        <span class='answer-choice-label'> <img class=\"choice-image\" src=\"").concat(imageUrl).concat(showImage, "\"></img> ").concat(showName, "</span>\n      </div>");
  }

  function buildTvQuestionHtml(showOverview, answerChoicesHtml) {
    return "<div class=\"question-container\">\n        <p class=\"question\">\n          Show Overview -  ".concat(showOverview, "\n        </p>\n\n        <div class=\"choices-container\">\n          <div class=\"choices-header\">\n            Select One Show:\n              <div class=\"choices\">\n                ").concat(answerChoicesHtml, "\n              </div>\n          </div>\n        </div>\n      </div>");
  } //****PEOPLE quiz functions*****


  function processPeopleQuestion(people) {
    //select a random movie to be the correct movie
    var selectedPerson = _.sample(people);

    answerArray.push(selectedPerson.id);
    var choicesHtml = people.map(function (person) {
      return buildPeopleAnswerChoiceHtml(person.name, person.id, person.known_for_department, person.profile_path, selectedPerson.id);
    }).join('');
    return buildPeopleQuestionHtml(selectedPerson.known_for[0].title, selectedPerson.known_for[0].overview, selectedPerson.known_for[1].title, selectedPerson.known_for[1].overview, selectedPerson.known_for[2].title, selectedPerson.known_for[2].overview, choicesHtml);
  }

  function buildPeopleAnswerChoiceHtml(personName, personId, personKnownFor, personImage, selectedPersonId) {
    return "<div class=\"answer-choice\">\n        <input type=\"radio\" class=\"choice-button\" name=\"".concat(selectedPersonId, "\" id=\"").concat(personId, "\">\n        <span class='answer-choice-label'> <img class=\"choice-image\" src=\"").concat(imageUrl).concat(personImage, "\"></img> ").concat(personName, "</span>\n      </div>");
  }

  function buildPeopleQuestionHtml(personKnownForZero, movieOverviewZero, personKnownForOne, movieOverviewOne, personKnownForTwo, movieOverviewTwo, answerChoicesHtml) {
    return "<div class=\"question-container\">\n        <p class=\"question\">\n          This person is asscoiated with -\n        </p>\n        <ol>\n          <li><u>".concat(personKnownForZero, "</u>: ").concat(movieOverviewZero, "</li>\n          <li><u>").concat(personKnownForOne, "</u>: ").concat(movieOverviewOne, "</li>\n          <li><u>").concat(personKnownForTwo, "</u>: ").concat(movieOverviewTwo, "</li>\n        </ol>\n        <div class=\"choices-container\">\n          <div class=\"choices-header\">\n            Select One Person:\n              <div class=\"choices\">\n                ").concat(answerChoicesHtml, "\n              </div>\n          </div>\n        </div>\n      </div>");
  }
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62224" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map