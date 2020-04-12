$(function () {
  let questionList = []
  const questionChoices = []
  let answerArray = []
  const apiKey = process.env.TMDB_API_KEY
  const trendingMovieUrl = "https://api.themoviedb.org/3/trending/movie/week"
  const trendingTvUrl = "https://api.themoviedb.org/3/trending/tv/week"
  const trendingPeopleUrl = "https://api.themoviedb.org/3/trending/person/week"
  const imageUrl = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/"
  let quizScore = 0

  $('.quiz-container').hide()

  //add anonymous arrow function for next button
  $("#see-results").click(() => {
    //console.log("results")
    $(".choices").each(function(index) {
      // // answerArray.includes(parseInt($('input[type=radio][name=${}]:checked').attr('id')))
      // var item1 = $( "li.item-1" )[ 0 ];
      // $( "li.item-ii" ).find( item1 ).css( "background-color", "red" );
      //$ as jQuery object(naming convention;best practice)
      const $selectedChoice = $("input:checked")
      console.log($(this).find($selectedChoice).attr("id"))
      const currentId = $(this).find($selectedChoice).attr("id")
      console.log(`Current ID - ${currentId}`)
      const correctId = $(this).find("input").first().attr("name")
      console.log(`Correct ID - ${correctId}`)
      console.log(currentId === correctId)

      if (currentId === correctId) {
        console.log("selected correct answer")
        $(this).find($selectedChoice).parent().attr("class", "answer-choice fa fa-check fa-2x")
      } else {
        console.log("selected incorrect answer")
        //adds CSS style to incorrect selection
        $(this).find($selectedChoice).parent().attr("class", "answer-choice fa fa-times fa-2x")
        //adds CSS style to choice with correct ID
        $(this).find("#" + correctId).parent().attr("class", "answer-choice fa fa-check fa-2x")
      }
    })
  })
  //add anonymous arrow function for previous button
  $("#go-back").click(() => {
    console.log('clicking home button')
    $('.home-container').show()
    $('.quiz-container').hide()
  })

  $("#movie-link").click(() => {
    // window.location.pathname = '/movie_quiz.html'
    // window.location.href = 'http://localhost:1234/movie_quiz.html'
    // window.onload = function() {
      // trendingMovies();
    // }
    console.log("go to movie quiz")
    trendingMovies()
    $('.home-container').hide()
    $('.quiz-container').show()
  })

  $("#tv-link").click(() => {
    // window.location.pathname = '/tv_quiz.html'
    // window.location.href = 'http://localhost:1234/tv_quiz.html'
    // window.onload = function() {
    $('.home-container').hide()
    $('.quiz-container').show()
    trendingTvShows();
    // }
    console.log("go to tv quiz")
  })

  $("#people-link").click(() => {
    $('.home-container').hide()
    $('.quiz-container').show()
    trendingPeople();
    // window.onclick = function() {
      // trendingTvShows();
    // }
    //console.log("go to people quiz")
  })

  $("#reset").click(() => {
    location.reload()
  })

  updateUi()


  function trendingMovies() {
    console.log('making API call to movies')
    axios.get(trendingMovieUrl, {
      params: {
        api_key: apiKey
      }
    })
    .then((response) => {
      console.log(response)
      const movies = response.data.results
      questionList = []
      return createQuestions(movies, 'movie')
    })

  }

  function trendingTvShows() {
    console.log('making API call to tv')
    axios.get(trendingTvUrl, {
      params: {
        api_key: apiKey
      }
    })
    .then((response) => {
      console.log(response)
      const shows = response.data.results
      questionList = []
      return createQuestions(shows, 'tv')
    })
  }

  function trendingPeople() {
    console.log('making API call to people')
    axios.get(trendingPeopleUrl, {
      params: {
        api_key: apiKey
      }
    })
    .then((response) => {
      console.log(response)
      const people = response.data.results
      questionList = []
      return createQuestions(people, 'people')
    })


    // $.ajax({
    //   url: trendingPeopleUrl,
    //   type: "GET",
    //   data: { api_key: apiKey }
    // })
    //   .done((response) => {
    //     const people = response.results
    //     //  console.log(response)
    //
    //     createQuestions(people)
    //   })
    //   .fail(() => {
    //     alert("an error occured")
    //   })

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
    // console.log(questionList)
    updateUi(quizType)
    return questionList
  }

  function updateUi(quizType) {
    $('.question-list').html('')
    console.log(questionList)
    //4 choices for each question; 5 questions
    //loop through the questionList array to pull the 4 properties for title
    //prints the amount of arrays there are
    questionList.forEach((questions) => {

      let questionHtml
      if (quizType === 'people') {
        questionHtml = processPeopleQuestion(questions)
      } else if (quizType === 'movie' || quizType === 'tv') {
        questionHtml = processQuestion(questions)
      }
      //console.log(questionHtml)
      $(".question-list").append(questionHtml)
    })
  }

  function processQuestion(movies) {
    //select a random movie to be the correct movie
    const selectedMovie = _.sample(movies)
    //console.log(selectedMovie)
    answerArray.push(selectedMovie.id)
    const choicesHtml = movies.map((movie) => {
      return buildAnswerChoiceHtml(movie.title,movie.id,movie.poster_path,selectedMovie.id)
    }).join('')
    //console.log(choicesHtml)
    return buildQuestionHtml(selectedMovie.overview, choicesHtml)
  }

  function buildAnswerChoiceHtml (movieTitle,movieId,movieImage,selectedMovieId) {
    return (
      `<div class="answer-choice">
        <input type="radio" class="choice-button" name="${selectedMovieId}" id="${movieId}">
        <span class='answer-choice-label'> <img class="choice-image" src="${imageUrl}${movieImage}"></img> ${movieTitle}</span>
      </div>`
    )
  }

  function buildQuestionHtml(movieOverview, answerChoicesHtml) {
    return (
      `<div class="question-container">
        <p class="question">
          Movie Overview -  ${movieOverview}
        </p>

        <div class="choices-container">
          <div class="choices-header">
            Choices:
              <div class="choices">
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
    console.log(selectedPerson)
    answerArray.push(selectedPerson.id)
    const choicesHtml = people.map((person) => {
      return buildPeopleAnswerChoiceHtml(person.name,person.id,person.known_for_department,person.profile_path,selectedPerson.id)
    }).join('')
    //console.log(choicesHtml)
    return buildPeopleQuestionHtml(selectedPerson.known_for[0].title,selectedPerson.known_for[0].overview,selectedPerson.known_for[1].title,selectedPerson.known_for[1].overview,selectedPerson.known_for[2].title,selectedPerson.known_for[2].overview, choicesHtml)
  }

  function buildPeopleAnswerChoiceHtml (personName,personId,personKnownFor,personImage,selectedPersonId) {
    return (
      `<div class="answer-choice">
        <input type="radio" class="choice-button" name="${selectedPersonId}" id="${personId}">
        <span class='answer-choice-label'> <img class="choice-image" src="${imageUrl}${personImage}"></img> ${personName}</span>
      </div>`
    )
  }

  function buildPeopleQuestionHtml(personKnownForZero,movieOverviewZero,personKnownForOne,movieOverviewOne,personKnownForTwo,movieOverviewTwo, answerChoicesHtml) {
    return (
      `<div class="question-container">
        <p class="question">
          This person is asscoiated with
        </p>
        <ol>
          <li>${personKnownForZero} - ${movieOverviewZero}</li>
          <li>${personKnownForOne} - ${movieOverviewOne}</li>
          <li>${personKnownForTwo} - ${movieOverviewTwo}</li>
        </ol>
        <div class="choices-container">
          <div class="choices-header">
            Choices:
              <div class="choices">
                ${answerChoicesHtml}
              </div>
          </div>
        </div>
      </div>`
    )
  }
})
