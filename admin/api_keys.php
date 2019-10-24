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
if (!defined('IN_INSTALLER09_ADMIN')) {
    $HTMLOUT = '';
    $HTMLOUT.= "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"
\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<title>Error!</title>
</head>
<body>
<div style='font-size:33px;color:white;background-color:red;text-align:center;'>Incorrect access<br />You cannot access this file directly.</div>
</body></html>";
    echo $HTMLOUT;
    exit();
}
require_once (CLASS_DIR . 'class_check.php');
$class = get_access(basename($_SERVER['REQUEST_URI']));
class_check($class);
$lang = array_merge($lang, load_language('ad_apikeys'));

$pconf = sql_query('SELECT * FROM api_keys') or sqlerr(__FILE__, __LINE__);
while ($ac = mysqli_fetch_assoc($pconf)) $api_keys[$ac['name']] = $ac['value'];
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $update = array();
   
    foreach ($api_keys as $c_name => $c_value) if (isset($_POST[$c_name]) && $_POST[$c_name] != $c_value) $update[] = '(' . sqlesc($c_name) . ',' . sqlesc(is_array($_POST[$c_name]) ? join('|', $_POST[$c_name]) : $_POST[$c_name]) . ')';
    if (sql_query('INSERT INTO api_keys(name,value) VALUES ' . join(',', $update) . ' ON DUPLICATE KEY update value=values(value)')) {
        $t = '$INSTALLER09';
        $configfile = "<" . "?php\n/**\n{$lang['apikeys_file']}" . date('M d Y H:i:s') . ".\n{$lang['apikeys_cfg']}\n**/\n";
        $res = sql_query("SELECT * from api_keys ");
        while ($arr = mysqli_fetch_assoc($res)) {
            $configfile .= "" . $t . "['$arr[name]'] = ".sqlesc($arr[value]).";\n";
        }
        $configfile.= "?" . ">";
        $filenum = fopen('./cache/api_keys.php', 'w');
        ftruncate($filenum, 0);
        fwrite($filenum, $configfile);
        fclose($filenum);
        stderr($lang['apikeys_success'], $lang['apikeys_success1']);
    } else stderr($lang['apikeys_stderr'], $lang['apikeys_stderr3']);
    exit;
}
$HTMLOUT.= "<div class='row'><div class='col-md-12'>";
$HTMLOUT.= "<h3>{$lang['apikeys_sitehead']}</h3>
<form action='staffpanel.php?tool=api_keys' method='post'>
<table class='table table-bordered'>";
if ($CURUSER['id'] === 1)
    $HTMLOUT.= "
<tr><td width='50%'>OMDB API Key</td><td><input type='text' class='form-control' name='omdb_key' size='3' value='" . htmlsafechars($api_keys['omdb']) . "' /></td></tr>
<tr><td width='50%'>TMBD API Key</td><td><input type='text' class='form-control' name='tmdb_key' size='3' value='" . htmlsafechars($api_keys['tmdb']) . "' /></td></tr>
<tr><td colspan='2' class='table' align='center'><input class='btn btn-default' type='submit' value='{$lang['apikeys_apply']}' /></td></tr>
</table></form>";
$HTMLOUT.= "</div></div>";
echo stdhead($lang['apikeys_stdhead']) . $HTMLOUT . stdfoot();
?>