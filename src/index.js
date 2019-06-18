document.addEventListener("DOMContentLoaded", () => {
console.log("The DOM is loaded")

  const quoteList = document.querySelector('#quote-list')
  const newQuoteForm = document.querySelector('#new-quote-form')

  let quotesArray = []

  QUOTE_URL = "http://localhost:3000/quotes"
  URL = "http://localhost:3000/quotes?_embed=likes"
  LIKE_URL = "http://localhost:3000/likes"

  quoteList.addEventListener('click', event => {
    if(event.target.className === "btn-success") {
      let quoteId = parseInt(event.target.dataset.id)
      let likeNum = event.target.querySelector('span').innerText
      let actualNum = parseInt(likeNum)
      actualNum++
      event.target.querySelector('span').innerText = actualNum

      fetch(LIKE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: actualNum,
          quoteId: quoteId

        })
      }).then(rsp => rsp.json())
        .then(like => console.log(like))
        /// Not sure what to do here, but I know I need it needs to get to stay in the database
        /// Turns out that I don't have to do jack-shit here
    } else if (event.target.className === "btn-danger") {
      let quoteId = parseInt(event.target.dataset.id)
      let selectedCard = event.target.parentElement.parentElement
      selectedCard.remove()

      fetch(`${QUOTE_URL}/${quoteId}`, {
        method: "DELETE"
      })
    }

    // listen for the Clickin
    // access the integer in the innerHTML
    // increment or add one
    // save the input and post it to the database
  })

  newQuoteForm.addEventListener('submit', event => {
    event.preventDefault()
    const quoteInput = document.querySelector('#new-quote').value
    const quoteAuthor = document.querySelector('#author').value

    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quote: quoteInput,
        author: quoteAuthor
      })
    }).then(rsp => rsp.json())
      .then(quote => {
        quoteList.innerHTML += `
        <li class='quote-card'>
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button data-id="${quote.id}" class='btn-success'>Likes: <span>0</span></button>
            <button data-id="${quote.id}" class='btn-danger'>Delete</button>
          </blockquote>
        </li>
        `
      })
  })



  function renderQuotes(quotes) {
    quotes.forEach( quote => {
      quoteList.innerHTML += `
      <li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button data-id="${quote.id}"class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button data-id="${quote.id}"class='btn-danger'>Delete</button>
        </blockquote>
      </li>
      `
    })
  }

  function fetchQuotes() {
    return fetch(URL)
    .then(rsp => rsp.json())
    .then(quotes => {
      console.log(quotes)
      renderQuotes(quotes)})

    }
  fetchQuotes()
})
