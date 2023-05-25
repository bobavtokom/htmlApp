function InitSidebar() {
    $('.menu li:has(ul)').click(function (e) {
        e.preventDefault();

        if ($(this).hasClass('activado')) {
            $(this).removeClass('activado');
            $(this).children('ul').slideUp();
        } else {
            $('.menu li ul').slideUp();
            $('.menu li').removeClass('activado');
            $(this).addClass('activado');
            $(this).children('ul').slideDown();
        }

        $('.menu li ul li a').click(function () {
            window.location.href = $(this).attr('href');
        })
    });
}

function ActivateNavbarLink() {
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/') + 1);
    document.querySelectorAll("nav > ul > li > a").forEach(function (item) {
        if (item.hasAttribute("href")) {
            var hrefFilename = item.getAttribute("href");
            if (filename === hrefFilename) {
                item.classList.toggle("active");
                item.setAttribute("href", "#");
            }
        }
    });
}

function topRated() {
    var likes = document.querySelectorAll("#like-count");
    var maxLike = 0;
    for (like of likes) {
        const value = like.innerText || like.textContent || like.innerHTML;
        maxLike = Math.max(maxLike, value);
    }
    console.log(maxLike);
}

function searchForArticle() {
    var input, filter, title, i, txtValue;
    input = document.getElementById('myInput');
    span = document.getElementsByClassName("container article-world");
    filter = input.value.toUpperCase();
    title = document.querySelectorAll(".center .article-title");

    // for (i = 0; i < title.length; i++) {
    //   txtValue = title[i].textContent || title[i].innerText;
    //   if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //     title[i].parentNode.style.display = "block";
    //   } else {
    //   title[i].parentNode.style.display = "none";
    //   }
    // }
    
    for (let letter of title) {
        txtValue = letter.textContent || letter.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            letter.parentNode.style.display = "block";
        } else {
            letter.parentNode.style.display = "none";
        }
    }
}