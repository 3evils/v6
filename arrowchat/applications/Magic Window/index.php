<?php

	// Lets get started and loads what comes first
	
	require_once(dirname(__FILE__)."/config.php");
	
	$linkURL = htmlspecialchars($linkURL);

?>
<div style="padding: 5px;">
<iframe src="<?php echo $linkURL; ?>" scrolling="yes" frameborder="0" style="border:none;  width:750px; height:300px;" allowTransparency="true"></iframe>
</div>
