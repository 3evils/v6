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
$xmasday = mktime(0, 0, 0, 12, 25, date("Y"));
$today = mktime(date("G") , date("i") , date("s") , date("m") , date("d") , date("Y"));
//if (($CURUSER["opt1"] & user_options::GOTGIFT) && $today <> $xmasday) {
if ($CURUSER["gotgift"] == 'no' && $today <> $xmasday) {
$HTMLOUT .= "<div class='card'>
	<div class='card-divider portlet-header'>{$lang['index_xmas_gift']}</div>";
$HTMLOUT.= "<div class='portlet-content card-section'>
	<p><a href='{$INSTALLER09['baseurl']}/gift.php?open=1'><img src='{$INSTALLER09['pic_base_url']}gift.png' alt='{$lang['index_xmas_gift']}' title='{$lang['index_xmas_gift']}' /></a></p></div>";
$HTMLOUT .= "</div>";
    }
//==End
// End Class
// End File
