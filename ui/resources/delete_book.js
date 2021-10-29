// delete book
delete_book = async () => {
	enable_disable() 
	_delete_book.style.display = 'block';
	
	try {
		await fetch("http://localhost:3000/books")								
			.then(response => response.json()) // read response body and parse as JSON
			.then(data => {
				const number_of_books = data.length;
				_delete_books.innerHTML = "<table id='delete_books' class='books'>" +
										  "<tr><th>Title</th><th>Author</th><th>Published" +
										  "</th><th>Pages</th></tr></table>";
		
				for ( i = 0; i < number_of_books; i++ ){
					_delete_books.innerHTML += "<tr onClick='delete_window(" + data[i].isbn + ")'><td>" + 
										data[i].title + "</td><td>" + 
										data[i].author + "</td><td>" + 
										data[i].published + "</td><td>" + 
										data[i].pages + "</td></tr>";
				}
			});		
	} catch {

	}		
}

delete_window = (isbn) => {
	let url = "http://localhost:3000/books";
	let isbn_string = isbn.toString()
	let _isbn = {
		"isbn": isbn_string
	};

	try {
		fetch(url, {
			method: 'delete',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(_isbn)
		}).then(res => res.json())
		  .then(res => {
			document.getElementById("alert").innerHTML = res.success;
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
	} catch {
	}
}