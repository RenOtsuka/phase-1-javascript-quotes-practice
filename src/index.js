function fetchQuotes(){
    fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(resp => resp.json())
    .then(obj => loadQuotes(obj));
}


function loadQuotes(quoteObj){
    //console.log(quoteObj);

    const quoteList = document.getElementById('quote-list');
    quoteList.textContent = '';

    for(let key in quoteObj){
        let li = createQuote(quoteObj[key]);
        quoteList.appendChild(li);
    }

    const quoteForm = document.getElementById('new-quote-form');
    quoteForm.addEventListener('submit', e => {
        e.preventDefault();
        let quote = document.querySelector('#new-quote.form-control').value;
        let author = document.querySelector('#author.form-control').value;
        addNewQuote(quote, author);

    });
}


function createQuote(quoteObj){
    //console.log(quoteObj['likes']);
    const li = document.createElement('li');
    li.className = 'quote-card';

    const blockQuote = document.createElement('blockquote');
    blockQuote.className = 'blockquote';

    const pQuote = document.createElement('p');
    pQuote.className = 'mb-0';
    pQuote.textContent = quoteObj['quote'];

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.textContent = quoteObj['author'];

    const btnSuccess = document.createElement('button');
    btnSuccess.className = 'btn-success';
    if(quoteObj['likes'][0] !== undefined && typeof quoteObj['likes'][0]['quoteId'] === 'number'){
        btnSuccess.innerHTML = `Likes: <span>${quoteObj['likes'][0]['quoteId']}</span>`;
    }
    else if(quoteObj['likes'][0] !== undefined && typeof quoteObj['likes'][0]['quoteId'] === 'string'){
        btnSuccess.innerHTML = `Likes: <span>${parseInt(quoteObj['likes'][0]['quoteId'], 10)}</span>`;
    }
    else{
        btnSuccess.innerHTML = `Likes: <span>${0}</span>`;
    }
    
    
  
    const btnDanger = document.createElement('button');
    btnDanger.className = 'btn-danger';
    btnDanger.textContent = 'Delete';

    blockQuote.appendChild(pQuote);
    blockQuote.appendChild(footer);
    blockQuote.appendChild(document.createElement('br'));
    blockQuote.appendChild(btnSuccess);
    blockQuote.appendChild(btnDanger);
    li.appendChild(blockQuote);

    btnSuccess.addEventListener('click', () => createLike(quoteObj));
    btnDanger.addEventListener('click', () => deleteQuote(quoteObj));

    return li;
}

function addNewQuote(quote, author){
    fetch(`http://localhost:3000/quotes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            quote: quote,
            author: author,
        })
    })
    .then(resp => resp.json())
    .then(() => fetchQuotes());
}


function createLike(quoteObj){
    fetch(`http://localhost:3000/likes`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            quoteId: quoteObj.id
        })
    })
    .then(resp => resp.json())
    .then(() => fetchQuotes());
}


function deleteQuote(quoteObj){
   fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    })
   .then(resp => resp.json())
   .then(() => fetchQuotes());
}






document.addEventListener("DOMContentLoaded", () => {
    fetchQuotes();
});