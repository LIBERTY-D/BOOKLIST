import { select } from "./select.js";

let unique = "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// EDITS ELEMENTS
let editTitle = "";
let editAuthor = "";
let editIsbn = "";
let editQty = "";
let editId = "";
let edit = false;
class BookList {
  constructor(element) {
    this.element = element;
    this.title = select("#title");
    this.author = select("#author");
    this.isbn = select("#isbn");
    this.quantity = select("#quantity");
    this.parent = select("#body");
    // ADD EVENTS
    //edit
    this.parent.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-edit")) {
        const id = e.target.parentElement.parentElement.dataset.id;
        // remove from dom
        const title = e.target.parentElement.parentElement.children[0];
        const author = e.target.parentElement.parentElement.children[1];
        const isbn = e.target.parentElement.parentElement.children[2];
        const quantity = e.target.parentElement.parentElement.children[3];
        this.title.value = title.innerHTML;
        this.author.value = author.innerHTML;
        this.isbn.value = isbn.innerHTML;
        this.quantity.value = quantity.innerHTML;
        this.edit(id, title, author, isbn, quantity);
      }
    });
    //remove
    this.parent.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-trash")) {
        const id = e.target.parentElement.parentElement.dataset.id;
        this.remove(id);
        // remove from dom
        e.target.parentElement.parentElement.remove();
      }
    });
    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      let uniqueId = "";
      for (let i = 0; i <= 20; i++) {
        const randomNumbers = Math.floor(Math.random() * unique.length);
        uniqueId += unique.charAt(randomNumbers);
      }

      this.book(uniqueId, this.parent);
    });
  }
  //   ADD BOOK
  book(id, body) {
    const title = this.title.value;
    const author = this.author.value;
    const isbn = this.isbn.value;
    const quantity = format(parseInt(this.quantity.value));
    if (title && author && isbn && quantity && !edit) {
      const tableRow = document.createElement("tr");
      tableRow.setAttribute("data-id", id);
      tableRow.innerHTML = `
                    <td>${title}</td>
                    <td>${author}</td>
                    <td class="number">${isbn}</td>
                    <td>${quantity}</td>
                    <td><i class="fas fa-edit"></i></td>
                    <td><i class="fas fa-trash"></i></td>
                `;
      body.appendChild(tableRow);
      this.setToDefault();
      this.addToStorage(id, title, author, isbn, quantity);
    } else if (title && author && isbn && quantity && edit) {
      editTitle.innerHTML = title;
      editAuthor.innerHTML = author;
      editIsbn.innerHTML = isbn;
      editQty.innerHTML = quantity;
      let books = this.getStorage();
      books.map((book) => {
        if (book.id === editId) {
          book.title = title;
          book.author = author;
          book.isbn = isbn;
          book.quantity = quantity;
        }
      });
      localStorage.setItem("book", JSON.stringify(books));
      this.setToDefault();
    }
  }
  //   DiSPLAY TABLE    WHEN WINDOW LOADS
  display() {
    const parent = select("#body");
    let books = localStorage.getItem("book")
      ? JSON.parse(localStorage.getItem("book"))
      : [];
    books = books
      .map((book) => {
        const { id, title, author, isbn, quantity } = book;
        return `  <tr data-id="${id}">
                    <td>${title}</td>
                    <td>${author}</td>
                    <td class="number">${isbn}</td>
                    <td>${quantity}</td>
                    <td><i class="fas fa-edit"></i></td>
                    <td><i class="fas fa-trash"></i></td>
                </tr>`;
      })
      .join("");
    parent.innerHTML = books;
  }
  // ADD TO STORAGE

  addToStorage(id, title, author, isbn, quantity) {
    const items = { id, title, author, isbn, quantity };
    let book = localStorage.getItem("book")
      ? JSON.parse(localStorage.getItem("book"))
      : [];
    book.push(items);
    localStorage.setItem("book", JSON.stringify(book));
  }
  // GET STORAGE
  getStorage() {
    let booksStorage = localStorage.getItem("book");
    if (booksStorage) {
      booksStorage = JSON.parse(localStorage.getItem("book"));
    } else {
      booksStorage = [];
    }
    return booksStorage;
  }
  // EDIT
  edit(id, title, author, isbn, quantity) {
    edit = true;
    editTitle = title;
    editAuthor = author;
    editIsbn = isbn;
    editQty = quantity;
    editId = id;
  }
  // REMOVE

  remove(id) {
    //   remove storage
    let books = this.getStorage();
    books = books.filter((item) => item.id !== id);
    localStorage.setItem("book", JSON.stringify(books));
  }
  // default;
  setToDefault() {
    this.title.value = "";
    this.author.value = "";
    this.quantity.value = "";
    this.isbn.value = "";
    editTitle = "";
    editAuthor = "";
    editIsbn = "";
    editQty = "";
    edit = false;
    editId = "";
  }
}

const book = new BookList(select("form"));

// WINDOW LOADS
window.addEventListener("DOMContentLoaded", () => {
  book.display();
});
// Format Qty
function format(qty) {
  if (qty <= 0) {
    return (qty = 1);
  } else {
    return qty;
  }
}
