<?php
/**
 |--------------------------------------------------------------------------|
 |   https://github.com/Bigjoos/                                            |
 |--------------------------------------------------------------------------|
 |   Licence Info: WTFPL                                                    |
 |--------------------------------------------------------------------------|
 |   Copyright (C) 2010 U-232 V5                                            |
 |--------------------------------------------------------------------------|
 |   A bittorrent tracker source based on TBDev.net/tbsource/bytemonsoon.   |
 |--------------------------------------------------------------------------|
 |   Project Leaders: Mindless, Autotron, whocares, Swizzles.               |
 |--------------------------------------------------------------------------|
  _   _   _   _   _     _   _   _   _   _   _     _   _   _   _
 / \ / \ / \ / \ / \   / \ / \ / \ / \ / \ / \   / \ / \ / \ / \
( U | - | 2 | 3 | 2 )-( S | o | u | r | c | e )-( C | o | d | e )
 \_/ \_/ \_/ \_/ \_/   \_/ \_/ \_/ \_/ \_/ \_/   \_/ \_/ \_/ \_/
 */
//==SVN
$HTMLOUT.= "<div class='card'>
	<div class='card-divider portlet-header ui-widget-header ui-corner-all'>3 Evils Radio</div>";
//$HTMLOUT.= "<div class='portlet-content card-section'><iframe id='shout' class='contentScroller shout-table' src='/radio/radio.html' style='border:0; margin: auto; -webkit-border-radius: 0px; width:30%; height:480px;'></iframe>
  //  <iframe id='shout' class='contentScroller shout-table iframe' src='/radio/autodj.html' style='border:0; margin: auto; -webkit-border-radius: 0px;-ms-overflow-style: none;overflow: -moz-scrollbars-none;color: #F34A87; width:33%; height:480px;'></iframe>
    //<iframe id='shout' class='contentScroller shout-table iframe' src='/radio/dragon.html' style='border:0; margin: auto; -webkit-border-radius: 0px; width:33%; height:480px;'></iframe><br />
    //<div></div></div><br>";


$json = file_get_contents( "http://radio.3evils.com:8999/status-json.xsl");
$radio = json_decode($json, true);
foreach ($radio['icestats'] as $key => $radio_info);



$HTMLOUT .="<script src=\"http://code.jquery.com/jquery-latest.js\">
  <script src='./radio/radio.js'>
    
  </script>
<div class=' panel panel-default' id='radio'><div class='panel-heading'>
<label for='checkbox_4' class='text-left'></label></div>
<!--<html>

<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
<title>3 Evils Radio</title>
<link href='https://fonts.googleapis.com/css?family=Dancing Script' rel='stylesheet'>  
<style>
audio {
width: 100%;
}
r1 {
font-family: \"Dancing Script\"; font-size: 24px; font-style: normal; font-variant: normal; font-weight: 700; line-height: 26.4px; }
</style>

<r1>3 Evils Radio</r1><br>
<div id='title'>
<strong><font color='#79c5c5'>Title:</font></strong><font style='font-size:24px;' color='white'> " . $radio_info['title'] . "</font><br/></div>
<div id='listeners'> <strong><font color='#79c5c5'>Listeners:</font></strong><font style='font-size:24px;' color='white'> " . $radio_info['listeners'] . "</font></br>
</div>




<audio id=\"audioDemo\" controls controlsList=\"nodownload\"  loop preload=\"none\" src=\"http://radio.3evils.com:8999/stream\" type=\"audio/mp3\">
Your browser does not support the audio element.
</audio></body>
</html>
</div></div>-->


<!--<iframe src=\"https://widgets.autopo.st/widgets/public/antimidas/webplayer/\" height=\"300\" width=\"100%\" scrolling=\"no\" frameborder=\"0\" style='background:transparent!important;'></iframe>-->

<iframe  allow=\"encrypted-media\" src=\"https://freewidgets.co/Media/audio/?uid=277&sid=7Evr9FiUhC\" width=\"100%\" height=\"200\" style=\"border:none;overflow:hidden\" scrolling=\"no\" frameborder=\"0\" allowTransparency=\"true\"></iframe>
<a href=\"http://51.77.32.32:8777/stream.m3u\">
<img align=\"absmiddle\" src=\"https://www.iconhot.com/icon/png/colobrush/16/icone-winamp.png\" border=\"0\" alt=\"Winamp, iTunes\" title=\"Winamp, iTunes\" />Tune In with iTunes/Winamp</a>
</div></div>";
//<span style='float:right;'>Pop-Out Player<SCRIPT TYPE=\"text/javascript\"> function popup(mylink, windowname) { if (! window.focus)return true; var href; if (typeof(mylink) == 'string') href=mylink; else href=mylink.href; window.open(href, windowname, 'width=600,height=200,scrollbars=yes'); return false; } </SCRIPT><a href=\"https://freewidgets.co/Media/audio/?uid=277&sid=7Evr9FiUhC\" onClick=\"return popup(this, 'notes')\"><img src=\"https://shoutcastwidgets.com/images/buttons/button1.gif\" /></a></span>-->





//</div></div>";
//$htmlout.="";
//$htmlout.="<!-- START: FREEWIDGETS.CO -- MEDIA WIDGET --><iframe  allow=\"encrypted-media\" src=\"https://freewidgets.co/Media/audio/?uid=277&sid=7Evr9FiUhC\" width=\"100%\" height=\"200\" style=\"border:none;overflow:hidden\" scrolling=\"no\" frameborder=\"0\" allowTransparency=\"true\"></iframe><!-- END: FREEWIDGETS.CO -- MEDIA WIDGET -->";
//$htmlout.="<!-- START: FREEWIDGETS.CO -- Last Played Widget --><script>if (typeof jQuery == 'undefined') {var i = \"i\"; document.write('<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery-2.2.4.min.js\"></scr' + i + 'pt>');}</script><div id=\"LASTPLAYED\" ></div><script>$(document).ready(function(){$(\"#LASTPLAYED\").load(\"https://freewidgets.co/Media/audio/LastPlayed/?id=7Evr9FiUhC&blank=blank\");var refreshId = setInterval(function() {$(\"#LASTPLAYED\").load(\"https://freewidgets.co/Media/audio/LastPlayed/?id=7Evr9FiUhC&blank=blank\"  + Math.random());}, 50000); $.ajaxSetup({ cache: false });});</script><!-- END: FREEWIDGETS.CO -- Last Played Widget-->";
//$htmlout.="<!-- START: FREEWIDGETS.CO -- POP UP PLAYER --><!-- END: FREEWIDGETS.CO -- POP UP PLAYER-->";

//==End
// End Class
// End File

?>
