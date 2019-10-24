<?php

	require_once(dirname(__FILE__)."/config.php");

echo <<<EOD
	<style type="text/css">
		#arrowchat_music_wrapper{height:47px}
	</style>

	<div id="arrowchat_music_wrapper">
<object type="application/x-shockwave-flash" id="scplayer" name="scplayer" data="http://player.wavestreamer.com/cgi-bin/player2.swf" width="340" height="45"><param name="allowfullscreen" value="false"><param name="allowscriptaccess" value="always"><param name="bgcolor" value="#FFFFFF"><param name="wmode" value="transparent"><param name="flashvars" value="skin=http://player.wavestreamer.com/cgi-bin/stijl/stijl.swf&amp;title=Live Stream&amp;type=sound&amp;file={$stream}&amp;13276457640&amp;duration=99999&amp;id=scplayer&amp;autostart=true"></object>
	</div>

EOD;

?>