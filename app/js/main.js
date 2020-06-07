$(function() {
	$('a.go').click( function(event){ 
    event.preventDefault();
    $('html').css('position', 'fixed');
		$('.overlay').fadeIn(400,
		 	function(){ 
				$('.modal') 
					.css('display', 'block')
					.animate({opacity: 1, top: '50%'}, 200);
		});
	});

	$('.modal__close, .overlay').click( function(){
		$('.modal')
			.animate({opacity: 0, top: '45%'}, 200,
				function(){
					$(this).css('display', 'none');
          $('.overlay').fadeOut(400);
          $('html').css('position', 'static');
				}
			);
	});
});
