const LikeButtonClick = e => {
	let articleElement = e.srcElement.parentElement;
	if (e.srcElement.classList.contains("fa")) {
		articleElement = e.srcElement.parentElement.parentElement;
	}
	const likeCountElement = articleElement.querySelector('#like-count');
	const articleId = articleElement.getAttribute('data-article-id');
	let newValue = GetLikesByArticleId(articleId) + 1;

	likeCountElement.textContent = newValue;
	SetLikesByArticleId(articleId,newValue);
}

const DislikeButtonClick = e => {
	let articleElement = e.srcElement.parentElement;
	if (e.srcElement.classList.contains("fa")) {
		articleElement = e.srcElement.parentElement.parentElement;
	}
	const dislikeCountElement = articleElement.querySelector('#dislike-count');
	const articleId = articleElement.getAttribute('data-article-id');
	let newValue = GetDislikesByArticleId(articleId) + 1;

	dislikeCountElement.textContent = newValue;
	SetDislikesByArticleId(articleId,newValue);
}

const GetLikesByArticleId = id => {
	const storageKey = 'likes-' + id;
	return parseInt(localStorage.getItem(storageKey)) || 0;
}

const SetLikesByArticleId = (id, value) => {
	const storageKey = 'likes-' + id;
	localStorage.setItem(storageKey, value);
}

const GetDislikesByArticleId = id => {
	const storageKey = 'dislikes-' + id;
	return parseInt(localStorage.getItem(storageKey)) || 0;
}

const SetDislikesByArticleId = (id, value) => {
	const storageKey = 'dislikes-' + id;
	localStorage.setItem(storageKey, value);
}

function openLeftSidebar() {
	document.getElementById("sidebar").style.left = "0px";
}
function closeLeftSidebar() {
	document.getElementById("sidebar").style.left = "-250px";
}

const IncludeFromHtml = () => {
	let includeElement = document.querySelector(".js-include-html");
	if (includeElement !== null) {
		let filename = includeElement.getAttribute("data-filename");
		let callbackFunction = includeElement.getAttribute("data-function");
		if (filename) {
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status == 200) {
						includeElement.innerHTML = this.responseText;
						if (callbackFunction) {
							eval(callbackFunction);
						}
					}
					includeElement.classList.remove("js-include-html");
					IncludeFromHtml();
				}
			}
			xhttp.open("GET", filename, true);
			xhttp.send();
		}
	}
}

const IncludeFromJSON = () => {
	// TODO Put defensive ....
	const urlParams = new URLSearchParams(window.location.search);
	let filterClass = urlParams.get("filter");
	if (!filterClass) {
		filterClass = "";
	}
	let filterId = urlParams.get("id");
	if (!filterId) {
		filterId = 0;
	}
	let includeElement = document.querySelector(".js-include-json");
	if (includeElement !== null) {
		let filename = includeElement.getAttribute("data-filename");
		if (filename) {
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status == 200) {
						let output = "";
						const response = JSON.parse(this.responseText);
						response.forEach(article => {
							var classes = article.class;
							if (classes.includes(filterClass)) {
								if(filterId==0 || article.id == filterId) {
									output += `<div class="container article-world ${article.class}" data-article-id="${article.id}">
												<h2 class = "article-title">${article.title}</h2>
												<img class="image" src="${article.imageUrl}" alt="${article.imageText}">
												<p class="description">${article.description}</p>
												<button id="like-button"><i class="fa fa-thumbs-up"></i> Like</button>
												<button id="dislike-button"><i class="fa fa-thumbs-down"></i> Dislike</button>
												<div>
													<span id="like-count">${GetLikesByArticleId(article.id)}</span> likes,
													<span id="dislike-count">${GetDislikesByArticleId(article.id)}</span> dislikes
												</div>
												</div>`;
								}
							}
						});
						includeElement.innerHTML = output;

						includeElement.querySelectorAll("#like-button").forEach(item => item.addEventListener("click", LikeButtonClick));
						includeElement.querySelectorAll("#dislike-button").forEach(item => item.addEventListener("click", DislikeButtonClick));

					}
					includeElement.classList.remove("js-include-json");
					// TODO Try catch
					IncludeFromJSON();
				}
			}
			xhttp.open("GET", filename, true);
			xhttp.send();
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	IncludeFromHtml();
	IncludeFromJSON();
});
