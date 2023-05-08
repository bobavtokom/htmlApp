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
    var filename = url.substring(url.lastIndexOf('/')+1);
    document.querySelectorAll("nav > ul > li > a").forEach(function(item) {
        if(item.hasAttribute("href")){
            var hrefFilename=item.getAttribute("href");
            if(filename===hrefFilename){
                item.classList.toggle("active");
                item.setAttribute("href","#");
            }
        }
    });
}