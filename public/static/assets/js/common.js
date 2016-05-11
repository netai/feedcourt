$(document).ready(function(){
	$("body").on("click",'.pop-link', function(){
		$("#pop-content").html('<div style="text-align: center;text-align: center;font-size: 20px;font-weight: bold;margin-top: 70px;">Loading, Please Wait.</div>');
		var html = $(this).data('href');
		$("#pop-content").load(html, function(){});
	});
});