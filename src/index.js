const QUOTE_URL = 'http://localhost:3000/quotes'
const LIKE_URL = 'http://localhost:3000/likes'
let QUOTE_ARR = []
let selectedQuoteId = null

//DOM ELEMS
const quoteUl = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')

init()

//EVENT LISTENERS
newQuoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let newQuote = e.target[0].value;
    let newAuthor = e.target[1].value;
    
    fetch(QUOTE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "quote": newQuote,
            "author": newAuthor
        })
    })
    .then(res => res.json())
    .then(quote => {
        QUOTE_ARR.push(quote);
        quoteUl.appendChild(renderQuote(quote));
        newQuoteForm.reset();
        console.log(QUOTE_ARR)
    })
})

quoteUl.addEventListener('click', (e) => {
    if(e.target.className === 'btn-danger') {
        let selectedCard = e.target.parentElement.parentElement
        let quoteId = parseInt(selectedCard.dataset.id)
        selectedCard.remove()
        fetch(`${QUOTE_URL}/${quoteId}`, {
            method: 'DELETE'
        })
        console.log(QUOTE_ARR)
    }
    if(e.target.className === 'btn-success') {
        let selectedCard = e.target.parentElement.parentElement
        let quoteId = parseInt(selectedCard.dataset.id)
        ++e.target.lastElementChild.innerText

        fetch(LIKE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'quoteId': quoteId
            })
        })
    }
})

//RENDER FUNCTIONS
function renderQuote(quote) {
    const quoteLi = document.createElement('li');
    quoteLi.className = 'quote-card';
    quoteLi.dataset.id = `${quote.id}`;
    quoteLi.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>0</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>
    `
    return quoteLi;
}

function renderQuotes(quotes) {
    let quoteList = quotes.forEach(quote =>{
        quoteUl.appendChild(renderQuote(quote))
    })
    return quoteList;
}

//INIT
function init() {
    fetch(QUOTE_URL)
    .then(res => res.json())
    .then(quotes => {
        QUOTE_ARR = quotes
        renderQuotes(QUOTE_ARR);
    })
} 