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
/*
$HTMLOUT.= "<fieldset class='header'><legend>{$lang['index_donations']}</legend>
			<div class='container-fluid cite text-center'>
			<a href='{$INSTALLER09['baseurl']}/donate.php'><img border='0' src='{$INSTALLER09['pic_base_url']}makedonation.gif' alt='{$lang['index_donations']}' title='{$lang['index_donations']}'  /></a><br />
			<br />
<br />
	
				<div class='progress' style ='width: 50%; margin-left: 25%;color: black;'>
  <div class='progress-bar' role='progressbar' aria-valuenow='$Progress_so_far' aria-valuemin='0' aria-valuemax='100' style='width: $Progress_so_far;'>
    $Progress_so_far%
  </div>
</div>
				
				
					</div>
			</fieldset><hr />";
*/
$HTMLOUT.= "
<div class='header panel panel-default'>
	<div class='panel-heading'>
		<label for='checkbox_4' class='text-left'>{$lang['index_donations']}</label>
	</div>
	<div class='container-fluid panel-body' align='center'>
			<a href='{$INSTALLER09['baseurl']}/donate.php'><img border='0' src='{$INSTALLER09['pic_base_url']}makedonation.gif' alt='{$lang['index_donations']}' title='{$lang['index_donations']}'  /></a><br />
				<table width='140' style='height: 20%;' border='2'>
					<tr>
						<td bgcolor='transparent' align='center' valign='middle' width='$Progress_so_far%'>$Progress_so_far%</td>
						<td bgcolor='grey' align='center' valign='middle'></td>
					</tr>
				</table>
			</div>
			</div>";
//==end
// End Class
// End File
