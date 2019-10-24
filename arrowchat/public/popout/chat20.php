<?php

	/*
	|| #################################################################### ||
	|| #                             ArrowChat                            # ||
	|| # ---------------------------------------------------------------- # ||
	|| #    Copyright �2010-2012 ArrowSuites LLC. All Rights Reserved.    # ||
	|| # This file may not be redistributed in whole or significant part. # ||
	|| # ---------------- ARROWCHAT IS NOT FREE SOFTWARE ---------------- # ||
	|| #   http://www.arrowchat.com | http://www.arrowchat.com/license/   # ||
	|| #################################################################### ||
	*/
	
	// ########################## INCLUDE BACK-END ###########################
	require_once (dirname(dirname(dirname(__FILE__))) . DIRECTORY_SEPARATOR . 'bootstrap.php');
	//require_once ('./include/bittorrent.php');
	//require_once ('/include/user_functions.php');

	
	$load_chatroom_id		= get_var('cid');
	$autohide_panel			= get_var('ah');
	
	if (!is_numeric($load_chatroom_id))
		$load_chatroom_id = 0;
		
	if ($autohide_panel != 1 AND $autohide_panel != 0)
		$autohide_panel = 0;

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en-gb" xml:lang="en-gb"> 
<head> 

	<title><?php echo $language[110]; ?></title>
	
	<link type="text/css" rel="stylesheet" media="all" href="<?php echo $base_url; ?>external.php?type=css" charset="utf-8" />

	<script type="text/javascript" src="<?php echo $base_url; ?><?php echo AC_FOLDER_INCLUDES; ?>/js/jquery.js"></script>
	<script type="text/javascript" src="<?php echo $base_url; ?><?php echo AC_FOLDER_INCLUDES; ?>/js/jquery-ui.js"></script>
	<script type="text/javascript" src="<?php echo $base_url; ?>external.php?type=djs" charset="utf-8"></script>
	<script type="text/javascript" src="<?php echo $base_url; ?>external.php?type=pjs" charset="utf-8"></script> 
	<script type="text/javascript">
		var ac_load_chatroom_id = <?php echo htmlspecialchars($load_chatroom_id); ?>;
		var ac_autohide_panel = <?php echo htmlspecialchars($autohide_panel); ?>;
	</script>
	<style type="text/css">
        .MyClass{margin-left: 15px;
            margin-right: 15px;
            margin-top: 3px;
            margin-bottom: 3px;}
		body, html {
			margin: 0px;
			padding: 0px;
			height: 100%;
			width: 100%;
			font-size: 11px;
			font-family: 'Raleway', serif;
			color:black
		}
		
		.arrowchat_at_user {
    font-weight: bold;
    background-color: #fff;
    color: #000;
    padding: 3px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
}
		
		#arrowchat_popout_chat {
     background-color: transparent !important; 
    left: 321px;
    position: absolute;
    right: 0px;
    top: 0px;
    min-width: 260px;
}

		
		.arrowchat_popout_tab {
       background-color: #000;
    color: #666;
    cursor: pointer;
    float: left;
    margin: 2px 2px 3px 2px;
    padding: 3px 7px 7px 7px;
    position: relative;
    z-index: 1005;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
	border-color: #F34A87 !important;
}

#arrowchat_popout_container {
    border-top: 1px solid #AAA;
    padding: 0px 8px 0px;
    display: block;
    zoom: 1;
    border-bottom: 1px solid #F34A87;
}

.arrowchat_closebox_bottom {
    width: 10px;
    height: 10px;
    background: url(bg-core.png) no-repeat top left;
    background-position: -305px -43px;
    float: right;
    text-align: left;
    display: none;
    opacity: .6;
    margin-right: 2px;
    margin-top: -1px;
}

.arrowchat_popout_focused {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    -webkit-box-shadow: rgba(0,0,0,0.0898438) 0px 1px 0px;
    color: #fff;
    margin-top: -2px;
    padding-top: 5px;
    background-color: #0f0f0f !important;
	    border-color: #F34A87 !important;
}
		
		#arrowchat_popout_chat {
    /* background-image: url(/skulls.jpg); */
    left: 321px;
    position: absolute;
    right: 0px;
    top: 0px;
    min-width: 260px;
	
		}
		.video-container {
	position:relative;
	padding-bottom:56.25%;
	padding-top:30px;
	height:0;
	overflow:hidden;
}




