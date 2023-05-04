const LikeButtonClick = e => {
	const articleElement = e.srcElement.parentElement;
	const likeCountElement = articleElement.querySelector('#like-count');
	const articleId = articleElement.getAttribute('data-article-id');
	let storageKey = 'likes-'+articleId;
	let storageVal = parseInt(localStorage.getItem(storageKey)) || 0;

	storageVal++;
	likeCountElement.textContent = storageVal;
	localStorage.setItem(storageKey, storageVal);
}

const DislikeButtonClick = e => {
	const articleElement = e.srcElement.parentElement;
	const dislikeCountElement = articleElement.querySelector('#dislike-count');
	const articleId = articleElement.getAttribute('data-article-id');
	let storageKey = 'dislikes-'+articleId;
	let storageVal = parseInt(localStorage.getItem(storageKey)) || 0;

	storageVal++;
	dislikeCountElement.textContent = storageVal;
	localStorage.setItem(storageKey, storageVal);
}

const InitLikesAndDislikes = articleElement => {
	const articleId = articleElement.getAttribute('data-article-id');

	const likeCountElement = articleElement.querySelector('#like-count');
	let storageKey = 'likes-'+articleId;
	let storageVal = parseInt(localStorage.getItem(storageKey)) || 0;
	likeCountElement.textContent = storageVal;

	const dislikeCountElement = articleElement.querySelector('#dislike-count');
	storageKey = 'dislikes-'+articleId;
	storageVal = parseInt(localStorage.getItem(storageKey)) || 0;
	dislikeCountElement.textContent = storageVal;
}

document.querySelectorAll("#like-button").forEach(item => item.addEventListener("click", LikeButtonClick));
document.querySelectorAll("#dislike-button").forEach(item => item.addEventListener("click", DislikeButtonClick));

document.querySelectorAll(".article-world").forEach(article => InitLikesAndDislikes(article));

function openLeftSidebar() {
	document.getElementById("sidebar").style.left = "0px";
	// document.querySelector(".left-sidebar").style.left = "0";
}
function closeLeftSidebar() {
	// document.querySelector(".left-sidebar").style.left = "-250px";
	document.getElementById("sidebar").style.left = "-250px";
}
