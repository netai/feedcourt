$(document).ready(function(){
	$("body").on("click",'.pop-link', function(){
		$("#pop-content").html('<div style="text-align: center;">Loading, Please Wait.</div>');
		var html = $(this).data('href');
		$("#pop-content").load(html, function(){});
	});
});