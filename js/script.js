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
function toggleHamburger() {
	console.log("ko");
	const hamburger = document.querySelector('.hamburger');
	const menu = document.querySelector('.hamburger-menu');
	menu.classList.toggle("act");
}

const ShowModalWindow = e => {
	let articleElement = e.srcElement.parentElement;
	const articleId = articleElement.getAttribute("data-article-id");
	const articleTitle = articleElement.querySelector(".article-title");
	const articleImage = articleElement.querySelector(".image");
	const modalImage = articleImage.cloneNode(true);
	const articleDescription = articleElement.querySelector("[data-article-description]");
	
	const modal = articleElement.parentElement.querySelector("#myModal");
	const modalClose = modal.querySelector(".modal-close");

	modal.querySelector(".article-title").innerHTML = `<h2>${articleTitle.innerHTML}</h2>`
	const modalArticleImage = modal.querySelector(".article-image").querySelector("img");
	if(modalArticleImage) { modalArticleImage.remove(); }
	modal.querySelector(".article-image").appendChild(modalImage);
	modal.querySelector(".article-description").innerHTML = articleDescription.innerHTML;

	let htmlText = `<button id="like-button"><i class="fa fa-thumbs-up"></i> Like</button>
					<button id="dislike-button"><i class="fa fa-thumbs-down"></i> Dislike</button>
					<div>
						<span id="like-count">${GetLikesByArticleId(articleId)}</span> likes,
						<span id="dislike-count">${GetDislikesByArticleId(articleId)}</span> dislikes
					</div>`;

	modal.querySelector(".article-buttons").innerHTML = htmlText
	modal.querySelector(".article-buttons").setAttribute("data-article-id",articleId);

	modal.querySelectorAll("#like-button").forEach(item => item.addEventListener("click", LikeButtonClick));
	modal.querySelectorAll("#dislike-button").forEach(item => item.addEventListener("click", DislikeButtonClick));

	modal.style.display = "block";
	modalClose.addEventListener("click", () => modal.style.display = "none" );
	window.addEventListener("click", (e) => {
		if (e.target == modal) {
			modal.style.display = "none";
		}
	});
}

const GetTop3LikedArticles = () => {
	let includeElement = document.querySelector(".js-gettop3liked-json");
	if (includeElement !== null) {
		let filename = includeElement.getAttribute("data-filename");
		if (filename) {
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status == 200) {
						const response = JSON.parse(this.responseText);
						response.forEach(article => {
							article.likes = GetLikesByArticleId(article.id);
							article.dislikes = GetDislikesByArticleId(article.id);
						});
						response.sort((a,b) => b.likes - a.likes)
						let lastAricle=Math.min(3,response.length);
						let top3articles = response.slice(0,lastAricle);
						let output = `<h2>Top ${lastAricle} liked destination</h2>`;
						top3articles.forEach(article => {
							output += `<div class="container" data-article-id="${article.id}">
											<h4 class="article-title clickable-title">${article.title}</h4>
											<img class="image" src="${article.imageUrl}" alt="${article.imageText}">
											<div>
												<span id="like-count">${GetLikesByArticleId(article.id)}</span> likes,
												<span id="dislike-count">${GetDislikesByArticleId(article.id)}</span> dislikes
											</div>
											<div hidden data-article-description>${article.description}</div>
										</div>`;
						});
						
						output += `<div id="myModal" class="modal">
									<div class="modal-content">
									<div class="grid-container">
										<div class="modal-close article-close">&times;</div>
										<div class="article-title"></div>
										<div class="article-buttons"></div>
										<div class="article-image"></div>  
										<div class="article-description"></div>
									</div>
									</div>
								</div>`

						includeElement.innerHTML = output;

						includeElement.querySelectorAll(".article-title").forEach(item => item.addEventListener("click", ShowModalWindow));
					}
					includeElement.classList.remove("js-gettop3liked-json");
					// TODO Try catch
					GetTop3LikedArticles();
				}
			}
			xhttp.open("GET", filename, true);
			xhttp.send();
		}
	}
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
	GetTop3LikedArticles();
});
