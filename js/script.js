const LikeButtonClick = e => {
	let articleElement = e.srcElement.parentElement;
	if(e.srcElement.classList.contains("fa")){
		articleElement = e.srcElement.parentElement.parentElement;
	}
	const likeCountElement = articleElement.querySelector('#like-count');
	const articleId = articleElement.getAttribute('data-article-id');
	let storageKey = 'likes-' + articleId;
	let storageVal = parseInt(localStorage.getItem(storageKey)) || 0;

	storageVal++;
	likeCountElement.textContent = storageVal;
	localStorage.setItem(storageKey, storageVal);
}

const DislikeButtonClick = e => {
	let articleElement = e.srcElement.parentElement;
	if(e.srcElement.classList.contains("fa")){
		articleElement = e.srcElement.parentElement.parentElement;
	}
	const dislikeCountElement = articleElement.querySelector('#dislike-count');
	const articleId = articleElement.getAttribute('data-article-id');
	let storageKey = 'dislikes-' + articleId;
	let storageVal = parseInt(localStorage.getItem(storageKey)) || 0;

	storageVal++;
	dislikeCountElement.textContent = storageVal;
	localStorage.setItem(storageKey, storageVal);
}

const InitLikesAndDislikes = articleElement => {
	const articleId = articleElement.getAttribute('data-article-id');

	const likeCountElement = articleElement.querySelector('#like-count');
	let storageKey = 'likes-' + articleId;
	let storageVal = parseInt(localStorage.getItem(storageKey)) || 0;
	likeCountElement.textContent = storageVal;

	const dislikeCountElement = articleElement.querySelector('#dislike-count');
	storageKey = 'dislikes-' + articleId;
	storageVal = parseInt(localStorage.getItem(storageKey)) || 0;
	dislikeCountElement.textContent = storageVal;
}

function openLeftSidebar() {
	document.getElementById("sidebar").style.left = "0px";
	// document.querySelector(".left-sidebar").style.left = "0";
}
function closeLeftSidebar() {
	// document.querySelector(".left-sidebar").style.left = "-250px";
	document.getElementById("sidebar").style.left = "-250px";
}

const IncludeFromHtml = () => {
	let includeElement = document.querySelector(".js-include-html");
	if (includeElement !== null) {
		let htmlFile = includeElement.getAttribute("data-filename");
		if (htmlFile) {
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status == 200) { includeElement.innerHTML = this.responseText; }
					includeElement.classList.remove("js-include-html");
					IncludeFromHtml();
				}
			}
			xhttp.open("GET", htmlFile, true);
			xhttp.send();
		}
	}
}

const IncludeFromJSON = () => {
	let includeElement = document.querySelector(".js-include-json");
	if (includeElement !== null) {
		let htmlFile = includeElement.getAttribute("data-filename");
		if (htmlFile) {
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status == 200) {
						let output = "";
						const response = JSON.parse(this.responseText);
						response.forEach(article => {
							output += `<div class="container article-world" data-article-id="${article.id}">
								<h2>${article.title}</h2>
								<img class="image" src="${article.imageUrl}" alt="${article.imageText}">
								<p class="description">${article.description}</p>
								<button id="like-button"><i class="fa fa-thumbs-up"></i> Like</button>
								<button id="dislike-button"><i class="fa fa-thumbs-down"></i> Dislike</button>
								<div>
									<span id="like-count">0</span> likes,
									<span id="dislike-count">0</span> dislikes
								</div>
							</div>`;
						});
						includeElement.innerHTML = output;

						document.querySelectorAll("#like-button").forEach(item => item.addEventListener("click", LikeButtonClick));
						document.querySelectorAll("#dislike-button").forEach(item => item.addEventListener("click", DislikeButtonClick));
						document.querySelectorAll(".article-world").forEach(article => InitLikesAndDislikes(article));

					}
					includeElement.classList.remove("js-include-json");
					IncludeFromJSON();
				}
			}
			xhttp.open("GET", htmlFile, true);
			xhttp.send();
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	IncludeFromHtml();
	IncludeFromJSON();
});