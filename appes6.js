class Book {
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
class Ui {
    addBookToList(book){
        const list = document.getElementById('book-list');
        // create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }

    showAlert(message, className){
        // create div
    const div = document.createElement('div');
    // add classes
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(message));
    // get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // insert alert
    container.insertBefore(div, form);
    // timeout after 3s
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
};
// local storage class
class Store{
   static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
        return books;
    }
   static displayBooks(){
    const books = Store.getBooks();
    books.forEach(book => {
        const ui = new Ui;
        // add book to ui
        ui.addBookToList(book);
    });
    }
   static addBook(book){
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
    }
   static removeBook(isbn){
    const books = Store.getBooks();
    books.forEach((book, index) => {
        if(book.isbn === isbn){
            books.splice(index, 1);
        }

    });
    localStorage.setItem('books', JSON.stringify(books));
    }

}
// dom load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);
// event listeners
document.getElementById('book-form').addEventListener('submit', function(event){
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    // instantiate book
    const book = new Book(title, author, isbn);

    // instantiate ui
    const ui = new Ui();
    //validate
    if(title === '' || author === '' || isbn === ''){
        // error alert
        ui.showAlert('Please fill in all fields', 'error')
    } else {
        // add book to list
        ui.addBookToList(book);
        // add to ls
        Store.addBook(book);
        // show success
        ui.showAlert('Book Added', 'success');
        // clear fields
        ui.clearFields();
    }

    event.preventDefault();
});
// event listener for delete
document.getElementById('book-list').addEventListener('click', function(event){
   
    // instantiate ui
    const ui = new Ui();
    // delete book
    ui.deleteBook(event.target);
    // remove from ls
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
    // show message 
    ui.showAlert('Book Removed', 'success');



    event.preventDefault();
})