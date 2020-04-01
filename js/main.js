$(function () {
  console.log($("#movie").text())
  const questionList = []
  const questionChoices = []
  const apiKey = "768202ad02f0dc8a03660578ed2c5f4d"
  const trendingMovieUrl = "https://api.themoviedb.org/3/trending/movie/week"
  //add anonymous arrow function for next button
  $("#next").click(()=> {
    console.log("next")
  })
  //add anonymous arrow function for previous button
  $("#previous").click(()=> {
    console.log("previous")
    $(this).css("background","red")
  })

  trendingMovies()

  function trendingMovies() {
    $.ajax({
      url: trendingMovieUrl,
      type: "GET",
      data:{api_key:apiKey}
    })
    .done((response) => {
      const movies = response.results
    //  console.log(response)

      console.log(movies)
      //$("#movie").text(output)

      createQuestions(movies)
    })
    .fail(() => {
      alert("an error occured")
    })
  }
  function createQuestions(results) {
    const shuffledResults = _.shuffle(results)
    console.log(shuffledResults)
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
    //4 choices for each question; 5 questions
    //loop through the questionList array to pull the 4 properties for title
    //prints the amount of arrays there are
    let questionChoices = []
    console.log(choices.length)
    //loops through input arrays to print object
    for(i=0;i<choices.length;i++) {
      let questionChoices = choices[i]
      console.log(questionChoices)
      const movieHtml =
        `
        <input type="radio" name="movie" id="movie">
        <span class='answer-choice-label'>$(questionChoices)</span>
        `
      //random selection from each array for answer
      const answer = _.sample(questionChoices)
      $(".question").text(answer.overview)
      console.log(answer.overview)

      //loops through and provide template literals
      for(index=0;index<questionChoices.length;index++) {
        let results = questionChoices[index].title
        console.log(results)

      }

    }
  }
})
