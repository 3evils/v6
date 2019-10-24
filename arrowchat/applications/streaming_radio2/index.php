<?php

	require_once(dirname(__FILE__)."/config.php");

echo <<<EOD
	<style type="text/css">
		#arrowchat_music_wrapper{height:47px}
		 body{
    background-color:black;
}
	</style>

	<div id="arrowchat_music_wrapper">
<script type="text/javascript" src="https://hosted.muses.org/mrp.js"></script>

<script type="text/javascript">
    MRP.insert({
        'url':'http://54.37.134.248:8004/;',
        'codec':'mp3',
        'volume':100,
        'autoplay':false,
        'jsevents':true,
        'buffering':0,
        'title':'3evils AutoDJ',
        'welcome':'Welcome',
        'wmode':'transparent',
        'skin':'longtail',
        'width':498,
        'height':61
    });
</script>	</div>

EOD;

?>