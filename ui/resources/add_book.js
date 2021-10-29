// add book method
add_book = () => {
	 enable_disable() 
	_add_book.style.display = 'block';
}
	
// submit_book method
submit_book = async () => {
	let isbn = document.getElementById("isbn").value;
	let title = document.getElementById("title").value;
	let subtitle = document.getElementById("subtitle").value;
	let author = document.getElementById("author").value;
	let published = document.getElementById("published").value;
	let publisher = document.getElementById("publisher").value;
	let pages = document.getElementById("pages").value;
	let description = document.getElementById("description").value;
	let website = document.getElementById("website").value;
	
	const book = {
		"isbn": isbn,
		"title": title,
		"subtitle": subtitle,
		"author": author,
		"published": published,
		"publisher": publisher,
		"pages": pages,
		"description": description,
		"website": website
	};

	try {
		await fetch('http://localhost:3000/books', {
			method: 'post',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(book)
		}).then(res => res.json())
		  .then(res => {
			document.getElementById("alert").innerHTML = res.success;
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		});
	} catch {
	}			
}