.arrowchat_chatroom_delete{
	display:none;
	position:absolute;
	top:7px;right:-15px;
	background:url(bg-core.png) no-repeat -305px -43px;
	width:10px;height:10px;
	cursor:pointer;
	opacity:.6
	}
	
.arrowchat_giphy_button {
    cursor: pointer;
    background: url(bg-core.png) no-repeat -125px 5px;
    position: absolute;
    bottom: -1px;
    right: 20px;
    width: 24px;
    height: 25px;
}
.arrowchat_upload_user_button {
    background: url(bg-core.png) no-repeat -40px 6px;
    position: absolute !important;
    bottom: -1px;
    right: 40px;
    width: 24px;
    height: 25px;
    z-index: 2;
}

.arrowchat_smiley_button {
    cursor: pointer;
    background: url(bg-core.png) no-repeat 5px 5px;
    position: absolute;
    bottom: -1px;
    right: 0;
    width: 24px;
    height: 25px;
    z-index: 1091;
}

		
		.arrowchat_chatroom_room_list{
			padding:3px 0;
			font-size:13px;
			cursor:pointer;
			height:30px;
			text-align:left;
			line-height:100%;
			color: #fff;
			border-top:1px solid #F34A87;
			border-bottom:1px solid #F34A87;
			/* background-image: url(/mars.jpg); */
			}



    arrowchat_chatroom_room_list:hover {
        background-color:#6c757d;
        opacity:0.5;
        color:black !important;
    }


