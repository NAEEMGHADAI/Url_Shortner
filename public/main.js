let copy = document.querySelectorAll(".copy");

let del = document.querySelectorAll(".delete");
copy.forEach((element) => {
	element.addEventListener("click", copyFunction);
});
del.forEach((element) => {
	element.addEventListener("click", deleteFunction);
});

function copyFunction() {
	let value = this.parentNode.parentNode.childNodes[3].childNodes[1].innerText;
	console.log(this.parentNode.parentNode.childNodes[3].childNodes[1].innerText);
	navigator.clipboard.writeText(value);
	alert("Copied the text: " + value);
}

async function deleteFunction() {
	let value = this.parentNode.parentNode.childNodes[3].childNodes[1].href;
	let short = value.slice(-9);
	console.log(value.slice(-9));
	await fetch(`/delete`, {
		method: "delete",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify({
			shortUrl: short,
		}),
	});
	location.reload();
}
