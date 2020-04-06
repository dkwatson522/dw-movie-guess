$(function () {
  const questionList = []
  const questionChoices = []
  let answerArray = []
  const apiKey = "768202ad02f0dc8a03660578ed2c5f4d"
  const trendingMovieUrl = "https://api.themoviedb.org/3/trending/movie/week"
  const trendingTvUrl = "https://api.themoviedb.org/3/trending/tv/week"
  const trendingPeopleUrl = "https://api.themoviedb.org/3/trending/person/week"
  const imageUrl = "https://image.tmdb.org/t/p/w300_and_h450_bestv2/"
  let quizScore = 0
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
    window.location.href = 'index.html'
    // console.log("previous")
  })

  $("#movie-link").click(() => {
    window.location.href = 'movie_quiz.html'
    window.onload = function() {
      trendingMovies();
    }
    console.log("go to movie quiz")
  })

  $("#tv-link").click(() => {
    window.location.href = 'tv_quiz.html'
    window.onload = function() {
      trendingTvShows();
    }
    console.log("go to tv quiz")
  })

  $("#people-link").click(() => {
    window.location.href = 'people_quiz.html'
    window.onload = function() {
      trendingTvShows();
    }
    console.log("go to people quiz")
  })

  $("#reset").click(() => {
    location.reload()
    })

  trendingPeople()
  //trendingTvShows()


  function trendingPeople() {
    $.ajax({
      url: trendingPeopleUrl,
      type: "GET",
      data: { api_key: apiKey }
    })
      .done((response) => {
        const people = response.results
        //  console.log(response)

        createQuestions(people)
      })
      .fail(() => {
        alert("an error occured")
      })

  }

  function createQuestions(results) {
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
    console.log(questionList)

    updateUi(questionList)
  }

  function updateUi(choices) {
    console.log(choices)
    //4 choices for each question; 5 questions
    //loop through the questionList array to pull the 4 properties for title
    //prints the amount of arrays there are
    questionList.forEach((questions) => {
      const questionHtml = processQuestion(questions)
      //console.log(questionHtml)
      $(".question-list").append(questionHtml)
    })
  }

  function processQuestion(people) {
    //select a random movie to be the correct movie
    const selectedPerson = _.sample(people)
    console.log(selectedPerson)
    answerArray.push(selectedPerson.id)
    const choicesHtml = people.map((person) => {
      return buildAnswerChoiceHtml(person.name,person.id,person.known_for_department,person.profile_path,selectedPerson.id)
    }).join('')
    //console.log(choicesHtml)
    return buildQuestionHtml(selectedPerson.known_for[0].title,selectedPerson.known_for[1].title,selectedPerson.known_for[2].title, choicesHtml)
  }

  function buildAnswerChoiceHtml (personName,personId,personKnownFor,personImage,selectedPersonId) {
    return (
      `<div class="answer-choice">
        <input type="radio" class="choice-button" name="${selectedPersonId}" id="${personId}">
        <span class='answer-choice-label'> <img class="choice-image" src="${imageUrl}${personImage}"></img> ${personName}</span>
      </div>`
    )
  }

  function buildQuestionHtml(personKnownForZero,personKnownForOne,personKnownForTwo, answerChoicesHtml) {
    return (
      `<div class="question-container">
        <p class="question">
          This person is asscoiated with
        </p>
        <ol>
          <li>${personKnownForZero}</li>
          <li>${personKnownForOne}</li>
          <li>${personKnownForTwo}</li>
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