.arrowchat_chatroom_room_name{font-size:11px;white-space:nowrap;max-height:10px;float:left; padding-left:5px;padding-top:8px;padding-bottom:3px;text-align:left;max-width:74px;overflow:hidden;text-overflow:ellipsis}
.arrowchat_chatroom_list_title{color: #F34A87;font-size:13px;line-height:24px;padding:0 12px}
.arrowchat_global_chatroom_message{color:#fff;text-align:center;max-width:100% !important;float:none;background-color:transparent !important}
.arrowchat_chatroom_important{font-weight:bold;;background-size: cover; -ms-background-size: cover; -o-background-size: cover; -moz-background-size: cover; -webkit-background-size: cover;}
		
		.arrowchat_popout_convo{
			-x:hidden;
			overflow-y:auto;
			padding-top:5px;
			padding-left:25px;
			padding-right:25px;
			background-color:transparent !important;
			 }

        .arrowchat_self .arrowchat_chatbox_avatar {
            display: block !important;
        }
.arrowchat_self .arrowchat_chatboxmessage_wrapper{background-color:transparent !important;color: #893a8d !important;margin-left:35px;float:left;}
.arrowchat_self{color:#333 !important;text-align:left;background-color:transparent !important}
.arrowchat_chatroom_message_content{position:relative;background-color:#f1f0f0;float:left;margin:1px 4px 4px 0;max-width:300px;-webkit-border-radius:12px;-moz-border-radius:12px;border-radius:12px;padding:6px 8px 6px 8px;word-wrap:break-word}
.arrowchat_self .arrowchat_chatroom_message_content{background-color: #dc7ed7;color:#fff;margin-left:35px;float:right}
.arrowchat_image_msg .arrowchat_chatroom_message_content{background:#fff;border:1px solid #bcc7d6;padding:0;-webkit-border-radius:12px;-moz-border-radius:12px;border-radius:12px}
.arrowchat_chatroom_message_content .arrowchat_ts{left:0;top:-11px}
.arrowchat_chatboxmessage_wrapper{background-color:transparent !important;color:white;float:left;margin:3px 4px 0px 4px;max-width:180px;-webkit-border-radius:12px;-moz-border-radius:12px;border-radius:12px}

.arrowchat_popout_convo_input {
    border: 1px;
	border-color:#0F0F0F;
    font-size: 14px;
    font-family: "Helvetica Neue","Segoe UI",Helvetica,Arial,sans-serif;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0px;
    height: 35px;
    width: 100%;
    outline: none;
    resize: none;
    padding-top: 4px;
	color:white;
	background-color:#0f0f0f;
}



.arrowchat_chatroom_message_name {
    float: left;
    display: none;
    padding: 5px 3px 0 0px;
    position: relative;
    top: 2px;
    left: 1px;
    font-size: 11px !important;
    color: #c7c7c7;
    white-space: nowrap;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.arrowchat_info_panel {
    display: none;
    background-color:transparent !important ;
    position: absolute;
    right: 0px;
    top: 51px;
    bottom: 0px;
    width: 200px;
    border-left: 1px solid rgba(0,0,0,.10);
    overflow-x: hidden;
    overflow-y: auto;
	height: 82%;
}
.arrowchat_popout_convo_right_header {
    box-sizing: border-box;
    background-color: transparent;
    color: white;
    border-bottom: 1px solid rgba(0,0,0,.10);
    height: 50px;
    justify-content: space-between; 
    width: 100%;
    position: relative;
}

.arrowchat_right_header_name {
    font-size: 24px;
    font-weight: normal;
    margin: 0px 0 0;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
	color: #F34A87;
}

#arrowchat_popout_open_chats {
    background-color: transparent;
    bottom: 0px;
    left: 321px;
    overflow: hidden;
    position: absolute;
    right: 0px;
    min-width: 260px;
    z-index: 2000;
}
.arrowchat_popout_input_container {
    padding: 0 115px 0 10px;
    border-top: 1px solid #F34A87;
    position: relative;
    background-color: black;
	width:88.8%;
}

		::-webkit-scrollbar-track {
  box-shadow: inset 0 0 .5em rgba(0, 0, 0, .1);
  border-radius: .3125em;
  background-color: rgba(0, 0, 0, .1);
}

::-webkit-scrollbar {
  width: 1em;
  background-color: rgba(50, 50, 50, 1);
}

::-webkit-scrollbar-thumb:horizontal {
  border-top: 1px solid #F34A87;
  border-bottom: 1px solid #F34A87;
  border-radius: .3125em;
  background: -webkit-linear-gradient(180deg, rgba(0, 0, 0, 1) 0, rgba(0, 0, 0, 1) 25%, transparent 100%, rgba(0, 0, 0, 1) 75%, transparent) rgba(0, 0, 0, .1);
}

::-webkit-scrollbar-thumb:vertical {
  border-left: 1px solid #F34A87;
  border-right: 1px solid #F34A87;
  border-radius: .625em;
  background: -webkit-linear-gradient(90deg, rgba(0, 0, 0, 1) 0, rgba(0, 0, 0, 1) 25%, transparent 100%, rgba(0, 0, 0, 1) 75%, transparent) rgba(0, 0, 0, .1);
}
.ps-container{-ms-touch-action:none;touch-action:none;overflow:hidden !important;-ms-overflow-style:none}@supports (-ms-overflow-style: none){.ps-container{overflow:auto !important}}@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none){.ps-container{overflow:auto !important}}.ps-container.ps-active-x>.ps-scrollbar-x-rail,.ps-container.ps-active-y>.ps-scrollbar-y-rail{display:block;background-color:transparent}.ps-container.ps-in-scrolling{pointer-events:none}.ps-container.ps-in-scrolling.ps-x>.ps-scrollbar-x-rail{background-color:#eee;opacity:.9}.ps-container.ps-in-scrolling.ps-x>.ps-scrollbar-x-rail>.ps-scrollbar-x{background-color:#999}.ps-container.ps-in-scrolling.ps-y>.ps-scrollbar-y-rail{background-color:#eee;opacity:.9}.ps-container.ps-in-scrolling.ps-y>.ps-scrollbar-y-rail>.ps-scrollbar-y{background-color:#999}.ps-container>.ps-scrollbar-x-rail{display:none;position:absolute;opacity:0;-webkit-transition:background-color .2s linear, opacity .2s linear;-moz-transition:background-color .2s linear, opacity .2s linear;-o-transition:background-color .2s linear, opacity .2s linear;transition:background-color .2s linear, opacity .2s linear;bottom:0px;height:15px}.ps-container>.ps-scrollbar-x-rail>.ps-scrollbar-x{position:absolute;background-color:#aaa;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;-moz-transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;-o-transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -webkit-border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;bottom:2px;height:6px}.ps-container>.ps-scrollbar-x-rail:hover>.ps-scrollbar-x,.ps-container>.ps-scrollbar-x-rail:active>.ps-scrollbar-x{height:11px}.ps-container>.ps-scrollbar-y-rail{display:none;position:absolute;opacity:0;-webkit-transition:background-color .2s linear, opacity .2s linear;-moz-transition:background-color .2s linear, opacity .2s linear;-o-transition:background-color .2s linear, opacity .2s linear;transition:background-color .2s linear, opacity .2s linear;right:0;width:15px}.ps-container>.ps-scrollbar-y-rail>.ps-scrollbar-y{position:absolute;background-color:#aaa;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;-webkit-transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, -webkit-border-radius .2s ease-in-out;-moz-transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;-o-transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out;transition:background-color .2s linear, height .2s linear, width .2s ease-in-out, border-radius .2s ease-in-out, -webkit-border-radius .2s ease-in-out, -moz-border-radius .2s ease-in-out;right:2px;width:6px}.ps-container>.ps-scrollbar-y-rail:hover>.ps-scrollbar-y,.ps-container>.ps-scrollbar-y-rail:active>.ps-scrollbar-y{width:11px}.ps-container:hover.ps-in-scrolling{pointer-events:none}.ps-container:hover.ps-in-scrolling.ps-x>.ps-scrollbar-x-rail{background-color:#eee;opacity:.9}.ps-container:hover.ps-in-scrolling.ps-x>.ps-scrollbar-x-rail>.ps-scrollbar-x{background-color:#999}.ps-container:hover.ps-in-scrolling.ps-y>.ps-scrollbar-y-rail{background-color:#eee;opacity:.9}.ps-container:hover.ps-in-scrolling.ps-y>.ps-scrollbar-y-rail>.ps-scrollbar-y{background-color:#999}.ps-container:hover>.ps-scrollbar-x-rail,.ps-container:hover>.ps-scrollbar-y-rail{opacity:.6}.ps-container:hover>.ps-scrollbar-x-rail:hover{background-color:#000;opacity:.9}.ps-container:hover>.ps-scrollbar-x-rail:hover>.ps-scrollbar-x{background-color:#999}.ps-container:hover>.ps-scrollbar-y-rail:hover{background-color:#eee;opacity:.9}.ps-container:hover>.ps-scrollbar-y-rail:hover>.ps-scrollbar-y{background-color:#999}
	
	
	</style>
</head>
<body>
 <div id="fb-root"></div>
<script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=406968973156436&autoLogAppEvents=1"></script>
	<div id="arrowchat_sound_player_holder "></div>
	<div id="arrowchat_chatroom_password_flyout" class="arrowchat_password_box arrowchat_popout_password_flyout">
		<div class="arrowchat_password_box_wrapper">
			<div class="arrowchat_chatroom_pw_desc_text">
				<span><?php echo $language[50]; ?></span>
			</div>
			<div class="arrowchat_chatroom_password_input_wrapper">
				<input type="password" id="arrowchat_chatroom_password_input" maxlength="50" />
				<input type="hidden" id="arrowchat_chatroom_password_id" value="" />
			</div>
			<div class="arrowchat_password_button_wrapper">
				<div class="arrowchat_ui_button" id="arrowchat_password_button">
					<div><?php echo $language[100]; ?></div>
				</div>
				<div class="arrowchat_ui_button_cancel" id="arrowchat_password_cancel_button">
					<div><?php echo $language[222]; ?></div>
				</div>
			</div>
			<div style="clear: both;"></div>
		</div>
	</div>
	<div id="arrowchat_popout_wrapper">
		<div id="arrowchat_popout_left">
			<div id="arrowchat_popout_friends">
				<div id="arrowchat_popout_left_header">
					<div id="arrowchat_popout_settings">
						<a href="javascript:void(0);" class="arrowchat_panel_item arrowchat_more_anchor"></a>
						<div id="arrowchat_options_wrapper" class="arrowchat_more_wrapper">
							<div id="arrowchat_options_flyout" class="">
								<ul class="arrowchat_inner_menu">
									<div id="arrowchat_popout_change_name_wrapper">
										<li class="arrowchat_menu_item">
											<a id="arrowchat_popout_change_name" class="arrowchat_menu_anchor" style="background:none">
												<span><?php echo $language[242]; ?></span>
												<input type="checkbox" checked="" />
											</a>
										</li>
										<li class="arrowchat_menu_separator"></li>
									</div>
									<li class="arrowchat_menu_item">
										<a id="arrowchat_setting_sound" class="arrowchat_menu_anchor">
											<span><?php echo $language[6]; ?></span>
											<input type="checkbox" checked="" />
										</a>
									</li>
									<li class="arrowchat_menu_item">
										<a id="arrowchat_setting_names_only" class="arrowchat_menu_anchor">
											<span><?php echo $language[18]; ?></span>
											<input type="checkbox" checked="" />
										</a>
									</li>
									<li class="arrowchat_menu_item">
										<a id="arrowchat_setting_block_list" class="arrowchat_menu_anchor" style="background:none">
											<span><?php echo $language[95]; ?></span>
											<input type="checkbox" checked="" />
										</a>
									</li>
									<li class="arrowchat_menu_separator"></li>
									<li class="arrowchat_menu_item">
										<a id="arrowchat_chatroom_show_names" class="arrowchat_menu_anchor">
											<span><?php echo $language[152]; ?></span>
											<input type="checkbox" checked="" />
										</a>
									</li>
									<li class="arrowchat_menu_item">
										<a id="arrowchat_chatroom_block" class="arrowchat_menu_anchor">
											<span><?php echo $language[38]; ?></span>
											<input type="checkbox" checked="" />
										</a>
									</li>
									<li class="arrowchat_menu_separator"></li>
									<li class="arrowchat_menu_item">
										<a id="arrowchat_hide_lists_button" class="arrowchat_menu_anchor" style="background:none">
											<span><?php echo $language[229]; ?></span>
											<input type="checkbox" checked="" />
										</a>
									</li>
								</ul>
								<div class="arrowchat_change_name_menu">
									<div class="arrowchat_block_menu_text"><?php echo $language[244]; ?></div>
									<div style="float:left">
										<input id="arrowchat_change_name_input" type="text" maxlength="25" />
									</div>
									<div class="arrowchat_ui_button" id="arrowchat_change_name_button" style="float:right">
										<div style="width:45px;height:18px;position:relative;top:2px;left:-1px;"><?php echo $language[243]; ?></div>
									</div>
									<div class="arrowchat_clearfix"></div>
								</div>
								<div class="arrowchat_block_menu">
									<div class="arrowchat_block_menu_text"><?php echo $language[96]; ?></div>
									<div style="float:left">
										<select></select>
									</div>
									<div class="arrowchat_ui_button" id="arrowchat_unblock_button" style="float:right">
										<div style="width:45px;height:18px;position:relative;top:2px;left:-1px;"><?php echo $language[97]; ?></div>
									</div>
									<div class="arrowchat_clearfix"></div>
								</div>
								<i class="arrowchat_more_tip"></i>
							</div>
						</div>
					</div>
					<div class="arrowchat_popout_left_header_text"><?php echo $language[110]; ?></div>
				</div>
				<div id="arrowchat_popout_selection_wrapper">
					<div id="arrowchat_popout_selection_chat" class="arrowchat_popout_selection_box arrowchat_popout_selection_focused">Private</div>
					<div id="arrowchat_popout_selection_room" class="arrowchat_popout_selection_box">Chat Rooms</div>
				</div>
				<div id="arrowchat_popout_left_lists">
					<div id="arrowchat_userslist_available"></div>
					<div id="arrowchat_userslist_busy"></div>
					<div id="arrowchat_userslist_away"></div>
					<div id="arrowchat_userslist_offline"></div>
				</div>
			</div>
		</div>
		<div id="arrowchat_popout_right">
			<div id="arrowchat_popout_chat">
				<div id="arrowchat_user_upload_queue" class="arrowchat_users_upload_queue"></div>
				<div id="arrowchat_chatroom_message_flyout" class="arrowchat_message_box">
					<div class="arrowchat_message_box_wrapper">
						<div>
							<span class="arrowchat_message_text"></span>
						</div>
					</div>
				</div>	
			</div>
			<div id="arrowchat_popout_open_chats">
			

				<div id="arrowchat_popout_container">
				</div>
			</div>
		</div>
	</div>
</body>
</html>