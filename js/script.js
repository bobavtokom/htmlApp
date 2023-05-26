const ReloadTop3Destination = () => {
	const spanElement = document.querySelector("#top-rated>span");
	if (spanElement) {
		spanElement.classList.toggle("js-gettop3liked-json");
		GetTop3LikedArticles(true);
	}
}

const UpdateLikeNumber = id => {
	const likeElements = document.querySelectorAll("#like-count");
	likeElements.forEach(element => {
		const articleId = element.parentElement.parentElement.getAttribute('data-article-id');
		const articleLikeNumber = GetLikesByArticleId(articleId);
		element.textContent = articleLikeNumber;
	});
	ReloadTop3Destination();
}

const UpdateDislikeNumber = id => {
	const likeElements = document.querySelectorAll("#dislike-count");
	likeElements.forEach(element => {
		const articleId = element.parentElement.parentElement.getAttribute('data-article-id');
		const articleDislikeNumber = GetDislikesByArticleId(articleId);
		element.textContent = articleDislikeNumber;
	});
	ReloadTop3Destination();
}

const LikeButtonClick = e => {
	let articleElement = e.srcElement.parentElement;
	if (e.srcElement.classList.contains("fa")) {
		articleElement = e.srcElement.parentElement.parentElement;
	}
	const articleId = articleElement.getAttribute('data-article-id');
	let newValue = GetLikesByArticleId(articleId) + 1;

	SetLikesByArticleId(articleId, newValue);
	UpdateLikeNumber(articleId);
}

const DislikeButtonClick = e => {
	let articleElement = e.srcElement.parentElement;
	if (e.srcElement.classList.contains("fa")) {
		articleElement = e.srcElement.parentElement.parentElement;
	}
	const articleId = articleElement.getAttribute('data-article-id');
	let newValue = GetDislikesByArticleId(articleId) + 1;

	SetDislikesByArticleId(articleId, newValue);
	UpdateDislikeNumber(articleId);
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
	if (modalArticleImage) { modalArticleImage.remove(); }
	modalImage.classList.remove("clickable-title");
	modal.querySelector(".article-image").appendChild(modalImage);
	modal.querySelector(".article-description").innerHTML = articleDescription.innerHTML;

	let htmlText = `<button id="like-button"><i class="fa fa-thumbs-up"></i> Like</button>
					<button id="dislike-button"><i class="fa fa-thumbs-down"></i> Dislike</button>
					<div>
						<span id="like-count">${GetLikesByArticleId(articleId)}</span> likes,
						<span id="dislike-count">${GetDislikesByArticleId(articleId)}</span> dislikes
					</div>`;

	modal.querySelector(".article-buttons").innerHTML = htmlText
	modal.querySelector(".article-buttons").setAttribute("data-article-id", articleId);

	modal.querySelectorAll("#like-button").forEach(item => item.addEventListener("click", LikeButtonClick));
	modal.querySelectorAll("#dislike-button").forEach(item => item.addEventListener("click", DislikeButtonClick));

	modal.style.display = "block";
	modalClose.addEventListener("click", () => modal.style.display = "none");
	window.addEventListener("click", (e) => {
		if (e.target == modal) {
			modal.style.display = "none";
		}
	});
}

function closeMain() {
	document.querySelector(".hamburger-menu").style.width = 0;
}

const GetTop3LikedArticles = (reload = false) => {
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
						response.sort((a, b) => b.likes - a.likes)
						let lastAricle = Math.min(3, response.length);
						let top3articles = response.slice(0, lastAricle);
						let output = `<h2>Top ${lastAricle} liked destination</h2>`;
						top3articles.forEach(article => {
							output += `<div class="container" data-article-id="${article.id}">
											<h4 class="article-title clickable-title">${article.title}</h4>
											<img class="image clickable-title" src="${article.imageUrl}" alt="${article.imageText}">
											<div>
												<span id="like-count">${GetLikesByArticleId(article.id)}</span> likes,
												<span id="dislike-count">${GetDislikesByArticleId(article.id)}</span> dislikes
											</div>
											<div hidden data-article-description>${article.description}</div>
										</div>`;
						});

						if (!reload) {

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
						} else {
							const modalElement = includeElement.querySelector("#myModal");
							includeElement.innerHTML = output;
							if(modalElement){
								includeElement.appendChild(modalElement);
							}
						}
						
						includeElement.querySelectorAll(".clickable-title").forEach(item => item.addEventListener("click", ShowModalWindow));

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

const LoadJS = (FILE_URL, async = true) => {
	let scriptEle = document.createElement("script");

	scriptEle.setAttribute("src", FILE_URL);
	scriptEle.setAttribute("type", "text/javascript");
	scriptEle.setAttribute("async", async);

	document.body.appendChild(scriptEle);

	// success event 
	scriptEle.addEventListener("load", () => {
		console.log("File loaded")
	});
	// error event
	scriptEle.addEventListener("error", (ev) => {
		console.log("Error on loading file", ev);
	});
}

const IncludeFromHtml = () => {
	let includeElement = document.querySelector(".js-include-html");
	if (includeElement !== null) {
		let filename = includeElement.getAttribute("data-filename");
		let callbackFunction = includeElement.getAttribute("data-function");
		let scriptFile = includeElement.getAttribute("data-load-script");
		if (filename) {
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				if (this.readyState == 4) {
					if (this.status == 200) {
						includeElement.innerHTML = this.responseText;
						if (scriptFile) {
							console.log(scriptFile);
							LoadJS(scriptFile);
						}
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
								if (filterId == 0 || article.id == filterId) {
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
