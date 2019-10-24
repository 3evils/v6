<?php

	/*
	|| #################################################################### ||
	|| #                             ArrowChat                            # ||
	|| # ---------------------------------------------------------------- # ||
	|| #    Copyright ©2010-2012 ArrowSuites LLC. All Rights Reserved.    # ||
	|| # This file may not be redistributed in whole or significant part. # ||
	|| # ---------------- ARROWCHAT IS NOT FREE SOFTWARE ---------------- # ||
	|| #   http://www.arrowchat.com | http://www.arrowchat.com/license/   # ||
	|| #################################################################### ||
	*/
	
	header("Expires: Mon, 26 Jul 1990 05:00:00 GMT");
	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");

	// ########################## INCLUDE BACK-END ###########################
	require_once (dirname(dirname(dirname(dirname(__FILE__)))) . DIRECTORY_SEPARATOR . 'bootstrap.php');
	require_once (dirname(dirname(dirname(dirname(__FILE__)))) . DIRECTORY_SEPARATOR . AC_FOLDER_INCLUDES . DIRECTORY_SEPARATOR . 'init.php');
	require_once (dirname(dirname(dirname(__FILE__))) . DIRECTORY_SEPARATOR . 'functions' . DIRECTORY_SEPARATOR . 'functions_send.php');

	// ########################### GET POST DATA #############################
	$chatroomid = get_var('chatroomid');
	$message 	= get_var('message');
	$message_id 	= get_var('message_id');
	$s_message	= sanitize($message);
	
	// Get the username of the user sending the message
	if (check_if_guest($userid))
	{
		$username = strip_tags(create_guest_username($userid, $guest_name));
	}
	else
	{
		$username = strip_tags(get_username($userid));
	}

	// ######################### START POST MESSAGE ##########################
	if (!empty($_POST['message']) && strlen($_POST['message']) <= $chatroom_message_length) 
	{
		if (logged_in($userid)) 
		{
			$chatroom_admin = 0;
			$chatroom_mod = 0;
			
			// *** Start Group Permissions Check ***
			$disable_edit_group_msg = 0;
			
			if (empty($disable_edit_group_msg))
			{
				if (!$messages_are_limited)
				{
					$db->execute("
						UPDATE arrowchat_chatroom_messages SET
							message = '".$db->escape_string($s_message)."',
							edited_session_id = '".md5(date("Ymdhis"))."',
							edited = '".time()."'
						Where 
							id = '" . $db->escape_string($message_id) . "'
					");
					
					// Update message history totals
					$result = $db->execute("
						SELECT sent
						FROM arrowchat_chatroom_messages
						ORDER BY id DESC
						LIMIT 1, 1
					");
					
					if ($push_on == 1)
					{
						//push_publish('chatroom' . $chatroomid, array('chatroommessage' => array("id" => $last_id, "name" => $username, "message" => $s_message, "userid" => $userid, "sent" => time(), "global" => '0', "mod" => $chatroom_mod, "admin" => $chatroom_admin, "chatroomid" => $chatroomid)));
					}
					$message[] = array('t' => '1', 'm' => "updated");
					$response['error'] = $message;
					header('Content-type: application/json; charset=utf-8');
					echo json_encode($response);
				}
			} else {
				$flood_message = $language[169] . $time_to_talk . $language[170];
				
				$error[] = array('t' => '1', 'm' => $flood_message);
				$response['error'] = $error;
				header('Content-type: application/json; charset=utf-8');
				echo json_encode($response);
			}
		}
		else
		{
			echo "-1";
		}
			
		close_session();
		exit(0);
	}

?>