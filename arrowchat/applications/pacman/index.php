<?php
	// Gets the folder path without filename
	function GetFileDir($php_self) { 
		$filename = explode("/", $php_self);
		for( $i = 0; $i < (count($filename) - 1); ++$i ) { 
			$filename2 .= $filename[$i].'/'; 
		} 
		return $filename2; 
	} 
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-gb" xml:lang="en-gb"> 
<head>

<style type="text/css"> 
	body, html {
		margin: 0px;
		padding: 0px;
	}
	#pacman_game {
		background-color: #000000;
	}
</style>

</head>
<body>
<div id="pacman_game">
 <OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" WIDTH="600" HEIGHT="450" id="arrowchat_pacman">
	<PARAM NAME="movie" VALUE="<?php echo GetFileDir($_SERVER['PHP_SELF']); ?>includes/pacman.swf">
	<PARAM NAME="quality" VALUE="high">
	<PARAM NAME="bgcolor" VALUE="#000000">
	<PARAM NAME="wmode" VALUE="transparent">
	<EMBED src="<?php echo GetFileDir($_SERVER['PHP_SELF']); ?>includes/pacman.swf" quality="high" bgcolor="#000000" wmode="transparent" WIDTH="600" HEIGHT="450" NAME="arrowchat_pacman" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash"></EMBED>
</OBJECT>
</div>
</body>
</html>