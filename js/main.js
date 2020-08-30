$(function () {
  let questionList = []
  const questionChoices = []
  let answerArray = []
  const apiKey = process.env.TMDB_API_KEY
  const trendingMovieUrl = "https://api.themoviedb.org/3/trending/movie/day"
  const trendingTvUrl = "https://api.themoviedb.org/3/trending/tv/day"
  const trendingPeopleUrl = "https://api.themoviedb.org/3/trending/person/day"
  const imageUrl = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/"
  let quizScore = 0

  //initial hide of quiz container
  $('.quiz-container').hide()

  $("#see-results").click(() => {
    $(".choices").each(function(index) {
      const $selectedChoice = $("input:checked")
      // console.log($(this).find($selectedChoice).attr("id"))
      const currentId = $(this).find($selectedChoice).attr("id")
      // console.log(`Current ID - ${currentId}`)
      const correctId = $(this).find("input").first().attr("name")
      // console.log(`Correct ID - ${correctId}`)
      console.log(currentId === correctId)


      if (currentId === correctId) {
        // console.log("selected correct answer")
        $(this).find($selectedChoice).parent().attr("class", "answer-choice fa fa-check fa-2x container p-6 flex flex-col items-stretch text-center bg-green-200 justify-between font-sans");
        quizScore++
        console.log(quizScore)
      } else {
        // console.log("selected incorrect answer")
        //adds CSS style to incorrect selection
        $(this).find($selectedChoice).parent().attr("class", "answer-choice fa fa-times fa-2x container p-6 flex flex-col items-stretch text-center bg-red-200 justify-between font-sans")
        //adds CSS style to choice with correct ID
        $(this).find("#" + correctId).parent().attr("class", "answer-choice fa fa-check fa-2x container p-6 flex flex-col items-stretch text-center bg-green-200 justify-between font-sans")
      }
    })
  })

  $("#home").click(() => {
    window.location.reload()
    // $('.home-container').show()
    // $('.quiz-container').hide()
  })

  $("#movie-link").click(() => {
    $('.home-container').hide()
    $('.quiz-container').hide()
    $('.quiz-container').show()
    trendingMovies()
  })

  $("#tv-link").click(() => {
    $('.home-container').hide()
    $('.quiz-container').hide()
    $('.quiz-container').show()
    trendingTvShows();
  })

  $("#people-link").click(() => {
    $('.home-container').hide()
    $('.quiz-container').hide()
    $('.quiz-container').show()
    trendingPeople();
  })

  $("#reset").click(() => {
    location.reload()
  })

  updateUi()


  function trendingMovies() {
    //console.log('making API call to movies')
    axios.get(trendingMovieUrl, {
      params: {
        api_key: apiKey
      }
    })
    .then((response) => {
      //console.log(response)
      const movies = response.data.results
      questionList = []
      return createQuestions(movies, 'movie')
    })

  }

  function trendingTvShows() {
    //console.log('making API call to tv')
    axios.get(trendingTvUrl, {
      params: {
        api_key: apiKey
      }
    })
    .then((response) => {
      //console.log(response)
      const shows = response.data.results
      questionList = []
      return createQuestions(shows, 'tv')
    })
  }

  function trendingPeople() {
    //console.log('making API call to people')
    axios.get(trendingPeopleUrl, {
      params: {
        api_key: apiKey
      }
    })
    .then((response) => {
      //console.log(response)
      const people = response.data.results
      questionList = []
      return createQuestions(people, 'people')
    })
  }

  function createQuestions(results, quizType) {
    //lojack to shuffle the parameter passed into function
    const shuffledResults = _.shuffle(results)
    // console.log(shuffledResults)
    //iterate through the array
    //structure - [[],[],[],[],[]]
    let question = []
    shuffledResults.forEach((result, index) => {
      //create an empty question array and store 4 numbers in an inner array unitl all possibilities are in an array
      //group every 4 elements in their own array
      question.push(result)
      if ((index + 1) % 4 === 0) {
        questionList.push(question)
        question = []
      }
    })
    updateUi(quizType)
    return questionList
  }

  function updateUi(quizType) {
    $('.question-list').html('')
    //4 choices for each question; 5 questions
    //loop through the questionList array to pull the 4 properties for title
    //prints the amount of arrays there are
    questionList.forEach((questions) => {

      let questionHtml
      if (quizType === 'people') {
        questionHtml = processPeopleQuestion(questions)
      } else if (quizType === 'movie') {
        questionHtml = processMovieQuestion(questions)
      } else if (quizType === 'tv') {
        questionHtml = processTvQuestion(questions)
      }
      $(".question-list").append(questionHtml)
    })
  }

  //****MOVIE quiz functions*****
  function processMovieQuestion(movies) {
    //select a random movie to be the correct movie
    const selectedMovie = _.sample(movies)
    //console.log(selectedMovie)
    answerArray.push(selectedMovie.id)
    const choicesHtml = movies.map((movie) => {
      return buildMovieAnswerChoiceHtml(movie.title,movie.id,movie.poster_path,selectedMovie.id)
    }).join('')
    //console.log(choicesHtml)
    return buildMovieQuestionHtml(selectedMovie.overview, choicesHtml)
  }

  function buildMovieAnswerChoiceHtml (movieTitle,movieId,movieImage,selectedMovieId) {
    return (
      `<div class="container p-6 flex flex-col items-stretch text-center hover:bg-orange-200 justify-between">
        <span class='answer-choice-label'>
          <img class="choice-image rounded-t-lg" src="${imageUrl}${movieImage}">
          </img>
        </span>
        <span class="py-2 font-sans">
          ${movieTitle}
        </span>
        <input type="radio" class="choice-button checked:bg-gray-900 checked:border-transparent self-center" name="${selectedMovieId}" id="${movieId}">
      </div>
      `
    )
  }

  function buildMovieQuestionHtml(movieOverview, answerChoicesHtml) {
    return (
      `<div class="question-container border-double border-4 border-gray-600 flex flex-col p-4 mb-4">
      <p class="question underline uppercase text-2xl">
        Movie Overview -
      </p>
      <p class="p-4 justify-center">
        ${movieOverview}
      </p>

        <div class="choices-container">
          <div class="choices-header font-bold">
            Select One Movie:
              <div class="choices flex justify-center flex-col sm:flex-row align-baseline">
                ${answerChoicesHtml}
              </div>
          </div>
        </div>
      </div>`
    )
  }

  //****TV quiz functions*****
  function processTvQuestion(shows) {
    //select a random movie to be the correct movie
    const selectedShow = _.sample(shows)
    // console.log(selectedShow)
    answerArray.push(selectedShow.id)
    const choicesHtml = shows.map((show) => {
      return buildTvAnswerChoiceHtml(show.name,show.id,show.poster_path,selectedShow.id)
    }).join('')
    // console.log(choicesHtml)
    return buildTvQuestionHtml(selectedShow.overview, choicesHtml)
  }

  function buildTvAnswerChoiceHtml (showName,showId,showImage,selectedShowId) {
    return (
      `<div class="container p-6 flex flex-col items-stretch text-center hover:bg-orange-200 justify-between">
        <span class='answer-choice-label'>
          <img class="choice-image rounded-t-lg" src="${imageUrl}${showImage}">
          </img>
        </span>
        <span class="py-2 font-sans">
          ${showName}
        </span>
        <input type="radio" class="choice-button checked:bg-gray-900 checked:border-transparent self-center" name="${selectedShowId}" id="${showId}">
      </div>
      `
    )
  }

  function buildTvQuestionHtml(showOverview, answerChoicesHtml) {
    return (
      `<div class="question-container border-double border-4 border-gray-600 flex flex-col p-4 mb-4">
        <p class="question underline uppercase text-2xl">
          Show Overview -
        </p>
        <p class="p-4 justify-center">
          ${showOverview}
        </p>
        <div class="choices-container">
          <div class="choices-header font-bold">
            Select One Show:
              <div class="choices flex flex-row">
                ${answerChoicesHtml}
              </div>
          </div>
        </div>
      </div>`
    )
  }

  //****PEOPLE quiz functions*****
  function processPeopleQuestion(people) {
    //select a random movie to be the correct movie
    const selectedPerson = _.sample(people)
    answerArray.push(selectedPerson.id)
    const choicesHtml = people.map((person) => {
      return buildPeopleAnswerChoiceHtml(person.name,person.id,person.known_for_department,person.profile_path,selectedPerson.id)
    }).join('')
    return buildPeopleQuestionHtml(selectedPerson.known_for[0].title,selectedPerson.known_for[0].overview,selectedPerson.known_for[1].title,selectedPerson.known_for[1].overview,selectedPerson.known_for[2].title,selectedPerson.known_for[2].overview, choicesHtml)
  }

  function buildPeopleAnswerChoiceHtml (personName,personId,personKnownFor,personImage,selectedPersonId) {
    return (
      `<div class="container p-6 flex flex-col items-stretch text-center hover:bg-orange-200 justify-between">
        <span class='answer-choice-label'>
          <img class="choice-image rounded-t-lg" src="${imageUrl}${personImage}">
          </img>
        </span>
        <span class="py-2 font-sans">
          ${personName}
        </span>
        <input type="radio" class="choice-button checked:bg-gray-900 checked:border-transparent self-center" name="${selectedPersonId}" id="${personId}">
      </div>`
    )
  }

  function buildPeopleQuestionHtml(personKnownForZero,movieOverviewZero,personKnownForOne,movieOverviewOne,personKnownForTwo,movieOverviewTwo, answerChoicesHtml) {
    return (
      `<div class="question-container border-double border-4 border-gray-600 flex flex-col p-4 mb-4">
        <p class="question underline uppercase text-2xl">
          This person is associated with -
        </p>
        <ol class="flex flex-col p-4">
          <li>
            <span class="text-lg font-semibold uppercase justify-start">
              ${personKnownForZero}
            </span>
            <p class="pl-4 italic">${movieOverviewZero}</p>
          </li>
          <li>
            <span class="text-lg font-semibold uppercase justify-start">
              ${personKnownForOne}
            </span>
            <p class="pl-4 italic">${movieOverviewOne}</p>
          </li>
          <li>
            <span class="text-lg font-semibold uppercase justify-start">
              ${personKnownForTwo}
            </span>
            <p class="pl-4 italic">${movieOverviewTwo}</p>
          </li>
        </ol>
        <div class="choices-container">
          <div class="choices-header font-bold">
            Select One Person:
              <div class="choices flex justify-center flex-col sm:flex-row align-baseline">
                ${answerChoicesHtml}
              </div>
          </div>
        </div>
      </div>`
    )
  }
})
