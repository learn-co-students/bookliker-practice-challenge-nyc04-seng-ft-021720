document.addEventListener("DOMContentLoaded", function() {

let bookList = document.querySelector('#list')
let bookShow = document.querySelector('#show-panel')

let booksArray

function bookFetcher(){
    fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(book => {
        bookList.innerHTML = ""
        booksArray = book
        book.forEach(book=>bookAdder(book))
    })
}


function bookAdder(book){
    let bookItem = document.createElement('li')
    bookItem.dataset.id = book.id
    bookItem.innerText = book.title
    bookList.append(bookItem)
}

bookFetcher()

function bookShower(bookFound){
    bookShow.dataset.id = bookFound.id
    bookShow.innerHTML = `<h2> ${bookFound.title}</h2>
                          <img src=${bookFound.img_url}>
                          <p> ${bookFound.description} </p>
                          <p> Users who have liked this book: </p>`
    bookFound.users.forEach(user=> {
        bookShow.innerHTML = bookShow.innerHTML + `<p> <strong>${user.username}</p>`
    })
    

    if(bookFound.users.find(user => user.id === 1)){
        bookShow.innerHTML = bookShow.innerHTML + `<button id="like-btn"> no like </button>`
    }
    else{
    bookShow.innerHTML = bookShow.innerHTML + `<button id="like-btn"> Like </button>`
    }
}




bookList.addEventListener('click', e=>{
    let bookClicked =  parseInt(e.target.dataset.id)
    let bookFound = booksArray.find(book => book.id === bookClicked)
    bookShower(bookFound)
})

function bookLiker(users,bookID){
    fetch(`http://localhost:3000/books/${bookID}`,{
        method: 'PATCH',
        body: JSON.stringify({
            users
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(object => {
        bookFetcher()
        bookShower(object)
    })
}

bookShow.addEventListener('click', e=>{
    if(e.target.matches('#like-btn')){
        let bookID = parseInt(e.target.closest('div').dataset.id)
        let users = booksArray.find(book=>book.id === bookID).users
        if(users.find(user => user.id ===1)){
        let userFiltered = users.filter(user => user.id != 1)
        bookLiker(userFiltered, bookID)
        }
        else{
        users.push({"id":1, "username":"pouros"})
        bookLiker(users, bookID)}
    }
})


});


