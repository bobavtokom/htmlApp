const likeButton = document.getElementById('like-button');
		const dislikeButton = document.getElementById('dislike-button');
		const likeCount = document.getElementById('like-count');
		const dislikeCount = document.getElementById('dislike-count');


		let currentLikes = parseInt(localStorage.getItem('likes')) || 0;
		let currentDislikes = parseInt(localStorage.getItem('dislikes')) || 0;
		likeCount.textContent = currentLikes;
		dislikeCount.textContent = currentDislikes;

		likeButton.addEventListener('click', () => {
		currentLikes++;
		likeCount.textContent = currentLikes;
		localStorage.setItem('likes', currentLikes);
		});

		dislikeButton.addEventListener('click', () => {
		currentDislikes++;
		dislikeCount.textContent = currentDislikes;
		localStorage.setItem('dislikes', currentDislikes);
		});
		
	function openLeftSidebar() {
		document.getElementById("sidebar").style.left = "0px";
		// document.querySelector(".left-sidebar").style.left = "0";
	}
	function closeLeftSidebar() {
		// document.querySelector(".left-sidebar").style.left = "-250px";
		document.getElementById("sidebar").style.left = "-250px";
	}
	