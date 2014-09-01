// isotope
$(function(){
		
		var $container = $('#punches');
  	
		$container.isotope({
		  // options
		  itemSelector : '.punch',
			layoutMode : 'masonry',
			masonry : {
        columnWidth : 205
      }
		});
		
		
		$container.delegate( '.punch', 'click', function(){
			$(this).toggleClass('large');
			$container.isotope('reLayout');
		});
});
