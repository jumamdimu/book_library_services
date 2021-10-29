// list all books method
list_books = async () => {
	enable_disable()
	_list_books.style.display = 'block';
		
	try {
		await fetch("http://localhost:3000/books")								
			.then(response => response.json()) // read response body and parse as JSON
			.then(data => {
				_books.innerHTML = "<table id='books' class='books'>" +
										  "<tr><th>Title</th><th>Author</th><th>Published" +
										  "</th><th>Pages</th></tr></table>";				
				const number_of_books = data.length;
				for ( i = 0; i < number_of_books; i++ ){
					_books.innerHTML += "<tr onClick='display_window(" + data[i].isbn + ")'><td>" + data[i].title + "</td><td>" + 
										data[i].author + "</td><td>" + 
										data[i].published + "</td><td>" + 
										data[i].pages + "</td></tr>";
				}
			});		
	} catch {

	}
}

display_window = async (isbn) => {
	_list_books.style.display = 'none';
	_add_book.style.display = 'none';
	_update_book.style.display = 'none'; 
	_delete_book.style.display = 'none';
	_update_book_window.style.display = 'none';
	_display_book_window.style.display = 'block';
	
	let url = "http://localhost:3000/books/" + isbn;
	try {
		await fetch(url)								
		  .then(response => response.json()) // read response body and parse as JSON
		  .then(data => {						
					document.getElementById("display_isbn").innerHTML = data.isbn;
					document.getElementById("display_title").innerHTML = data.title;
					document.getElementById("display_subtitle").innerHTML = data.subtitle;
					document.getElementById("display_author").innerHTML = data.author;
					document.getElementById("display_published").innerHTML = data.published;
					document.getElementById("display_publisher").innerHTML = data.publisher;
					document.getElementById("display_pages").innerHTML = data.pages;
					document.getElementById("display_description").innerHTML = data.description;
					document.getElementById("display_website").innerHTML = data.website; 						
			});				  			  
	} catch {

	}	
}
