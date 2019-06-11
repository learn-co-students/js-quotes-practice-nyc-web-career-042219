// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", () => {
  console.log('%cI don\'t have friends. I have family.', 'color: cyan')

  //------- DOM ELEMENTS ---------//

  // const selectedQuoteId = null
  const BASE_URL = 'http://localhost:3000/quotes';
  const quoteList = document.querySelector('#quote-list');
  const quoteForm = document.querySelector('#new-quote-form');



  //-------- LOCAL STATE ----------//

  let quotes = [];


  //------- RENDER METHODS ---------//

  // function renderSingleQuote() {
  //   const selectedQuoteId = quotes.find(quote => {
  //     return quote.id === selectedQuoteId
  //   })
  // }

  function renderAllQuotes() {
    const li = document.createElement('li');
    quotes.forEach(quote => {
      li.innerHTML += `
      <li class='quote-card' data-id="${quote.id}">
      <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}
      <br>
      <button class='btn-success' data-id='${quote.id}'>Likes: <span>0</span></button>
      <button class='btn-danger' data-id='${quote.id}'>Delete</button>
      </blockquote>
      </li>
      `
    })
    quoteList.innerHTML = "";
    quoteList.appendChild(li);

  }


  //------- EVENT LISTENERS ---------//

//UPLOAD QUOTE
  quoteForm.addEventListener('submit', event => {
    event.preventDefault()

    let newQuote = event.target[0].value
    let newAuthor = event.target[1].value

    fetch(BASE_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify ({
        quote: newQuote,
        author: newAuthor
      })
    })
    .then(response => response.json())
    .then(newQuote =>{
      quotes.push(newQuote)
      renderAllQuotes();
    })
    event.target.reset()
  })

//DELETE QUOTE
quoteList.addEventListener('click', event => {
  quoteId = parseInt(event.target.dataset.id)
  if(event.target.className === 'btn-danger') {
    event.target.parentNode.parentNode.parentNode.remove()

    fetch(`${BASE_URL}/${quoteId}`, {
        method: "DELETE"})
        .then(console.log)

      } else if (event.target.className === 'btn-success'){
        like = event.target.childNodes[1];
        let likeNum = parseInt(event.target.childNodes[1].innerText);
        like.innerText = `${++likeNum}`;

        fetch('http://localhost:3000/likes', {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
            quoteId: quoteId,
            likes: likeNum })
          })
          .then(res => res.json())
          .then(console.log)
        }
    })


  //------- INITIALIZE PAGE ---------//

function fetchQuotes(){
  fetch(BASE_URL)
    .then(response => response.json())
    .then(quotesData => {
      console.log('initial response:', quotesData)
      quotes = quotesData

      renderAllQuotes()
    })
  }




fetchQuotes()
}) //END DOM CONTENT LISTENER
