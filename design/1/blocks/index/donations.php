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
//== 09 Donation progress
$progress = '';
if (($totalfunds_cache = $mc1->get_value('totalfunds_')) === false) {
    $totalfunds_cache = mysqli_fetch_assoc(sql_query("SELECT sum(cash) as total_funds FROM funds"));
    $totalfunds_cache["total_funds"] = (int)$totalfunds_cache["total_funds"];
    $mc1->cache_value('totalfunds_', $totalfunds_cache, $INSTALLER09['expires']['total_funds']);
}
$funds_so_far = (int)$totalfunds_cache["total_funds"];
$funds_difference = $INSTALLER09['totalneeded'] - $funds_so_far;
$Progress_so_far = number_format($funds_so_far / $INSTALLER09['totalneeded'] * 100, 1);
if ($Progress_so_far >= 100) $Progress_so_far = 100;
	$HTMLOUT.= "<div class='card'>
	<div class='card-divider portlet-header'>{$lang['index_donations']}</div>
			<div class='portlet-content card-section'>
				<a href='{$INSTALLER09['baseurl']}/donate.php' class='thumbnail float-center'><img src='{$INSTALLER09['pic_base_url']}makedonation.gif' alt='{$lang['index_donations']}'></a>
				<div class='success progress' role='progressbar' tabindex='0' aria-valuenow='20' aria-valuemin='0' aria-valuetext='$Progress_so_far%' aria-valuemax='100'>
					<div class='progress-meter' style='width: $Progress_so_far%'>$Progress_so_far% (success)</div>
				</div>
			</div>
	</div>";
//==End
// End Class
// End File
