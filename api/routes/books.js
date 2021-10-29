const express = require('express')
const router = express.Router()

const redis = require('redis');

const { redisPort } = require('../config');
const client = redis.createClient( redisPort );

const sequelize = require('../db/database')
const Book = require('../models/Book')

const {check, validationResult, body} = require('express-validator');

sequelize.sync().then(() => console.log("Database connection has been established successfully.."))

// Cache middleware
const cacheOneBook = (req, res, next) => {
    const isbn = req.params.isbn
  
    client.get(isbn, (err, data) => {
      if (err) throw err;
      if (data !== null) {
          return res.send(data) 
      } else {
        next();
      }
    });
}

// Cache middleware
const cacheAllBooks = (req, res, next) => {
    const books = "books"
  
    client.get(books, (err, data) => {
      if (err) throw err;
      if (data !== null) {
          return res.send(data) 
      } else {
        next();
      }
    });
}

const resetCachedData = () => { 
    client.get("books", async (err, data) => {
        if (data !== null) {
            const books = await Book.findAll()
            // Set data to Redis
            client.setex("books", 60, JSON.stringify(books))
        } 
    });
}

// const validateUserInput = (req, isbn, title, pages, subtitle, author, published, publisher, description, website) => {
const validateUserInput = (req) => {
    const isbn = req.body.isbn
    const title = req.body.title
    const pages = req.body.pages
    const subtitle = req.body.subtitle
    const author = req.body.author
    const publisher = req.body.publisher
    const description = req.body.description
    const published = req.body.published
    const website = req.body.website 

    let error_message = ""
    if (isNaN(pages)) { error_message += "Number of pages must be numbers..<br>" }
    else if ( parseInt(pages) > 2500 || parseInt(pages) < 4 ) { error_message += "Minimum 5 and Maximum 2500 number of pages allowed in pages..<br>" }
    if ( title.length > 250 || title.length < 4 ) { error_message += "Minimum 4 and Maximum 250 characters allowed in title..<br>" }
    if ( subtitle.length > 250 ) { error_message += "Maximum 250 characters allowed in subtitle..<br>" }
    if ( author.length > 250 || author.length < 4 ) { error_message += "Minimum 4 and Maximum 250 characters allowed in author..<br>" }
    if ( publisher.length > 250 || publisher.length < 4 ) { error_message += "Minimum 4 and Maximum 250 characters allowed in publisher.<br>" }
    if ( isbn.length > 13 || isbn.length < 13 ) { error_message += "ISBN should contain only 13 characters..<br>" }
    if ( description.length > 1000 || description.length < 4 ) { error_message += "Minimum 4 and Maximum 1000 characters allowed in description..<br>" }
    if ( website.length > 250 || website.length < 4 ) { error_message += "Minimum 4 and Maximum 250 characters allowed in website..<br>" }
    var d = new Date(published);
    if (Object.prototype.toString.call(d) === "[object Date]") {
        // it is a date
        if (isNaN(d.getTime())) {  
          error_message += "Published date must be a valid date..<br>"
        } 
    } else {
        error_message += "Published date must be a valid date..<br>"
    }
    return error_message
}

router.post('/', async (req, res) => { // http://localhost:3000

    const error_message = validateUserInput (req)

    if ( error_message == "" ) {
        try {
            await Book.create(req.body);
            const message = { "success" : "book has been added.." }
            return res.end(JSON.stringify(message));
        } catch {
            const message = { "success" : "input error, check all the fields or isbn exist.." }
            return res.end(JSON.stringify(message));
        }
    } else {
        const message = { "success" : error_message }
        return res.end(JSON.stringify(message));       
    }
})

// get the list of all books	
router.get('/', cacheAllBooks, async (req, res) => { // http://localhost:3000
    const books = await Book.findAll()
    // Set data to Redis
    client.setex("books", 60, JSON.stringify(books));
    res.send(books)
})

// get single book
router.get('/:isbn', cacheOneBook, async (req, res) => { // http://localhost:3000/books/9781484242216
    const requested_isbn = req.params.isbn
    const book = await Book.findOne({ where: { isbn: requested_isbn }})
    // Set data to Redis
    client.setex(requested_isbn, 60, JSON.stringify(book));
    res.send(book)
})

// update a single book
router.put('/:isbn', async (req, res) => { // http://localhost:3000/books/9781484242216
    const requested_isbn = req.params.isbn
    const updated_isbn = req.body.isbn
    const book = await Book.findOne({ where: { isbn: requested_isbn }})

    if ( updated_isbn != requested_isbn ) { 
        const book_isbn = await Book.count({ where: { isbn: updated_isbn }} )
            .then(count => {
                if (count > 0) { 
                    const message = { "success" : `There is another book with this isbn ${updated_isbn}` }
                    return res.end(JSON.stringify(message));                     
                }
            });
    }

    const error_message = validateUserInput (req)

    if ( error_message == "" ) {
        try {
            book.isbn = req.body.isbn
            book.title = req.body.title
            book.subtitle = req.body.subtitle
            book.author = req.body.author
            book.published = req.body.published
            book.publisher = req.body.publisher
            book.pages = req.body.pages
            book.description = req.body.description
            book.website = req.body.website 

            await book.save()
    
            // Set data to Redis
            client.setex(updated_isbn, 60, JSON.stringify(book))
        
            resetCachedData()
        
            const message = { "success" : "book updated.." }
            return res.end(JSON.stringify(message));

        } catch {
            const message = { "success" : "input error, check all the fields.." }
            return res.end(JSON.stringify(message));
        }
    } else {
        const message = { "success" : error_message }
        return res.end(JSON.stringify(message));       
    }
})

router.delete('/', async (req, res) => { 
    const requested_isbn = req.body.isbn
    await Book.destroy({ where: { isbn: requested_isbn } })

    resetCachedData()

    const message = { "success" : "book removed.." }
    return res.end(JSON.stringify(message));
})

module.exports = router