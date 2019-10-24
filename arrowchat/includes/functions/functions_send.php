<?php

	/*
	|| #################################################################### ||
	|| #                             ArrowChat                            # ||
	|| # ---------------------------------------------------------------- # ||
	|| #    Copyright &#65533;2010-2012 ArrowSuites LLC. All Rights Reserved.    # ||
	|| # This file may not be redistributed in whole or significant part. # ||
	|| # ---------------- ARROWCHAT IS NOT FREE SOFTWARE ---------------- # ||
	|| #   http://www.arrowchat.com | http://www.arrowchat.com/license/   # ||
	|| #################################################################### ||
	*/

	/**
	 * Does everything to turn text into a readable, safe format
	 *
	 * @param	string	$text	The text to convert
	 * @return	string	The new string in a readable, safe format
     *

include ('../../include/bittorrent.php');
include ('user_functions.php');*/

	function sanitize($text)
	{
		global $base_url;
		global $db;
		global $disable_smilies;
		global $language;
		global $smileys;
		global $theme;
		global $blocked_words;
		global $giphy_chatroom_off;
		global $giphy_off;
		
		$text = htmlspecialchars($text, ENT_NOQUOTES);
		$text = preg_replace('/\\\[rn]/', '<br/>', $text);
		
		// Get the theme's directory if it is numeric
		if (is_numeric($theme)) 
		{
			$result = $db->execute("
				SELECT folder 
				FROM arrowchat_themes 
				WHERE id='".$theme."'
			");
			
			if ($result AND $db->count_select() > 0) 
			{
				$row = $db->fetch_array($result);
				$theme = $row['folder'];
			} 
			else 
			{
				$theme = "new_facebook";
			}
		}
		
		if (!empty($blocked_words))
		{
			$bad_words = explode(",", $blocked_words);
			$container_words = array();
			$exact_match_words = array();
			
			foreach ($bad_words as $word)
			{
				$s_word = trim($word);
				
				if (preg_match('/\[(.*?)\]/', $s_word))
				{
					$exact_match_words[] = trim($s_word, '[]');
				}
				else
				{
					$container_words[] = $s_word;
				}
			}

			if (!empty($exact_match_words))
				$text = preg_replace("/\b(" . implode($exact_match_words,"|") . ")\b/i", "****", $text);
				
			if (!empty($container_words))
				$text = preg_replace("/(" . implode($container_words,"|") . ")/i", "****", $text);
		}
		
		if ($disable_smilies != 1) 
		{ 
			$text = preg_replace('/^\[e-([A-Za-z0-9]+)\]$/', '<span class="arrowchat_emoji_text arrowchat_emoji_32"><img src="' . $base_url . 'includes/emojis/img/32/$1.png" alt="" data-id="$1.png" /> </span>', $text);
			$text = preg_replace('/\[e-([A-Za-z0-9]+)\]/', '<span class="arrowchat_emoji_text"><img src="' . $base_url . 'includes/emojis/img/16/$1.png" alt="" data-id="$1.png" /> </span>', $text);
			
			//if (!empty($smileys)) 
			//{
				foreach ($smileys as $pattern => $result) 
				{
					$pattern = str_replace("\;", ";", $pattern);
					$pattern = htmlspecialchars($pattern);
					$text = str_replace($pattern, '<span class="arrowchat_emoji_text"><img src="' . $base_url . 'includes/emojis/img/16/' . $result . '" alt="" /> </span>', $text);
				}
			//}
			
			$premade_smilies = array(
				":)" => "1f600.png",
				":-)" => "1f600.png",
				"=)" => "1f600.png",
				":p" => "1f61b.png",
				":o" => "1f62e.png",
				":|" => "1f610.png",
				":(" => "1f614.png",
				"=(" => "1f614.png",
				":D" => "1f603.png",
				"=D" => "1f603.png",
				":/" => "1f615.png",
				"=/" => "1f615.png",
				";)" => "1f609.png",
				":'(" => "1f62d.png",
				"<3" => "2764.png",
				">:(" => "1f620.png",
                "@" => "@.png"
			);
			
			foreach ($premade_smilies as $pattern => $result) 
			{
				$pattern = str_replace("\;", ";", $pattern);
				$pattern = htmlspecialchars($pattern);
				if ($text == $pattern)
					$text = str_replace($pattern, '<span class="arrowchat_emoji_text"><img src="' . $base_url . 'includes/emojis/img/32/' . $result . '" alt="" /> </span>', $text);
				else
					$text = str_replace(" " . $pattern, ' <span class="arrowchat_emoji_text"><img src="' . $base_url . 'includes/emojis/img/16/' . $result . '" alt="" /> </span>', $text);
			}
		}
		
		$text = preg_replace('@video[{](.*)[}]@', '<div class="arrowchat_action_message">' . $language[61] . '<br /><a href="javascript:jqac.arrowchat.videoWith(\'$1\');">' . $language[62] . '</a></div>', $text);
		
		$text = preg_replace('@file[{]([0-9]{13})[}][{](.*)[}]@', '<div class="arrowchat_action_message">' . $language[69] . '<br /><a href="' . $base_url . 'public/download.php?file=$1">$2</a></div>', $text);
		
		$text = preg_replace('@image[{]([0-9]{13})[}][{](.*)[}]@', '<div class="arrowchat_image_message"><img data-id="' . $base_url . 'public/download.php?file=$1" src="' . $base_url . 'public/download.php?file=$1_t" alt="Image" class="arrowchat_lightbox" /></div>', $text);
		
		if ($giphy_chatroom_off != 1 OR $giphy_off != 1)
		{
			$text = preg_replace('@giphy[{](.*)[}][{](.*)[}]@', '<div class="arrowchat_giphy_message"><img class="arrowchat_lightbox" data-id="$2" src="$2" alt="" style="width:279px" /></div>', $text);
		}
		
		
		
				$tune = array(
				":tunein:",
				":bigstu:",
                ":bigstu1:",
                ":bigstu2:",
			    ":radio1:",
				":radio2:",
				":radio3:",
				":radio4:",
				":radio5:",
				":radio6:",
			);

			foreach ($tune as $pattern => $result) 
			{
				$pattern = str_replace("\;", ";", $pattern);
				$pattern = htmlspecialchars($pattern);	
						$text = preg_replace("/\:tunein:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/radio.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
						$text = preg_replace("/\:tunein2:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/3er.png\" src=\"/arrowchat/includes/emojis/img/16/3er.png\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);

						$text = preg_replace("/\:bigstu:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/bigstu.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
						$text = preg_replace("/\:bigstu1:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/bigstu1.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
						$text = preg_replace("/\:bigstu2:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/bigstu2.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
                $text = preg_replace("/\:phules1:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/phules.gif\" src=\"/arrowchat/includes/emojis/img/16/phules.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
                $text = preg_replace("/\:phules2:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/phules1.png\" src=\"/arrowchat/includes/emojis/img/16/phules1.png\" border=\"0\" alt=\"\" style=\"max-width: 750px;\" /></a>", $text);
                $text = preg_replace("/\:radio1:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/radio1.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
						$text = preg_replace("/\:radio2:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/radio2.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
						$text = preg_replace("/\:radio3:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/radio3.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
						$text = preg_replace("/\:radio4:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/radio4.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
						$text = preg_replace("/\:radio5:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/radio5.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
						$text = preg_replace("/\:radio6:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/radio6.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);

                $text = preg_replace("/\:motown:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/motown.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
                $text = preg_replace("/\:motown1:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/radio.gif\" src=\"/arrowchat/includes/emojis/img/16/motown1.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);

                $text = preg_replace("/\:us:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/us.gif\" src=\"/arrowchat/includes/emojis/img/16/us.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
                $text = preg_replace("/\:us1:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/us1.gif\" src=\"/arrowchat/includes/emojis/img/16/us1.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);
                $text = preg_replace("/\:us2:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/us2.gif\" src=\"/arrowchat/includes/emojis/img/16/us2.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);

                $text = preg_replace("/\:gray:/is", "<a href=\"https://radio.3evils.com:2199/tunein/3evilsdj.pls\"><img data-id=\"/arrowchat/includes/emojis/img/16/gray.gif\" src=\"/arrowchat/includes/emojis/img/16/gray.gif\" border=\"0\" alt=\"\" style=\"max-width: 350px;\" /></a>", $text);


            }





		$text = preg_replace("/\[img\]((http|https):\/\/[^\s'\"<>]+(\.(jpg|gif|png|bmp|jpeg)))\[\/img\]/i", "<div class=\"arrowchat_image_message\"><a href=\"\\1\"><img src=\"\\1\" border=\"0\" alt=\"\" style=\"max-width: 150px;\" /></div></a>", $text);
		$text = preg_replace('/\[yt]([^()<>\s]+?)\[\/yt\]/is', "<iframe width=\"400\" height=\"225\" src=\"https://www.youtube.com/embed/\\1\" frameborder=\"0\" allowfullscreen></iframe>", $text);
			//$text = preg_replace("/\[url=((http|https):\/\/[^\s'\"<>]+(\.(jpg|gif|png)))\[\/img\]/i", "<img  src=\"\\1\" alt=\"\" border=\"0\" /></div>", $text);
		$text = preg_replace_callback("/\[url=((http|https):\/\/[^()<>\s]\s*((\s|.)+?)\s*/\[img\]((http|https):\/\/[^\s'\"<>]+(\.(jpg|gif|png|bmp|jpeg)))\[\/img\]\[\/url\]/is", "<a href=\"\\1\"><img src=\"\\2\" border=\"0\" alt=\"\" style=\"max-width: 150px;\" /></a>", $text);
		$text = preg_replace_callback("/\[url\]([^()<>\s]+?)\[\/url\]/is", "<a href=\"\\1\" rel=\"lightbox\"><img src=\"\\2\" border=\"0\" alt=\"\" style=\"max-width: 150px;\" /></a>", $text);
		$text = preg_replace("/\[color=([a-zA-Z]+)\]\s*((\s|.)+?)\s*\[\/color\]/i","<span style=\"color:\\1;\">\\2</span>", $text);
		$text = preg_replace("/\[color=(#[a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9][a-f0-9])\]\s*((\s|.)+?)\s*\[\/color\]/i","<span style=\"color:\\1;\">\\2</span>", $text);
        $text = preg_replace("/\[size=(.*?)\]\s*((\s|.)+?)\s*\[\/size\]/i","<span style=\"font-size:\\1px;\">\\2</span>", $text);
        $text = preg_replace("/\[m\]\s*((\s|.)+?)\s*\[\/m\]/i","<marquee class=\"style\">\\1</marquee></span>", $text);
      //  $text = preg_replace("/\[you\]/i","{$CURUSER['username']}", $text);




// [b]Bold[/b]
$text = preg_replace("/\[b\]((\s|.)+?)\[\/b\]/", "<b>\\1</b>", $text);

// [i]Italic[/i]
$text = preg_replace("/\[i\]((\s|.)+?)\[\/i\]/", "<i>\\1</i>", $text);
// [u]Underline[/u]
$text = preg_replace("/\[u\]((\s|.)+?)\[\/u\]/", "<u>\\1</u>", $text);

// [u]Underline[/u]
$text = preg_replace("/\[u\]((\s|.)+?)\[\/u\]/i", "<u>\\1</u>", $text);

// [sup]Superscript[/sup]
$text = preg_replace("/\[sup\]((\s|.)+?)\[\/sup\]/i", "<sup>\\1</sup>", $text);

// [sub]Subscript[/sub]
$text = preg_replace("/\[sub\]((\s|.)+?)\[\/sub\]/i", "<sub>\\1</sub>", $text);		


// the [you] tag

$text = preg_replace("/\[you\]/i", $CURUSER['username'], $text);
			return $text;
	}



?>