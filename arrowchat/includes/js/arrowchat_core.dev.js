(function (a) {
	a.arrowchat = function () {

		var $body = a('body');
		var $base;
		var $maintenance;
		var $show_bar_button;
		var $popout_chat_button;
		var $optionsbutton;
		var $optionsbutton_popup;
		var $modbutton;
		var $modbutton_popup;
		var $chatrooms_button;
		var $buddy_list_tab;
		var $userstab_popup;
		var $tooltip = null;
		var $tooltip_content;
		var $chatroom_chat;
		var $chatroom_room_list;
		var $chatrooms_popup;
		var $chatroom_tab = {};
		var $chatroom_create;
		var $chatroom_create_flyout;
		var $application_buttons = {};
		var $application_button_popups = {};
		var $applications_button;
		var $applications_button_popup;
		var $applications_button_popups;
		var $users = [];
		var $user_popups = [];
		var $chatboxes;
		var $chatboxes_wide;
		var $chatbox_left;
		var $unseen_users;
		var $chatroom_admin_controls = "";

		function addHover($elements, classes) {
			$elements.each( function (i, element) {
				a(element).hover(
					function () {
						a(this).addClass(classes);
					}, function () {
						a(this).removeClass(classes);
					}
				);
			});
		}

		function preventScrolling($target) {
			$target.bind('mousewheel DOMMouseScroll', function (e) {
				var e0 = e.originalEvent,
					delta = e0.wheelDelta || -e0.deltaY || -e0.detail;
				this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
				e.preventDefault();
			});
		}
		
		function showLoading($element) {
			a('.arrowchat_hide_loading', $element).hide();
			a('.arrowchat_show_loading', $element).show();
		}

		function hideLoading($element) {
			a('.arrowchat_hide_loading', $element).show();
			a('.arrowchat_show_loading', $element).hide();
		}

		function closePopup($popup, $button, hidden) {
			if ($popup !== undefined) {
				if (hidden == 1) {
					$popup.addClass("arrowchat_tabopen_hidden");
				} else{
					$popup.removeClass("arrowchat_tabopen");
				}
			}
			if ($button !== undefined) {
				$button.removeClass("arrowchat_tabclick arrowchat_userstabclick arrowchat_trayclick arrowchat_usertabclick");
			}
		}

		function hideTooltip() {
			if ($tooltip) {
				$tooltip.hide();
			}
		}

		function showTooltip($target, text, is_left, custom_left, custom_top, is_sideways, is_sideways_right) {
			if ($tooltip === null) {
				$tooltip = a('<div id="arrowchat_tooltip"><div class="arrowchat_tooltip_content"></div></div>').appendTo($body);
				$tooltip_content = a('.arrowchat_tooltip_content', $tooltip);
			}
			$tooltip_content.html(text);
			var target_offset = $target.offset();
			var target_width = $target.width();
			var target_height = $target.height();
			var tooltip_width = $tooltip.width();
			if (!custom_left) {
				custom_left = 0;
			}
			if (!custom_top) {
				custom_top = 0;
			}
			if (is_left) {
				$tooltip.css({
					top				: target_offset.top - a(window).scrollTop() - target_height - 5 - custom_top,
					left			: target_offset.left + target_width - 16 - custom_left,
					display			: "block",
					'padding-right' : "0px",
					'padding-left' : "0px"
				}).addClass("arrowchat_tooltip_left");
			} else if (is_sideways_right) {
				$tooltip.css({
					top				: target_offset.top - a(window).scrollTop() + (target_height/2) - 10 - custom_top,
					left			: target_offset.left + target_width + 28 - custom_left,
					display			: "block",
					'background-position'	: "-113px -58px",
					'padding-right' : "0px",
					'padding-left' : "6px"
				}).removeClass("arrowchat_tooltip_left");
			} else if (is_sideways) {
				$tooltip.css({
					top				: target_offset.top - a(window).scrollTop() - target_height - 5 - custom_top,
					left			: target_offset.left + target_width - tooltip_width + 18 - custom_left,
					display			: "block",
					'background-position'	: tooltip_width - 128 + "px -58px",
					'padding-right' : "6px",
					'padding-left' : "0px"
				}).removeClass("arrowchat_tooltip_left");
			} else {
				$tooltip.css({
					top				: target_offset.top - a(window).scrollTop() - target_height - 5 - custom_top,
					left			: target_offset.left + target_width - tooltip_width + 18 - custom_left,
					display			: "block",
					'background-position'	: tooltip_width - 23 + "px -114px",
					'padding-right' : "0px",
					'padding-left' : "0px"
				}).removeClass("arrowchat_tooltip_left");
			}
			if (W) {
				$tooltip.css("position", "absolute");
				$tooltip.css(
					"top", 
					parseInt(a(window).height()) - parseInt($tooltip.css("bottom")) - parseInt($tooltip.height()) + a(window).scrollTop() + "px"
				);
			}
		}

		function replaceURLWithHTMLLinks(text) {
			return anchorme.js(text);
		}

		RegExp.escape = function(text) {
			return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		};

		function smileyreplace(mess) {
			if (c_disable_smilies != 1) {
				mess = mess.replace(/^\[e-([A-Za-z0-9]+)\]$/g, function(match, contents, offset, s) 
					{
						return '<span class="arrowchat_emoji_text arrowchat_emoji_32"><img src="' + c_ac_path + 'includes/emojis/img/32/' + contents + '.png" alt="" data-id="' + contents + '.png" /> </span>';
					}
				);
				mess = mess.replace(/\[e-([A-Za-z0-9]+)\]/g, function(match, contents, offset, s) 
					{
						return '<span class="arrowchat_emoji_text"><img src="' + c_ac_path + 'includes/emojis/img/16/' + contents + '.png" alt="" data-id="' + contents + '.png" /> </span>';
					}
				);
				for (var i = 0; i < Smiley.length; i++) {
					var smiley_test = Smiley[i][1].replace(/</g, "&lt;").replace(/>/g, "&gt;");
					var check_emoticon = mess.lastIndexOf(smiley_test);
					if (check_emoticon != -1) {
						mess = mess.replace(
							new RegExp(RegExp.escape(smiley_test), 'g'),
							'<span class="arrowchat_emoji_text"><img src="' + c_ac_path + 'includes/emojis/img/16/' + Smiley[i][0] + '" alt="" /> </span>'
						);
					}
				}
				for (var i = 0; i < premade_smiley.length; i++) {
					var smiley_test = premade_smiley[i][0].replace(/</g, "&lt;").replace(/>/g, "&gt;");
					var check_emoticon = mess.lastIndexOf(smiley_test);
					if (check_emoticon != -1) {
						if (mess == smiley_test) {
							mess = mess.replace(
								new RegExp(RegExp.escape(smiley_test), 'g'),
								'<span class="arrowchat_emoji_text"><img src="' + c_ac_path + 'includes/emojis/img/16/' + premade_smiley[i][1] + '" alt="" /> </span>'
							);
						} else {
							mess = mess.replace(
								new RegExp(RegExp.escape(" " + smiley_test), 'g'),
								' <span class="arrowchat_emoji_text"><img src="' + c_ac_path + 'includes/emojis/img/16/' + premade_smiley[i][1] + '" alt="" /> </span>'
							);
						}
					}
				}
			}
			return mess;
		}

		function chatroomKeydown(key, $element) {
			if (key.keyCode == 13 && key.shiftKey == 0) {
				var i = $element.val();
				i = i.replace(/^\s+|\s+$/g, "");
				$element.val("");
				$element.css("height", "18px");
				$element.css("overflow-y", "hidden");
				$element.focus();
				if (c_send_room_msg == 1 && i != "") {
					displayMessage("arrowchat_chatroom_message_flyout", lang[209], "error");
				} else {
					i != "" && a.ajax({
						url: c_ac_path + "includes/json/send/send_message_chatroom.php",
						type: "post",
						cache: false,
						dataType: "json",
						data: {
							userid: u_id,
							username: u_name,
							chatroomid: Ccr,
							message: i
						},
						beforeSend: function () {
							a(".arrowchat_chatroom_message_input").addClass("arrowchat_message_sending");
						},
						error: function () {
							a(".arrowchat_chatroom_message_input").removeClass("arrowchat_message_sending");
							displayMessage("arrowchat_chatroom_message_flyout", lang[135], "error");
						},
						success: function (o) {
							a(".arrowchat_chatroom_message_input").removeClass("arrowchat_message_sending");
							if (o) {
								var is_json = true;
								if (a.isNumeric(o)) is_json = false;
								var no_error = true;
								if (is_json) {
									o && a.each(o, function (i, e) {
										if (i == "error") {
											a.each(e, function (l, f) {
												no_error = false;
												displayMessage("arrowchat_chatroom_message_flyout", f.m, "error");
											});
										}
									});
								}
								
								if (no_error) {
									addMessageToChatroom(o, u_name, i);
									var data_array = [o, u_name, i, Ccr];
									lsClick(JSON.stringify(data_array), 'send_chatroom_message');
									$chatroom_chat.scrollTop($chatroom_chat[0].scrollHeight)
								}
							}
						}
					});
				}
				return false
			}
		}

		function userchatKeydown(key, $element, typing, jabber) {
			if (jabber != 1) {
				clearTimeout(pa);
				pa = setTimeout(function () {
					a.post(c_ac_path + "includes/json/send/send_typing.php", {
						userid: u_id,
						typing: typing,
						untype: 1
					}, function () {});
					fa = -1
				}, 5E3);
				if (fa != typing) {
					a.post(c_ac_path + "includes/json/send/send_typing.php", {
						userid: u_id,
						typing: typing
					}, function () {});
					fa = typing
				}
			}
			if (key.keyCode == 13 && key.shiftKey == 0) {
				var i = $element.val();
				i = i.replace(/^\s+|\s+$/g, "");
				$element.val("").css({
					height: '18px',
					'overflow-y': 'hidden'
				}).focus();
				if (c_send_priv_msg == 1 && i != "") {
					displayMessage("arrowchat_chatbox_message_flyout_" + typing, lang[209], "error");
				} else {
					i != "" && a.ajax({
						url: c_ac_path + "includes/json/send/send_message.php",
						type: "post",
						cache: false,
						dataType: "json",
						data: {
							userid: u_id,
							to: typing,
							message: i
						},
						beforeSend: function () {
							a(".arrowchat_textarea").addClass("arrowchat_message_sending");
						},
						error: function () {
							a(".arrowchat_textarea").removeClass("arrowchat_message_sending");
							displayMessage("arrowchat_chatbox_message_flyout_" + typing, lang[135], "error");
						},
						success: function (e) {
							a(".arrowchat_textarea").removeClass("arrowchat_message_sending");
							if (e) {
								if (e == "-1") {
									displayMessage("arrowchat_chatbox_message_flyout_" + typing, lang[102], "error");
								} else {
									clearTimeout(pa);
									fa = -1;
									var time = Math.floor((new Date).getTime() / 1E3);
									addMessageToChatbox(typing, i, "1", "1", e, 1, time);
									var data_array = [e, typing, i, time, 1, 1];
									lsClick(JSON.stringify(data_array), 'private_message');
								}
							}
							K = 1;
						}
					});
				}
				return false;
			}
		}

		function resizeChatfield($element) {
			var height = $element[0].clientHeight;
			if (height < 94) {
				height = Math.max($element[0].scrollHeight, height);
				height = Math.min(94, height);
				if (height > $element[0].clientHeight) {
					$element.css("height", height + 3 + "px")
				}
			} else {
				$element.css("overflow-y", "auto");
			}
		}

		function chatroomKeyup(b, $element) {
			resizeChatfield($element);
			$chatroom_chat.scrollTop($chatroom_chat[0].scrollHeight)
		}

		function userchatKeyup(key, $element, d) {
			if (a(".arrowchat_smiley_popout", $user_popups[d]).children(".arrowchat_more_popout").is(":visible")) {
				a(".arrowchat_smiley_popout", $user_popups[d]).children(".arrowchat_more_popout").hide();
			}
			resizeChatfield($element);
			a(".arrowchat_tabcontenttext", $user_popups[d]).scrollTop(a(".arrowchat_tabcontenttext", $user_popups[d])[0].scrollHeight)
		}

		function clearUserStatus() {
			a("#arrowchat_userstab_icon").removeClass("arrowchat_user_available2 arrowchat_user_busy2 arrowchat_user_invisible2 arrowchat_user_away2");
		}

		function setUserStatus(status) {
			a("#arrowchat_userstab_icon").removeClass("arrowchat_user_available2 arrowchat_user_busy2 arrowchat_user_invisible2");
			a.post(c_ac_path + "includes/json/send/send_status.php", {
				userid: u_id,
				status: status
			}, function () {})
		}

		function showUserOffline() {
			w = 1;
			clearUserStatus();
			a("#arrowchat_userstab_icon").addClass("arrowchat_user_invisible2");
			setUserStatus("offline");
			closePopup($userstab_popup, $buddy_list_tab);
			closePopup($optionsbutton_popup, $optionsbutton);
			closePopup($modbutton_popup, $modbutton);
			if (a('#arrowchat_chatbox_left').hasClass('arrowchat_unseen_list_open'))
				a('#arrowchat_chatbox_left').click();
			a("#arrowchat_userstab_text").html(lang[7])
		}

		function buildMaintenance() {
			$maintenance = a(ArrowChat.Templates.maintenance_tab(c_login_url)).appendTo($base);
			$maintenance.mouseover(function () {
				if (c_db_connection == "1") {
					showTooltip($maintenance, "We couldn't connect to the database. Please try again later.");
				} else if (c_guests_login_msg == "1" && u_id == "") {
					showTooltip($maintenance, lang[58]);
				} else {
					showTooltip($maintenance, lang[27]);
				}
				a(this).addClass("arrowchat_tabmouseover")
			});
			$maintenance.mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				hideTooltip();
			});
		}

		function buildHideBarButton() {
			$hide_bar_button = a(ArrowChat.Templates.bar_hide_tab()).appendTo($base);
			$hide_bar_button.mouseover(function () {
				showTooltip($hide_bar_button, lang[14]);
				a(this).addClass("arrowchat_tabmouseover")
			});
			$hide_bar_button.mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				hideTooltip();
			});
			$hide_bar_button.click(function () {
				lsClick("#arrowchat_hide_bar_button", 'ac_click');
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					hide: "1"
				});
				showUserOffline();
				closePopup($chatrooms_popup, $chatrooms_button);
				closePopup($applications_button_popup, $applications_button);
				if (m != "") {
					closePopup($application_button_popups[m], $application_buttons[m]);
					m = "";
				}
				if (j != "") {
					closePopup($user_popups[j], $users[j]);
					a(".arrowchat_closebox_bottom", $users[j]).removeClass("arrowchat_closebox_bottom_click");
					j = "";
				}
				clearTimeout(Z);
				clearTimeout(Crref2);
				a.idleTimer("destroy");
				pushCancelAll();
				cancelJSONP();
				$base.hide();
				$show_bar_button.show()
			})
		}

		function buildShowBarButton() {
			$show_bar_button = a(ArrowChat.Templates.bar_show_tab()).appendTo($body);
			$show_bar_button.mouseover(function () {
				showTooltip($show_bar_button, lang[15]);
				a(this).addClass("arrowchat_tabmouseover")
			});
			$show_bar_button.mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				hideTooltip();
			});
			$show_bar_button.click(function () {
				showBar();
			})
		}
		
		function showBar() {
			lsClick("#arrowchat_show_bar_button", 'ac_click');
			a.post(c_ac_path + "includes/json/send/send_settings.php", {
				hide: "-1"
			});
			setUserStatus("available");
			a("#arrowchat_userstab_icon").addClass("arrowchat_user_available2");
			w = 0;
			loadBuddyList();
			pushSubscribe();
			receiveCore();
			a.idleTimer(60000 * ArrowChat.IdleTime);
			$show_bar_button.hide();
			$base.show();
		}
		
		function startCreateChatRoom() {
			var i = a("#arrowchat_chatroom_create_input").val();
			var passinput = a("#arrowchat_chatroom_create_password_input").val();
			var descinput = a("#arrowchat_chatroom_create_desc_input").val();
			var welcomeinput = a("#arrowchat_chatroom_create_welcome_input").val();
			a(".arrowchat_chatroom_full_content").removeClass("arrowchat_chatroom_opacity");
			a("#arrowchat_chatroom_create_input").val("");
			a("#arrowchat_chatroom_create_password_input").val("");
			a("#arrowchat_chatroom_create_desc_input").val("");
			a("#arrowchat_chatroom_create_welcome_input").val("");
			i = i.replace(/^\s+|\s+$/g, "");
			i != "" && a.post(c_ac_path + "includes/json/send/send_chatroom_create.php", {
				userid: u_id,
				name: i,
				password: passinput,
				description: descinput,
				welcome: welcomeinput
			}, function (e) {
				if (e) {
					$chatroom_create_flyout.hide("slide", { direction: "up"}, 250);
					a("#arrowchat_chatroom_options_flyout").removeClass("arrowchat_chatroom_options_flyout_display");
					if (e == "-1") {
						displayMessage("arrowchat_chatroom_message_flyout", lang[39], "error");
					} else if (e == "-2") {
						displayMessage("arrowchat_chatroom_message_flyout", lang[40], "error");
					} else {
						chatroomreceived = 0;
						loadChatroomList();
					}
				}
			});
		}

		function buildChatroomsButton() {
			$chatrooms_button = a(ArrowChat.Templates.chatrooms_tab()).appendTo($base);
			$chatrooms_popup = a(ArrowChat.Templates.chatrooms_window()).css("display", "none").appendTo($body);
			$chatroom_create = a("#arrowchat_chatroom_create");
			$chatroom_create_flyout = a("#arrowchat_chatroom_create_flyout");
			$chatrooms_button.css("width", c_width_chatroom + "px");
			addHover(a("#arrowchat_chatroom_add_tab"), "arrowchat_add_tab_hover");
			a("#arrowchat_chatroom_add_tab").mouseover(function () {
				showTooltip(a("#arrowchat_chatroom_add_tab"), lang[217], 0, -2, 14, 0, 0);
			});
			a("#arrowchat_chatroom_add_tab").mouseout(function () {
				hideTooltip();
			});
			a("#arrowchat_chatroom_add_tab").click(function () {
				lsClick("#arrowchat_chatroom_add_tab", 'ac_click');
				hideTooltip();
				if (Object.keys($chatroom_tab).length <= 2) {
					a("#arrowchat_chatroom_open_chats").hide();
					a(".arrowchat_chatroom_tab").removeClass("arrowchat_chatroom_tab_focused");
					a("#arrowchat_chatroom_leave").click();
				} else {
					displayMessage("arrowchat_chatroom_message_flyout", lang[218], "error");
				}
			});
			a("#arrowchat_chatroom_create_input").placeholder();
			a("#arrowchat_chatroom_create_password_input").placeholder();
			if (c_width_chatroom <= 25) {
				a("#arrowchat_chatrooms_text", $chatrooms_button).hide();
			}
			if (u_chatroom_block_chats == 1) { 
				a("#arrowchat_chatroom_block :input").prop("checked", true)
			} else {
				a("#arrowchat_chatroom_block").addClass("arrowchat_menu_unchecked");
				a("#arrowchat_chatroom_block :input").prop("checked", false)
			}
			if (u_chatroom_sound == 1) { 
				a("#arrowchat_chatroom_sound :input").prop("checked", true)
			} else {
				a("#arrowchat_chatroom_sound").addClass("arrowchat_menu_unchecked");
				a("#arrowchat_chatroom_sound :input").prop("checked", false)
			}
			if (u_chatroom_show_names == 1) { 
				a("#arrowchat_chatroom_show_names :input").prop("checked", true)
			} else {
				a("#arrowchat_chatroom_show_names").addClass("arrowchat_menu_unchecked");
				a("#arrowchat_chatroom_show_names :input").prop("checked", false)
			}
			if (u_chatroom_stay != "-1") { 
				a("#arrowchat_chatroom_stay :input").prop("checked", true)
			} else {
				a("#arrowchat_chatroom_stay").addClass("arrowchat_menu_unchecked");
				a("#arrowchat_chatroom_stay :input").prop("checked", false)
			}
			if (u_chatroom_open != "-1") { 
				a("#arrowchat_chatroom_window :input").prop("checked", true)			} else {
				a("#arrowchat_chatroom_window").addClass("arrowchat_menu_unchecked");
				a("#arrowchat_chatroom_window :input").prop("checked", false)
			}
			if (c_user_chatrooms == "0") {
				$chatroom_create.hide();
			}
			$chatrooms_button.click(function () {
				lsClick("#arrowchat_chatrooms_button", 'ac_openclose');
				count = 0;
				if (c_width_chatroom <= 25) {
					hideTooltip();
				}
				if (a(".arrowchat_tabalert", $chatrooms_button).length > 0) {
					a(".arrowchat_tabalert", $chatrooms_button).remove();
					$chatrooms_button.removeClass("arrowchat_tab_new_message")
				}
				loadChatroomList();
				closePopup($userstab_popup, $buddy_list_tab);
				closePopup($optionsbutton_popup, $optionsbutton);
				closePopup($modbutton_popup, $modbutton);
				$chatrooms_popup.css("left", $chatrooms_button.offset().left - $chatrooms_popup.outerWidth() + $chatrooms_button.outerWidth()).css("bottom", "25px");
				a(this).toggleClass("arrowchat_tabclick").toggleClass("arrowchat_userstabclick");				
				$chatrooms_popup.toggleClass("arrowchat_tabopen");
				if ($chatroom_chat !== undefined) {
					$chatroom_chat.scrollTop(5E4);
				}
				a(".arrowchat_chatroom_message_input").focus();
			});
			$chatrooms_button.mouseover(function () {
				if (c_width_chatroom <= 25) {
					if ($chatrooms_button.hasClass("arrowchat_tabclick")) {} else {
						showTooltip($chatrooms_button, lang[19]);
					}
				}
				a(this).addClass("arrowchat_tabmouseover")
			});
			$chatrooms_button.mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				hideTooltip();
			});
			preventScrolling(a(".arrowchat_chatroom_content"));
			if (a.cookie('arrowchat_no_userlist') == 1) {
				a(".arrowchat_chatroom_full_content").addClass("arrowchat_no_userlist");
			}
			a("#arrowchat_chatroom_userlist_button").click(function() {
				if (a(".arrowchat_chatroom_full_content").hasClass("arrowchat_no_userlist")) {
					a.cookie('arrowchat_no_userlist', 0, {expires: 365, path: '/'});
					a(".arrowchat_chatroom_full_content").removeClass("arrowchat_no_userlist");
				} else {
					a.cookie('arrowchat_no_userlist', 1, {expires: 365, path: '/'});
					a(".arrowchat_chatroom_full_content").addClass("arrowchat_no_userlist");
				}
				a(".arrowchat_chatroom_message_input").focus();
			});
			a("#arrowchat_chatroom_password_input").keydown(function (h) {
				if (h.keyCode == 13) {
					c = a("#arrowchat_chatroom_password_id").val();
					a("#arrowchat_chatroom_password_flyout").hide();
					input_value = a("#arrowchat_chatroom_password_input").val();
					a("#arrowchat_chatroom_password_input").val("");
					input_value = input_value.replace(/^\s+|\s+$/g, "");
					a(".arrowchat_chatroom_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
					$chatroom_create.hide();
					Ccr = c;
					loadChatroom(c, crt[c], input_value)
				}
			});
			a(".arrowchat_chatroom_create_options").click(function () {
				a(".arrowchat_chatroom_create_options_wrapper").show();
				a(".arrowchat_chatroom_create_input").prop('disabled', false);
			});
			a("#arrowchat_password_cancel_button").click(function () {
				a(".arrowchat_chatroom_full_content").removeClass("arrowchat_chatroom_opacity");
				a(".arrowchat_chatroom_list").removeClass("arrowchat_chatroom_clicked");
				a("#arrowchat_chatroom_password_flyout").hide("slide", { direction: "up"}, 250);
			});
			a("#arrowchat_create_cancel_button").click(function () {
				$chatroom_create_flyout.hide("slide", { direction: "up"}, 250);
				a(".arrowchat_chatroom_full_content").removeClass("arrowchat_chatroom_opacity");
			});
			a("#arrowchat_password_button").click(function () {
				c = a("#arrowchat_chatroom_password_id").val();
				a("#arrowchat_chatroom_password_flyout").hide();
				input_value = a("#arrowchat_chatroom_password_input").val();
				a("#arrowchat_chatroom_password_input").val("");
				input_value = input_value.replace(/^\s+|\s+$/g, "");
				a(".arrowchat_chatroom_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
				$chatroom_create.hide();
				Ccr = c;
				loadChatroom(c, crt[c], input_value)
			});
			a("#arrowchat_chatroom_stay").click(function () {
				a(this).toggleClass("arrowchat_menu_unchecked");
				if (a("#arrowchat_chatroom_stay :input").is(":checked")) {
					a("#arrowchat_chatroom_stay :input").prop("checked", false);
					_chatroomstay = -1;
				} else {
					a("#arrowchat_chatroom_stay :input").prop("checked", true);
					u_chatroom_stay = Ccr;
					_chatroomstay = Ccr;
				}
				if (a("#arrowchat_chatroom_window :input").is(":checked")) {
					a("#arrowchat_chatroom_window").toggleClass("arrowchat_menu_unchecked");
					a("#arrowchat_chatroom_window :input").prop("checked", false);
				}
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					chatroom_stay: _chatroomstay
				}, function () {
				});
			});
			a("#arrowchat_chatroom_window").click(function () {
				a(this).toggleClass("arrowchat_menu_unchecked");
				if (a("#arrowchat_chatroom_window :input").is(":checked")) {
					a("#arrowchat_chatroom_window :input").prop("checked", false);
					_chatroomwindow = -1;
				} else {
					a("#arrowchat_chatroom_window :input").prop("checked", true);
					u_chatroom_open = Ccr;
					_chatroomwindow = Ccr;
				}
				if (a("#arrowchat_chatroom_stay :input").is(":checked")) {
					a("#arrowchat_chatroom_stay").toggleClass("arrowchat_menu_unchecked");
					a("#arrowchat_chatroom_stay :input").prop("checked", false);
				}
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					chatroom_window: _chatroomwindow
				}, function () {
				})
			});
			a("#arrowchat_chatroom_block").click(function () {	
				lsClick("#arrowchat_chatroom_block", 'ac_click');
				a(this).toggleClass("arrowchat_menu_unchecked");
				if (a("#arrowchat_chatroom_block :input").is(":checked")) {
					a("#arrowchat_chatroom_block :input").prop("checked", false);
					_chatroomblock = -1;
				} else {
					a("#arrowchat_chatroom_block :input").prop("checked", true);
					_chatroomblock = 1;
				}
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					chatroom_block_chats: _chatroomblock
				}, function () {
				})
			});
			a("#arrowchat_chatroom_sound").click(function () {
				lsClick("#arrowchat_chatroom_sound", 'ac_click');
				a(this).toggleClass("arrowchat_menu_unchecked");
				if (a("#arrowchat_chatroom_sound :input").is(":checked")) {
					a("#arrowchat_chatroom_sound :input").prop("checked", false);
					_chatroomsound = -1;
					u_chatroom_sound = 0;
				} else {
					a("#arrowchat_chatroom_sound :input").prop("checked", true);
					_chatroomsound = 1;
					u_chatroom_sound = 1;
				}
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					chatroom_sound: _chatroomsound
				}, function () {
				})
			});
			a("#arrowchat_chatroom_show_names").click(function () {
				lsClick("#arrowchat_chatroom_show_names", 'ac_click');
				a(this).toggleClass("arrowchat_menu_unchecked");
				if (a("#arrowchat_chatroom_show_names :input").is(":checked")) {
					a("#arrowchat_chatroom_show_names :input").prop("checked", false);
					_chatroomshownames = -1;
					u_chatroom_show_names = 0;
					a(".arrowchat_chatroom_message_name").hide();
					a(".arrowchat_chatroom_message_avatar").addClass("arrowchat_no_names");
					$chatroom_chat.scrollTop(5E4);
				} else {
					a("#arrowchat_chatroom_show_names :input").prop("checked", true);
					_chatroomshownames = 1;
					u_chatroom_show_names = 1;
					a(".arrowchat_chatroom_message_name").show();
					a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_no_names");
					$chatroom_chat.scrollTop(5E4);
				}
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					chatroom_show_names: _chatroomshownames
				}, function () {
				})
			});
			a(".arrowchat_chatrooms_title", $chatrooms_popup).click(function () {
				$chatrooms_button.click()
			}).children().not(".arrowchat_tab_name").click(function () {
				return false;
			});
			a(".arrowchat_chatrooms_title", $chatrooms_popup).mouseenter(function () {
				a(this).addClass("arrowchat_chatboxtabtitlemouseover3")
			});
			a(".arrowchat_chatrooms_title", $chatrooms_popup).mouseleave(function () {
				a(this).removeClass("arrowchat_chatboxtabtitlemouseover3")
			});
			a("#arrowchat_chatroom_create_input").keydown(function (h) {
				if (h.keyCode == 13) {
					startCreateChatRoom();
				}
			});
			a("#arrowchat_create_button").click(function () {
				startCreateChatRoom();
			});
			a("#arrowchat_chatroom_leave").click(function () {
				lsClick("#arrowchat_chatroom_leave", 'ac_click');
				if (a.isEmptyObject($chatroom_tab)) {
					clearTimeout(Crref2);
				}
				if (a(".arrowchat_smiley_box", $chatrooms_popup).is(":visible")) {
					a(".arrowchat_smiley_box", $chatrooms_popup).hide("slide", { direction: "up"}, 250, function() {});
				}
				if (a("#arrowchat_chatroom_options_flyout", $chatrooms_popup).is(":visible")) a(".arrowchat_chatroom_item2").click();
				if ($chatroom_admin_controls.length) $chatroom_admin_controls.remove();
				a(".arrowchat_chatrooms_title .arrowchat_tab_name").html(lang[19]);
				a(".arrowchat_chatroom_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
				a("#arrowchat_chatroom_leave").hide();
				a(".arrowchat_chatroom_popout").hide();
				if (c_user_chatrooms == "1") {
					$chatroom_create.show();
				}
				chatroom_popout = "";
				chatroomreceived = 0;
				u_chatroom_stay = Ccr;
				loadChatroomList();
				var retain_ccr = Ccr;
				Ccr = 0;
				if (c_push_engine != 1) {
					cancelJSONP();
					receiveCore();
				}
			});
			a(".arrowchat_chatroom_leave").mouseenter(function () {				
				showTooltip(a(this), lang[92], 0, 10, 5);
				a(this).addClass("arrowchat_chatroom_leave_hover");
				a("#arrowchat_chatrooms_popup .arrowchat_chatrooms_title").removeClass("arrowchat_chatboxtabtitlemouseover3")
			});
			a(".arrowchat_chatroom_leave").mouseleave(function () {
				a(this).removeClass("arrowchat_chatroom_leave_hover");
				a("#arrowchat_chatrooms_popup .arrowchat_chatrooms_title").addClass("arrowchat_chatboxtabtitlemouseover3");
				hideTooltip();
			});
			function i() {
				a("#arrowchat_chatroom_options_flyout").removeClass("arrowchat_chatroom_options_flyout_display");
			}
			a(".arrowchat_chatroom_item").click(function () {
				i();
				if (a(".arrowchat_chatroom_item2").hasClass("arrowchat_more_button_selected")) {
					a(".arrowchat_chatroom_item2").toggleClass("arrowchat_more_button_selected");
				}
				if (!$chatroom_create_flyout.is(":visible")) {
					$chatroom_create_flyout.show("slide", { direction: "up"}, 250, function() {
						a("#arrowchat_chatroom_create_input").focus();
					});
					a(".arrowchat_chatroom_full_content").addClass("arrowchat_chatroom_opacity");
				} else {
					$chatroom_create_flyout.hide("slide", { direction: "up"}, 250);
					a(".arrowchat_chatroom_full_content").removeClass("arrowchat_chatroom_opacity");
				}
				if (a("#arrowchat_chatroom_password_flyout").is(":visible")) {
					a(".arrowchat_chatroom_list").removeClass("arrowchat_chatroom_clicked");
					a("#arrowchat_chatroom_password_flyout").hide("slide", { direction: "up"}, 250);
				}
			});
			a(".arrowchat_chatroom_item").mouseenter(function () {
				showTooltip(a(this), lang[93], 0, 10, 5);
				a(this).parent().addClass("arrowchat_chatroom_create_hover");
				a("#arrowchat_chatrooms_popup .arrowchat_chatrooms_title").removeClass("arrowchat_chatboxtabtitlemouseover3")
			});
			a(".arrowchat_chatroom_item").mouseleave(function () {
				hideTooltip();
				a(this).parent().removeClass("arrowchat_chatroom_create_hover");
				a("#arrowchat_chatrooms_popup .arrowchat_chatrooms_title").addClass("arrowchat_chatboxtabtitlemouseover3")
			});
			a(".arrowchat_chatroom_item2").click(function () {
				a("#arrowchat_chatroom_options_flyout").children(".arrowchat_inner_menu").show();
				a(".arrowchat_flood_menu").hide();
				hideTooltip();
				if ($chatroom_create_flyout.is(":visible")) {
					$chatroom_create_flyout.hide("slide", { direction: "up"}, 250);
				}
				if (a("#arrowchat_chatroom_password_flyout").is(":visible")) {
					a("#arrowchat_chatroom_password_flyout").hide("slide", { direction: "up"}, 250);
					a(".arrowchat_chatroom_list").removeClass("arrowchat_chatroom_clicked");
				}
				a(".arrowchat_chatroom_full_content").removeClass("arrowchat_chatroom_opacity");
				a("#arrowchat_chatroom_options_flyout").toggleClass("arrowchat_chatroom_options_flyout_display");
				a(this).addClass("arrowchat_more_button_hover");
				a(this).toggleClass("arrowchat_more_button_selected");
			});
			a(".arrowchat_chatroom_item2").mouseenter(function () {
				showTooltip(a(this), lang[23], 0, 10, 5);
				a(this).parent().addClass("arrowchat_more_button_hover");
				a("#arrowchat_chatrooms_popup .arrowchat_chatrooms_title").removeClass("arrowchat_chatboxtabtitlemouseover3")
			});
			a(".arrowchat_chatroom_item2").mouseleave(function () {
				hideTooltip();
				a(this).parent().removeClass("arrowchat_more_button_hover");
				a("#arrowchat_chatrooms_popup .arrowchat_chatrooms_title").addClass("arrowchat_chatboxtabtitlemouseover3")
			});
		}

		function buildApplicationButtons() {
			var pold = apps.slice();

			function mysortfn(a, b) {
				if (a[13] < b[13]) return -1;
				if (a[13] > b[13]) return 1;
				return 0;
			}
			apps.sort(mysortfn);
			for (b in apps) {
				if (typeof apps[b][0] != "undefined") {
					if (apps[b][10] == "" || apps[b][10] == 0) apps[b][10] = 16;
					$application_buttons[apps[b][0]] = a("<div/>").attr("id", "arrowchat_applications_button_" + apps[b][0]).addClass("arrowchat_appname_" + apps[b][2]).addClass("arrowchat_bar_left").addClass("arrowchat_apps_button").css("width", apps[b][10] + "px").html(ArrowChat.Templates.applications_bookmarks_tab(c_ac_path, apps, b)).appendTo($base);
					if ((apps[b][12] == "1" || (apps[b][9] != "1" && u_id == "") || (u_id != "" && apps[b][9] != "1" && u_is_guest == "1")) && c_no_apps_menu != 1) {
						$application_buttons[apps[b][0]].hide();
					}
					if (apps[b][6] == "") {
						$application_button_popups[apps[b][0]] = a("<div/>").attr("id", "arrowchat_applications_button_" + apps[b][0] + "_popup").addClass("arrowchat_apppopup").css("display", "none").html(ArrowChat.Templates.applications_bookmarks_window(c_ac_path, apps, b)).appendTo($body);
					}
				}
			}
			apps = pold.slice();
			a(".arrowchat_app_keep_open").addClass("arrowchat_menu_unchecked");
			a(".arrowchat_app_keep_open :input").prop("checked", false);
			if (u_apps_open != "" && u_apps_open != "0") { 
				a("#arrowchat_app_keep_open_"+u_apps_open+" :input").prop("checked", true);
				a("#arrowchat_app_keep_open_"+u_apps_open).removeClass("arrowchat_menu_unchecked");
			}
			a(".arrowchat_apps_button").mouseover(function () {
				var c = a(this).attr("id").substr(30);
				if ($application_buttons[c].hasClass("arrowchat_trayclick")) {} else {
					if (apps[c][10] <= 16 || apps[c][10] == "") showTooltip($application_buttons[c], apps[c][1], true);
				}
				a(this).addClass("arrowchat_tabmouseover")
			});
			a(".arrowchat_apps_button").mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				hideTooltip();
			});
			a(".arrowchat_traytitle").click(function () {
				var e = a(this).parent().attr("id");
				e = e.substring(30, e.length - 6);
				if ($application_buttons[e]) {
					$application_buttons[e].click();
				}
			}).children().not(".arrowchat_tab_name").click(function () {
					return false;
			});;
			a(".arrowchat_traytitle").each( function (i, element) {
				a(element).mouseenter(function () {
					a(this).addClass("arrowchat_chatboxtabtitlemouseover")
				});
				a(element).mouseleave( function () {
					a(this).removeClass("arrowchat_chatboxtabtitlemouseover")
				});
			});
			a(".arrowchat_traytitle .arrowchat_more_button").each( function (i, element) {
				a(element).mouseenter(function () {
					showTooltip(a(this), lang[23], 0, 10, 5);
					a(this).addClass("arrowchat_more_button_hover");
					a(".arrowchat_traytitle").removeClass("arrowchat_chatboxtabtitlemouseover")
				});
				a(element).mouseleave( function () {
					hideTooltip();
					a(this).removeClass("arrowchat_more_button_hover");
					a(".arrowchat_traytitle").addClass("arrowchat_chatboxtabtitlemouseover")
				});
			});
			a(".arrowchat_traytitle .arrowchat_more_anchor").click(function () {
				hideTooltip();
				var c = a(this).attr("id").substr(20);
				a("#arrowchat_apps_more_popout_" + c).toggle();
				a(this).addClass("arrowchat_more_button_hover");
				a(this).toggleClass("arrowchat_more_button_selected");			});
			addHover(a(".arrowchat_menu_item"), "arrowchat_more_hover");
			a(".arrowchat_app_keep_open").click(function () {
				var c = a(this).attr("id").substr(24);
				a(".arrowchat_app_keep_open").addClass("arrowchat_menu_unchecked");
				if (a("#arrowchat_app_keep_open_"+c+" :input").is(":checked")) {
					a("#arrowchat_app_keep_open_"+c+" :input").prop("checked", false);
					var keep_open_id = -1;
					u_apps_open = "";
				} else {
					a(".arrowchat_app_keep_open :input").prop("checked", false);
					a("#arrowchat_app_keep_open_"+c+" :input").prop("checked", true);
					var keep_open_id = c;
					u_apps_open = c;
					a(this).removeClass("arrowchat_menu_unchecked");
				}
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					app_keep: keep_open_id
				}, function () {				});
			});			
			a(".arrowchat_apps_button").click(function () {
				var c = a(this).attr("id").substr(30);
				closePopup($applications_button_popup, $applications_button);
				a(this).children(".arrowchat_tabalert").remove();
				if (apps[c][6] == "") {
					if (m != c && m !== "") {	
						if (apps[m][7] == 1) {
							closePopup($application_button_popups[m], $application_buttons[m], 1);
						} else {
							closePopup($application_button_popups[m], $application_buttons[m]);
						}
						m = "";
					}
					if (m == "") {
						$application_button_popups[c].css("left", $application_buttons[c].offset().left).css("bottom", "25px").css("width", apps[c][4]);
						$application_button_popups[c].removeClass("arrowchat_tabopen_hidden");
						$application_button_popups[c].addClass("arrowchat_tabopen");
						$application_buttons[c].addClass("arrowchat_trayclick");
						if (apps[c][7] != "1" || apps[c][14] != "1") {
							a.get(c_ac_path + "applications/" + apps[c][2] + "/index.php", function (d) {
								a("#arrowchat_applications_button_" + apps[c][0] + "_content").html(d)
							});
						}
						apps[c][14] = 1;
						m = c;
					} else {
						if (apps[m][7] == 1) {
							closePopup($application_button_popups[m], $application_buttons[m], 1);
						} else {
							closePopup($application_button_popups[m], $application_buttons[m]);
						}
						var test = a("#arrowchatapplist_" + m).parent().attr('id');
						if (test == "arrowchat_other_applications") {
							$application_buttons[m].hide()
						}
						m = "";
					}
				} else {
					window.open(apps[c][6], "self");
				}
			});
		}

		function buildApplicationsButton() {
			$applications_button = a("<div/>").attr("id", "arrowchat_applications_button").addClass("arrowchat_bar_left").addClass("arrowchat_bar_button").html(ArrowChat.Templates.applications_tab()).appendTo($base);
			$applications_button_popup = a("<div/>").attr("id", "arrowchat_applications_button_popup").addClass("arrowchat_tabpopup").css("display", "none").html(ArrowChat.Templates.applications_window()).appendTo($body);
			$applications_button.css("width", c_width_apps + "px");
			if (c_width_apps <= 25) {
				a(".arrowchat_tray_name", $applications_button).hide();
			}
			var pold = apps.slice();

			function mysortfn(a, b) {
				if (a[13] < b[13]) return -1;
				if (a[13] > b[13]) return 1;
				return 0;
			}
			apps.sort(mysortfn);
			_appslist = '<div class="arrowchat_bookmark_apps_title">' + lang[20] + '</div><ul id="arrowchat_applications" class="arrowchat_connectedSortable" style="list-style-type: none; min-height:20px;">';
			for (b in apps) {
				if (typeof apps[b][0] != "undefined") {
					if (apps[b][12] != "1") {
						if ((apps[b][9] == "1" && u_id == "") || (u_id != "" && u_is_guest == "1" && apps[b][9] == "1") || (u_id != "" && u_is_guest != "1")) {
							_appslist += ArrowChat.Templates.applications_bookmarks_list(c_ac_path, apps, b);
						}
					}
				}
			}
			_appslist += '</ul><div class="arrowchat_other_apps_title">' + lang[64] + '</div><ul id="arrowchat_other_applications" class="arrowchat_connectedSortable" style="list-style-type: none; min-height:20px;">';
			for (b in apps) {
				if (typeof apps[b][0] != "undefined") {
					if (apps[b][12] == "1") {
						if ((apps[b][9] == "1" && u_id == "") || (u_id != "" && u_is_guest == "1" && apps[b][9] == "1") || (u_id != "" && u_is_guest != "1")) {
							_appslist += ArrowChat.Templates.applications_bookmarks_list(c_ac_path, apps, b);
						}
					}
				}
			}
			_appslist += '</ul>';
			apps = pold.slice();
			a("#arrowchat_bookmarks").append("<div>" + _appslist + "</div>");
			if (u_id != "") {
				a("#arrowchat_applications, #arrowchat_other_applications").sortable({
					delay: 50,
					connectWith: ".arrowchat_connectedSortable",
					scroll: false,
					axis: 'y',
					containment: '.arrowchat_traycontent',
					update: function () {
						var result = a('#arrowchat_other_applications').sortable('toArray');
						var result2 = a(this).sortable('serialize') + "&" + a(this).attr('id') + "=1";
						a.post(c_ac_path + "includes/json/send/send_settings.php", result2, function () {});
						for (var b = 0; b < result.length; b++) {
							var c = result[b].substr(17);
							$application_buttons[c].hide();
							apps[c][12] = "1";
						}
						var result2 = a('#arrowchat_applications').sortable('toArray');
						for (var b = 0; b < result2.length; b++) {
							var d = result2[b].substr(17);
							$application_buttons[d].show();
							apps[d][12] = "";
						}
					}
				});
			} else {
				a(".arrowchat_apps_subtitle").hide();
			}
			a(".arrowchat_app_link:not(.ui-sortable-helper)").on("click", function () {
				var c = a(this).attr("id").substr(19);
				if (apps[c][6] == "") {
					$application_buttons[c].show();
					closePopup($applications_button_popup, $applications_button);
				}
				$application_buttons[c].click()
			});
			a(".arrowchat_traytitle", $applications_button_popup).mouseenter(function () {
				a(this).addClass("arrowchat_chatboxtabtitlemouseover")
			});
			a(".arrowchat_traytitle", $applications_button_popup).mouseleave(function () {
				a(this).removeClass("arrowchat_chatboxtabtitlemouseover")
			});
			$applications_button.mouseover(function () {
				if (c_width_apps <= 25) {
					if ($applications_button.hasClass("arrowchat_tabclick")) {} else {
						showTooltip($applications_button, lang[16], true);
					}
				}
				a(this).addClass("arrowchat_tabmouseover")
			});
			$applications_button.mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				if (c_width_apps <= 25) {
					hideTooltip();
				}
			});
			a(".arrowchat_traytitle", $applications_button_popup).click(function () {
				$applications_button.click();
			});
			$applications_button.click(function () {
				lsClick("#arrowchat_applications_button", 'ac_openclose');
				if (c_width_apps <= 25) {
					hideTooltip();
				}
				if (m != "") {
					$application_buttons[m].click();
					m = "";
				}
				$applications_button_popup.css("left", $applications_button.offset().left).css("bottom", "25px");
				a(this).toggleClass("arrowchat_tabclick");
				$applications_button_popup.toggleClass("arrowchat_tabopen");
			});
		}
		
		function buildModButton() {
			$modbutton = a("<div/>").attr("id", "arrowchat_modbutton").addClass("arrowchat_bar_right").addClass("arrowchat_bar_button").html(ArrowChat.Templates.mod_tab()).appendTo($base);
			$modbutton_popup = a("<div/>").attr("id", "arrowchat_modbutton_popup").addClass("arrowchat_tabpopup").css("display", "none").html(ArrowChat.Templates.mod_window()).appendTo($body);
			$modbutton.mouseover(function () {
				$modbutton_popup.hasClass("arrowchat_tabopen") || ($ == 0 ? showTooltip($modbutton, lang[166]) : showTooltip($modbutton, lang[166]));
				a(this).addClass("arrowchat_tabmouseover")
			});
			$modbutton.mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				hideTooltip();
			});
			$modbutton.click(function () {
				lsClick("#arrowchat_modbutton", 'ac_openclose');
				if (a("#arrowchat_modbutton .arrowchat_tabalertnf").length) {
					a("#arrowchat_modbutton .arrowchat_tabalertnf").remove();
				}
				closePopup($chatrooms_popup, $chatrooms_button);
				closePopup($userstab_popup, $buddy_list_tab);
				closePopup($optionsbutton_popup, $optionsbutton);
				hideTooltip();
				$modbutton_popup.css("left", $modbutton.offset().left - $modbutton_popup.outerWidth() + $modbutton.outerWidth()).css("bottom", "25px");
				a(this).toggleClass("arrowchat_tabclick");
				$modbutton_popup.toggleClass("arrowchat_tabopen");
				$modbutton.toggleClass("arrowchat_modimages_click");
				adjustBarSize();
				if ($modbutton.hasClass("arrowchat_tabclick"))
					loadModerationContent();
			});
			a(".arrowchat_moderation_title", $modbutton_popup).click(function () {
				$modbutton.click()
			}).children().not(".arrowchat_tab_name").click(function () {
				return false;
			});
			a(".arrowchat_moderation_title", $modbutton_popup).mouseenter(function () {
				a(this).addClass("arrowchat_chatboxtabtitlemouseover2")
			});
			a(".arrowchat_moderation_title", $modbutton_popup).mouseleave(function () {
				a(this).removeClass("arrowchat_chatboxtabtitlemouseover2")
			});
			if (u_num_mod_reports > 0) {
				a("<div/>").css("top", "-11px").css("left", "8px").addClass("arrowchat_tabalertnf").html(u_num_mod_reports).prependTo($modbutton);
			}
		}
		
		function loadModerationContent() {
			a(".arrowchat_moderation_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
			a.ajax({					
				url: c_ac_path + "includes/json/receive/receive_moderation.php",
				cache: false,
				type: "get",
				dataType: "json",
				success: function (b) {
					buildModerationContent(b);
				}
			});
		}
		
		function buildModerationContent(b) {
			a(".arrowchat_moderation_full_content").html("");
			a(".arrowchat_reports_subtitle").html('<div class="arrowchat_report_sub_from">' + lang[177] + '</div><div class="arrowchat_report_sub_about">' + lang[178] + '</div><div class="arrowchat_report_sub_time">' + lang[179] + '</div>');
			var c = {},
				no_reports = true;
			b && a.each(b, function (i, e) {
				if (i == "reports") {
					a.each(e, function (l, f) {
						no_reports = false;
						a("<div/>").attr("id", "arrowchat_report_" + f.id).mouseover(function () {							
						a(this).addClass("arrowchat_report_list_hover");
						}).mouseout(function () {
							a(this).removeClass("arrowchat_report_list_hover");
						}).addClass("arrowchat_report_list").html('<div class="arrowchat_report_from_image"><img src="' + f.from_pic + '" alt=""></div><div class="arrowchat_report_from_name">' + f.from + '</div><div class="arrowchat_report_about_image"><img src="' + f.about_pic + '" alt=""></div><div class="arrowchat_report_about_name">' + f.about + ' (' + f.about_num + ')</div><div class="arrowchat_report_time">' + f.time + '</div><div class="arrowchat_clearfix"></div>').appendTo(a(".arrowchat_moderation_full_content"));
					})
				}
				if (i == "total_reports") {
					a(".arrowchat_moderation_title .arrowchat_tab_name").html(lang[166] + " (" + e.count + " " + lang[180] + ")");
				}
			});
			if (c_disable_avatars == 1 || a("#arrowchat_setting_names_only :input").is(":checked")) {
				a(".arrowchat_report_from_image").addClass("arrowchat_hide_avatars");
				a(".arrowchat_report_about_image").addClass("arrowchat_hide_avatars");
				a(".arrowchat_report_from_name").css("width","165px");
			}
			if (no_reports) {
				a("<div/>").attr("id", "arrowchat_report_no_reports").html(lang[189]).appendTo(a(".arrowchat_moderation_full_content"));
			}
			preventScrolling(a(".arrowchat_moderation_content"));
			a(".arrowchat_report_list").click(function (l) {
				reportClicked(a(this))
			});
		}
		
		function reportClicked(b) {
			c = "";
			 if (a(b).attr("id"))
				c = a(b).attr("id").substr(17);
			if (c == "") c = a(b).parent().attr("id").substr(17);
			a(".arrowchat_moderation_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
			open_report = c;
			loadReport(c);
		}
		
		function loadReport(b) {
			a.ajax({
				url: c_ac_path + "includes/json/receive/receive_report.php",
				data: {
					reportid: b
				},
				type: "post",
				cache: false,
				dataType: "json",
				success: function (o) {
					if (o) {
						var no_error = true;
						o && a.each(o, function (i, e) {
							if (i == "error") {
								a.each(e, function (l, f) {
									no_error = false;
									open_report = 0;
									displayMessage("arrowchat_moderation_flyout", f.m, "error");
									loadModerationContent();
								});
							}
						});
						if (no_error) {
							a(".arrowchat_reports_subtitle").html('<div class="arrowchat_report_sub_back"><a href="javascript:void(0);">' + lang[186] + '</a></div><div class="arrowchat_report_sub_close"><a href="javascript:void(0);">' + lang[185] + '</a></div><div class="arrowchat_report_sub_ban"><a href="javascript:void(0);">' + lang[183] + '</a></div><div class="arrowchat_report_sub_warn"><a href="javascript:void(0);">' + lang[184] + '</a></div>');
							a(".arrowchat_moderation_full_content").html(ArrowChat.Templates.mod_report());
							a(".arrowchat_report_sub_back a").click(function() {
								loadModerationContent();
							});
							a(".arrowchat_report_sub_close a").click(function() {
								a(".arrowchat_reports_subtitle").html('');
								a(".arrowchat_moderation_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
								a.post(c_ac_path + "includes/json/send/send_settings.php", {
									report_id: b
								}, function () {
									loadModerationContent();
								})
							});
							a(".arrowchat_report_sub_ban a").click(function() {
								var r = confirm(lang[195]);
								if (r == true) {
									a(".arrowchat_reports_subtitle").html('');
									a(".arrowchat_moderation_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
									a.post(c_ac_path + "includes/json/send/send_settings.php", {
										report_ban: b
									}, function () {
										loadModerationContent();
									})
								}
							});
							a(".arrowchat_report_sub_warn a").click(function() {
								var reason = prompt(lang[196]);
								if (reason != null && reason != "") {
									a.post(c_ac_path + "includes/json/send/send_settings.php", {
										report_warn: b,
										report_warn_reason: reason
									}, function (e) {
										if (e == 2) {
											var r = confirm(lang[197]);
											if (r == true) {
												a(".arrowchat_reports_subtitle").html('');
												a(".arrowchat_moderation_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
												a.post(c_ac_path + "includes/json/send/send_settings.php", {
													report_warn: b,
													report_warn_reason: reason,
													report_warn_confirm: 1
												}, function () {
													loadModerationContent();
												})
											}
										} else {
											a(".arrowchat_reports_subtitle").html('');
											a(".arrowchat_moderation_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
											loadModerationContent();
										}
									})
								}
							});
							$report_history = a("#arrowchat_report_history");
							$report_list = a("#arrowchat_report_list");
							preventScrolling(a("#arrowchat_report_list"));
							var no_additional_reports = true,report_time = 0;
							o && a.each(o, function (i, e) {
								if (i == "reports") {
									a.each(e, function (l, f) {
										no_additional_reports = false;
										a("<div/>").attr("id", "arrowchat_report_list_id_" + f.id).mouseover(function () {
											a(this).addClass("arrowchat_report_list_hover");
										}).mouseout(function () {
											a(this).removeClass("arrowchat_report_list_hover");
										}).click(function () {
											if (f.id != open_report) {
												a("#arrowchat_report_history_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
												loadReport(f.id);
												open_report = f.id;
											}
										}).addClass("arrowchat_report_other_list").html('<span class="arrowchat_report_list_name">' + lang[187] + f.id + '</span>').appendTo(a("#arrowchat_list_reports"));
										if (f.id == open_report) {
											a("#arrowchat_report_list_id_" + f.id).addClass('arrowchat_report_clicked');
										}
									});
								}
								if (i == "report_info") {
									a.each(e, function (l, f) {
										a(".arrowchat_report_info_about").html(lang[190] + '<a href="javascript:void(0);">' + f.about_name + '</a>');
										a(".arrowchat_report_info_from").html(lang[191] + '<a href="javascript:void(0);">' + f.from_name + '</a>');
										a(".arrowchat_report_info_warnings").html(lang[192] + f.previous_warnings);
										a(".arrowchat_report_info_time").html(lang[193] + f.time);
										
										a(".arrowchat_report_info_about a").click(function() {
											receiveUser(f.about, uc_name[f.about], uc_status[f.about], uc_avatar[f.about], uc_link[f.about]);
										});
										a(".arrowchat_report_info_from a").click(function() {
											receiveUser(f.from, uc_name[f.from], uc_status[f.from], uc_avatar[f.from], uc_link[f.from]);
										});
										report_time = f.unix;
									});
								}
								if (i == "report_history") {
									var d = "",report_here_used=false;
									a.each(e, function (l, f) {
										if (typeof(blockList[f.userid]) == "undefined") {
											var title = "", important = "";
											if (f.mod == 1) {
												title = lang[137];
												important = " arrowchat_chatroom_important";
											}
											if (f.admin == 1) {
												title = lang[136];
												important = " arrowchat_chatroom_important";
											}
											l = "",repotee="",image_msg="";
											fromname = f.n;
											if (f.reportee == 1) {
												repotee = " arrowchat_reportee";
											}
											if (f.m.substr(0, 4) == "<div") {
												image_msg = " arrowchat_image_msg";
											}
											var sent_time = new Date(f.t * 1E3);
											var tooltip = formatTimestamp(sent_time, 1);
											if (f.t >= report_time && !report_here_used) {
												d += '<div class="arrowchat_chatroom_box_message arrowchat_clearfix arrowchat_report_here"><div class="arrowchat_chatroom_message_content arrowchat_global_chatroom_message">' + lang[194] + "</div></div>";
												report_here_used = true;
											}
											if (f.global == 1) {
												d += '<div class="arrowchat_chatroom_box_message arrowchat_clearfix" id="arrowchat_chatroom_message_' + f.id + '"><div class="arrowchat_chatroom_message_content' + l + ' arrowchat_global_chatroom_message">' + formatTimestamp(sent_time) + f.m + "</div></div>"
											} else {
												d += '<div class="arrowchat_chatroom_box_message arrowchat_clearfix' + l + image_msg + repotee + important + '" id="arrowchat_chatroom_message_' + f.id + '"><img class="arrowchat_chatroom_message_avatar arrowchat_no_names" src="'+f.a+'" alt="' + fromname + title + ' ' + tooltip + '" /><div class="arrowchat_chatroom_message_name">' + fromname + title + ':</div><div class="arrowchat_chatroom_message_content" data-id="' + tooltip + '"><span class="arrowchat_chatroom_msg">' + f.m + '</span></div></div>'
											}
										}
									});
									if (!report_here_used) {
										d += '<div class="arrowchat_chatroom_box_message arrowchat_clearfix arrowchat_report_here"><div class="arrowchat_chatroom_message_content arrowchat_global_chatroom_message">' + lang[194] + "</div></div>";
									}
									a("#arrowchat_report_history_content").html(d);
									showChatroomTime();
								}
							});
							if (c_disable_avatars == 1 || a("#arrowchat_setting_names_only :input").is(":checked")) {
								a(".arrowchat_chatroom_message_avatar").addClass("arrowchat_hide_avatars");
								a(".arrowchat_chatroom_message_name").show();
								a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_no_names");
							}
							a('#arrowchat_report_history').scrollTop(a('#arrowchat_report_history').scrollTop() + a(".arrowchat_report_here").position().top - a('#arrowchat_report_history').height()/2 + a(".arrowchat_report_here").height()/2);
							a(".arrowchat_image_msg img,.arrowchat_emoji_text img").one("load", function() {
								a('#arrowchat_report_history').scrollTop(a('#arrowchat_report_history').scrollTop() + a(".arrowchat_report_here").position().top - a('#arrowchat_report_history').height()/2 + a(".arrowchat_report_here").height()/2);
							}).each(function() {
								if(this.complete) a(this).load();
							});
							preventScrolling(a("#arrowchat_report_history"));
							if (no_additional_reports) {
								a("<div/>").attr("id", "arrowchat_report_list_none").addClass("arrowchat_report_other_list").html('<span class="arrowchat_report_list_name">' + lang[188] + '</span>').appendTo(a("#arrowchat_list_reports"));
							}
						}
					}
				}
			})
		}
		
		function receiveWarning(h) {
			if (h.read == 0 && h.data != "") {
				a("#arrowchat_warnings").remove();
				$body.append(ArrowChat.Templates.warnings_display(h));
				if (a("#arrowchat_announcement").length) {
					var nb = parseInt(a(window).height() - a("#arrowchat_announcement").position().top);
					a("#arrowchat_warnings").css("bottom", nb + 5 + "px");
				}
				a("#arrowchat_warnings .arrowchat_warnings_close").click(function () {
					a("#arrowchat_warnings").remove();
					if (a("#arrowchat_announcement").length)
						a("#arrowchat_announcement").css("bottom", "35px");
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						warning_read: 1
					}, function () {});
				});
			} else {
				a("#arrowchat_warnings").remove();
			}
		}

		function buildOptionsButton() {
			$optionsbutton = a("<div/>").attr("id", "arrowchat_optionsbutton").addClass("arrowchat_bar_right").addClass("arrowchat_bar_button").html(ArrowChat.Templates.notifications_tab()).appendTo($base);
			$optionsbutton_popup = a("<div/>").attr("id", "arrowchat_optionsbutton_popup").addClass("arrowchat_tabpopup").css("display", "none").html(ArrowChat.Templates.notifications_window()).appendTo($body);
			$optionsbutton.mouseover(function () {
				$optionsbutton_popup.hasClass("arrowchat_tabopen") || ($ == 0 ? showTooltip($optionsbutton, lang[0]) : showTooltip($optionsbutton, lang[0]));
				a(this).addClass("arrowchat_tabmouseover")
			});
			$optionsbutton.mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				hideTooltip();
			});
			a(".arrowchat_see_all_link").mouseenter(function () {
				showTooltip(a(this), lang[21], 0, 10, 5);
				a(this).parent().addClass("arrowchat_see_all_button_hover");
				a("#arrowchat_userstab_popup .arrowchat_userstabtitle").removeClass("arrowchat_chatboxtabtitlemouseover2")
			});
			a(".arrowchat_see_all_link").mouseleave(function () {
				hideTooltip();
				a(this).parent().removeClass("arrowchat_see_all_button_hover");
				a("#arrowchat_userstab_popup .arrowchat_userstabtitle").addClass("arrowchat_chatboxtabtitlemouseover2")
			});
			a(".arrowchat_see_all_link").click(function () {
				lsClick(".arrowchat_see_all_link", 'ac_click');
				a("#arrowchat_notifications_content").html('<div class="arrowchat_loading_icon"></div>');
				var i = 0;
				a.ajax({
					url: c_ac_path + "includes/json/receive/receive_notifications.php",
					type: "get",
					cache: false,
					dataType: "json",
					success: function (b) {
						if (b && b != null) {
							a("#arrowchat_notifications_content").html("");
							a.each(b, function (e, l) {
								a.each(l, function (f, h) {
									a("<div/>").attr("id", "arrowchat_alert_" + h.alert_id).attr("class", "arrowchat_notification_message_div").html(h.markup).appendTo(a("#arrowchat_notifications_content"));
									i++;
								});
							});
							if (i == 0) {
								a("#arrowchat_notifications_content").html(lang[9]);
							}
							if ((a(window).height() - $optionsbutton_popup.height()) < 80) {
								a("#arrowchat_notifications_content").css("height", a(window).height() - 135);
							} else {
								a("#arrowchat_notifications_content").css("height", "auto");
							}
							adjustBarSize();
						}
					}
				});
			});
			$optionsbutton.click(function () {
				lsClick("#arrowchat_optionsbutton", 'ac_openclose');
				if (a("#arrowchat_notification_alert").length > 0) {
					a("#arrowchat_notification_alert").remove();
					$optionsbutton.removeClass("arrowchat_tab_new_message");
				}
				closePopup($modbutton_popup, $modbutton);
				closePopup($chatrooms_popup, $chatrooms_button);
				if (Q > 0) {
					a("#arrowchat_optionsbutton .arrowchat_tabalertnf").remove();
					a.post(c_ac_path + "includes/json/send/send_notifications.php", {
						userid: u_id
					}, function () {});
					Q = 0
				}
				if ($ == 0) {
					hideTooltip();
					$optionsbutton_popup.css("left", $optionsbutton.offset().left - $optionsbutton_popup.outerWidth() + $optionsbutton.outerWidth()).css("bottom", "25px");
					a(this).toggleClass("arrowchat_tabclick");
					$optionsbutton_popup.toggleClass("arrowchat_tabopen");
					$optionsbutton.toggleClass("arrowchat_optionsimages_click");
					closePopup($userstab_popup, $buddy_list_tab);
				} else if (lang[16] != "") location.href = lang[16];
				if ((a(window).height() - $optionsbutton_popup.height()) < 80) {
					a("#arrowchat_notifications_content").css("height", a(window).height() - 135);
				} else {
					a("#arrowchat_notifications_content").css("height", "auto");
				}
				adjustBarSize();
			});
			a(".arrowchat_userstabtitle", $optionsbutton_popup).click(function () {
				$optionsbutton.click()
			}).children().not(".arrowchat_tab_name").click(function () {
				return false;
			});
			a(".arrowchat_userstabtitle", $optionsbutton_popup).mouseenter(function () {
				a(this).addClass("arrowchat_chatboxtabtitlemouseover2")
			});
			a(".arrowchat_userstabtitle", $optionsbutton_popup).mouseleave(function () {
				a(this).removeClass("arrowchat_chatboxtabtitlemouseover2")
			})
		}
		
		function displayMessage(id, message, type) {
			clearTimeout(message_timeout);
			if (a("#" + id).is(":visible")) {
				a("#" + id).hide("slide", { direction: "up"}, 250, function() {					
					a("#" + id + " .arrowchat_message_text").html(message);
					type == "error" && a(".arrowchat_message_box").addClass("arrowchat_message_box_error").removeClass("arrowchat_message_box_notice");
					type == "notice" && a(".arrowchat_message_box").addClass("arrowchat_message_box_notice").removeClass("arrowchat_message_box_error");
					a("#" + id).show("slide", { direction: "up"}, 250);
				});
			} else {
				type == "error" && a(".arrowchat_message_box").addClass("arrowchat_message_box_error").removeClass("arrowchat_message_box_notice");
				type == "notice" && a(".arrowchat_message_box").addClass("arrowchat_message_box_notice").removeClass("arrowchat_message_box_error");
				a("#" + id + " .arrowchat_message_text").html(message);
				a("#" + id).show("slide", { direction: "up"}, 250);
			}
			message_timeout = setTimeout(function () {
				a("#" + id).hide("slide", { direction: "up"}, 250);
			}, 5000);
		}
		
		function loadGiphy(url, selector, popup_id) {
			var selector_id = $chatrooms_popup;
			if (selector == 1)
				selector_id = $user_popups[popup_id];
			a.ajax({
				url: url,
				type: "get",
				cache: false,
				dataType: "json",
				success: function (results) {
					results && a.each(results, function (i, e) {
						if (i == "data") {
							a(".arrowchat_giphy_image_wrapper", selector_id).html('');
							var new_height = 0;
							a.each(e, function (l, f) {
								new_height = Math.round((256/(f.images.original.width/f.images.original.height)));
								a(".arrowchat_giphy_image_wrapper", selector_id).append('<img class="arrowchat_giphy_image" src="' + f.images.original.url + '" alt="" style="height:' + new_height + 'px;width:256px" height="' + new_height + '" />');
							});
							a(".arrowchat_giphy_image", selector_id).click(function () {
								a(".arrowchat_giphy_popout", selector_id).children(".arrowchat_more_popout").hide();
								var giphy_src = a(this).attr('src');
								if (selector == 2) {
									a.post(c_ac_path + "includes/json/send/send_message_chatroom.php", {
										userid: u_id,
										username: u_name,
										chatroomid: Ccr,
										message: "giphy{" + a(this).attr('height') + "}{" + a(this).attr('src') + "}"
									}, function (e) {
										if (a("#arrowchat_chatroom_message_" + e).length) {} else {
											$chatroom_chat.append('<div class="arrowchat_chatroom_box_message arrowchat_clearfix arrowchat_self arrowchat_image_msg arrowchat_chatroom_important" id="arrowchat_chatroom_message_' + e + '"><div class="arrowchat_chatroom_message_name">' + lang[90] + '</div><div class="arrowchat_chatroom_message_content" data-id="' + lang[90] + '"><div class="arrowchat_chatroom_delete" data-id="' + e + '" style="display: block;"> </div><span class="arrowchat_chatroom_msg"><div class="arrowchat_giphy_message"><img class="arrowchat_lightbox" data-id="' + giphy_src + '" src="' + giphy_src + '" alt="" style="width:179px" /></div></span></div></div>');
											var data_array = [e, u_name, '<div class="arrowchat_giphy_message"><img class="arrowchat_lightbox" data-id="' + giphy_src + '" src="' + giphy_src + '" alt="" style="width:179px" /></div>', Ccr];
											lsClick(JSON.stringify(data_array), 'send_chatroom_message');
										}
										$chatroom_chat.scrollTop(5E4);
									});
								} else {
									a.post(c_ac_path + "includes/json/send/send_message.php", {
										userid: u_id,
										to: popup_id,
										message: "giphy{" + a(this).attr('height') + "}{" + a(this).attr('src') + "}"
									}, function (e) {
										if (a("#arrowchat_message_" + e).length) {} else {
											a(".arrowchat_tabcontenttext", $user_popups[popup_id]).append('<div class="arrowchat_chatboxmessage arrowchat_clearfix arrowchat_self arrowchat_image_msg" id="arrowchat_message_' + e + '"><span class="arrowchat_ts" style="display: none;"></span><div class="arrowchat_chatboxmessagefrom"><div class="arrowchat_disable_avatars_name">' + lang[90] + '</div></div><div class="arrowchat_chatboxmessage_wrapper"><div class="arrowchat_chatboxmessagecontent" data-id="' + lang[90] + '"><div class="arrowchat_giphy_message"><img class="arrowchat_lightbox" data-id="' + giphy_src + '" src="' + giphy_src + '" alt="" style="width:179px"></div></div></div></div>');
											var time = Math.floor((new Date).getTime() / 1E3);
											var data_array = [e, popup_id, '<div class="arrowchat_giphy_message"><img class="arrowchat_lightbox" data-id="' + giphy_src + '" src="' + giphy_src + '" alt="" style="width:179px"></div>', time, 1, 1];
											lsClick(JSON.stringify(data_array), 'private_message');
										}
										a(".arrowchat_tabcontenttext", $user_popups[popup_id]).scrollTop(a(".arrowchat_tabcontenttext", $user_popups[popup_id])[0].scrollHeight);
									});
								}
							});
						}
					});
				}
			});
		}
		
		function addChatroomTab(id, name, focused) {
			if (typeof $chatroom_tab[id] == "undefined") {
				crt2[id] = name;
				$chatroom_tab[id] = a("<div/>").attr("id", "arrowchat_chatroom_tab_" + id).addClass("arrowchat_chatroom_tab").html('<div class="arrowchat_bar_left"><div class="arrowchat_chatroom_tab_wrap"><div class="arrowchat_chatroom_tab_name">' + crt2[id] + '</div></div></div><div class="arrowchat_chatroom_tab_right"><div class="arrowchat_closebox_bottom" data-id="' + id + '"></div></div>').prependTo(a("#arrowchat_chatroom_open_chats_container"));
				if (focused == 1) $chatroom_tab[id].addClass("arrowchat_chatroom_tab_focused");
				addHover($chatroom_tab[id], "arrowchat_chatroom_tab_hover");
				a(".arrowchat_closebox_bottom", $chatroom_tab[id]).unbind('click');
				a(".arrowchat_closebox_bottom", $chatroom_tab[id]).click(function() {
					lsClick(".arrowchat_closebox_bottom", 'ac_click', "chatroom_tab['"+id+"']");
					var id2 = a(this).attr("data-id");
					var focused = false;
					if (typeof($chatroom_tab[id2]) != "undefined") {
						if ($chatroom_tab[id2].hasClass("arrowchat_chatroom_tab_focused"))
							focused = true;
						$chatroom_tab[id2].remove();
						delete $chatroom_tab[id2];
					}
					if (a.isEmptyObject($chatroom_tab)) {
						a("#arrowchat_chatroom_open_chats").hide();
						a("#arrowchat_chatroom_leave").click();
					} else {
						if (focused) {
							for (var i in $chatroom_tab) {
								chatroomListClicked(a("#arrowchat_chatroom_tab_" + i), 23);
								break;
							}
						}
					}
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chatroom_unfocus: id2
					}, function () {});
					changePushChannel(id2, 0);
				});
				$chatroom_tab[id].unbind('click');
				$chatroom_tab[id].click(function () {
					if (!$chatroom_tab[id].hasClass("arrowchat_chatroom_tab_focused")) {
						lsClick(" ", 'ac_click', "chatroom_tab['"+id+"']");
						if (a(".arrowchat_popout_alert", $chatroom_tab[id]).length > 0) {
							a(".arrowchat_popout_alert", $chatroom_tab[id]).remove();
						}
						a(".arrowchat_chatroom_tab").removeClass("arrowchat_chatroom_tab_focused");
						$chatroom_tab[id].addClass("arrowchat_chatroom_tab_focused");
						chatroomListClicked(a("#arrowchat_chatroom_tab_" + id), 23);
					}
				});
				a(".arrowchat_closebox_bottom", $chatroom_tab[id]).mouseenter(function () {
					a(this).addClass("arrowchat_closebox_bottomhover")
				});
				a(".arrowchat_closebox_bottom", $chatroom_tab[id]).mouseleave(function () {
					a(this).removeClass("arrowchat_closebox_bottomhover")
				});
			} else {
				$chatroom_tab[id].addClass("arrowchat_chatroom_tab_focused");
			}
		}

		function loadChatroom(b, c, pass) {
			a(".arrowchat_chatroom_full_content").removeClass("arrowchat_chatroom_opacity");
			a(".arrowchat_chatroom_content").removeClass("arrowchat_chatroom_lobby");
			a(".arrowchat_chatrooms_title").removeClass("arrowchat_chatroom_lobby_title");
			lsClick("#arrowchat_chatroom_"+b, 'ac_click');
			var global_mod = 0,
				global_admin = 0,
				admin_markup = "";
			chatroom_mod = 0;
			chatroom_popout = "";
			chatroom_admin = 0;
			chatroomreceived = 1;
			a.ajax({
				url: c_ac_path + "includes/json/receive/receive_chatroom_room.php",
				data: {
					chatroomid: b,
					chatroom_window: u_chatroom_open,
					chatroom_stay: u_chatroom_stay,
					chatroom_pw: pass
				},
				type: "post",
				cache: false,
				dataType: "json",
				success: function (o) {
					if (o) {
						clearTimeout(Crref2);
						var no_error = true;
						o && a.each(o, function (i, e) {
							if (i == "error") {
								a.each(e, function (l, f) {
									no_error = false;
									Ccr = 0;
									clearTimeout(Crref2);
									if (typeof($chatroom_tab[b]) != "undefined") {
										a(".arrowchat_closebox_bottom", $chatroom_tab[b]).click();
									}
									if (!a.isEmptyObject($chatroom_tab)) {
										for (var i in $chatroom_tab) {
											$chatroom_tab[i].click();
											break;
										}
									} else {
										chatroomreceived = 0;
										loadChatroomList();
									}
									displayMessage("arrowchat_chatroom_message_flyout", f.m, "error");
								});
							}
						});
						if (no_error) {
							u_chatroom_stay = b;
							Crref2 = setTimeout(function () {
								receiveChatroom(b)
							}, 30000);
							if (c_push_engine != 1) {
								cancelJSONP();
								changePushChannel(b, 1);
								receiveCore();
							} else {
								changePushChannel(b, 1);
							}
							a("#arrowchat_chatroom_userlist_button").show();
							a("#arrowchat_chatroom_open_chats").show();
							if (typeof crt2[b] != "undefined") {
								a(".arrowchat_chatrooms_title .arrowchat_tab_name").html(lang[19]);
								addChatroomTab(b, crt2[b], 1);
							}
							a("#arrowchat_chatroom_leave").show();
							a(".arrowchat_chatroom_full_content").html(ArrowChat.Templates.chatrooms_room(c_max_chatroom_msg));
							$chatroom_chat = a("#arrowchat_chatroom_chat");
							$chatroom_room_list = a("#arrowchat_chatroom_room_list");
							if(c_popout_on == 1){a(".arrowchat_chatroom_popout", $chatrooms_popup).show();}
							a("#arrowchat_chatroom_chat").click(function () {
								if (window.getSelection().toString().length) {} else {
									a(".arrowchat_chatroom_message_input").focus();
								}
							});
							a(".arrowchat_chatroom_message_input").focusin(function() {
								a(".arrowchat_chatrooms_title").addClass("arrowchat_typing_title");
							});
							a(".arrowchat_chatroom_message_input").focusout(function() {
								a(".arrowchat_chatrooms_title").removeClass("arrowchat_typing_title");
							});
							a(".arrowchat_chatroom_popout", $chatrooms_popup).mouseenter(function () {
								showTooltip(a(this), lang[117], 0, 10, 5);
								a(this).addClass("arrowchat_chatroom_popout_hover");
								a(".arrowchat_chatrooms_title", $chatrooms_popup).removeClass("arrowchat_chatboxtabtitlemouseover3")
							});
							a(".arrowchat_chatroom_popout", $chatrooms_popup).mouseleave(function () {
								a(this).removeClass("arrowchat_chatroom_popout_hover");
								a(".arrowchat_chatrooms_title", $chatrooms_popup).addClass("arrowchat_chatboxtabtitlemouseover3");
								hideTooltip();
							});
							a(".arrowchat_chatroom_popout", $chatrooms_popup).unbind('click');
							a(".arrowchat_chatroom_popout", $chatrooms_popup).click(function() {
								window.open(c_ac_path + "public/popout/?cid=" + b + "&ah=1", "chatroom", "menubar=0,resizable=0,width=940,height=620,top=25,left=25,scrollbars=0,status=0");
							});
							a(".arrowchat_chatroom_message_input", $chatrooms_popup).keydown(function (h) {
								if (a(".arrowchat_smiley_popout", $chatrooms_popup).children(".arrowchat_more_popout").is(":visible")) {
									a(".arrowchat_smiley_popout", $chatrooms_popup).children(".arrowchat_more_popout").hide();
								}
								return chatroomKeydown(h, a(this))
							});
							a(".arrowchat_chatroom_message_input", $chatrooms_popup).keyup(function (h) {
								return chatroomKeyup(h, a(this))
							});
							a(".arrowchat_emoji_selector", $chatrooms_popup).click(function() {
								if (!a(this).hasClass("arrowchat_emoji_focused")) {
									a(".arrowchat_emoji_wrapper", $chatrooms_popup).html('<div class="arrowchat_loading_icon"></div>');
									a(".arrowchat_emoji_selector", $chatrooms_popup).removeClass("arrowchat_emoji_focused");
									a(this).addClass("arrowchat_emoji_focused");
									var load_id = a(this).attr("data-id");
									a.ajax({
										url: c_ac_path + 'includes/emojis/' + load_id + '.php',
										type: "GET",
										cache: true,
										success: function(html) {
											a(".arrowchat_emoji_wrapper", $chatrooms_popup).html(html);
											a(".arrowchat_emoji", $chatrooms_popup).click(function () {
												if (a(this).hasClass("arrowchat_emoji_custom"))
													var smiley_code = a(this).children('img').attr("data-id");
												else
													var smiley_code = '[e-' + a(this).children('img').attr("data-id").replace('.png', '') + ']';
												var existing_text = a(".arrowchat_chatroom_message_input", $chatrooms_popup).val();
												a(".arrowchat_chatroom_message_input", $chatrooms_popup).focus().val('').val(existing_text + smiley_code);
											});
										}
									});
								}
							});
							a(".arrowchat_emoji_smileys").mouseover(function(){showTooltip(a(this), lang[230], true, 15);}).mouseout(function(){hideTooltip();});
							a(".arrowchat_emoji_animals").mouseover(function(){showTooltip(a(this), lang[231], true, 15);}).mouseout(function(){hideTooltip();});
							a(".arrowchat_emoji_food").mouseover(function(){showTooltip(a(this), lang[232], true, 15);}).mouseout(function(){hideTooltip();});
							a(".arrowchat_emoji_activities").mouseover(function(){showTooltip(a(this), lang[233], true, 15);}).mouseout(function(){hideTooltip();});
							a(".arrowchat_emoji_travel").mouseover(function(){showTooltip(a(this), lang[234], true, 15);}).mouseout(function(){hideTooltip();});
							a(".arrowchat_emoji_objects").mouseover(function(){showTooltip(a(this), lang[235], true, 15);}).mouseout(function(){hideTooltip();});
							a(".arrowchat_emoji_symbols").mouseover(function(){showTooltip(a(this), lang[236], true, 15);}).mouseout(function(){hideTooltip();});
							a(".arrowchat_emoji_flags").mouseover(function(){showTooltip(a(this), lang[237], true, 15);}).mouseout(function(){hideTooltip();});
							a(".arrowchat_emoji_custom").mouseover(function(){showTooltip(a(this), lang[238], true, 15);}).mouseout(function(){hideTooltip();});
							a(".arrowchat_smiley_button", $chatrooms_popup).mouseenter(function () {
								a(this).addClass("arrowchat_smiley_button_hover")
							});
							a(".arrowchat_smiley_button", $chatrooms_popup).mouseleave(function () {
								a(this).removeClass("arrowchat_smiley_button_hover");
							});
							a(".arrowchat_smiley_wrapper", $chatrooms_popup).click(function () {
								var smiley_code = a(this).attr("data-id");
								var existing_text = a(".arrowchat_chatroom_message_input", $chatrooms_popup).val();
								a(".arrowchat_chatroom_message_input", $chatrooms_popup).focus().val('').val(existing_text + Smiley[smiley_code][1]);
							});
							a(".arrowchat_smiley_button", $chatrooms_popup).click(function () {
								if (a(".arrowchat_giphy_popout", $chatrooms_popup).children(".arrowchat_more_popout").is(":visible")) {
									a(".arrowchat_giphy_popout", $chatrooms_popup).children(".arrowchat_more_popout").hide();
								}
								if (a(".arrowchat_smiley_popout", $chatrooms_popup).children(".arrowchat_more_popout").is(":visible")) {
									a(".arrowchat_smiley_popout", $chatrooms_popup).children(".arrowchat_more_popout").hide();
								} else {
									if (!a(".arrowchat_emoji_selector", $chatrooms_popup).hasClass("arrowchat_emoji_focused")) {
										a(".arrowchat_emoji_wrapper", $chatrooms_popup).html('<div class="arrowchat_loading_icon"></div>');
										a(".arrowchat_emoji_selector", $chatrooms_popup).removeClass("arrowchat_emoji_focused");
										a(".arrowchat_emoji_smileys", $chatrooms_popup).addClass("arrowchat_emoji_focused");
										a.ajax({
											url: c_ac_path + 'includes/emojis/emoji_smileys.php',
											type: "GET",
											cache: true,
											success: function(html) {
												a(".arrowchat_emoji_wrapper", $chatrooms_popup).html(html);
												a(".arrowchat_emoji", $chatrooms_popup).click(function () {
													if (a(this).hasClass("arrowchat_emoji_custom"))
														var smiley_code = a(this).children('img').attr("data-id");
													else
														var smiley_code = '[e-' + a(this).children('img').attr("data-id").replace('.png', '') + ']';
													var existing_text = a(".arrowchat_chatroom_message_input", $chatrooms_popup).val();
													a(".arrowchat_chatroom_message_input", $chatrooms_popup).focus().val('').val(existing_text + smiley_code);
												});
											}
										});
									}
									a(".arrowchat_chatroom_message_input", $chatrooms_popup).focus();
									a(".arrowchat_smiley_popout", $chatrooms_popup).children(".arrowchat_more_popout").show();
								}
							}).children().click(function(e){
								return false;
							});
							a(".arrowchat_giphy_button", $chatrooms_popup).mouseenter(function () {
								a(this).addClass("arrowchat_giphy_button_hover")
							});
							a(".arrowchat_giphy_button", $chatrooms_popup).mouseleave(function () {
								a(this).removeClass("arrowchat_giphy_button_hover");
							});
							a(".arrowchat_giphy_button", $chatrooms_popup).click(function () {
								if (a(".arrowchat_smiley_popout", $chatrooms_popup).children(".arrowchat_more_popout").is(":visible")) {
									a(".arrowchat_smiley_popout", $chatrooms_popup).children(".arrowchat_more_popout").hide();
								}
								if (a(".arrowchat_giphy_popout", $chatrooms_popup).children(".arrowchat_more_popout").is(":visible")) {
									a(".arrowchat_giphy_popout", $chatrooms_popup).children(".arrowchat_more_popout").hide();
								} else {
									a(".arrowchat_giphy_popout", $chatrooms_popup).children(".arrowchat_more_popout").show();
									a(".arrowchat_giphy_search", $chatrooms_popup).val('');
									a(".arrowchat_giphy_search", $chatrooms_popup).focus();
									loadGiphy('https://api.giphy.com/v1/gifs/trending?api_key=IOYyr4NK5ldaU&limit=20', 2, 0);
								}
							}).children().click(function(e){
								return false;
							});
							a(".arrowchat_giphy_search", $chatrooms_popup).keyup(function () {
								a(".arrowchat_giphy_image_wrapper", $chatrooms_popup).html('<div class="arrowchat_loading_icon"></div>');
								if (a(".arrowchat_giphy_search", $chatrooms_popup).val() == '')
									loadGiphy('https://api.giphy.com/v1/gifs/trending?api_key=IOYyr4NK5ldaU&limit=20', 2, 0);
								else
									loadGiphy('https://api.giphy.com/v1/gifs/search?api_key=IOYyr4NK5ldaU&limit=20&q=' + a(".arrowchat_giphy_search", $chatrooms_popup).val(), 2);
							});
							if (c_chatroom_transfer == 1) {
								chatroomUploadProcessing();
							}
							preventScrolling(a(".arrowchat_giphy_image_wrapper"));
							preventScrolling(a(".arrowchat_emoji_wrapper"));
							preventScrolling(a("#arrowchat_chatroom_chat"));
							preventScrolling(a("#arrowchat_chatroom_room_list"));
							if (c_chatroom_transfer != 1) {a("#arrowchat_upload_button", $chatrooms_popup).hide();a(".arrowchat_chatroom_message_area", $chatrooms_popup).addClass("arrowchat_no_file_upload")}
							if (c_disable_smilies == 1) {a(".arrowchat_smiley_button", $chatrooms_popup).hide();a(".arrowchat_chatroom_message_area", $chatrooms_popup).addClass("arrowchat_no_smiley")}
							if (c_giphy_chatroom == 1) {a(".arrowchat_giphy_button", $chatrooms_popup).hide();a(".arrowchat_chatroom_message_area", $chatrooms_popup).addClass("arrowchat_no_giphy")}
							o && a.each(o, function (i, e) {
								if (i == "user_title") {
									a.each(e, function (l, f) {
										if (f.admin == 1) {
											global_admin = 1;
											chatroom_admin = 1;
										}
										if (f.mod == 1) {
											global_mod = 1;
											chatroom_mod = 1;
										}
									});
								}
								if (i == "chat_name") {
									a.each(e, function (l, f) {										
										if (typeof crt2[b] == "undefined") {
											crt2[b] = f.n;
											addChatroomTab(b, crt2[b], 1);
											a(".arrowchat_chatrooms_title .arrowchat_tab_name").html(lang[19]);
										}
									});
								}
								if (i == "chat_users") {
									var longname,adminCount=0,modCount=0,userCount=0;
									a.each(e, function (l, f) {
										if ((global_admin == 1 || global_mod == 1) && (f.t == 1 || f.t == 4)) {
											admin_markup = '<hr class="arrowchat_options_divider" /><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_make_mod_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[52] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_silence_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[161] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_ban_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[53] + '</div></div>';
										}
										if (global_admin == 1 && f.t == 2) {
											admin_markup = '<hr class="arrowchat_options_divider" /><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_remove_mod_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[54] + '</div></div>';
										}
										appendVal = a("#arrowchat_chatroom_list_users");
										if (f.t == 2) {
											appendVal = a("#arrowchat_chatroom_list_mods");
											modCount++;
										} else if (f.t == 3) {
											appendVal = a("#arrowchat_chatroom_list_admins");
											adminCount++;
										} else
											userCount++;
										longname = renderHTMLString(f.n);
										f.n = renderHTMLString(f.n);
										a("<div/>").attr("id", "arrowchat_chatroom_user_" + f.id).mouseover(function () {
											a(this).addClass("arrowchat_chatroom_list_hover");
										}).mouseout(function () {
											a(this).removeClass("arrowchat_chatroom_list_hover");
										}).addClass("arrowchat_chatroom_room_list").addClass('arrowchat_chatroom_admin_' + f.t).html('<img class="arrowchat_chatroom_avatar" src="' + f.a + '"/><span class="arrowchat_chatroom_room_name">' + f.n + '</span><span class="arrowchat_userscontentdot arrowchat_' + f.status + '"></span>').appendTo(appendVal);
										var pm_opacity = "";
										if ((f.b == 1 && global_admin != 1) || f.id == u_id) pm_opacity = " arrowchat_no_private_msg";
										a("<div/>").attr("id", "arrowchat_chatroom_users_flyout_" + f.id).addClass("arrowchat_more_wrapper_chatroom").html('<div class="arrowchat_chatroom_users_flyout"><div class="arrowchat_chatroom_flyout_avatar"><img src="'+f.a+'" alt="" /></div><div class="arrowchat_chatroom_flyout_info"><div class="arrowchat_chatroom_title_padding"><div id="arrowchat_chatroom_title_' + f.id + '" class="arrowchat_chatroom_flyout_text"><a href="'+f.l+'">' + longname + '</a><br/>' + lang[43] + '</div></div><hr class="arrowchat_options_divider"/><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_private_message_' + f.id + '" class="arrowchat_chatroom_flyout_text'+pm_opacity+'">' + lang[41] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_block_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[84] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_report_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[167] + '</div></div>' + admin_markup + '</div><div class="arrowchat_clearfix"></div><i class="arrowchat_more_tip_chatroom"></i></div>').appendTo(a("#arrowchat_chatroom_user_" + f.id));
										if (f.t == 2) {
											a("#arrowchat_chatroom_title_" + f.id).html('<a href="'+f.l+'">' + longname + '</a><br/>' + lang[44]);
										} else if (f.t == 3) {
											a("#arrowchat_chatroom_title_" + f.id).html('<a href="'+f.l+'">' + longname + '</a><br/>' + lang[45]);
										} else if (f.t == 4) {
											a("#arrowchat_chatroom_title_" + f.id).html('<a href="'+f.l+'">' + longname + '</a><br/>' + lang[212])
										}
										addHover(a(".arrowchat_chatroom_options_padding"), "arrowchat_options_padding_hover");
										chatroomUserOptions(f, global_admin);
									});
									userCount == 0 && a("#arrowchat_chatroom_line_users").hide();
									adminCount == 0 && a("#arrowchat_chatroom_line_admins").hide();
									modCount == 0 && a("#arrowchat_chatroom_line_mods").hide();
									a(".arrowchat_chatroom_admin_3").css("background-color", "#"+c_admin_bg);
									a(".arrowchat_chatroom_admin_3").css("color", "#"+c_admin_txt);
								}
								if (i == "chat_history") {
									d = "";
									a.each(e, function (l, f) {
										var regex = new RegExp('^(^|\\s)(@' + u_name + ')(\\s|$)', 'i');
										f.m = f.m.replace(regex, '$1<span class="arrowchat_at_user">$2</span>$3');
										if (typeof(blockList[f.userid]) == "undefined") {
											var title = "", important = "";
											if (f.mod == 1) {
												title = lang[137];
												important = " arrowchat_chatroom_important";
											}
											if (f.admin == 1) {
												title = lang[136];
												important = " arrowchat_chatroom_important";
											}
											l = "";
											var image_msg = "";
											fromname = f.n;
											if (f.n == u_name) {
												l = " arrowchat_self";
											}
											if (f.m.substr(0, 4) == "<div") {
												image_msg = " arrowchat_image_msg";
											}
											var sent_time = new Date(f.t * 1E3);
											var tooltip = formatTimestamp(sent_time, 1);
											if (f.global == 1) {
												d += '<div class="arrowchat_chatroom_box_message arrowchat_clearfix" id="arrowchat_chatroom_message_' + f.id + '"><div class="arrowchat_chatroom_message_content' + l + ' arrowchat_global_chatroom_message">' + formatTimestamp(sent_time) + f.m + "</div></div>"
											} else {
												d += '<div class="arrowchat_chatroom_box_message arrowchat_clearfix' + l + image_msg + important + '" id="arrowchat_chatroom_message_' + f.id + '"><img class="arrowchat_chatroom_message_avatar arrowchat_no_names" src="'+f.a+'" alt="' + fromname + title + ' ' + tooltip + '" /><div class="arrowchat_chatroom_message_name">' + fromname + title + ':</div><div class="arrowchat_chatroom_message_content" data-id="' + tooltip + '"><div class="arrowchat_chatroom_delete" data-id="' +  f.id + '"> </div><span class="arrowchat_chatroom_msg">' + f.m + '</span></div></div>'
											}
										}
									});
									a("#arrowchat_chatroom_chat #arrowchat_chatroom_chat_content").html(d);
									showChatroomTime();
								}
								if (i == "room_info") {
									a.each(e, function (l, f) {										
										if (f.welcome_msg != "") {
											var message = stripslashes(f.welcome_msg);
											room_info[b] = message;
											message = replaceURLWithHTMLLinks(message);
											$chatroom_chat.append('<div class="arrowchat_chatroom_box_message arrowchat_clearfix" id="arrowchat_chatroom_welcome_msg"><div class="arrowchat_chatroom_message_content arrowchat_global_chatroom_message">' + message + "</div></div>");
										}
										room_desc[b] = f.desc;
										room_limit_msg[b] = f.limit_msg;
										room_limit_sec[b] = f.limit_sec;
									});
								}
							});
							modDeleteControls();
							if (c_disable_avatars == 1 || a("#arrowchat_setting_names_only :input").is(":checked")) {
								a(".arrowchat_chatroom_avatar").addClass("arrowchat_hide_avatars");
								a(".arrowchat_chatroom_message_avatar").addClass("arrowchat_hide_avatars");
								a(".arrowchat_chatroom_flyout_avatar").addClass("arrowchat_hide_avatars");
								a(".arrowchat_chatroom_message_name").show();
								a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_no_names");
							}
							if (a("#arrowchat_chatroom_show_names :input").is(":checked")) {
								a(".arrowchat_chatroom_message_name").show();
								a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_no_names");
							}
							$chatroom_chat.scrollTop(5E4);
							a(".arrowchat_chatroom_message_input").focus();
							if (global_admin == 1 || global_mod == 1) {
								if (!a('.arrowchat_chatroom_admin_menu').length || !a('.arrowchat_flood_menu').length) addChatroomAdminControls();
							} else {
								if ($chatroom_admin_controls.length) $chatroom_admin_controls.remove();
							}
							a(".arrowchat_image_msg img,.arrowchat_emoji_text img").one("load", function() {
							  $chatroom_chat.scrollTop(5E4);
							}).each(function() {
							  if(this.complete) a(this).load();
							});
						} else {
							if (c_user_chatrooms == "1") {
								$chatroom_create.show();
							}
						}
					}
				}
			})
		}
		
		function modDeleteControls() {
			if (chatroom_mod == 1 || chatroom_admin == 1) {
				a(".arrowchat_chatroom_delete").show();
				a(".arrowchat_chatroom_delete", $chatrooms_popup).unbind("mouseenter").unbind("mouseleave").unbind("click");
				a(".arrowchat_chatroom_delete", $chatrooms_popup).mouseenter(function () {
					showTooltip(a(this), lang[160], 0, 3, 21);
					a(this).addClass("arrowchat_chatroom_delete_hover")
				});
				a(".arrowchat_chatroom_delete", $chatrooms_popup).mouseleave(function () {
					hideTooltip();
					a(this).removeClass("arrowchat_chatroom_delete_hover");
				});
				a(".arrowchat_chatroom_delete").click(function () {
					hideTooltip();
					var msg_id = a(this).attr('data-id');
					a("#arrowchat_chatroom_message_" + msg_id + " .arrowchat_chatroom_delete").remove();
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						delete_msg: msg_id,
						chatroom_id: Ccr,
						delete_name: u_name
					}, function () {
						a("#arrowchat_chatroom_message_" + msg_id + " .arrowchat_chatroom_msg").html(lang[159] + u_name);
					})
				});
			} else {
				a(".arrowchat_chatroom_delete").hide();
			}
		}
		
		function chatroomUploadProcessing() {
			var ts67 = Math.round(new Date().getTime());
			var path = c_ac_path.replace("../", "/");
			a("#arrowchat_upload_button").uploadifive({
				'uploadScript': path + 'includes/classes/class_uploads.php',
				'buttonText': ' ',
				'removeCompleted' : true,
				'formData': {
					'unixtime': ts67,
					'user': u_id
				},
				'queueID' : 'arrowchat_chatroom_upload_queue',
				'height': 25,
				'width': 24,
				'multi': false,
				'auto': true,
				'fileType': 'image/*',
				'fileSizeLimit' : c_max_upload_size + 'MB',
				'onError': function (file, errorCode, errorMsg, errorString) {
					
				},
				'onUploadComplete': function (file) {
					var uploadType = "file",
						fileType = file.type.toLowerCase();
					if (fileType == "image/jpeg" || fileType == "image/gif" || fileType == "image/jpg" || fileType == "image/png")
						uploadType = "image";
						
					a.post(c_ac_path + "includes/json/send/send_message_chatroom.php", {
						userid: u_id,
						username: u_name,
						chatroomid: Ccr,
						message: uploadType + "{" + ts67 + "}{" + file.name + "}"
					}, function (e) {
						if (a("#arrowchat_chatroom_message_" + e).length) {} else {
							var message = '';
							if (uploadType == "image") {
								$chatroom_chat.append('<div id="arrowchat_chatroom_message_' + e + '" class="arrowchat_chatroom_important arrowchat_image_msg arrowchat_self arrowchat_chatroom_box_message arrowchat_clearfix"><div class="arrowchat_chatroom_message_name">' + lang[90] + '</div><div class="arrowchat_chatroom_message_content" data-id="' + lang[90] + '"><div class="arrowchat_chatroom_delete" data-id="' + e + '" style="display: block;"> </div><span class="arrowchat_chatroom_msg"><div class="arrowchat_image_message"><img data-id="' + c_ac_path + 'public/download.php?file=' + ts67 + '" src="' + c_ac_path + 'public/download.php?file=' + ts67 + '_t" alt="Image" class="arrowchat_lightbox" /></div></span></div></div>');
								message = '<div class="arrowchat_image_message"><img data-id="' + c_ac_path + 'public/download.php?file=' + ts67 + '" src="' + c_ac_path + 'public/download.php?file=' + ts67 + '_t" alt="Image" class="arrowchat_lightbox" /></div>';
								a(".arrowchat_image_msg img,.arrowchat_emoji_text img").one("load", function() {
									setTimeout(function () {
										$chatroom_chat.scrollTop(5E4);
									}, 500);
								}).each(function() {
								  if(this.complete) a(this).load();
								});
							} else {
								$chatroom_chat.append('<div id="arrowchat_chatroom_message_' + e + '" class="arrowchat_chatroom_important arrowchat_image_msg arrowchat_self arrowchat_chatroom_box_message arrowchat_clearfix"><div class="arrowchat_chatroom_message_name">' + lang[90] + '</div><div class="arrowchat_chatroom_message_content" data-id="' + lang[90] + '"><div class="arrowchat_chatroom_delete" data-id="' + e + '" style="display: block;"> </div><span class="arrowchat_chatroom_msg"><div class="arrowchat_action_message">' + lang[69] + '<br /><a href="' + c_ac_path + 'public/download.php?file=' + ts67 + '">' + file.name + '</a></div></span></div></div>');
								message = '<div class="arrowchat_action_message">' + lang[69] + '<br /><a href="' + c_ac_path + 'public/download.php?file=' + ts67 + '">' + file.name + '</a></div>';
							}
							var data_array = [e, u_name, message, Ccr];
							lsClick(JSON.stringify(data_array), 'send_chatroom_message');
						}
						$chatroom_chat.scrollTop(5E4);
					});
					chatroomUploadProcessing();
				}
			});
			a("#uploadifive-arrowchat_upload_button", $chatrooms_popup).mouseenter(function () {
				a(this).addClass("arrowchat_upload_button_hover")
			});
			a("#uploadifive-arrowchat_upload_button", $chatrooms_popup).mouseleave(function () {
				a(this).removeClass("arrowchat_upload_button_hover");
			});
		}
		
		function addChatroomAdminControls() {
			$chatroom_admin_controls = a("<div/>").addClass('arrowchat_chatroom_admin_menu').html('<li class="arrowchat_menu_separator"></li><li class="arrowchat_menu_item"><a id="arrowchat_edit_description" class="arrowchat_menu_anchor arrowchat_menu_no_check"><span>' + lang[157] + '</span></a></li><li class="arrowchat_menu_item"><a id="arrowchat_edit_welcome" class="arrowchat_menu_anchor arrowchat_menu_no_check"><span>' + lang[153] + '</span></a></li><li class="arrowchat_menu_item"><a id="arrowchat_edit_flood" class="arrowchat_menu_anchor arrowchat_menu_no_check"><span>' + lang[171] + '</span></a></li>').appendTo('#arrowchat_chatroom_options_flyout .arrowchat_inner_menu');
			addHover(a(".arrowchat_menu_item"), "arrowchat_more_hover");
			a("#arrowchat_edit_welcome").click(function () {
				var welcome_msg_input = prompt(lang[154], room_info[Ccr]);
				if (welcome_msg_input  || welcome_msg_input  == "") {
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chatroom_welcome_msg: welcome_msg_input ,
						chatroom_id: Ccr
					}, function () {
						displayMessage("arrowchat_chatroom_message_flyout", lang[155], "notice");
						room_info[Ccr] = welcome_msg_input;
						a(".arrowchat_chatroom_item2").click();
					});
				}
			});
			a("#arrowchat_edit_description").click(function () {
				var desc_input = prompt(lang[158], room_desc[Ccr]);
				if (desc_input  || desc_input  == "") {
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chatroom_description: desc_input,
						chatroom_id: Ccr
					}, function () {
						displayMessage("arrowchat_chatroom_message_flyout", lang[155], "notice");
						room_desc[Ccr] = desc_input;
						a(".arrowchat_chatroom_item2").click();
					});
				}
			});
			a("#arrowchat_edit_flood").unbind('click');
			a("#arrowchat_edit_flood").click(function () {
				a(this).parent().parent().parent(".arrowchat_inner_menu").hide();
				a("#arrowchat_flood_select_messages").val(room_limit_msg[Ccr]);
				a("#arrowchat_flood_select_seconds").val(room_limit_sec[Ccr]);
				a(".arrowchat_flood_menu").show();
			});			a("#arrowchat_flood_button").unbind('click');
			a("#arrowchat_flood_button").click(function () {
				a(".arrowchat_chatroom_item2").click();
				var flood_message = a("#arrowchat_flood_select_messages").val();
				var flood_seconds = a("#arrowchat_flood_select_seconds").val();
				if (!isNaN(flood_message) && !isNaN(flood_seconds)) {
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chatroom_id: Ccr,
						flood_message: flood_message,
						flood_seconds: flood_seconds
					}, function () {
						displayMessage("arrowchat_chatroom_message_flyout", lang[155], "notice");
						room_limit_msg[Ccr] = flood_message;
						room_limit_sec[Ccr] = flood_seconds;
					});
				}
			});
		}

		function receiveUser(b, c, d, e, l, f, h) {
			if (!(b == null || b == "")) {
				if ((uc_name[b] == null || uc_name[b] == "") && b.toString().search('facebook') == "-1") {
					if (aa[b] != 1) {
						aa[b] = 1;
						a.ajax({
							url: c_ac_path + "includes/json/receive/receive_user.php",
							data: {
								userid: b
							},
							type: "post",
							cache: false,
							dataType: "json",
							success: function (o) {
								if (o) {
									c = uc_name[b] = o.n;
									d = uc_status[b] = o.s;
									e = uc_avatar[b] = o.a;
									l = uc_link[b] = o.l;
									if (G[b] != null && typeof($user) != "undefined") {
										a(".arrowchat_closebox_bottom_status", $user[b]).removeClass("arrowchat_available arrowchat_busy arrowchat_offline").addClass("arrowchat_" + d);
										$users[b].removeClass("arrowchat_tab_offline").addClass("arrowchat_tab_" + c);
										$user_popups[b].length > 0 && a(".arrowchat_tabsubtitle .arrowchat_message", $user_popups[b]).html(i)
									}
									aa[b] = 0;
									if (c != null) {
										toggleUserChatTab(b, c, d, e, l, f);
									} else {
										a.post(c_ac_path + "includes/json/send/send_settings.php", {
											unfocus_chat: b
										}, function () {})
									}
								}
							}
						})
					} else {
						setTimeout(function () {
							receiveUser(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b], f, h)
						}, 500);
					}
				} else {
					if (b.toString().search('facebook') == "-1")
						toggleUserChatTab(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b], f);
					else
						toggleUserChatTab(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b], f, 1);
				}
			}
		}
		
		function userUploadProcessing(b) {
			var ts67 = Math.round(new Date().getTime());
			var path = c_ac_path.replace("../", "/");				
			a("#arrowchat_file_transfer_" + b).uploadifive({
				'uploadScript': path + 'includes/classes/class_uploads.php',
				'buttonText': ' ',
				'buttonClass': 'arrowchat_upload_user_button',
				'removeCompleted' : true,
				'formData': {
					'unixtime': ts67,
					'user': u_id
				},
				'queueID' : 'arrowchat_user_upload_queue_' + b,
				'height': 25,
				'width': 24,
				'multi': false,
				'auto': true,
				'fileType': 'image/*',
				'fileSizeLimit' : c_max_upload_size + 'MB',
				'onError': function (file, errorCode, errorMsg, errorString) {
					a(".arrowchat_textarea", $user_popups[b]).focus();
				},
				'onCancel': function (file) {
					a(".arrowchat_textarea", $user_popups[b]).focus();
				},
				'onUploadComplete': function (file) {
					var uploadType = "file",
						fileType = file.type.toLowerCase();
					if (fileType == "image/jpeg" || fileType == "image/gif" || fileType == "image/jpg" || fileType == "image/png")
						uploadType = "image";
						
					a.post(c_ac_path + "includes/json/send/send_message.php", {
						userid: u_id,
						to: b,
						message: uploadType + "{" + ts67 + "}{" + file.name + "}"
					}, function (e) {
						if (a("#arrowchat_message_" + e).length) {} else {
							var message = "";
							if (uploadType == "image") {
								a(".arrowchat_tabcontenttext", $user_popups[b]).append('<div class="arrowchat_chatboxmessage arrowchat_clearfix arrowchat_self arrowchat_image_msg" id="arrowchat_message_' + e + '"><span class="arrowchat_ts" style="display: none;">' + lang[90] + '</span><div class="arrowchat_chatboxmessagefrom"><div class="arrowchat_disable_avatars_name">' + lang[90] + '</div></div><div class="arrowchat_chatboxmessage_wrapper"><div class="arrowchat_chatboxmessagecontent" data-id="' + lang[90] + '"><div class="arrowchat_image_message"><img data-id="' + c_ac_path + 'public/download.php?file=' + ts67 + '" src="' + c_ac_path + 'public/download.php?file=' + ts67 + '_t" alt="Image" class="arrowchat_lightbox" /></div></div></div></div>');
								message = '<div class="arrowchat_image_message"><img data-id="' + c_ac_path + 'public/download.php?file=' + ts67 + '" src="' + c_ac_path + 'public/download.php?file=' + ts67 + '_t" alt="Image" class="arrowchat_lightbox" /></div>';
								a(".arrowchat_image_msg img,.arrowchat_emoji_text img").one("load", function() {
									setTimeout(function () {
										a(".arrowchat_tabcontenttext", $user_popups[b]).scrollTop(a(".arrowchat_tabcontenttext", $user_popups[b])[0].scrollHeight);
									}, 500);
								}).each(function() {
								  if(this.complete) a(this).load();
								});
							} else {
								a(".arrowchat_tabcontenttext", $user_popups[b]).append('<div class="arrowchat_chatboxmessage arrowchat_clearfix arrowchat_self arrowchat_image_msg" id="arrowchat_message_' + e + '"><span class="arrowchat_ts" style="display: none;">' + lang[90] + '</span><div class="arrowchat_chatboxmessagefrom"><div class="arrowchat_disable_avatars_name">' + lang[90] + '</div></div><div class="arrowchat_chatboxmessage_wrapper"><div class="arrowchat_chatboxmessagecontent" data-id="' + lang[90] + '"><div class="arrowchat_action_message">' + lang[69] + '<br /><a href="' + c_ac_path + 'public/download.php?file=' + ts67 + '">' + file.name + '</a></div></div></div></div>');
								message = '<div class="arrowchat_action_message">' + lang[69] + '<br /><a href="' + c_ac_path + 'public/download.php?file=' + ts67 + '">' + file.name + '</a></div>';
							}
							var time = Math.floor((new Date).getTime() / 1E3);
							var data_array = [e, b, message, time, 1, 1];
							lsClick(JSON.stringify(data_array), 'private_message');
						}
						a(".arrowchat_tabcontenttext", $user_popups[b]).scrollTop(a(".arrowchat_tabcontenttext", $user_popups[b])[0].scrollHeight);
					});
					a(".arrowchat_textarea", $user_popups[b]).focus();
					userUploadProcessing(b);
				}
			});
			a(".arrowchat_upload_user_button", $user_popups[b]).mouseenter(function () {
				a(this).addClass("arrowchat_upload_button_hover")
			});
			a(".arrowchat_upload_user_button", $user_popups[b]).mouseleave(function () {
				a(this).removeClass("arrowchat_upload_button_hover");
			});
		}

		function toggleUserChatTab(b, c, d, e, l, f, jabber) {
			if (G[b] != null) {
				if (!$users[b].hasClass("arrowchat_tabclick") && f != 1) {
					if (j != "") {
						closePopup($user_popups[j], $users[j]);
						j = "";
					}
					if (a("#arrowchat_unseenuser_" + b).length > 0) { 
						a("#arrowchat_unseenuser_" + b).click();
					} else {
						$users[b].click();
					}
				}
			} else {
				shortname = renderHTMLString(c);
				longname = renderHTMLString(c);
				$users[b] = a(ArrowChat.Templates.chat_tab(shortname)).attr('data-id', b).appendTo($chatboxes_wide);
				$users[b].children('.arrowchat_inner_button').prepend('<div class="arrowchat_closebox_bottom_status arrowchat_' + d + '"></div>');
				$users[b].addClass("arrowchat_tab_" + d);
				adjustBarSize();
				a(".arrowchat_closebox_bottom", $users[b]).mouseenter(function () {
					a(this).addClass("arrowchat_closebox_bottomhover")
				});
				a(".arrowchat_closebox_bottom", $users[b]).mouseleave(function () {
					a(this).removeClass("arrowchat_closebox_bottomhover");
				});
				a(".arrowchat_closebox_bottom", $users[b]).click(function () {
					lsClick(".arrowchat_closebox_bottom", 'ac_click', "users['"+b+"']");
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						close_chat: b,
						tab_alert: 1
					}, function () {});
					$user_popups[b].remove();
					$users[b].remove();
					if (j == b) j = "";
					adjustBarSize();
					y[b] = null;
					G[b] = null;
					ca[b] = 0;
				});
				i = c = "";
				if (l != "") {
					c = '<a href="' + l + '">';
					i = "</a>"
				}
				l = "";
				if (e != "") l = '<div class="arrowchat_avatarbox">' + c + '<img src="' + e + '" class="arrowchat_avatar" />' + i + "</div>";
				$user_popups[b] = a(ArrowChat.Templates.chat_window(c, longname, i, l, b)).css("display", "none").appendTo($body);
				if (c_video_chat != 1) {
					a("#arrowchat_video_chat_" + b).hide();
				}
				if (c_enable_moderation != 1) {
					a("#arrowchat_report_" + b).hide();
				}
				if (c_popout_on != 1) {
					a(".arrowchat_chat_popout").hide();
				}
				addHover(a(".arrowchat_video_chat"), "arrowchat_more_hover");
				a(".arrowchat_tabcontenttext", $user_popups[b]).click(function () {
					if (window.getSelection().toString().length) {} else {
						a(".arrowchat_textarea", $user_popups[b]).focus();
					}
				});
				a(".arrowchat_textarea", $user_popups[b]).focusin(function() {
					a(".arrowchat_tabtitle", $user_popups[b]).addClass("arrowchat_typing_title");
				});
				a(".arrowchat_textarea", $user_popups[b]).focusout(function() {
					a(".arrowchat_tabtitle", $user_popups[b]).removeClass("arrowchat_typing_title");
				});
				if (c_file_transfer == 1) {
					userUploadProcessing(b);
				}
				if (uc_status[b] == 'offline' || uc_status[b] == 'busy')
					a(".arrowchat_tabtitle .arrowchat_video_icon", $user_popups[b]).addClass("arrowchat_video_unavailable");
				else
					a(".arrowchat_tabtitle .arrowchat_video_icon", $user_popups[b]).removeClass("arrowchat_video_unavailable");
				a("#arrowchat_video_chat_" + b).click(function () {
					if (uc_status[b] != 'offline' && uc_status[b] != 'busy') {
						var RN = Math.floor(Math.random() * 9999999999);
						while (String(RN).length < 10) {
							RN = '0' + RN;
						}
						if (c_video_select == 4)
							RN = location.host + RN;
						if (c_video_select == 2) {
							a.ajax({
								type:"post",
								url: c_ac_path + "public/video/video_session.php",
								data: {
									room: RN
								},
								async: false,
								success: function(sess) {
									jqac.arrowchat.videoWith(sess);
									a.post(c_ac_path + "includes/json/send/send_message.php", {
										userid: u_id,
										to: b,
										message: "video{" + sess + "}"
									}, function (e) {
										if (e == "-1") {
											displayMessage("arrowchat_chatbox_message_flyout_" + b, lang[102], "error");
										} else {
											displayMessage("arrowchat_chatbox_message_flyout_" + b, lang[63], "notice");
										}
										a(".arrowchat_tabcontenttext", $user_popups[b]).scrollTop(a(".arrowchat_tabcontenttext", $user_popups[b])[0].scrollHeight);
									});
								}
							});
						} else {
							jqac.arrowchat.videoWith(RN);
							a.post(c_ac_path + "includes/json/send/send_message.php", {
								userid: u_id,
								to: b,
								message: "video{" + RN + "}"
							}, function (e) {
								if (e == "-1") {
									displayMessage("arrowchat_chatbox_message_flyout_" + b, lang[102], "error");
								} else {
									displayMessage("arrowchat_chatbox_message_flyout_" + b, lang[63], "notice");
								}
								a(".arrowchat_tabcontenttext", $user_popups[b]).scrollTop(a(".arrowchat_tabcontenttext", $user_popups[b])[0].scrollHeight);
							});
						}
					}
				});
				preventScrolling(a(".arrowchat_tabcontenttext, .arrowchat_emoji_wrapper"));
				preventScrolling(a(".arrowchat_giphy_image_wrapper"));
				a(".arrowchat_emoji_selector", $user_popups[b]).click(function() {
					if (!a(this).hasClass("arrowchat_emoji_focused")) {
						a(".arrowchat_emoji_wrapper", $user_popups[b]).html('<div class="arrowchat_loading_icon"></div>');
						a(".arrowchat_emoji_selector", $user_popups[b]).removeClass("arrowchat_emoji_focused");
						a(this).addClass("arrowchat_emoji_focused");
						var load_id = a(this).attr("data-id");
						a.ajax({
							url: c_ac_path + 'includes/emojis/' + load_id + '.php',
							type: "GET",
							cache: true,
							success: function(html) {
								a(".arrowchat_emoji_wrapper", $user_popups[b]).html(html);
								a(".arrowchat_emoji", $user_popups[b]).click(function () {
									if (a(this).hasClass("arrowchat_emoji_custom"))
										var smiley_code = a(this).children('img').attr("data-id");
									else
										var smiley_code = '[e-' + a(this).children('img').attr("data-id").replace('.png', '') + ']';
									var existing_text = a(".arrowchat_textarea", $user_popups[b]).val();
									a(".arrowchat_textarea", $user_popups[b]).focus().val('').val(existing_text + smiley_code);
								});
							}
						});
					}
				});
				a(".arrowchat_emoji_smileys").mouseover(function(){showTooltip(a(this), lang[230], true, 15);}).mouseout(function(){hideTooltip();});
				a(".arrowchat_emoji_animals").mouseover(function(){showTooltip(a(this), lang[231], true, 15);}).mouseout(function(){hideTooltip();});
				a(".arrowchat_emoji_food").mouseover(function(){showTooltip(a(this), lang[232], true, 15);}).mouseout(function(){hideTooltip();});
				a(".arrowchat_emoji_activities").mouseover(function(){showTooltip(a(this), lang[233], true, 15);}).mouseout(function(){hideTooltip();});
				a(".arrowchat_emoji_travel").mouseover(function(){showTooltip(a(this), lang[234], true, 15);}).mouseout(function(){hideTooltip();});
				a(".arrowchat_emoji_objects").mouseover(function(){showTooltip(a(this), lang[235], true, 15);}).mouseout(function(){hideTooltip();});
				a(".arrowchat_emoji_symbols").mouseover(function(){showTooltip(a(this), lang[236], true, 15);}).mouseout(function(){hideTooltip();});
				a(".arrowchat_emoji_flags").mouseover(function(){showTooltip(a(this), lang[237], true, 15);}).mouseout(function(){hideTooltip();});
				a(".arrowchat_emoji_custom").mouseover(function(){showTooltip(a(this), lang[238], true, 15);}).mouseout(function(){hideTooltip();});
				a(".arrowchat_smiley_button", $user_popups[b]).mouseenter(function () {
					a(this).addClass("arrowchat_smiley_button_hover")
				});
				a(".arrowchat_smiley_button", $user_popups[b]).mouseleave(function () {
					a(this).removeClass("arrowchat_smiley_button_hover");
				});
				a(".arrowchat_smiley_button", $user_popups[b]).click(function () {
					if (a(".arrowchat_giphy_popout", $user_popups[b]).children(".arrowchat_more_popout").is(":visible")) {
						a(".arrowchat_giphy_popout", $user_popups[b]).children(".arrowchat_more_popout").hide();
					}
					if (a(".arrowchat_smiley_popout", $user_popups[b]).children(".arrowchat_more_popout").is(":visible")) {
						a(".arrowchat_smiley_popout", $user_popups[b]).children(".arrowchat_more_popout").hide();
					} else {
						if (!a(".arrowchat_emoji_selector", $user_popups[b]).hasClass("arrowchat_emoji_focused")) {
							a(".arrowchat_emoji_wrapper", $user_popups[b]).html('<div class="arrowchat_loading_icon"></div>');
							a(".arrowchat_emoji_selector", $user_popups[b]).removeClass("arrowchat_emoji_focused");
							a(".arrowchat_emoji_smileys", $user_popups[b]).addClass("arrowchat_emoji_focused");
							a.ajax({
								url: c_ac_path + 'includes/emojis/emoji_smileys.php',
								type: "GET",
								cache: true,
								success: function(html) {
									a(".arrowchat_emoji_wrapper", $user_popups[b]).html(html);
									a(".arrowchat_emoji", $user_popups[b]).click(function () {
										if (a(this).hasClass("arrowchat_emoji_custom"))
											var smiley_code = a(this).children('img').attr("data-id");
										else
											var smiley_code = '[e-' + a(this).children('img').attr("data-id").replace('.png', '') + ']';
										var existing_text = a(".arrowchat_textarea", $user_popups[b]).val();
										a(".arrowchat_textarea", $user_popups[b]).focus().val('').val(existing_text + smiley_code);
									});
								}
							});
						}
						a(".arrowchat_textarea", $user_popups[b]).focus();
						a(".arrowchat_smiley_popout", $user_popups[b]).children(".arrowchat_more_popout").show();
					}
				}).children().click(function(e){
					return false;
				});
				a(".arrowchat_giphy_button", $user_popups[b]).mouseenter(function () {
					a(this).addClass("arrowchat_giphy_button_hover")
				});
				a(".arrowchat_giphy_button", $user_popups[b]).mouseleave(function () {
					a(this).removeClass("arrowchat_giphy_button_hover");
				});
				a(".arrowchat_giphy_button", $user_popups[b]).click(function () {
					if (a(".arrowchat_smiley_popout", $user_popups[b]).children(".arrowchat_more_popout").is(":visible")) {
						a(".arrowchat_smiley_popout", $user_popups[b]).children(".arrowchat_more_popout").hide();
					}
					if (a(".arrowchat_giphy_popout", $user_popups[b]).children(".arrowchat_more_popout").is(":visible")) {
						a(".arrowchat_giphy_popout", $user_popups[b]).children(".arrowchat_more_popout").hide();
					} else {
						a(".arrowchat_giphy_popout", $user_popups[b]).children(".arrowchat_more_popout").show();
						a(".arrowchat_giphy_search", $user_popups[b]).val('');
						a(".arrowchat_giphy_search", $user_popups[b]).focus();
						loadGiphy('https://api.giphy.com/v1/gifs/trending?api_key=IOYyr4NK5ldaU&limit=20', 1, b);
					}
				}).children().click(function(e){
					return false;
				});
				a(".arrowchat_giphy_search", $user_popups[b]).keyup(function () {
					a(".arrowchat_giphy_image_wrapper", $user_popups[b]).html('<div class="arrowchat_loading_icon"></div>');
					if (a(".arrowchat_giphy_search", $user_popups[b]).val() == '')
						loadGiphy('https://api.giphy.com/v1/gifs/trending?api_key=IOYyr4NK5ldaU&limit=20', 1, b);
					else
						loadGiphy('https://api.giphy.com/v1/gifs/search?api_key=IOYyr4NK5ldaU&limit=20&q=' + a(".arrowchat_giphy_search", $user_popups[b]).val(), 1, b);
				});
				if (c_file_transfer != 1) {a("#arrowchat_file_transfer_" + b).hide();a(".arrowchat_tabcontentinput", $user_popups[b]).addClass("arrowchat_no_file_upload")}
				if (c_disable_smilies == 1) {a(".arrowchat_smiley_button").hide();a(".arrowchat_tabcontentinput", $user_popups[b]).addClass("arrowchat_no_smiley")}
				if (c_giphy == 1) {a(".arrowchat_giphy_button", $user_popups[b]).hide();a(".arrowchat_tabcontentinput", $user_popups[b]).addClass("arrowchat_no_giphy")}
				a(".arrowchat_tabtitle .arrowchat_more_button", $user_popups[b]).mouseenter(function () {
					showTooltip(a(this), lang[23], 0, 10, 5);
					a(this).addClass("arrowchat_more_button_hover");
					a(".arrowchat_tabtitle", $user_popups[b]).removeClass("arrowchat_chatboxtabtitlemouseover")
				});
				a(".arrowchat_tabtitle .arrowchat_more_button", $user_popups[b]).mouseleave(function () {
					hideTooltip();
					a(this).removeClass("arrowchat_more_button_hover");
					a(".arrowchat_tabtitle", $user_popups[b]).addClass("arrowchat_chatboxtabtitlemouseover")
				});
				a("#arrowchat_more_" + b).click(function () {
					hideTooltip();
					a("#arrowchat_more_popout_" + b).toggle();
					a(this).addClass("arrowchat_more_button_hover");
					a(this).toggleClass("arrowchat_more_button_selected");
				});
				a("#arrowchat_block_" + b).click(function () {
					a("#arrowchat_more_popout_" + b).toggle();
					a("#arrowchat_more_" + b).toggleClass("arrowchat_more_button_selected");
					a(".arrowchat_tabtitle .arrowchat_closebox", $user_popups[b]).click();
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						block_chat: b
					}, function () {
						if (typeof(blockList[b]) == "undefined") {
							blockList[b] = b;
						}
						loadBuddyList();
					})
				});
				a("#arrowchat_clear_" + b).click(function () {
					a("#arrowchat_more_popout_" + b).toggle();
					a("#arrowchat_more_" + b).toggleClass("arrowchat_more_button_selected");
					a("#arrowchat_tabcontenttext_" + b).html("");
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						clear_chat: b
					}, function () {})
				});
				a("#arrowchat_report_" + b).click(function () {
					a("#arrowchat_more_popout_" + b).toggle();
					a("#arrowchat_more_" + b).toggleClass("arrowchat_more_button_selected");
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						report_from: u_id,
						report_about: b
					}, function () {
						displayMessage("arrowchat_chatbox_message_flyout_" + b, lang[168], "notice");
					});
				});
				a(".arrowchat_textarea", $user_popups[b]).keydown(function (h) {
					return userchatKeydown(h, a(this), b, jabber)
				});
				a(".arrowchat_textarea", $user_popups[b]).keyup(function (h) {
					return userchatKeyup(h, a(this), b)
				});
				a(".arrowchat_tabtitle .arrowchat_closebox", $user_popups[b]).mouseenter(function () {
					showTooltip(a(this), lang[89], 0, 10, 5);
					a(this).addClass("arrowchat_chatboxmouseoverclose");
					a(".arrowchat_tabtitle", $user_popups[b]).removeClass("arrowchat_chatboxtabtitlemouseover")
				});
				a(".arrowchat_tabtitle .arrowchat_closebox", $user_popups[b]).mouseleave(function () {
					a(this).removeClass("arrowchat_chatboxmouseoverclose");
					a(".arrowchat_tabtitle", $user_popups[b]).addClass("arrowchat_chatboxtabtitlemouseover");
					hideTooltip();
				});
				a(".arrowchat_tabtitle .arrowchat_closebox", $user_popups[b]).click(function () {
					lsClick(".arrowchat_tabtitle .arrowchat_closebox", 'ac_click', "user_popups['"+b+"']");
					hideTooltip();
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						close_chat: b,
						tab_alert: 1
					}, function () {});
					$user_popups[b].remove();
					$users[b].remove();
					if (j == b) j = "";
					adjustBarSize();
					G[b] = null;
					y[b] = null;
					ca[b] = 0;
				});
				a(".arrowchat_tabtitle .arrowchat_video_icon", $user_popups[b]).mouseenter(function () {
					if (uc_status[b] == 'offline' || uc_status[b] == 'busy') {
						showTooltip(a(this), lang[146], 0, 10, 5); 
					} else {
						showTooltip(a(this), lang[88], 0, 10, 5);
						a(this).addClass("arrowchat_video_icon_hover");
					}
					a(".arrowchat_tabtitle", $user_popups[b]).removeClass("arrowchat_chatboxtabtitlemouseover")
				});
				a(".arrowchat_tabtitle .arrowchat_video_icon", $user_popups[b]).mouseleave(function () {
					a(this).removeClass("arrowchat_video_icon_hover");
					a(".arrowchat_tabtitle", $user_popups[b]).addClass("arrowchat_chatboxtabtitlemouseover");
					hideTooltip();
				});
				a(".arrowchat_more_popout .arrowchat_chat_popout", $user_popups[b]).click(function () {
					a("#arrowchat_more_popout_" + b).toggle();
					a("#arrowchat_more_" + b).toggleClass("arrowchat_more_button_selected");
					startPopoutChat();
				});
				a(".arrowchat_more_popout .arrowchat_chat_popout", $user_popups[b]).popupWindow({
					windowURL: c_ac_path + "public/popout/",
					height: 620,
					width: 940,
					top: 25,
					left: 25
				});
				a(".arrowchat_tabtitle", $user_popups[b]).not('.arrowchat_video_icon').click(function () {
					$users[b].click()
				}).children().not('.arrowchat_tab_name').click(function () {
					return false;
				});
				a(".arrowchat_tabtitle", $user_popups[b]).mouseenter(function () {
					a(this).addClass("arrowchat_chatboxtabtitlemouseover")
				});
				a(".arrowchat_tabtitle", $user_popups[b]).mouseleave(function () {
					a(this).removeClass("arrowchat_chatboxtabtitlemouseover")
				});
				$users[b].mouseenter(function () {
					a(this).addClass("arrowchat_tabmouseover");
					a("div", $users[b]).addClass("arrowchat_tabmouseovertext")
				});
				$users[b].mouseleave(function () {
					a(this).removeClass("arrowchat_tabmouseover");
					a("div", $users[b]).removeClass("arrowchat_tabmouseovertext")
				});
				$users[b].click(function () {
					lsClick(" ", 'ac_openclose', "users['"+b+"']");
					var tba = 0;
					if (a(".arrowchat_tabalert", $users[b]).length > 0) {
						tba = 1;
						a(".arrowchat_tabalert", $users[b]).remove();
						$users[b].removeClass("arrowchat_tab_new_message");
						G[b] = 0;
						y[b] = 0;
					}
					if (a(this).hasClass("arrowchat_tabclick")) {
						closePopup($user_popups[b], a(this));
						a(".arrowchat_closebox_bottom", $users[b]).removeClass("arrowchat_closebox_bottom_click");
						j = "";
						a.post(c_ac_path + "includes/json/send/send_settings.php", {
							unfocus_chat: b,
							tab_alert: 1
						}, function () {})
					} else {
						if (j != "") {
							closePopup($user_popups[j], $users[j]);
							a(".arrowchat_closebox_bottom", $users[j]).removeClass("arrowchat_closebox_bottom_click");
							j = ""
						}
						if (ca[b] != 1) {
							receiveHistory(b);
							ca[b] = 1
						}
						a.post(c_ac_path + "includes/json/send/send_settings.php", {
							focus_chat: b,
							tab_alert: tba
						}, function () {});     
						$user_popups[b].css("left", $users[b].offset().left).css("bottom", "25px"); 
						a(this).addClass("arrowchat_tabclick").addClass("arrowchat_usertabclick");
						$user_popups[b].addClass("arrowchat_tabopen");
						a(".arrowchat_closebox_bottom", $users[b]).addClass("arrowchat_closebox_bottom_click");						
						j = b;
						if (W) {
							$user_popups[j].css("position", "absolute").css("top", parseInt(a(window).height()) - parseInt($user_popups[j].css("bottom")) - parseInt($user_popups[j].height()) + a(window).scrollTop() + "px")
						}
					}
					adjustBarSize();
					a(".arrowchat_tabcontenttext", $user_popups[b]).scrollTop(a(".arrowchat_tabcontenttext", $user_popups[b])[0].scrollHeight);
					getStatus("updatingsession") != 1 && a(".arrowchat_textarea", $user_popups[b]).focus()
				});
				if (f != 1) {
					if (a("#arrowchat_chatbox_left").is(":visible")) {
						swapTab(b);
					} else {
						$users[b].click();
					}
				}
				y[b] = 0;
				G[b] = 0;

				if (c_disable_avatars == 1) {
					a(".arrowchat_avatarbox").hide();
					a("#arrowchat_setting_names_only").parent("li").hide();
				}
			}
		}

		function formatTimestamp(b, noHTML) {
			var c = "am",
				d = b.getHours(),
				i = b.getMinutes(),
				e = b.getDate();
			b = b.getMonth();			var g = d;
			if (d > 11) c = "pm";
			if (d > 12) d -= 12;
			if (d == 0) d = 12;
			if (d < 10) d = d;
			if (i < 10) i = "0" + i;
			var l = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				f = "th";
			if (e == 1 || e == 21 || e == 31) f = "st";
			else if (e == 2 || e == 22) f = "nd";
			else if (e == 3 || e == 23) f = "rd";
			if (noHTML) {
				if (c_us_time != 1) {
					return e != Na ? '' + g + ":" + i + " " + e + f + " " + l[b] + "" : '' + g + ":" + i + ""
				} else {
					return e != Na ? '' + d + ":" + i + c + " " + e + f + " " + l[b] + "" : '' + d + ":" + i + c + ""
				}
			} else {
				if (c_us_time != 1) {
					return e != Na ? '<span class="arrowchat_ts">' + g + ":" + i + " " + e + f + " " + l[b] + "</span>" : '<span class="arrowchat_ts">' + g + ":" + i + "</span>"
				} else {
					return e != Na ? '<span class="arrowchat_ts">' + d + ":" + i + c + " " + e + f + " " + l[b] + "</span>" : '<span class="arrowchat_ts">' + d + ":" + i + c + "</span>"
				}
			}
		}

		function receiveHistory(b, times) {
			if (times) {} else times = 1;
			if (times > 1) {
				a('<div class="arrowchat_message_history_loading" style="text-align:center;padding:5px 0;"><img src="' + c_ac_path + 'themes/' + u_theme + '/images/img-loading.gif" alt="Loading" /></div>').prependTo(a("#arrowchat_tabcontenttext_" + b));
			}
			a.ajax({
				cache: false,
				url: c_ac_path + "includes/json/receive/receive_history.php",
				data: {
					chatbox: b,
					history: times
				},
				type: "post",
				dataType: "json",
				success: function (c) {
					a(".arrowchat_message_history_loading").remove();
					history_ids[b] = 0;
					numMessages = 0;
					if (c) {
						if (times == 1)
							a(".arrowchat_tabcontenttext", $user_popups[b]).html("");
						last_sent[b] = null;
						var d = "",
							i = uc_name[b],
							init = false,
							unhide_avatars = [];
						a.each(c, function (e, l) {
							e == "messages" && a.each(l, function (f, h) {
								numMessages++;
								f = "";
								if (h.self == 1) {
									fromname = u_name;
									fromid = u_id;
									f = " arrowchat_self";
									_aa5 = _aa4 = "";
									avatar = u_avatar;
								} else {
									fromname = i;
									fromid = b;
									_aa4 = '<a href="' + uc_link[b] + '">';
									_aa5 = "</a>";
									avatar = uc_avatar[h.from];
								}
								if (last_name[h.from] != fromid && typeof(last_name[h.from]) != "undefined") {
									unhide_avatars.push(last_id[h.from]);
								}
								var image_msg = "";
								var o = new Date(h.sent * 1E3);
								tooltip = formatTimestamp(o, 1);
								if (c_show_full_name != "1") {
									if (fromname.indexOf(" ") != -1) fromname = fromname.slice(0, fromname.indexOf(" "));
								}
								if (h.message.substr(0, 4) == "<div") {
									image_msg = " arrowchat_image_msg";
								}
								d += '<div class="arrowchat_chatboxmessage arrowchat_clearfix' + f + image_msg + '" id="arrowchat_message_' + h.id + '">' + formatTimestamp(o) + '<div class="arrowchat_chatboxmessagefrom"><div class="arrowchat_disable_avatars_name">' + fromname + '</div><img alt="' + fromname + ' ' + tooltip + '" class="arrowchat_chatbox_avatar arrowchat_single_avatar_hide" src="' + avatar + '" /></div><div class="arrowchat_chatboxmessage_wrapper"><div class="arrowchat_chatboxmessagecontent" data-id="' + tooltip + '">' + h.message + "</div></div></div>";
								last_sent[h.from] = h.sent;
								last_name[h.from] = fromid;
								last_id[h.from] = h.id;
								init = true;
								
							})
						});
						var current_top_element = a("#arrowchat_tabcontenttext_" + b).children('div').first('div');
						if (times > 1) {
							a(d).prependTo(a("#arrowchat_tabcontenttext_" + b).first('div'));
						} else {
							a("#arrowchat_tabcontenttext_" + b).html("<div>" + d + "</div>");
						}
						if (a("#arrowchat_message_" + last_id[b]).length) {
							a("#arrowchat_message_" + last_id[b]).children('.arrowchat_chatboxmessagefrom').children('.arrowchat_chatbox_avatar').removeClass('arrowchat_single_avatar_hide');
						}
						a.each(unhide_avatars, function(key, value) {
							if (a("#arrowchat_message_" + value).length) {
								a("#arrowchat_message_" + value).children('.arrowchat_chatboxmessagefrom').children('.arrowchat_chatbox_avatar').removeClass('arrowchat_single_avatar_hide');
							}
						});
						showTimeAndTooltip();
						if (c_disable_avatars == 1 || a("#arrowchat_setting_names_only :input").is(":checked")) {
							setAvatarVisibility(1);
						}
						var previous_height = 0;
						current_top_element.prevAll().each(function() {
						  previous_height += a(this).outerHeight();
						});
						if (times == 1)
							a("#arrowchat_tabcontenttext_" + b).scrollTop(5E4);
						else
							a("#arrowchat_tabcontenttext_" + b).scrollTop(previous_height);
						a("#arrowchat_tabcontenttext_" + b).scroll(function(){
							if (a("#arrowchat_tabcontenttext_" + b).scrollTop() < 50 && history_ids[b] != 1) {
								history_ids[b] = 1;
								if (numMessages == 20) {
									times++;
									receiveHistory(b, times);
								}
							}
						});
						if (times == 1) {
							a(".arrowchat_image_msg img,.arrowchat_emoji_text img").one("load", function() {
							  a("#arrowchat_tabcontenttext_" + b).scrollTop(5E4);
							}).each(function() {
							  if(this.complete) a(this).load();
							});
						}
					}
				}
			})
		}
		
		function showTimeAndTooltip() {
			a(".arrowchat_self .arrowchat_chatboxmessagecontent").mouseenter(function () {
				showTooltip(a(this), a(this).attr("data-id"), false, 10, 0, false, 1);
			});
			a(".arrowchat_self .arrowchat_chatboxmessagecontent").mouseleave(function () {
				hideTooltip();
			});
			a(".arrowchat_chatbox_avatar").mouseenter(function () {
				showTooltip(a(this), a(this).attr("alt"), false, 55, -38, 1);
			});
			a(".arrowchat_chatbox_avatar").mouseleave(function () {
				hideTooltip();
			});						
			a(".arrowchat_chatboxmessage").mouseenter(function () {
				a(this).children(".arrowchat_ts").show();
			});
			a(".arrowchat_chatboxmessage").mouseleave(function () {
				a(this).children(".arrowchat_ts").hide();
			});
			a(".arrowchat_lightbox").unbind('click');
			a(".arrowchat_lightbox").click(function (){
				a.slimbox(a(this).attr('data-id'), '<a href="'+a(this).attr('data-id')+'">'+lang[70]+'</a>', {resizeDuration:1, overlayFadeDuration:1, imageFadeDuration:1, captionAnimationDuration:1});
			});
		}
		
		function showChatroomTime() {
			a(".arrowchat_self .arrowchat_chatroom_message_content").mouseenter(function () {
				showTooltip(a(this), a(this).attr("data-id"), false, 10, 0, false, 1);
			});
			a(".arrowchat_self .arrowchat_chatroom_message_content").mouseleave(function () {
				hideTooltip();
			});
			a(".arrowchat_chatroom_message_avatar").mouseenter(function () {
				showTooltip(a(this), a(this).attr("alt"), false, 50, -28, 1);
			});
			a(".arrowchat_chatroom_message_avatar").mouseleave(function () {
				hideTooltip();
			});	
			a(".arrowchat_lightbox").unbind('click');
			a(".arrowchat_lightbox").click(function (){
				a.slimbox(a(this).attr('data-id'), '<a href="'+a(this).attr('data-id')+'">'+lang[70]+'</a>', {resizeDuration:1, overlayFadeDuration:1, imageFadeDuration:1, captionAnimationDuration:1});
			});
		}

		function notifyNewMessage(b, c, d) {
			if (uc_name[b] == null || uc_name[b] == "") setTimeout(function () {
				notifyNewMessage(b, c, d)
			}, 500);
			else {
				receiveUser(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b], 1);
				if (d == 1) if (a(".arrowchat_tabalert", $users[b]).length > 0) c = parseInt(a(".arrowchat_tabalert", $users[b]).html()) + parseInt(c);
				if (c == 0) {
					$users[b].removeClass("arrowchat_tab_new_message");
					a(".arrowchat_tabalert", $users[b]).remove()
				} else {
					if (a(".arrowchat_tabalert", $users[b]).length > 0) {
						a(".arrowchat_tabalert", $users[b]).html(c);
					} else a("<div/>").css("top", "-11px").css("left", "112px").addClass("arrowchat_tabalert").html(c).appendTo($users[b]);
					$users[b].removeClass("arrowchat_tab_new_message").addClass("arrowchat_tab_new_message")
				}
				y[b] = c;		
				adjustBarSize();
			}
		}

		function setAvatarVisibility(b) {
			if (b == 1) { 
				a(".arrowchat_userlist_avatar").addClass("arrowchat_hide_avatars");
				a(".arrowchat_chatroom_avatar").addClass("arrowchat_hide_avatars");
				a(".arrowchat_chatroom_flyout_avatar").addClass("arrowchat_hide_avatars");
				a(".arrowchat_chatroom_message_avatar").addClass("arrowchat_hide_avatars");
				a(".arrowchat_chatroom_message_name").show();
				a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_no_names");
				a(".arrowchat_chatbox_avatar").hide();
				a(".arrowchat_disable_avatars_name").show();
				a(".arrowchat_chatboxmessage_wrapper").addClass("arrowchat_chatboxmessage_wrapper2");
				a(".arrowchat_chatboxmessagecontent").addClass("arrowchat_chatboxmessagecontent2");
			} else {
				a(".arrowchat_userlist_avatar").removeClass("arrowchat_hide_avatars");
				a(".arrowchat_chatroom_avatar").removeClass("arrowchat_hide_avatars");
				a(".arrowchat_chatroom_flyout_avatar").removeClass("arrowchat_hide_avatars");
				a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_hide_avatars");
				a(".arrowchat_chatroom_message_name").hide();
				a(".arrowchat_chatroom_message_avatar").addClass("arrowchat_no_names");
				a(".arrowchat_chatbox_avatar").show();
				a(".arrowchat_disable_avatars_name").hide();
				a(".arrowchat_chatboxmessage_wrapper").removeClass("arrowchat_chatboxmessage_wrapper2");
				a(".arrowchat_chatboxmessagecontent").removeClass("arrowchat_chatboxmessagecontent2");
			}
		}

		function buildBuddyListTab() {
			var d = "";
			$buddy_list_tab = a("<div/>").attr("id", "arrowchat_buddy_list_tab").addClass("arrowchat_bar_button").addClass("arrowchat_bar_right").html(ArrowChat.Templates.buddylist_tab()).appendTo($base);
			$userstab_popup = a("<div/>").attr("id", "arrowchat_userstab_popup").addClass("arrowchat_tabpopup").css("display", "none").html(ArrowChat.Templates.buddylist_window(d, _ts)).appendTo($body);
			if (c_disable_avatars == 1) {
				a("#arrowchat_name_box").hide();
				a("#arrowchat_setting_names_only").parent("li").hide();
			}
			$buddy_list_tab.css("width", c_width_blist + "px");
			if (c_width_blist <= 25) {
				a("#arrowchat_userstab_text").hide();
			}
			if (c_theme_change != 1) {
				a(".arrowchat_theme_button").hide();
			}
			a(".arrowchat_search_friends_text").placeholder();
			if (u_sounds == 1) { 
				a("#arrowchat_setting_sound :input").prop("checked", true)
			} else {
				a("#arrowchat_setting_sound").addClass("arrowchat_menu_unchecked");
				a("#arrowchat_setting_sound :input").prop("checked", false)
			}
			if (u_blist_open == 1) { 
				a("#arrowchat_setting_window_open :input").prop("checked", true)
			} else {
				a("#arrowchat_setting_window_open").addClass("arrowchat_menu_unchecked");
				a("#arrowchat_setting_window_open :input").prop("checked", false)
			}
			if (u_no_avatars == 1) {
				a("#arrowchat_setting_names_only :input").prop("checked", true)
			} else {
				a("#arrowchat_setting_names_only").addClass("arrowchat_menu_unchecked");
				a("#arrowchat_setting_names_only :input").prop("checked", false);
			}
			u_is_guest == 1 && c_guest_name_change == 1 && u_guest_name == "" && a(".arrowchat_enter_name_wrapper").show();
			a("#arrowchat_guest_name_input").placeholder();
			a("#arrowchat_guest_name_input").keydown(function (h) {
				if (h.keyCode == 13) {
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chat_name: a(this).val()
					}, function (data) {
						if (data != "1") {
							displayMessage("arrowchat_buddylist_message_flyout", data, "error");
						} else {
							a(".arrowchat_enter_name_wrapper").slideUp("fast");
							u_name = a(this).val();
						}
					});
				}
			});
			a(".arrowchat_search_friends_text").keyup(function () {
				if (typeof(searchxhr) != "undefined") searchxhr.abort();
				a(".arrowchat_search_not_found").remove();
				a("#arrowchat_userscontent").children('div').not('.arrowchat_userslist_offline').hide();
				a("<div/>").attr("class", "arrowchat_search_not_found arrowchat_nofriends").html('<div class="arrowchat_loading_icon"></div>').prependTo("#arrowchat_userscontent");
				clearTimeout(Z);
				adjustBarSize();
				var i = 0,
					c = "",
					d = "",
					f = a(this).val();
				if (f.length < 2) {
					a(".arrowchat_search_not_found").remove();
					a("#arrowchat_userscontent").children('div').not('#arrowchat_userslist_offline').show();
					if (buddylisttest == 2) loadBuddyList();
					buddylisttest = 1;
				} else {
					buddylisttest = 2;
					if (a("#arrowchat_setting_names_only :input").is(":checked")) d = "arrowchat_hide_avatars";
					searchxhr = a.ajax({
						url: c_ac_path + "includes/json/receive/receive_search.php",
						type: "post",
						cache: false,
						dataType: "json",
						data: {
							search_name: f
						},
						success: function (b) {
							if (b && b != null) {
								a.each(b, function (e, l) {
									a.each(l, function (f, h) {
										if (typeof(uc_avatar[h.id]) != "undefined")
											var ava = uc_avatar[h.id];
										else
											var ava = h.avatar;
										if (c_disable_avatars == 1 || a("#arrowchat_setting_names_only :input").is(":checked")) d = "arrowchat_hide_avatars";
										c += '<div id="arrowchat_userlist_' + h.id + '" class="arrowchat_userlist" onmouseover="jqac(this).addClass(\'arrowchat_userlist_hover\');" onmouseout="jqac(this).removeClass(\'arrowchat_userlist_hover\');"><img class="arrowchat_userlist_avatar ' + d + '" src="' + ava + '" /><span class="arrowchat_userscontentname">' + h.name + '</span><span class="arrowchat_userscontentdot arrowchat_' + h.status + '"></span></div>';
										i++;
									});
								});
								if (i == 0) {
									a(".arrowchat_search_not_found").html(lang[26]);
								} else {
									a(".arrowchat_search_not_found").remove();
									a('#arrowchat_userslist_available').show().html(c);
									
									a(".arrowchat_userlist").click(function (l) {
										receiveUserFromUserlist(l.target)
									});
								}
							}
							adjustBarSize();
						}
					});
				}
				adjustBarSize();
			});
			a(document).bind("idle.idleTimer", function () {
				if (w != 1) {
					clearUserStatus();
					a("#arrowchat_userstab_icon").addClass("arrowchat_user_away2");
					setUserStatus("away");
					isAway = 1;
				}
			});
			a(document).bind("active.idleTimer", function () {
				if (w != 1) {
					clearUserStatus();
					setUserStatus("available");
					a("#arrowchat_userstab_icon").addClass("arrowchat_user_available2");
					isAway = 0;
				}
			});
			a.idleTimer(60000 * ArrowChat.IdleTime);
			a("#arrowchat_theme_button").click(function () {
				a("#arrowchat_theme_flyout").toggleClass("arrowchat_theme_flyout_display");
				a(".arrowchat_theme_link").addClass("arrowchat_theme_button_hover");
				a(".arrowchat_theme_link").toggleClass("arrowchat_more_button_selected");
				var theme_switch = a(".arrowchat_themeswitcher").val();
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					theme: theme_switch
				}, function (theme) {
					a("#arrowchat_css").attr({
						href: c_ac_path + "external.php?type=css&t=" + theme_switch
					});
					window.location.reload();
				});
			});
			a("#arrowchat_setting_sound").click(function () {
				lsClick("#arrowchat_setting_sound", 'ac_click');
				a(this).toggleClass("arrowchat_menu_unchecked");
				if (a("#arrowchat_setting_sound :input").is(":checked")) {
					a("#arrowchat_setting_sound :input").prop("checked", false);
					_soundcheck = -1;
					u_sounds = 0;
				} else {
					a("#arrowchat_setting_sound :input").prop("checked", true);
					_soundcheck = 1;
					u_sounds = 1;
				}
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					sound: _soundcheck
				}, function () {
				});
			});
			a("#arrowchat_setting_window_open").click(function () {
				a(this).toggleClass("arrowchat_menu_unchecked");
				if (a("#arrowchat_setting_window_open :input").is(":checked")) {
					a("#arrowchat_setting_window_open :input").prop("checked", false);
					_windowcheck = -1
				} else {
					a("#arrowchat_setting_window_open :input").prop("checked", true);
					_windowcheck = 1
				}
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					window: _windowcheck
				}, function () {
				});
			});
			a("#arrowchat_setting_names_only").click(function () {
				lsClick("#arrowchat_setting_names_only", 'ac_click');
				a(this).toggleClass("arrowchat_menu_unchecked");
				if (a("#arrowchat_setting_names_only :input").is(":checked")) {
					a("#arrowchat_setting_names_only :input").prop("checked", false);
					setAvatarVisibility(0);
					_namecheck = -1
				} else {
					a("#arrowchat_setting_names_only :input").prop("checked", true);
					setAvatarVisibility(1);
					_namecheck = 1
				}
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					name: _namecheck
				}, function () {
				});
			});
			a("#arrowchat_setting_block_list").click(function () {
				a(this).parent().parent(".arrowchat_inner_menu").hide();
				a(".arrowchat_block_menu").show();
				a.ajax({
					url: c_ac_path + "includes/json/receive/receive_block_list.php",
					type: "get",
					cache: false,
					dataType: "json",
					success: function (b) {
						if (b && b != null) {
							a(".arrowchat_block_menu select").html("");
							a("<option/>").attr("value", "0").html(lang[118]).appendTo(a(".arrowchat_block_menu select"));
							a.each(b, function (e, l) {
								a.each(l, function (f, h) {
									a("<option/>").attr("value", h.id).html(h.username).appendTo(a(".arrowchat_block_menu select"));
								});
							});
						}
					}
				});
			});
			a("#arrowchat_unblock_button").click(function () {
				a(".arrowchat_panel_item").click();
				var unblock_chat_user = a(".arrowchat_block_menu select").val();
				if (unblock_chat_user != "0") {
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						unblock_chat: unblock_chat_user
					}, function () {
						if (typeof(blockList[unblock_chat_user]) != "undefined") {
							blockList.splice(unblock_chat_user, 1);
						}
						loadBuddyList();
					});
				}
			});
			preventScrolling(a("#arrowchat_userscontent"));
			a(".arrowchat_theme_link").mouseenter(function () {
				showTooltip(a(this), lang[94], 0, 10, 5);
				a(this).parent().addClass("arrowchat_theme_button_hover");
				a("#arrowchat_userstab_popup .arrowchat_userstabtitle").removeClass("arrowchat_chatboxtabtitlemouseover2")
			});
			a(".arrowchat_theme_link").mouseleave(function () {
				hideTooltip();
				a(this).parent().removeClass("arrowchat_theme_button_hover");
				a("#arrowchat_userstab_popup .arrowchat_userstabtitle").addClass("arrowchat_chatboxtabtitlemouseover2")
			});
			a(".arrowchat_theme_link").click(function () {
				hideTooltip();
				a("#arrowchat_userscontent").height() < 150 ? a("#arrowchat_theme_wrapper").addClass("flyout_reversed") : a("#arrowchat_theme_wrapper").removeClass("flyout_reversed");
				a("#arrowchat_theme_flyout").toggleClass("arrowchat_theme_flyout_display");
				a(this).addClass("arrowchat_theme_button_hover");
				a(this).toggleClass("arrowchat_more_button_selected");
				if (a(".arrowchat_panel_item").hasClass("arrowchat_more_button_selected")) {
					a(".arrowchat_panel_item").toggleClass("arrowchat_more_button_selected");
					a("#arrowchat_options_flyout").toggleClass("arrowchat_options_flyout_display");
				}
			});
			a(".arrowchat_panel_item").mouseenter(function () {
				showTooltip(a(this), lang[23], 0, 10, 5);
				a(this).parent().addClass("arrowchat_more_button_hover");
				a("#arrowchat_userstab_popup .arrowchat_userstabtitle").removeClass("arrowchat_chatboxtabtitlemouseover2")
			});
			a(".arrowchat_panel_item").mouseleave(function () {
				hideTooltip();
				a(this).parent().removeClass("arrowchat_more_button_hover");
				a("#arrowchat_userstab_popup .arrowchat_userstabtitle").addClass("arrowchat_chatboxtabtitlemouseover2")
			});
			a(".arrowchat_panel_item").click(function () {
				hideTooltip();
				a("#arrowchat_userscontent").height() < 150 ? a("#arrowchat_options_wrapper").addClass("flyout_reversed") : a("#arrowchat_options_wrapper").removeClass("flyout_reversed");
				a("#arrowchat_options_flyout").toggleClass("arrowchat_options_flyout_display");
				a(this).addClass("arrowchat_more_button_hover");
				a(this).toggleClass("arrowchat_more_button_selected");
				if (a(".arrowchat_theme_link").hasClass("arrowchat_more_button_selected")) {
					a(".arrowchat_theme_link").toggleClass("arrowchat_more_button_selected");
					a("#arrowchat_theme_flyout").toggleClass("arrowchat_theme_flyout_display");
				}
				a("#arrowchat_options_flyout").children(".arrowchat_inner_menu").show();
				a(".arrowchat_block_menu").hide();
			});
			addHover(a(".arrowchat_menu_item"), "arrowchat_more_hover");
			a("#arrowchat_gooffline").click(function () {
				lsClick("#arrowchat_gooffline", 'ac_click');
				a(".arrowchat_panel_item").click();
				a(".arrowchat_userstabtitle").toggleClass("arrowchat_userstabtitle_button_click");		
				pushCancelAll();
				cancelJSONP();
				a.idleTimer("destroy");
				clearTimeout(Z);
				if (j != "") {
					closePopup($user_popups[j], $users[j]);
					a(".arrowchat_closebox_bottom", $users[j]).removeClass("arrowchat_closebox_bottom_click");
					j = "";
				}
				a("#arrowchat_panel_options").removeClass("arrowchat_panel_hover");
				showUserOffline();
				a("#arrowchat_userstab_icon").addClass("arrowchat_user_invisible2");
				$chatboxes.hide();
			});
			a("#arrowchat_userstab_popup .arrowchat_userstabtitle").click(function () {
				$buddy_list_tab.click()
			}).children().not(".arrowchat_tab_name").click(function () {
				return false;
			});
			a("#arrowchat_userstab_popup .arrowchat_userstabtitle").mouseenter(function () {
				a(this).addClass("arrowchat_chatboxtabtitlemouseover2")
			});
			a("#arrowchat_userstab_popup .arrowchat_userstabtitle").mouseleave(function () {
				a(this).removeClass("arrowchat_chatboxtabtitlemouseover2")
			});
			$buddy_list_tab.mouseover(function () {
				if (c_width_blist <= 25) {
					if ($buddy_list_tab.hasClass("arrowchat_tabclick")) {} else {
						showTooltip($buddy_list_tab, lang[4]);
					}
				}
				a(this).addClass("arrowchat_tabmouseover");
			});
			$buddy_list_tab.mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				hideTooltip();
			});
			$buddy_list_tab.click(function () {
				lsClick("#arrowchat_buddy_list_tab", 'ac_openclose');
				if (c_width_blist <= 25) {
					hideTooltip();
				}
				closePopup($chatrooms_popup, $chatrooms_button);
				if (w == 1 || bli == 1) {
					clearTimeout(Z);
					loadBuddyList();
					bli = 0;
				}
				if (w == 1) {
					w = 0;
					a("#arrowchat_userstab_text").html("<b>" + lang[4] + "</b> (<b>" + (R) + "</b>)");
					receiveCore();	
					pushSubscribe();
					a.idleTimer(60000 * ArrowChat.IdleTime);
					setUserStatus("available");
					a("#arrowchat_userstab_icon").addClass("arrowchat_user_available2");
					$chatboxes.show();
				}
				closePopup($optionsbutton_popup, $optionsbutton);
				closePopup($modbutton_popup, $modbutton);
				$userstab_popup.css("left", $buddy_list_tab.offset().left - $userstab_popup.outerWidth() +  $buddy_list_tab.outerWidth()).css("bottom", "25px");
				a(this).toggleClass("arrowchat_tabclick").toggleClass("arrowchat_userstabclick");
				$userstab_popup.toggleClass("arrowchat_tabopen");
				adjustBuddyListSize();
			});
		}
		
		function startPopoutChat() {

		}
		
		function adjustBuddyListSize() {
			var searchHeight = 0, nameHeight = 0, poweredHeight = 0;
			if (a("#arrowchat_search_friends").is(":visible")) {searchHeight = a("#arrowchat_search_friends").outerHeight();}
			if (a(".arrowchat_enter_name_wrapper").is(":visible")) {nameHeight = a(".arrowchat_enter_name_wrapper").outerHeight();}

				a("#arrowchat_userscontent").css("height", "auto");

		}

		function adjustBarSize() {
			if (c_chat_maintenance != 1 && c_db_connection != 1 && u_id != "") {
				if ($optionsbutton_popup !== undefined) {
					var d = 0;
					a(".arrowchat_notification_message_div").each(function() {
						d += parseInt(a(this).outerHeight()) + 5;
					});
					if ((a(window).height() - a("#arrowchat_notifications_content")[0].scrollHeight) <= c_window_top_padding && (a("#arrowchat_notifications_content").outerHeight() <= d)) {
						a("#arrowchat_notifications_content").css("height", a(window).height() - c_window_top_padding + "px");
					} else {
						a("#arrowchat_notifications_content").css("height", "auto");
					}
				}
				adjustBuddyListSize();
			}
			var b = a(window).width(),
				c = 0,
				additional_width = 0;
			c = 19;
			for (d = 0; d < barLinks.length; d++) {
				c += a("#arrowchat_trayicon_" + d).outerWidth();
				additional_width += a("#arrowchat_trayicon_" + d).outerWidth();
			}
			if ($optionsbutton !== undefined) c += $optionsbutton.outerWidth();
			if ($modbutton !== undefined) c += $modbutton.outerWidth();
			if ($chatrooms_button !== undefined) c += $chatrooms_button.outerWidth();
			if (a("#arrowchat_hide_bar_button") !== undefined) c += a("#arrowchat_hide_bar_button").outerWidth();
			var i = 0;
			for (bha in apps) {
				if (apps[bha][12] != "1" && typeof $application_buttons[apps[bha][0]] != "undefined") {
					c += $application_buttons[apps[bha][0]].outerWidth();
					additional_width += $application_buttons[apps[bha][0]].outerWidth();
				}
			}
			if ($applications_button !== undefined) {
				c += $applications_button.outerWidth();
				additional_width += $applications_button.outerWidth();
			}
			if (c_no_apps_menu == 1) c+= 130;
			if (barLinks.length > 0 && i > 0) c += 30;
			positionBar(c);
			if (c_chat_maintenance != 1 && c_db_connection != 1 && u_id != "") {
				var chatboxes_width_value = 0;
				a(".arrowchat_user_tab").each(function(){
					chatboxes_width_value = chatboxes_width_value + a(this).outerWidth();
				});
				$chatboxes_wide.width(chatboxes_width_value);
				c_notifications != 0 && $optionsbutton_popup.css("left", $optionsbutton.offset().left - $optionsbutton_popup.outerWidth() + $optionsbutton.outerWidth()).css("bottom", "25px");
				c_enable_moderation == 1 && u_is_mod == 1 && $modbutton_popup.css("left", $modbutton.offset().left - $modbutton_popup.outerWidth() + $modbutton.outerWidth()).css("bottom", "25px");
				c_chatrooms != 0 && $chatrooms_popup.css("left", $chatrooms_button.offset().left - $chatrooms_popup.outerWidth() + $chatrooms_button.outerWidth()).css("bottom", "25px");
				if (typeof $applications_button_popup != "undefined") {
					c_applications_on != 0 && $applications_button_popup.css("left", $applications_button.offset().left).css("bottom", "25px");
				}
				$userstab_popup.css("left", $buddy_list_tab.offset().left - $userstab_popup.outerWidth() + $buddy_list_tab.outerWidth()).css("bottom", "25px");
				if (m != "") {
					$application_button_popups[m].css("left", $application_buttons[m].offset().left).css("bottom", "25px");
				}
				if (j != "")
					$user_popups[j].css("left", $users[j].offset().left).css("bottom", "25px");           
				updateRightLastClasses(additional_width);
				$unseen_users.css("left", $chatbox_left.offset().left).css("bottom", "25px");
				W && positionArrowchat()
			}
		}
		
		function positionBar(apps_tray_width) {
			var window_width = a(window).width();
			if (c_bar_fixed == 1) {
				$base.css("width", c_bar_fixed_width);
				if (c_bar_fixed_alignment == "left") {
					$base.css("left", c_bar_padding);				
				}
				if (c_bar_fixed_alignment == "center") {
					var left_value = (window_width - c_bar_fixed_width) / 2;
					$base.css("left", left_value);
				}
				if (c_bar_fixed_alignment == "right") {
					var left_value = (window_width - c_bar_fixed_width);
					$base.css("left", left_value - c_bar_padding);
				}			} else {
				var check_width = parseInt(500) + parseInt(apps_tray_width) + parseInt(c_bar_padding * 2);
				if (window_width < check_width) {
					window_width = check_width;
				}
                $base.css("left", c_bar_padding + "px");
                $base.css("width", window_width - (c_bar_padding * 2));
			}
		}

		function updateRightLastClasses(additional_width) {	
			var ttlWidth = 0;
			visibleTab = [];
			var currUnreadCount = 0;
			var ttlLength = $chatboxes_wide.children().length;
			$chatboxes_wide.children().each(function(index) {
				var thisElem = a(this);
                var left = thisElem.offset().left;
                var id = thisElem.attr('data-id');
				var addNumber = 180 + $base.offset().left;
				a(".arrowchat_tabpopup", $user_popups[id]).css('left', left);
				if (thisElem.hasClass('arrowchat_tabclick')) {
                    left += 150;
					addNumber = 209 + $base.offset().left;
				}
					
					if (left < (addNumber + additional_width)) {
						closePopup($user_popups[id], $users[id]);
						var unseenUserCount = ttlLength-index;
						if(unseenUserCount > 0){
							currUnreadCount = ttlLength-index;
						}
						return false;
					}
                
                visibleTab.push(id);
                ttlWidth += (thisElem.hasClass('arrowchat_tabclick')) ? (260) : (148);
			});
			if (ttlWidth < 148) ttlWidth = 148;
			a('#arrowchat_chatboxes').css('width', ttlWidth + 'px');
			unseenUsers();
			if(!currUnreadCount){
				a('#arrowchat_chatbox_left').removeClass('arrowchat_unseen_list_open').hide();
				a('#arrowchat_unseen_users').hide();
			} else {
				if (!a("#arrowchat_popoutchatbutton").is(":visible") && w != 1)
					a('#arrowchat_chatbox_left').show();
			}
		}
		
		function swapTab(sourceId) {
			if (j != "") {
				closePopup($user_popups[j], $users[j]);
				a(".arrowchat_closebox_bottom", $users[j]).removeClass("arrowchat_closebox_bottom_click");
			}
			j = sourceId;
			var destinationId = visibleTab[visibleTab.length-1] || sourceId;
			var tempElem = $user_popups[sourceId].detach();
			$user_popups[destinationId].before(tempElem);
			var tempElem = $users[sourceId].detach();
			$users[destinationId].before(tempElem);
			tempElem.click();
			visibleTab.pop();
			visibleTab.push(sourceId);
			unseenUsers();
			if (a('#arrowchat_chatbox_left').hasClass('arrowchat_unseen_list_open'))
				a('#arrowchat_chatbox_left').click();
		}
		
		function unseenUsers() {
			var unseenUserHtml = '';
			var totalAmount = 0;
			$chatboxes_wide.children().each(function(index) {
				var id = a(this).attr('data-id');
				if(visibleTab.indexOf(id) == -1) {
				   var amount = parseInt(a(this).children('.arrowchat_tabalert').html());
				   var countVisible = '';
				   var unreadMsg = '';
					if (amount > 0) {
						countVisible = 'style="visibility: visible;" ';
						unreadMsg = 'arrowchat_unread_msg';
						totalAmount = totalAmount + amount;
					} else {
						amount = 0;
					}
				   unseenUserHtml += '<div id="arrowchat_unseenuser_' + id + '" class="arrowchat_unseen_user_list ' + unreadMsg + '" data-id="' + id + '"><div class="arrowchat_unread_count " ' + countVisible + '>' + amount + '</div><div class="arrowchat_unseen_username">' + uc_name[id] + '</div><div class="arrowchat_unseen_close" data-id="' + id + '" >x</div></div>';
				}
			});
			if (a("#arrowchat_chatbox_left .arrowchat_tabalertnf").length) {
				a("#arrowchat_chatbox_left .arrowchat_tabalertnf").remove();
			}
			if (totalAmount > 0 && !a("#arrowchat_chatbox_left").hasClass('arrowchat_unseen_list_open')) {
				a("<div/>").css("top", "-11px").css("left", "8px").addClass("arrowchat_tabalertnf").html(totalAmount).prependTo(a("#arrowchat_chatbox_left"));
			}
			if(unseenUserHtml == ''){
				a('#arrowchat_chatbox_left .arrowchat_unseen_list_open').click();
			} else {
				$unseen_users.children('.arrowchat_tabcontent').html(unseenUserHtml);
			}
			
			addHover(a(".arrowchat_unseen_user_list"), "arrowchat_unseen_user_list_hover");
			addHover(a(".arrowchat_unseen_close"), "arrowchat_unseen_close_hover");
			a('.arrowchat_unseen_close').click(function(e) {
				e.stopImmediatePropagation();
				var parentElem = a(this).parent();
				var uid = parentElem.attr('data-id');
				parentElem.remove();
				a('.arrowchat_closebox_bottom', $users[uid]).click();
				adjustBarSize();
			});
			a('.arrowchat_unseen_user_list').click(function() {
				var uid = a(this).attr('data-id');
				swapTab(uid);
			});
		}

		function set(b, c) {
			V[b] = c
		}

		function get(b) {
			return V[b] ? V[b] : ""
		}

		function getStatus(b) {
			return xa[b] ? xa[b] : ""
		}

		function receiveUserFromUserlist(b) {
			if (a(b).attr("id")) var c = a(b).attr("id").substr(19);
			else var c = "";
			if (c == "") c = a(b).parent().attr("id").substr(19);
			receiveUser(c, uc_name[c], uc_status[c], uc_avatar[c], uc_link[c]);
			lsClick("#arrowchat_userlist_" + c, 'ac_click');
		}

		function chatroomListClicked(b, length) {
			if ($chatroom_create_flyout.is(":visible")) {
				$chatroom_create_flyout.hide("slide", { direction: "up"}, 250);
			}
			c = "";
			 if (a(b).attr("id"))
				c = a(b).attr("id").substr(length);
			if (c == "") c = a(b).parent().attr("id").substr(length);
			if (crt[c] == 2) {
				a("#arrowchat_chatroom_password_id").val(c);
				if (a("#arrowchat_chatroom_" + c).hasClass("arrowchat_chatroom_clicked")) {
					a("#arrowchat_chatroom_password_flyout").hide("slide", { direction: "up"}, 250);
					a(".arrowchat_chatroom_list").removeClass("arrowchat_chatroom_clicked");
					a(".arrowchat_chatroom_full_content").removeClass("arrowchat_chatroom_opacity");
				} else {
					a(".arrowchat_chatroom_list").removeClass("arrowchat_chatroom_clicked");
					a("#arrowchat_chatroom_" + c).addClass("arrowchat_chatroom_clicked");
					if (!a("#arrowchat_chatroom_password_flyout").is(":visible")) {
						a("#arrowchat_chatroom_password_flyout").show("slide", { direction: "up"}, 250, function() {
							a("#arrowchat_chatroom_password_input").focus();
						});
						a(".arrowchat_chatroom_full_content").addClass("arrowchat_chatroom_opacity");
					} else {
						a("#arrowchat_chatroom_password_flyout").hide("slide", { direction: "up"}, 250);
						a("#arrowchat_chatroom_password_flyout").show("slide", { direction: "up"}, 250, function() {
							a("#arrowchat_chatroom_password_input").focus();
						});
						a(".arrowchat_chatroom_full_content").addClass("arrowchat_chatroom_opacity");
					}
				}
			} else {
				a(".arrowchat_chatroom_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
				a(".arrowchat_chatroom_full_content").removeClass("arrowchat_chatroom_opacity");
				if (a("#arrowchat_chatroom_password_flyout").is(":visible")) {
					a("#arrowchat_chatroom_password_flyout").hide("slide", { direction: "up"}, 250);
				}
				$chatroom_create.hide();
				Ccr = c;
				loadChatroom(c, crt[c])
			}
		}

		function addMessageToChatroom(b, c, d, multi_tab) {
			if (typeof(multi_tab) == "undefined") multi_tab = 0;
			var title = "",important = "", image_msg = "";
			if (chatroom_mod == 1) {
				title = lang[137];
				important = " arrowchat_chatroom_important";
			}
			if (chatroom_admin == 1) {
				title = lang[136];
				important = " arrowchat_chatroom_important";
			}
			if (multi_tab != 1)
				d = d.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>").replace(/\"/g, "&quot;");
			d = replaceURLWithHTMLLinks(d);
			d = smileyreplace(d);
			if (d.substr(0, 4) == "<div") {
				image_msg = " arrowchat_image_msg";
			}
			var tooltip = formatTimestamp(new Date(Math.floor((new Date).getTime() / 1E3) * 1E3), 1);
			if (a("#arrowchat_chatroom_message_" + b).length > 0) {
			} else {
				$chatroom_chat.append('<div class="arrowchat_chatroom_box_message arrowchat_clearfix arrowchat_self' + important + image_msg + '" id="arrowchat_chatroom_message_' + b + '"><img class="arrowchat_chatroom_message_avatar arrowchat_no_names" src="'+u_avatar+'" alt="' + c + title + ' ' + tooltip + '" /><div class="arrowchat_chatroom_message_name">' + c + title + ':</div><div class="arrowchat_chatroom_message_content" data-id="' + tooltip + '"><div class="arrowchat_chatroom_delete" data-id="' +  b + '"> </div><span class="arrowchat_chatroom_msg">' + d + "</span></div></div>");
				$chatroom_chat.scrollTop(5E4)
			}
			showChatroomTime();
			modDeleteControls();
		}

		function addMessageToChatbox(b, c, d, i, e, l, f, multi_tab) {
			if (typeof(multi_tab) == "undefined") multi_tab = 0;
			aa[b] != 1 && receiveUser(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b], 1, 1);
			if (uc_name[b] == null || uc_name[b] == "") setTimeout(function () {
				addMessageToChatbox(b, c, d, i, e, l, f, multi_tab)
			}, 500);
			else {
				lsClick(b, 'untyping');
				receiveNotTyping(b);
				var h = "",
					init = false;
				if (parseInt(d) == 1) {
					fromname = u_name;
					fromid = u_id;
					h = " arrowchat_self";
					avatar = u_avatar;
				} else {
					fromname = uc_name[b];
					fromid = b;
					avatar = uc_avatar[b];
				}
				tooltip = formatTimestamp(new Date(f * 1E3), 1);
				var full_name = fromid, image_msg = "";
				if (parseInt(l) == 1) c = c.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>").replace(/\"/g, "&quot;");
				c = replaceURLWithHTMLLinks(c);
				c = smileyreplace(c);
				separator = ":&nbsp;&nbsp;";
				if (c.substr(0, 4) == "<div") {
					image_msg = " arrowchat_image_msg";
				}
				if (a("#arrowchat_message_" + e).length > 0) {
					a("#arrowchat_message_" + e + " .arrowchat_chatboxmessagecontent").html(c);
				} else {
					if (c_show_full_name != "1")
					{
						if (fromname.indexOf(" ") != -1) fromname = fromname.slice(0, fromname.indexOf(" "));
					}

					a(".arrowchat_tabcontenttext", $user_popups[b]).append('<div class="arrowchat_chatboxmessage arrowchat_clearfix' + h + image_msg + '" id="arrowchat_message_' + e + '">' + formatTimestamp(new Date(f * 1E3)) + '<div class="arrowchat_chatboxmessagefrom"><div class="arrowchat_disable_avatars_name">' + fromname + '</div><img alt="' + fromname + ' ' + tooltip + '" class="arrowchat_chatbox_avatar" src="' + avatar + '" /></div><div class="arrowchat_chatboxmessage_wrapper"><div class="arrowchat_chatboxmessagecontent" data-id="' + tooltip + '">' + c + "</div></div></div>");
					
					if (a("#arrowchat_message_" + last_id[b]).length && d != 1) {
						a("#arrowchat_message_" + last_id[b]).children('.arrowchat_chatboxmessagefrom').children('.arrowchat_chatbox_avatar').addClass('arrowchat_single_avatar_hide');
					}
						
					last_sent[b] = f;
					last_name[b] = full_name;
					last_id[b] = e;

					if (c_disable_avatars == 1 || a("#arrowchat_setting_names_only :input").is(":checked")) {
						setAvatarVisibility(1);
					}
					a("#arrowchat_tabcontenttext_" + b).scrollTop(5E4);
					showTimeAndTooltip();
				}
				j != b && d != 1 && (i != 1 || multi_tab == 1) && notifyNewMessage(b, 1, 1);
				d != 1 && i != 1 && showDesktopNotification(b, c, e);
			}
		}

		function activateUser(b) {
			if (uc_name[b] == null || uc_name[b] == "") setTimeout(function () {
				activateUser(b)
			}, 500);
			else j != b && $users[b].click()
		}

		function addMessageToContent(b, c) {
			if (uc_name[b] == null || uc_name[b] == "") setTimeout(function () {
				addMessageToContent(b, c)
			}, 500);
			else {
				a("#arrowchat_tabcontenttext_" + b).append("<div>" + c + "</div>");
				a("#arrowchat_tabcontenttext_" + b).scrollTop(5E4);
				G[b] = 1
			}
		}

		function loadChatroomList() {
			if (chatroomreceived == 0) {
				a(".arrowchat_chatroom_content").addClass("arrowchat_chatroom_lobby");
				a(".arrowchat_chatrooms_title").addClass("arrowchat_chatroom_lobby_title");
				a("#arrowchat_chatroom_leave").hide();
				a(".arrowchat_chatroom_popout").hide();
				a.ajax({					
					url: c_ac_path + "includes/json/receive/receive_chatroom_list.php",
					cache: false,
					data: {
						chatroom_window: u_chatroom_open,
						chatroom_stay: u_chatroom_stay
					},
					type: "post",
					dataType: "json",
					success: function (b) {
						buildChatroomList(b);
					}
				});
			}
		}

		function buildChatroomList(b) {
			Ccr = 0;
			a("#arrowchat_chatroom_open_chats").hide();
			a("#arrowchat_chatroom_userlist_button").hide();
			a(".arrowchat_chatroom_full_content").html("");
			var c = {},
			code = "",
			featured_list = "",
			other_list = "";
			b && a.each(b, function (i, e) {
				if (i == "chatrooms") {
					a.each(e, function (l, f) {
						code = '<div id="arrowchat_chatroom_' + f.id + '" class="arrowchat_chatroom_list"><div class="arrowchat_chatroom_image"><img src="' + c_ac_path + "themes/" + u_theme + '/images/icons/' + f.img + '" alt="" /></div><div class="arrowchat_chatroom_name_wrapper"><div class="arrowchat_chatroom_name">' + f.n + '</div><div class="arrowchat_chatroom_desc">' + f.d + '</div></div><div class="arrowchat_chatroom_status_wrapper"><div class="arrowchat_chatroom_count">' + f.c + lang[35] + '</div><div class="arrowchat_chatroom_status arrowchat_chatroom_' + f.t + '"></div></div><div class="arrowchat_clearfix"></div></div>';
						if (f.o == 1) {
							other_list += code;
						} else {
							featured_list += code;
						}
						crt[f.id] = f.t;
						crt2[f.id] = f.n;
					})
				}
			});
			if (featured_list != "") {
				a('<div class="arrowchat_chatroom_list_title">' + lang[227] + '</div>').appendTo(a(".arrowchat_chatroom_full_content"));
				a(featured_list).appendTo(a(".arrowchat_chatroom_full_content"));
			}
			if (other_list != "") {
				a('<div class="arrowchat_chatroom_list_title">' + lang[228] + '</div>').appendTo(a(".arrowchat_chatroom_full_content"));
				a(other_list).appendTo(a(".arrowchat_chatroom_full_content"));
			}
			a(".arrowchat_chatroom_list").mouseover(function () {							
				a(this).addClass("arrowchat_chatroom_list_hover");
			}).mouseout(function () {
				a(this).removeClass("arrowchat_chatroom_list_hover");
			});
			chatroomreceived = 1;
			a(".arrowchat_chatroom_list").click(function (l) {
				chatroomListClicked(a(this), 19)
			});
		}

		function receiveChatroom(c) {
			var global_mod = 0,
				global_admin = 0,
				admin_markup = "";
			chatroom_mod = 0;
			chatroom_admin = 0;
			var tabs_string = "";
			for (var i in $chatroom_tab) {
				if (!a("#arrowchat_chatroom_tab_" + i).hasClass("arrowchat_chatroom_tab_focused") && i != c) {
					tabs_string += i + ",";
				}
			}
			tabs_string = tabs_string.slice(0, -1);
			a.ajax({
				url: c_ac_path + "includes/json/receive/receive_chatroom.php",
				cache: false,
				type: "post",
				data: {
					chatroomid: c,
					chatroomtabs: tabs_string
				},
				dataType: "json",
				success: function (b) {
					if (b) {
						var no_error = true;
						b && a.each(b, function (i, e) {
							if (i == "error") {
								a.each(e, function (l, f) {
									no_error = false;									
									Ccr = 0;
									clearTimeout(Crref2);
									if (typeof($chatroom_tab[c]) != "undefined") {
										a(".arrowchat_closebox_bottom", $chatroom_tab[c]).click();
									}
									if (!a.isEmptyObject($chatroom_tab)) {
										for (var i in $chatroom_tab) {
											$chatroom_tab[i].click();
											break;
										}
									} else {
										chatroomreceived = 0;
										loadChatroomList();
									}
									displayMessage("arrowchat_chatroom_message_flyout", f.m, "error");
								})
							}
						});
						if (no_error) {
							b && a.each(b, function (i, e) {
								if (i == "user_title") {
									a.each(e, function (l, f) {
										if (f.admin == 1) {
											global_admin = 1;
											chatroom_admin = 1;
										}
										if (f.mod == 1) {
											global_mod = 1;
											chatroom_mod = 1;
										}
									})
								}
								if (i == "chat_users") {
									var longname,adminCount=0,modCount=0,userCount=0;
									$chatroom_room_list.html('<div id="arrowchat_chatroom_line_admins" class="arrowchat_group_container"><span class="arrowchat_group_text">'+lang[148]+'</span><div class="arrowchat_group_line_container"><span class="arrowchat_group_line"></span></div></div><div id="arrowchat_chatroom_list_admins"></div><div id="arrowchat_chatroom_line_mods" class="arrowchat_group_container"><span class="arrowchat_group_text">'+lang[149]+'</span><div class="arrowchat_group_line_container"><span class="arrowchat_group_line"></span></div></div><div id="arrowchat_chatroom_list_mods"></div><div id="arrowchat_chatroom_line_users" class="arrowchat_group_container"><span class="arrowchat_group_text">'+lang[147]+'</span><div class="arrowchat_group_line_container"><span class="arrowchat_group_line"></span></div></div><div id="arrowchat_chatroom_list_users"></div>');
									a.each(e, function (l, f) {
										if ((global_admin == 1 || global_mod == 1) && (f.t == 1 || f.t == 4)) {
											admin_markup = '<hr class="arrowchat_options_divider" /><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_make_mod_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[52] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_silence_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[161] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_ban_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[53] + '</div></div>';
										}
										if (global_admin == 1 && f.t == 2) {
											admin_markup = '<hr class="arrowchat_options_divider" /><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_remove_mod_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[54] + '</div></div>';
										}
										appendVal = a("#arrowchat_chatroom_list_users");
										if (f.t == 2) {
											appendVal = a("#arrowchat_chatroom_list_mods");
											modCount++;
										} else if (f.t == 3) {
											appendVal = a("#arrowchat_chatroom_list_admins");
											adminCount++;
										} else
											userCount++;
										longname = renderHTMLString(f.n);
										f.n = renderHTMLString(f.n);
										a("<div/>").attr("id", "arrowchat_chatroom_user_" + f.id).mouseover(function () {
											a(this).addClass("arrowchat_chatroom_list_hover");
										}).mouseout(function () {
											a(this).removeClass("arrowchat_chatroom_list_hover");
										}).addClass("arrowchat_chatroom_room_list").addClass('arrowchat_chatroom_admin_' + f.t).html('<img class="arrowchat_chatroom_avatar" src="' + f.a + '"/><span class="arrowchat_chatroom_room_name">' + f.n + '</span><span class="arrowchat_userscontentdot arrowchat_' + f.status + '"></span>').appendTo(appendVal);
										var pm_opacity = "";
										if ((f.b == 1 && global_admin != 1) || f.id == u_id) pm_opacity = " arrowchat_no_private_msg";
										a("<div/>").attr("id", "arrowchat_chatroom_users_flyout_" + f.id).addClass("arrowchat_more_wrapper_chatroom").html('<div class="arrowchat_chatroom_users_flyout"><div class="arrowchat_chatroom_flyout_avatar"><img src="'+f.a+'" alt="" /></div><div class="arrowchat_chatroom_flyout_info"><div class="arrowchat_chatroom_title_padding"><div id="arrowchat_chatroom_title_' + f.id + '" class="arrowchat_chatroom_flyout_text"><a href="'+f.l+'">' + longname + '</a><br/>' + lang[43] + '</div></div><hr class="arrowchat_options_divider"/><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_private_message_' + f.id + '" class="arrowchat_chatroom_flyout_text'+pm_opacity+'">' + lang[41] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_block_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[84] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_report_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[167] + '</div></div>' + admin_markup + '</div><div class="arrowchat_clearfix"></div><i class="arrowchat_more_tip_chatroom"></i></div>').appendTo(a("#arrowchat_chatroom_user_" + f.id));
										if (f.t == 2) {
											a("#arrowchat_chatroom_title_" + f.id).html('<a href="'+f.l+'">' + longname + '</a><br/>' + lang[44])
										} else if (f.t == 3) {
											a("#arrowchat_chatroom_title_" + f.id).html('<a href="'+f.l+'">' + longname + '</a><br/>' + lang[45])
										} else if (f.t == 4) {
											a("#arrowchat_chatroom_title_" + f.id).html('<a href="'+f.l+'">' + longname + '</a><br/>' + lang[212])
										}
										addHover(a(".arrowchat_chatroom_options_padding"), "arrowchat_options_padding_hover");
										chatroomUserOptions(f, global_admin);
										uc_avatar[f.id] = f.a;
									});
									userCount == 0 && a("#arrowchat_chatroom_line_users").hide();
									adminCount == 0 && a("#arrowchat_chatroom_line_admins").hide();
									modCount == 0 && a("#arrowchat_chatroom_line_mods").hide();
									a(".arrowchat_chatroom_admin_3").css("background-color", "#"+c_admin_bg);
									a(".arrowchat_chatroom_admin_3").css("color", "#"+c_admin_txt);
									if (chatroom_popout != "") {
										a("#arrowchat_chatroom_user_" + chatroom_popout).click();
									}
								}
							});
							modDeleteControls();
							if (global_admin == 1 || global_mod == 1) {
								if (!a('.arrowchat_chatroom_admin_menu').length || !a('.arrowchat_flood_menu').length) addChatroomAdminControls();
							} else {
								if ($chatroom_admin_controls.length) $chatroom_admin_controls.remove();
							}
							if (c_disable_avatars == 1 || a("#arrowchat_setting_names_only :input").is(":checked")) {
								a(".arrowchat_chatroom_avatar").addClass("arrowchat_hide_avatars");
								a(".arrowchat_chatroom_message_avatar").addClass("arrowchat_hide_avatars");
								a(".arrowchat_chatroom_flyout_avatar").addClass("arrowchat_hide_avatars");
								a(".arrowchat_chatroom_message_name").show();
								a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_no_names");
							}
							if (a("#arrowchat_chatroom_show_names :input").is(":checked")) {
								a(".arrowchat_chatroom_message_name").show();
								a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_no_names");
							}
						}
					}
				}
			});
			clearTimeout(Crref2);
			Crref2 = setTimeout(function () {
				receiveChatroom(c)
			}, 6E4);
		}
		
		function chatroomUserOptions(data, is_admin) {
			a("#arrowchat_chatroom_make_mod_" + data.id).click(function () {
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					chatroom_mod: data.id,
					chatroom_id: Ccr
				}, function () {receiveChatroom(Ccr);});
				toggleChatroomUserInfo(data.id);
			});
			a("#arrowchat_chatroom_remove_mod_" + data.id).click(function () {
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					chatroom_remove_mod: data.id,
					chatroom_id: Ccr
				}, function () {receiveChatroom(Ccr);});
				toggleChatroomUserInfo(data.id);
			});
			a("#arrowchat_chatroom_block_user_" + data.id).click(function () {
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					block_chat: data.id
				}, function (json_data) {
					if (json_data != "-1") {
						if (typeof(blockList[data.id]) == "undefined") {
							blockList[data.id] = data.id;
						}
						loadBuddyList();
						displayMessage("arrowchat_chatroom_message_flyout", lang[103], "notice");
					}
				});
				toggleChatroomUserInfo(data.id);
			});
			if (c_enable_moderation != 1) a("#arrowchat_chatroom_report_user_" + data.id).hide();
			a("#arrowchat_chatroom_report_user_" + data.id).click(function () {
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					report_about: data.id,
					report_from: u_id,
					report_chatroom: Ccr
				}, function (json_data) {
					displayMessage("arrowchat_chatroom_message_flyout", lang[168], "notice");
				});
				toggleChatroomUserInfo(data.id);
			});
			a("#arrowchat_chatroom_ban_user_" + data.id).click(function () {
				var ban_length = prompt(lang[57]);
				if (ban_length != null && ban_length != "" && !(isNaN(ban_length))) {
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chatroom_ban: data.id,
						chatroom_id: Ccr,
						chatroom_ban_length: ban_length
					}, function () {receiveChatroom(Ccr);});
				}
				toggleChatroomUserInfo(data.id);
			});
			a("#arrowchat_chatroom_silence_user_" + data.id).click(function () {
				var silence_length = prompt(lang[162]);
				if (silence_length != null && silence_length != "" && !(isNaN(silence_length))) {
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chatroom_silence: data.id,
						chatroom_id: Ccr,
						chatroom_silence_length: silence_length
					}, function () {});
				}
				toggleChatroomUserInfo(data.id);
			});
			a("#arrowchat_chatroom_private_message_" + data.id).click(function () {
				if (data.b != 1 || is_admin == 1) {
					if (u_id != data.id) {
						jqac.arrowchat.chatWith(data.id)
					}
				} else {
					displayMessage("arrowchat_chatroom_message_flyout", lang[46], "error");
				}
				toggleChatroomUserInfo(data.id);
			});
			a("#arrowchat_chatroom_user_" + data.id).click(function () {
				if (crou != data.id) {
					a("#arrowchat_chatroom_user_" + crou).removeClass("arrowchat_chatroom_clicked");
					a("#arrowchat_chatroom_users_flyout_" + crou).removeClass("arrowchat_chatroom_create_flyout_display");
				}
				crou = data.id;
				toggleChatroomUserInfo(data.id);
				a("#arrowchat_chatroom_users_flyout_" + data.id).css("top", a("#arrowchat_chatroom_user_" + crou).position().top - a("#arrowchat_chatroom_users_flyout_" + data.id).height() + a("#arrowchat_chatroom_user_" + crou).height() + 12 + "px");
			}).children("#arrowchat_chatroom_users_flyout_" + data.id).click(function (e) {
				if (a(e.target).is('a')) {
					window.location = data.l;
				} else
					return false;
			});
		}
		function toggleChatroomUserInfo(id) {
			a("#arrowchat_chatroom_user_" + id).toggleClass("arrowchat_chatroom_clicked");
			a("#arrowchat_chatroom_users_flyout_" + id).toggleClass("arrowchat_chatroom_create_flyout_display");
			if (a("#arrowchat_chatroom_users_flyout_" + id).hasClass("arrowchat_chatroom_create_flyout_display")) {
				chatroom_popout = id;
			} else {
				chatroom_popout = "";
			}
		}

		function loadBuddyList() {
			clearTimeout(Z);
			a.ajax({
				url: c_ac_path + "includes/json/receive/receive_buddylist.php",
				cache: false,
				type: "get",
				dataType: "json",
				success: function (b) {
					buildBuddyList(b);
					if (c_disable_avatars == 1) {
						a(".arrowchat_userlist_avatar").addClass("arrowchat_hide_avatars")
					}
					adjustBuddyListSize();
					adjustBarSize();
				}
			});
			if (typeof c_list_heart_beat != "undefined") {
				var BLHT = c_list_heart_beat * 1000;
			} else {
				var BLHT = 60000;
			}
			Z = setTimeout(function () {
				loadBuddyList()			
			}, BLHT)
		}

		function buildBuddyList(b) {
			V.timestamp = ma;
			var c = {},
				d = "";
			c.available = "";
			c.busy = "";
			c.offline = "";
			c.invisible = "";
			c.away = "";
			onlineNumber = buddylistreceived = 0;
			b && a.each(b, function (i, e) {
				if (i == "buddylist") {
					buddylistreceived = 1;
					totalFriendsNumber = onlineNumber = 0;
					a.each(e, function (l, f) {
						longname = renderHTMLString(f.n);
						if (G[f.id] != null) {
							a(".arrowchat_closebox_bottom_status", $users[f.id]).removeClass("arrowchat_available").removeClass("arrowchat_busy").removeClass("arrowchat_offline").removeClass("arrowchat_away").addClass("arrowchat_" + f.s);
							$users[f.id].removeClass("arrowchat_tab_offline").removeClass("arrowchat_away").addClass("arrowchat_tab_" + f.s);
							$user_popups[f.id].length > 0 && a(".arrowchat_tabsubtitle .arrowchat_message", $user_popups[f.id]).html(f.m);
							if (f.s == "offline" || f.s == "busy")
								a(".arrowchat_tabtitle .arrowchat_video_icon", $user_popups[f.id]).addClass("arrowchat_video_unavailable");
							else
								a(".arrowchat_tabtitle .arrowchat_video_icon", $user_popups[f.id]).removeClass("arrowchat_video_unavailable");
						}
						if (f.s == "available" || f.s == "away" || f.s == "busy") onlineNumber++;
						totalFriendsNumber++;
						if (a("#arrowchat_setting_names_only :input").is(":checked")) d = "arrowchat_hide_avatars";
						c[f.s] += '<div id="arrowchat_userlist_' + f.id + '" class="arrowchat_userlist arrowchat_buddylist_admin_' + f.admin + '" onmouseover="jqac(this).addClass(\'arrowchat_userlist_hover\');" onmouseout="jqac(this).removeClass(\'arrowchat_userlist_hover\');"><img class="arrowchat_userlist_avatar ' + d + '" src="' + f.a + '" /><span class="arrowchat_userscontentname">' + longname + '</span><span class="arrowchat_userscontentdot arrowchat_' + f.s + '"></span></div>';
						uc_status[f.id] = f.s;
						uc_name[f.id] = f.n;
						uc_avatar[f.id] = f.a;
						uc_link[f.id] = f.l
					})
				}
				if (buddylistreceived == 1 && bli == 0) {
					for (buddystatus in c) {
						if (c.hasOwnProperty(buddystatus)) {
							if (c[buddystatus] == "") {
								a("#arrowchat_userslist_" + buddystatus).html("")
							} else {
								a("#arrowchat_userslist_" + buddystatus).html("<div>" + c[buddystatus] + "</div>");
							}
						}
					}
					a(".arrowchat_userlist").click(function (l) {
						if (!a(this).hasClass('arrowchat_jabber_user'))
							receiveUserFromUserlist(l.target)
					});
					a("#arrowchat_userstab_text").html("<b>" + lang[4] + "</b> (<b>" + (onlineNumber) + "</b>)");
					R = onlineNumber;
					totalFriendsNumber == 0 && a("#arrowchat_userslist_available").html('<div class="arrowchat_nofriends">' + lang[8] + "</div>");
					R == 0 && a("#arrowchat_userslist_available").html('<div class="arrowchat_nofriends">' + lang[8] + "</div>");
					R >= c_search_min ? a("#arrowchat_search_friends").show() : a("#arrowchat_search_friends").hide();
					buddylistreceived = 0
				} else {
					a("#arrowchat_userstab_text").html("<b>" + lang[4] + "</b> (<b>" + (onlineNumber) + "</b>)");
				}
				a(".arrowchat_buddylist_admin_1").css("background-color", "#"+c_admin_bg);
				a(".arrowchat_buddylist_admin_1").css("color", "#"+c_admin_txt);
			})
		}

		function cancelJSONP() {
			if (typeof CHA != "undefined") {
				clearTimeout(CHA);
			}
			if (typeof xOptions != "undefined") {
				xOptions.abort();
			}
		};

		function receiveCore() {
			cancelJSONP();
			var chatroom_string = "";
			if (!a.isEmptyObject(chatroom_list)) {
				for (var i in chatroom_list) {
					chatroom_string = chatroom_string + "&room[]=" + chatroom_list[i];
				}
			}
			var url = c_ac_path + "includes/json/receive/receive_core.php?hash=" + u_hash_id + "&init=" + acsi + chatroom_string;
			xOptions = a.ajax({
				url: url,
				dataType: "jsonp",
				success: function (b) {
					V.timestamp = ma;
					var c = "",
						d = {};
					d.available = "";
					d.busy = "";
					d.offline = "";
					d.away = "";
					onlineNumber = buddylistreceived = 0;
					if (b && b != null) {
						var i = 0;
						a.each(b, function (e, l) {
							if (e == "typing") {
								a.each(l, function (f, h) {
									if (h.is_typing == "1") {
										lsClick(h.typing_id, 'typing');
										receiveTyping(h.typing_id);
									} else {
										lsClick(h.typing_id, 'untyping');
										receiveNotTyping(h.typing_id);
									}
								});
							}
							if (e == "announcements") {
								a.each(l, function (f, h) {
									receiveAnnouncement(h);
								});
							}
							if (e == "warnings") {
								a.each(l, function (f, h) {
									receiveWarning(h);
								});
							}
							if (e == "chatroom") {
								var alert_count = [],
									room_data = [],
									play_chatroom_sound = 0;
								a.each(l, function (f, h) {
									if (h.action == 1) {
										a("#arrowchat_chatroom_message_" + h.m + " .arrowchat_chatroom_msg").html(lang[159] + h.n);
									} else {
										if (typeof(blockList[h.userid]) == "undefined") {
											if (h.chatroomid == Ccr) addChatroomMessage(h.id, h.n, h.m, h.userid, h.t, h.global, h.mod, h.admin, h.chatroomid);
											var data_array = [h.id, h.n, h.m, h.userid, h.t, h.global, h.mod, h.admin, h.chatroomid];
											lsClick(JSON.stringify(data_array), 'chatroom_message');
										}
										if (!a(".arrowchat_chatroom_message_input").is(":focus") && h.userid != u_id)
											play_chatroom_sound = 1;
											
										room_data[h.chatroomid] = h;
										if (typeof(alert_count[h.chatroomid]) != "undefined")
											alert_count[h.chatroomid] = alert_count[h.chatroomid] + 1;
										else
											alert_count[h.chatroomid] = 1;
									}
								});
								if (room_data.length > 0) {
									showChatroomTime();
									for (var key in room_data) {
										if (typeof(blockList[room_data[key].userid]) == "undefined") {
											chatroomAlerts(alert_count[key], room_data[key].chatroomid);
											var data_array = [alert_count[key], room_data[key].chatroomid];
											lsClick(JSON.stringify(data_array), 'chatroom_alerts');
										}
									}
									u_chatroom_sound == 1 && play_chatroom_sound ==1 && playNewMessageSound();
								}
							}
							if (e == "notifications") {
								var markup2 = "";
								a.each(l, function (f, h) {
									addNotification(h.alert_id, h.markup);
									markup2 = h.markup;
								});
								notificationAlerts(markup2);
							}
							if (e == "messages") {
								var play_sound = 0;
								a.each(l, function (f, h) {
									receiveMessage(h.id, h.from, h.message, h.sent, h.self, h.old);
									if (!a(".arrowchat_textarea", $user_popups[h.from]).is(":focus")) {
										play_sound = 1;
									}
								});
								K = 1;
								D = E;
								j != "" && i > 0 && addMessageToContent(j, c);
								showTimeAndTooltip();
								d != 1 && u_sounds == 1 && play_sound == 1 && acsi != 1 && playNewMessageSound();
							}
						});
					}
					set("initialize", "0");
					set("currenttime", "0");
					if ($ != 1 && w != 1) {
						K++;
						if (K > 4) {
							D *= 2;
							K = 1
						}
						if (D > 12E3) D = 12E3
					}
					acsi++;
				}
			});
			if (isAway == 1) {
				var CHT = c_heart_beat * 1000 * 3;
			} else {
				var CHT = c_heart_beat * 1000;
			}
			if (c_push_engine != 1) {
				CHA = setTimeout(function () {
					receiveCore()
				}, CHT);
			}
		}

		function addChatroomMessage(id, name, message, userid, sent, global, mod, admin, chatroomid) {
			if (userid == u_id) {
				uc_avatar[u_id] = u_avatar;
			}
			message = stripslashes(message);
			message = replaceURLWithHTMLLinks(message);
			var sent_time = new Date(sent * 1E3);
			if (typeof(uc_avatar[userid]) == "undefined") {
				a.ajax({
					url: c_ac_path + "includes/json/receive/receive_user.php",
					data: {
						userid: userid
					},
					type: "post",
					cache: false,
					dataType: "json",
					success: function (data) {
						if (data) {
							uc_avatar[userid] = data.a;
							chatroomDiv(id, uc_avatar[userid], name, sent_time, message, global, mod, admin, userid, chatroomid);
						}
					}
				});
			} else {
				chatroomDiv(id, uc_avatar[userid], name, sent_time, message, global, mod, admin, userid, chatroomid);
			}
			count++;	
		}
		
		function chatroomDiv(id, image, name, time, message, global, mod, admin, userid, chatroomid) {
			var container = $chatroom_chat[0].scrollHeight - $chatroom_chat.scrollTop() - 10;
			var container2 = $chatroom_chat.outerHeight();
			var title = "", l = "", important = "", image_msg = "";
			if (userid == u_id) {
				l = "arrowchat_self";
			}
			if (mod == 1) {
				title = lang[137];
				important = "arrowchat_chatroom_important";
			}
			if (admin == 1) {
				title = lang[136];
				important = "arrowchat_chatroom_important";
			}
			if (message.substr(0, 4) == "<div") {
				image_msg = " arrowchat_image_msg";
			}
			var regex = new RegExp('^(^|\\s)(@' + u_name + ')(\\s|$)', 'i');
			message = message.replace(regex, '$1<span class="arrowchat_at_user">$2</span>$3');
			if (a("#arrowchat_chatroom_message_" + id).length > 0) {
				a("#arrowchat_chatroom_message_" + id + " .arrowchat_chatroom_msg").html(message);
				if (userid == u_id) {
					a("#arrowchat_chatroom_message_" + id).addClass(l);
				}
			} else {
				var tooltip = formatTimestamp(time, 1);
				if (global == 1) {
					a("<div/>").attr("id", "arrowchat_chatroom_message_" + id).addClass("arrowchat_chatroom_box_message").addClass("arrowchat_clearfix").html('<div class="arrowchat_chatroom_message_content arrowchat_global_chatroom_message">' + formatTimestamp(time) + message + "</div>").appendTo($chatroom_chat);
					receiveChatroom(Ccr);
				} else {
					a("<div/>").attr("id", "arrowchat_chatroom_message_" + id).addClass(important).addClass(image_msg).addClass(l).addClass("arrowchat_chatroom_box_message").addClass("arrowchat_clearfix").html('<img class="arrowchat_chatroom_message_avatar arrowchat_no_names" src="'+image+'" alt="' + name + title + ' ' + tooltip + '" /><div class="arrowchat_chatroom_message_name">' + name + title + ':</div><div class="arrowchat_chatroom_message_content" data-id="' + tooltip + '"><div class="arrowchat_chatroom_delete" data-id="' +  id + '"> </div><span class="arrowchat_chatroom_msg">' + message + "</span></div>").appendTo($chatroom_chat);
				}
				if (c_disable_avatars == 1 || a("#arrowchat_setting_names_only :input").is(":checked")) {
					a(".arrowchat_chatroom_avatar").addClass("arrowchat_hide_avatars");
					a(".arrowchat_chatroom_message_avatar").addClass("arrowchat_hide_avatars");
					a(".arrowchat_chatroom_flyout_avatar").addClass("arrowchat_hide_avatars");
					a(".arrowchat_chatroom_message_name").show();
					a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_no_names");
				}
				if (a("#arrowchat_chatroom_show_names :input").is(":checked")) {
					a(".arrowchat_chatroom_message_name").show();
					a(".arrowchat_chatroom_message_avatar").removeClass("arrowchat_no_names");
				}
				if (container <= container2) {
					$chatroom_chat.scrollTop(5E4);
					a(".arrowchat_image_msg img,.arrowchat_emoji_text img").one("load", function() {
						setTimeout(function () {
							$chatroom_chat.scrollTop(5E4);
						}, 500);
					}).each(function() {
					  if(this.complete) a(this).load();
					});
				} else {
					displayMessage("arrowchat_chatroom_message_flyout", lang[134], "notice");
				}
				showChatroomTime();
				modDeleteControls();
			}
		}
		
		function chatroomAlerts(count, chatroomid) {
			if (a("#arrowchat_chatrooms_button .arrowchat_tabalert").length > 0 && count > 0) {
				var count2 = parseInt(a("#arrowchat_chatrooms_button .arrowchat_tabalert").html()) + count;
				a("#arrowchat_chatrooms_button .arrowchat_tabalert").html(count2);
			} else {
				if (!($chatrooms_button.hasClass("arrowchat_tabclick"))) {
					$chatrooms_button.addClass("arrowchat_tab_new_message");
					a("<div/>").css("top", "-11px").css("left", (c_width_chatroom - 10) + "px").addClass("arrowchat_tabalert").html(count).appendTo($chatrooms_button);
				}
				
				if (chatroomid != Ccr && typeof($chatroom_tab[chatroomid]) != "undefined") {
					if (a(".arrowchat_popout_alert", $chatroom_tab[chatroomid]).length > 0) {
						var count3 = parseInt(a(".arrowchat_popout_alert", $chatroom_tab[chatroomid]).html()) + count;
						a(".arrowchat_popout_alert", $chatroom_tab[chatroomid]).html(count3);
					} else {
						a("<div/>").addClass("arrowchat_popout_alert").html(count).prependTo(a(".arrowchat_chatroom_tab_wrap", $chatroom_tab[chatroomid]));
					}
				}
			}
		}
		
		function receiveAnnouncement(h) {
			if (h.read == 0 && h.data != "") {
				a("#arrowchat_announcement").remove();
				$body.append(ArrowChat.Templates.announcements_display(h));
				if (a("#arrowchat_warnings").length) {
					var nb = parseInt(a(window).height() - a("#arrowchat_warnings").position().top);
					a("#arrowchat_announcement").css("bottom", nb + 5 + "px");
				}
				a("#arrowchat_announcement .arrowchat_announce_close").click(function () {
					a("#arrowchat_announcement").remove();
					if (a("#arrowchat_warnings").length)
						a("#arrowchat_warnings").css("bottom", "35px");
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						announce: 1
					}, function () {});
				});
			} else {
				a("#arrowchat_announcement").remove();
			}
		}
		
		function addNotification(alert_id, markup) {
			a("<div/>").attr("id", "arrowchat_alert_" + alert_id).attr("class", "arrowchat_notification_message_div").html(markup).appendTo(a("#arrowchat_notifications_content"));
			Q++;
		}
		
		function notificationAlerts(markup) {
			a("#arrowchat_optionsbutton .arrowchat_tabalertnf").remove();
			if (!($optionsbutton.hasClass("arrowchat_tabclick"))) {
				if (a("#arrowchat_notification_alert").length > 0) {
					a("#arrowchat_notification_alert").remove();
				}
				$body.append('<div id="arrowchat_notification_alert"><div class="arrowchat_notification_alert_content">' + markup + '</div><div class="arrowchat_notification_tip_pos"></div></div>');
				a("#arrowchat_notification_alert").css("right", "auto").css("left", a("#arrowchat_optionsbutton").offset().left - a("#arrowchat_notification_alert").outerWidth() + (a("#arrowchat_optionsbutton").outerWidth()/2) + 18);
				a("#arrowchat_notification_alert .arrowchat_notifications_divider").hide();
				setTimeout(function () {
					a("#arrowchat_notification_alert").fadeOut("slow", function () {
						a("#arrowchat_notification_alert").remove();										
					});
				}, 7000);
				$optionsbutton.addClass("arrowchat_tab_new_message");
				a("<div/>").css("top", "-10px").css("left", "8px").addClass("arrowchat_tabalertnf").html(Q).prependTo($optionsbutton);
			}
			if (Q > 0) {
				a("#arrowchat_no_new_notifications").css("display", "none");
			}
		}
		
		function stripslashes(str) {
			str=str.replace(/\\'/g,'\'');
			str=str.replace(/\\"/g,'"');
			str=str.replace(/\\0/g,'\0');
			str=str.replace(/\\\\/g,'\\');
			return str;
		}
		
		function receiveMessage(id, from, message, sent, self, old, multi_tab) {
			var data_array = [id, from, message, sent, self, old];
			acsi != 1 && lsClick(JSON.stringify(data_array), 'private_message');
			ma = id;
			clearTimeout(dtit3);
			document.title = dtit;
			if (j == from && uc_name[from] != "" && uc_name[from] != null) {
				lsClick(from, 'untyping');
				receiveNotTyping(from);
				var container = a("#arrowchat_tabcontenttext_" + from)[0].scrollHeight - a("#arrowchat_tabcontenttext_" + from).scrollTop() - 10;
				var container2 = a("#arrowchat_tabcontenttext_" + from).outerHeight();
				var o = uc_name[from];
				if (uc_status[from] == "offline") {
					loadBuddyList();
				}
				f = "";
				if (self == 1) {
					fromname = u_name;
					fromid = u_id;
					f = " arrowchat_self";
					avatar = u_avatar;
				} else {
					DTitChange(uc_name[from]);
					fromname = o;
					fromid = from;
					avatar = uc_avatar[from];
				}
				tooltip = formatTimestamp(new Date(sent * 1E3), 1);
				var image_msg = "";
				message = stripslashes(message);
				message = replaceURLWithHTMLLinks(message);
				if (multi_tab == 1)
					message = smileyreplace(message);
				if (message.substr(0, 4) == "<div") {
					image_msg = " arrowchat_image_msg";
				}
				if (a("#arrowchat_message_" + id).length > 0) {
					a("#arrowchat_message_" + id + " .arrowchat_chatboxmessagecontent").html(message);
				} else {
					if (c_show_full_name != 1) {
						if (fromname.indexOf(" ") != -1) fromname = fromname.slice(0, fromname.indexOf(" "));
					}

					a(".arrowchat_tabcontenttext", $user_popups[from]).append('<div class="arrowchat_chatboxmessage arrowchat_clearfix' + f + image_msg + '" id="arrowchat_message_' + id + '">' + formatTimestamp(new Date(sent * 1E3)) + '<div class="arrowchat_chatboxmessagefrom"><div class="arrowchat_disable_avatars_name">' + fromname + '</div><img alt="' + fromname + ' ' + tooltip + '" class="arrowchat_chatbox_avatar" src="' + avatar + '" /></div><div class="arrowchat_chatboxmessage_wrapper"><div class="arrowchat_chatboxmessagecontent" data-id="' + tooltip + '">' + message + "</div></div></div>");
					if (a("#arrowchat_message_" + last_id[from]).length && self != 1) {
						a("#arrowchat_message_" + last_id[from]).children('.arrowchat_chatboxmessagefrom').children('.arrowchat_chatbox_avatar').addClass('arrowchat_single_avatar_hide');
					}
					last_sent[from] = sent;
					last_name[from] = fromid;
					last_id[from] = id;

					if (c_disable_avatars == 1 || a("#arrowchat_setting_names_only :input").is(":checked")) {
						setAvatarVisibility(1);
					}
				}
				if (container <= container2 || !$users[from].hasClass("arrowchat_tabclick")) {
					a("#arrowchat_tabcontenttext_" + from).scrollTop(5E4);
					a(".arrowchat_image_msg img,.arrowchat_emoji_text img").one("load", function() {
						setTimeout(function () {
							a("#arrowchat_tabcontenttext_" + from).scrollTop(5E4);
						}, 500);
					}).each(function() {
					  if(this.complete) a(this).load();
					});
				} else {
					displayMessage("arrowchat_chatbox_message_flyout_" + from, lang[134], "notice");
				}
				self != 1 && old != 1 && showDesktopNotification(from, message, id);
			} else {
				message = stripslashes(message);
				addMessageToChatbox(from, message, self, old, id, 0, sent, multi_tab);
				j == "" && 0 && activateUser(from)
			}
		}
		
		function receiveTyping(id) {
			if (a("#arrowchat_tabcontenttext_" + id).length) {
				var container = a("#arrowchat_tabcontenttext_" + id)[0].scrollHeight - a("#arrowchat_tabcontenttext_" + id).scrollTop() - 10;
				var container2 = a("#arrowchat_tabcontenttext_" + id).outerHeight();
				a(".arrowchat_closebox_bottom_status", $users[id]).addClass("arrowchat_typing");
				a(".arrowchat_is_typing", $users[id]).show();
				a(".arrowchat_tabcontenttext", $user_popups[id]).append('<div class="arrowchat_chatboxmessage arrowchat_clearfix" id="arrowchat_typing_message_' + id + '"><div class="arrowchat_chatboxmessagefrom"><img alt="" class="arrowchat_chatbox_avatar" src="' + uc_avatar[id] + '" /></div><div class="arrowchat_chatboxmessage_wrapper"><div class="arrowchat_chatboxmessagecontent" data-id="Typing"><div class="arrowchat_is_typing arrowchat_is_typing_chat"><div class="arrowchat_typing_bubble"></div><div class="arrowchat_typing_bubble"></div><div class="arrowchat_typing_bubble"></div></div></div></div></div>');
				if (container <= container2 || !$users[id].hasClass("arrowchat_tabclick")) {
					a("#arrowchat_tabcontenttext_" + id).scrollTop(5E4);
				}
				clearTimeout(typingTimeout);
				typingTimeout = setTimeout(function () {
					lsClick(id, 'untyping');
					receiveNotTyping(id)
				}, 30000);
			}
		}
		
		function receiveNotTyping(id) {
			if (a("#arrowchat_tabcontenttext_" + id).length) {
				clearTimeout(typingTimeout);
				if (a("#arrowchat_typing_message_" + id, $user_popups[id]).length) {
					a("#arrowchat_typing_message_" + id, $user_popups[id]).remove();
				}
				a(".arrowchat_closebox_bottom_status", $users[id]).removeClass("arrowchat_typing");
				a(".arrowchat_is_typing", $users[id]).hide();
			}
		}
		
		function pushCancelAll() {
			if (c_push_engine == 1) {
				push_uid.unsubscribe();
				push_arrowchat.unsubscribe();
				if (Ccr > 0) {
					push_room[Ccr].unsubscribe()
				}
			}
		}
		
		function pushSubscribe() {
			if (c_push_engine == 1) {
				push_uid = push.subscribe("u"+u_id);
				push_arrowchat = push.subscribe("arrowchat");
		
				push_arrowchat.on('data', function (data) {
					pushReceive(data);
				});
				push_uid.on('data', function (data) {
					pushReceive(data);
				});
			}
		}
		
		function pushReceive(data) {
			if ("announcement" in data) {
				receiveAnnouncement(data.announcement);
			}
			if ("warning" in data) {
				receiveWarning(data.warning);
			}
			if ("notification" in data) {
				var markup2;
				addNotification(data.notification.alert_id, data.notification.markup);
				notificationAlerts(markup2);
			}
			if ("chatroommessage" in data) {
				if (typeof(blockList[data.chatroommessage.userid]) == "undefined")
				{
					if (data.chatroommessage.chatroomid == Ccr) addChatroomMessage(data.chatroommessage.id, data.chatroommessage.name, data.chatroommessage.message, data.chatroommessage.userid, data.chatroommessage.sent, data.chatroommessage.global, data.chatroommessage.mod, data.chatroommessage.admin, data.chatroommessage.chatroomid);
					var data_array = [data.chatroommessage.id, data.chatroommessage.name, data.chatroommessage.message, data.chatroommessage.userid, data.chatroommessage.sent, data.chatroommessage.global, data.chatroommessage.mod, data.chatroommessage.admin, data.chatroommessage.chatroomid];
					lsClick(JSON.stringify(data_array), 'chatroom_message');
					if (data.chatroommessage.name != 'Delete' && data.chatroommessage.global != 1) {
						chatroomAlerts(1, data.chatroommessage.chatroomid);
						var data_array = [1, data.chatroommessage.chatroomid];
						lsClick(JSON.stringify(data_array), 'chatroom_alerts');
						if (data.chatroommessage.userid != u_id) {
							u_chatroom_sound == 1 && !a(".arrowchat_chatroom_message_input").is(":focus") && playNewMessageSound();
						}
					}
				}
			}
			if ("typing" in data) {
				lsClick(data.typing.id, 'typing');
				receiveTyping(data.typing.id);
			}
			if ("nottyping" in data) {
				lsClick(data.nottyping.id, 'untyping');
				receiveNotTyping(data.nottyping.id);
			}
			if ("messages" in data) {
				receiveMessage(data.messages.id, data.messages.from, data.messages.message, data.messages.sent, data.messages.self, data.messages.old);
				data.messages.self != 1 && u_sounds == 1 && !a(".arrowchat_textarea", $user_popups[data.messages.from]).is(":focus") && playNewMessageSound();
				showTimeAndTooltip();
				K = 1;
				D = E;
			}
			if ("chatroomban" in data) {									
				a(".arrowchat_closebox_bottom", $chatroom_tab[data.chatroomban.id]).click();
				displayMessage("arrowchat_chatroom_message_flyout", data.chatroomban.error2, "error");
			}
		}

		function DTitChange(name) {
			name = renderHTMLString(name);
			if (dtit2 != 2) {
				document.title = lang[30] + " " + name + "!";
				dtit2 = 2
			} else {
				document.title = dtit;
				dtit2 = 1
			}
			if (window_focus == false) {
				dtit3 = setTimeout(function () {
					DTitChange(name)
				}, 1000)
			} else {
				document.title = dtit;
				clearTimeout(dtit3);
				setTimeout(function(){lsClick("body", 'window_focus')},500);
			}
		}
		
		function changePushChannel(id, connect) {
			if (connect == 1) {
				if (c_push_engine == 1) {
					push_room[id] = push.subscribe("chatroom" + id);
					push_room[id].on('data', function (data) {
						pushReceive(data);
					});
				}
				chatroom_list[id] = id;
			} else {
				if (c_push_engine == 1) {
					push_room[id].unsubscribe();
				}
				if (typeof(chatroom_list[id]) != "undefined") {
					delete chatroom_list[id];
				}
			}
		}
		
		function buildTrayButtons() {
			for (var b = "", c = "", arcb = "", d = 0; d < barLinks.length; d++) {
				var i = barLinks[d];
				if (i[6] == "" || i[6] == 0) i[6] = 16;
				if (d == barLinks.length - 1) arcb = " arrowchat_right_border";
				b += '<div id="arrowchat_trayicon_' + d + '" class="arrowchat_tray_button arrowchat_bar_left' + arcb + '" style="width:' + i[6] + 'px;"><div class="arrowchat_inner_button"><img class="arrowchat_tray_icon" src=' + c_ac_path + "themes/" + u_theme + "/images/icons/" + i[0] + '><div class="arrowchat_tray_name">' + i[7] + "</div></div></div>";
				if (i[3] == "_popup") c += '<div id="arrowchat_trayicon_' + d + '_popup" class="arrowchat_traypopup" style="display:none"><div class="arrowchat_traytitle"><div class="arrowchat_name">' + i[1] + '</div><div class="arrowchat_minimizebox"></div><br clear="all"/></div><div class="arrowchat_traycontent"><div class="arrowchat_traycontenttext"><iframe allowtransparency="true" frameborder=0 width="' + i[4] + '" height="' + i[5] + '" id="arrowchat_trayicon_' + d + '_iframe"  ></iframe></div></div></div>'
			}
			$base.append("<div>" + b + "</div>");
			$body.append("<div>" + c + "</div>");
			a(".arrowchat_tray_button").mouseover(function () {
				var e = a(this).attr("id").substr(19);
				if (barLinks[e][6] <= 16 || barLinks[e][6] == "") showTooltip(a("#arrowchat_trayicon_" + e), barLinks[e][1], 1);
				a(this).addClass("arrowchat_tabmouseover")
			});
			a(".arrowchat_tray_button").mouseout(function () {
				a(this).removeClass("arrowchat_tabmouseover");
				hideTooltip();
			});
			a(".arrowchat_traytitle").mouseenter(function () {
				var e = a(this).parent().attr("id");
				e = e.substring(19, e.length - 6);
				a(this).addClass("arrowchat_chatboxtabtitlemouseover")
			});
			a(".arrowchat_traytitle").mouseleave(function () {
				var e = a(this).parent().attr("id");
				e = e.substring(19, e.length - 6);
				a(this).removeClass("arrowchat_chatboxtabtitlemouseover")
			});
			a(".arrowchat_traytitle").click(function () {
				var e = a(this).parent().attr("id");
				e = e.substring(19, e.length - 6);
				a("#arrowchat_trayicon_" + e).click()
			});
			a(".arrowchat_tray_button").click(function () {
				var e = a(this).attr("id").substr(19);
				if (j != "") {
					closePopup($user_popups[j], $users[j]);
					a(".arrowchat_closebox_bottom", $users[j]).removeClass("arrowchat_closebox_bottom_click");
					j = ""
				}
				closePopup($userstab_popup, $buddy_list_tab);
				closePopup($optionsbutton_popup, $optionsbutton);
				closePopup($modbutton_popup, $modbutton);
				var l = "_self";
				if (barLinks[e][3]) l = barLinks[e][3];
				if (l == "_popup") {
					if (m != e) {
						closePopup(a("#arrowchat_trayicon_" + m + "_popup"), a("#arrowchat_trayicon_" + m));
						m = "";
					}
					if (m == "") {
						a("#arrowchat_trayicon_" + e + "_popup").css("left", a("#arrowchat_trayicon_" + e).offset().left).css("bottom", "25px").css("width", barLinks[e][4]);
						a("#arrowchat_trayicon_" + e + "_popup").addClass("arrowchat_tabopen");
						a("#arrowchat_trayicon_" + e).addClass("arrowchat_trayclick");
						if (a("#arrowchat_trayicon_" + e + "_iframe").attr("src") === undefined || a("#arrowchat_trayicon_" + e + "_iframe").attr("src") == "") a("#arrowchat_trayicon_" + e + "_iframe").attr("src", barLinks[e][2]);
						m = e
					} else {
						closePopup(a("#arrowchat_trayicon_" + m + "_popup"), a("#arrowchat_trayicon_" + m));
						m = "";
					}
				} else {
					var bar_link_url = barLinks[e][2].replace("{USER_ID}", u_id);
					bar_link_url = bar_link_url.replace("{USER_NAME}", u_name);
					window.open(bar_link_url, l);
				}
			});
		}
		
		function buildChatboxes() {
			$chatbox_left.click(function () {
				a(this).toggleClass('arrowchat_unseen_list_open');
				$unseen_users.toggle();
				if (a(this).hasClass('arrowchat_unseen_list_open')) {
					a("#arrowchat_chatbox_left .arrowchat_tabalertnf").hide();
				} else {
					a("#arrowchat_chatbox_left .arrowchat_tabalertnf").show();
				}
			});
			addHover($chatbox_left, "arrowchat_chatbox_lr_mouseover");
			addHover(a('#arrowchat_unseen_users .arrowchat_unseen_title'), "arrowchat_chatboxtabtitlemouseover2");
			a('#arrowchat_unseen_users .arrowchat_unseen_title').click(function() {
				a('#arrowchat_chatbox_left').click();
			});
		}
		
		function notificationPermission() {
			if (window.webkitNotifications && window.webkitNotifications.checkPermission) {
				window.webkitNotifications.requestPermission();
			} else if (window.Notification && window.Notification.requestPermission) {
				window.Notification.requestPermission();
			} else {
				return;
			}
		}
		
		function showDesktopNotification(id, message, message_id) {
			var s_message = message.replace(/<(?:.|\n)*?>/gm, '').replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
			if (s_message != '') {
				if(window.Notification && !window_focus && c_desktop_notify == 1) {
					var time = new Date().getTime();
					var notification = new window.Notification(lang[144] + renderHTMLString(uc_name[id]), { icon: uc_avatar[id], body: s_message, tag: message_id });
					setTimeout(function(){notification.close()},5000);
				}
			}
		}
		
		function lsClick(id, action, acvar) {
			if (lsreceive == 0) {
				var milliseconds = new Date().getTime();
				if (action == "ac_openclose") {
					if (typeof(acvar) == "undefined") {
						if (a(id).hasClass("arrowchat_tabclick"))
							localStorage.setItem("ac_close", id + "/" + milliseconds);
						else
							localStorage.setItem("ac_open", id + "/" + milliseconds);
					} else {
						eval("var temp=$"+acvar+";");
						if (id == " ") {
							if (temp.hasClass("arrowchat_tabclick"))
								localStorage.setItem("ac_close", id + "," + acvar + "/" + milliseconds);
							else
								localStorage.setItem("ac_open", id + "," + acvar + "/" + milliseconds);
						} else {
							if (a(id, acvar).hasClass("arrowchat_tabclick"))
								localStorage.setItem("ac_close", id + "," + acvar + "/" + milliseconds);
							else
								localStorage.setItem("ac_open", id + "," + acvar + "/" + milliseconds);
						}
					}
				} else if (action == "private_message" || action == "chatroom_message" || action == "chatroom_alerts" || action == "send_chatroom_message") {
					if (!msieversion()) {
						localStorage.setItem(action, id + "/##-" + milliseconds);
					}
				} else {
					if (!msieversion()) {
						if (typeof(acvar) == "undefined") {
							localStorage.setItem(action, id + "/" + milliseconds);
						} else
							localStorage.setItem(action, id + "," + acvar + "/" + milliseconds);
					}
				}
			}
		}
		
		function msieversion() {
			var ua = window.navigator.userAgent;
			var msie = ua.indexOf("MSIE ");
			if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
				return true;

		   return false;
		}
		
		function localStorageFired(e) {
			lsreceive = 1;
			if (e.key == 'ac_open' || e.key == 'ac_close' || e.key == 'ac_click') {
				var res = e.newValue.split("/");
				var res2 = res[0].split(",");
				if (typeof(res2[1]) == "undefined") {
					if (e.key == 'ac_click')
						a(res2[0]).click();
					else if (!a(res2[0]).hasClass("arrowchat_tabclick") && e.key == 'ac_open')
						a(res2[0]).click();
					else if (a(res2[0]).hasClass("arrowchat_tabclick") && e.key == 'ac_close')
						a(res2[0]).click();
				} else {
					eval("var temp=$"+res2[1]+";");
					if (res2[0] == " ") {
						if (typeof(temp) != "undefined" && e.key == 'ac_click')
							temp.click();
						else if (typeof(temp) != "undefined" && !temp.hasClass("arrowchat_tabclick") && e.key == 'ac_open')
							temp.click();
						else if (typeof(temp) != "undefined" && temp.hasClass("arrowchat_tabclick") && e.key == 'ac_close')
							temp.click();
					} else {
						if (a(res2[0], temp).length && e.key == 'ac_click')
							a(res2[0], temp).click();
						else if (a(res2[0], temp).length && !a(res2[0], temp).hasClass("arrowchat_tabclick") && e.key == 'ac_open')
							a(res2[0], temp).click();
						else if (a(res2[0], temp).length && a(res2[0], temp).hasClass("arrowchat_tabclick") && e.key == 'ac_close')
							a(res2[0], temp).click();
					}
				}
			}
			if (e.key == 'window_focus') {
				clearTimeout(dtit3);
				document.title = dtit;
			}
			if (c_push_engine != 1) {
				if (e.key == 'untyping') {
					var res = e.newValue.split("/");
					receiveNotTyping(res[0]);
				}
				if (e.key == 'typing') {
					var res = e.newValue.split("/");
					receiveTyping(res[0]);
				}
				if (e.key == 'private_message') {
					var res = e.newValue.split("/##-");
					var data = JSON.parse(res[0]);
					receiveMessage(data[0], data[1], data[2], data[3], data[4], 1, 1);
				}
				if (e.key == 'chatroom_message') {
					var res = e.newValue.split("/##-");
					var data = JSON.parse(res[0]);
					var tester = data[8];
					if (tester.substring(0, 3) == "cr-")
						tester = tester.substr(3);
					if (Ccr == tester) addChatroomMessage(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], tester);
				}
				if (e.key == 'chatroom_alerts') {
					var res = e.newValue.split("/##-");
					var data = JSON.parse(res[0]);
					var tester = data[1];
					if (tester.substring(0, 3) == "cr-")
						tester = tester.substr(3);
					chatroomAlerts(data[0], tester);
				}
				if (e.key == 'send_chatroom_message') {
					var res = e.newValue.split("/##-");
					var data = JSON.parse(res[0]);
					var tester = data[3];
					if (tester.substring(0, 3) == "cr-")
						tester = tester.substr(3);
					if (Ccr == tester) addMessageToChatroom(data[0], data[1], data[2], 1);
					$chatroom_chat.scrollTop($chatroom_chat[0].scrollHeight);
					a(".arrowchat_image_msg img,.arrowchat_emoji_text img").one("load", function() {
					  $chatroom_chat.scrollTop(5E4);
					}).each(function() {
					  if(this.complete) a(this).load();
					});
				}
			}
			lsreceive = 0;
		}

		function runarrowchat() {
			a.ajax({					
				url: c_ac_path + "includes/json/receive/receive_init.php",
				cache: false,
				type: "get",
				dataType: "json",
				success: function (b) {}
			});
			$base = a("<div/>").attr("id", "arrowchat_base").appendTo($body);
			window.addEventListener('storage', localStorageFired, false);
			if (c_push_engine == 1) {
				push = new Scaledrone(c_push_publish);
			}
			if (c_chat_maintenance != 0 || c_db_connection == 1 || (c_guests_login_msg != 0 && u_id == "")) {				
				buildMaintenance();
			} else {
				if (c_hide_bar_on != 0) {
					buildShowBarButton();
					buildHideBarButton()				
				}
				u_is_mod == 1 && c_enable_moderation == 1 && buildModButton();
				c_notifications != 0 && buildOptionsButton();
				c_chatrooms != 0 && buildChatroomsButton();
				buildBuddyListTab();
				
				for (var d = 0; d < unfocus_chatroom.length; d++) {
					if (typeof(unfocus_chatroom[d] != "undefined")) {
						changePushChannel(unfocus_chatroom[d], 1);
						addChatroomTab(unfocus_chatroom[d], chatroom_name[unfocus_chatroom[d]], 0);
					}
				}
			}

			c_online_list == 0 && a("#arrowchat_buddy_list_tab").hide();

			if (c_links_right != 1) {
				buildTrayButtons();
			}
			if (c_applications_on != 0) {
				if ((u_id == "" && c_guests_apps == "1") || (u_id != "" && u_is_guest != 1) || (u_id !="" && u_is_guest == 1 && c_guests_apps == 1)) {
					if (c_no_apps_menu != 1) {
						buildApplicationsButton();
					}
					buildApplicationButtons();
				}
			}
			if (c_links_right == 1) {
				buildTrayButtons();
			}
			$unseen_users = a('<div id="arrowchat_unseen_users"><div class="arrowchat_unseen_title"><div class="arrowchat_tab_name">' + lang[215] + '</div></div><div class="arrowchat_tabcontent"></div></div>').appendTo($body);
			$body.append('<div id="arrowchat_sound_player_holder"></div>');			
			$chatboxes = a("<div/>").attr("id", "arrowchat_chatboxes").appendTo($base);
			$chatboxes_wide = a("<div/>").attr("id", "arrowchat_chatboxes_wide").appendTo($chatboxes);
			$chatbox_left = a("<div/>").attr("id", "arrowchat_chatbox_left").appendTo($base);
			a("<span/>").addClass("arrowchat_previous_tab").appendTo($chatbox_left);
			a("<div/>").addClass("arrowchat_tabtext").appendTo($chatbox_left);
			a("<span/>").css("top", "-5px").css("display", "none").addClass("arrowchat_tabalertlr").appendTo($chatbox_left);
			buildChatboxes();
			updateRightLastClasses(0);			
			$chatboxes_wide.css("width", "0px");
			a(window).bind("resize", adjustBarSize);
			a(window).on('resize', function(){
				clearTimeout(windowresize_timeout);
				windowresize_timeout = setTimeout(function () {
					adjustBarSize();
				}, 500);
			});
			set("buddylist", "1");
			set("initialize", "1");
			set("currenttime", ab);
			a(window).focus(function() {
				window_focus = true;
				lsClick("body", 'window_focus');
			}).blur(function() {
				window_focus = false;
			});
			if (c_desktop_notify == 1)
				a("#arrowchat_base").click(notificationPermission);
			if (typeof document.body.style.maxHeight === "undefined") {
				W = true;
				$base.css("position", "absolute");
				$tooltip.css("position", "absolute");
				$userstab_popup.css("position", "absolute");
				$optionsbutton_popup.css("position", "absolute");
				a(window).bind("scroll", function () {
					positionArrowchat()
				})
			}
			if (c_chat_maintenance != 1 && c_db_connection != 1) {
				for (var d = 0; d < unfocus_chat.length; d++) {
					if (typeof(unfocus_chat[d] != "undefined")) {
						receiveUser(unfocus_chat[d], uc_name[unfocus_chat[d]], uc_status[unfocus_chat[d]], uc_avatar[unfocus_chat[d]], uc_link[unfocus_chat[d]], "1");
					}
				}
			}
			if (u_hide_bar == 1 || u_status == "offline") {
				if (u_status == "offline" && u_hide_bar != 1) {
					a("#arrowchat_userstab_text").html(lang[7]);
					$chatboxes.hide();
					$chatbox_left.hide();
				} else {
					$base.hide();
					$show_bar_button.css("display", "block");
				}
				w = 1;
				a.idleTimer("destroy")
			} else if (c_chat_maintenance != 1 && c_db_connection != 1 && u_id != "") {
				if (u_chat_open.toString().search('facebook') == "-1")
					u_chat_open != 0 && receiveUser(u_chat_open, uc_name[u_chat_open], uc_status[u_chat_open], uc_avatar[u_chat_open], uc_link[u_chat_open]);
				if (c_push_engine == 1) {
					pushSubscribe();
				}
				receiveCore();
				a("#arrowchat_userslist_available").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[25] + "</div>");
				a(".arrowchat_chatroom_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
				if (u_blist_open == 1 && c_online_list != 0)
					$buddy_list_tab.click();
				else
					loadBuddyList();
				if (u_chatroom_open != -1 && $chatrooms_button !== undefined) {
					u_chatroom_open == 0 && $chatrooms_button.click();
					if (u_chatroom_open != 0) {
						Ccr = u_chatroom_open;
						chatroomreceived = 1;
						if(typeof($chatroom_create) != "undefined") $chatroom_create.hide();
						closePopup($userstab_popup, $buddy_list_tab);
						closePopup($optionsbutton_popup, $optionsbutton);
						closePopup($modbutton_popup, $modbutton);
						$chatrooms_popup.css("left", $chatrooms_button.offset().left - $chatrooms_popup.outerWidth() + $chatrooms_button.outerWidth()).css("bottom", "25px");
						$chatrooms_button.toggleClass("arrowchat_tabclick").toggleClass("arrowchat_userstabclick");
						$chatrooms_popup.toggleClass("arrowchat_tabopen");
						loadChatroom(u_chatroom_open, crt[u_chatroom_open]);
					}
				} else if (u_chatroom_stay > 0) {
					Ccr = u_chatroom_stay;
					chatroomreceived = 1;
					if(typeof($chatroom_create) != "undefined") $chatroom_create.hide();
					loadChatroom(u_chatroom_stay, crt[u_chatroom_stay])
				} else if (u_chatroom_stay == 0 && u_chatroom_open == -1 && c_chatroom_auto_join != 0) {
					Ccr = c_chatroom_auto_join;
					chatroomreceived = 1;
					if(typeof($chatroom_create) != "undefined") $chatroom_create.hide();
					loadChatroom(c_chatroom_auto_join, crt[c_chatroom_auto_join])
				}
				if (u_apps_open != "" && u_apps_open != "0") {
					a("#arrowchat_app_link_" + u_apps_open).click();
				}
			}
			clearUserStatus();
			adjustBarSize();
			a('.arrowchat_powered_by').each(function(){this.style.setProperty('');});
			a("#arrowchat_userstab_icon").addClass("arrowchat_user_" + u_status + "2");
			ion.sound({
				sounds: [
					{
						name: "new_message"
					}
				],
				volume: 1.0,
				path: c_ac_path + "themes/" + u_theme + "/sounds/",
				preload: true
			});
		}

		function positionArrowchat() {
			$base.css("top", a(window).scrollTop() + a(window).height() - 25);
			$userstab_popup.css("top", parseInt(a(window).height()) - parseInt($userstab_popup.css("bottom")) - parseInt($userstab_popup.height()) + a(window).scrollTop() + "px");
			$optionsbutton_popup.css("top", parseInt(a(window).height()) - parseInt($optionsbutton_popup.css("bottom")) - parseInt($optionsbutton_popup.height()) + a(window).scrollTop() + "px");
			$tooltip.length > 0 && $tooltip.css("top", parseInt(a(window).height()) - parseInt($tooltip.css("bottom")) - parseInt($tooltip.height()) + a(window).scrollTop() + "px");
			if (j != "") {
				$user_popups[j].css("position", "absolute");
				$user_popups[j].css("top", parseInt(a(window).height()) - parseInt($user_popups[j].css("bottom")) - parseInt($user_popups[j].height()) + a(window).scrollTop() + "px")
			}
		}

		function playNewMessageSound() {
			ion.sound.play("new_message");
		}
		
		function renderHTMLString(string) {
			var new_render = string;
			if (typeof(string) != "undefined") {
				var render = a("<div/>").attr("id", "arrowchat_render").html(string).appendTo('body');
				new_render = a("#arrowchat_render").html();
				render.remove();
			}
			return new_render;
		}
		
		var bounce2 = 1,
			bounce3 = 1,
			buddylisttest = 1,
			searchxhr,
			typingTimeout,
			lsreceive = 0,
			chatroom_mod = 0,
			chatroom_admin = 0,
			count = 0,
			V = {},
			dtit = document.title,
			dtit2 = 1,
			dtit3 = 1, 
			window_focus = true,
			xa = {},
			chatroom_list = {},
			j = "",
			chatroom_popout = "",
			crou = "",
			$ = 0,
			w = 0,
			bli = 1,
			isAway = 0,
			chatroomreceived = 0,
			W = false,
			Y, Z, E = 3E3,
			Crref2, Ccr = -1,
			open_report = -1,
			message_timeout,
			windowresize_timeout,
			D = E,
			K = 1,
			ma = 0,
			R = 0,
			m = "",
			Ka = 0,
			crt = {},
			crt2 = {},
			y = {},
			G = {},
			aa = {},
			ca = {},
			last_id = {},
			last_sent = {},
			last_name = {},
			history_ids = {},
			push_room = {},
			push_uid,
			push_arrowchat,
			room_info = [],
			room_desc = [],
			room_limit_msg = [],
			room_limit_sec = [],
			visibleTab = [],
			Aa = new Date,
			Na = Aa.getDate(),
			ab = Math.floor(Aa.getTime() / 1E3),
			acsi = 1,
			Q = 0,			
			fa = -1,
			acp = "Powered By <a href='http://www.arrowchat.com/' target='_blank'>ArrowChat</a>",
			pa = 0,
			B, 
			push,
			session_var = '',
			onlineNumber = 0,
			jabberOnlineNumber = 0,
			errorCount = 0,
			premade_smiley = [],
			N;
		premade_smiley[0] = [':)','1f600.png'];
		premade_smiley[1] = [':-)','1f600.png'];
		premade_smiley[2] = ['=)','1f600.png'];
		premade_smiley[3] = [':p','1f61b.png'];
		premade_smiley[4] = [':o','1f62e.png'];
		premade_smiley[5] = [':|','1f610.png'];
		premade_smiley[6] = [':(','1f614.png'];
		premade_smiley[7] = ['=(','1f614.png'];
		premade_smiley[8] = [':D','1f603.png'];
		premade_smiley[9] = ['=D','1f603.png'];
		premade_smiley[10] = [':/','1f615.png'];
		premade_smiley[11] = ['=/','1f615.png'];
		premade_smiley[12] = [';)','1f609.png'];
		premade_smiley[13] = [':\'(','1f62d.png'];
		premade_smiley[14] = ['<3','2764.png'];
		premade_smiley[15] = ['>:(','1f620.png'];
		var _ts = "",
			_ts2;
		for (d = 0; d < Themes.length; d++) {
			if (Themes[d][2] == u_theme) {
				_ts2 = "selected";
			} else {
				_ts2 = "";
			}
			_ts = _ts + "<option value=\"" + Themes[d][0] + "\" " + _ts2 + ">" + Themes[d][1] + "</option>";
		}
		a.ajaxSetup({
			scriptCharset: "utf-8",
			cache: false
		});
		a.expr[":"].icontains = function (b, c, d) {
			return (b.textContent || b.innerText || jqac(b).text() || "").toLowerCase().indexOf(d[3].toLowerCase()) >= 0
		};
		arguments.callee.videoWith = function (b) {
			if (c_video_select == 4) {
				var win = window.open('https://opentokrtc.com/room/' + b + '?userName=' + u_name, 'audiovideochat', "status=no,toolbar=no,menubar=no,directories=no,resizable=no,location=no,scrollbars=no,width="+c_video_width+",height="+c_video_height+"");
			} else {
				var win = window.open(c_ac_path + 'public/video/?rid=' + b, 'audiovideochat', "status=no,toolbar=no,menubar=no,directories=no,resizable=no,location=no,scrollbars=no,width="+c_video_width+",height="+c_video_height+"");
			}
			win.focus();
		};
		arguments.callee.runarrowchat = runarrowchat;

		arguments.callee.chatroom = function (b) {
			if (u_hide_bar == 1) showBar();
			$chatrooms_button.click();
			setTimeout(function () {
				a(".arrowchat_chatroom_full_content").html('<div class="arrowchat_nofriends"><div class="arrowchat_loading_icon"></div>' + lang[34] + "</div>");
				a(".arrowchat_chatroom_full_content").removeClass("arrowchat_chatroom_opacity");
				if (a("#arrowchat_chatroom_password_flyout").is(":visible")) {
					a("#arrowchat_chatroom_password_flyout").hide("slide", { direction: "up"}, 250);
				}
				a(".arrowchat_chatroom_tab").removeClass("arrowchat_chatroom_tab_focused");
				$chatroom_create.hide();
				Ccr = b;
				loadChatroom(b, "1");
			}, 400);
			$chatrooms_popup.addClass("arrowchat_tabopen"); 
			a("#arrowchat_chatrooms_button").addClass("arrowchat_tabclick").addClass("arrowchat_userstabclick");
		};
		arguments.callee.chatWith = function (b) {
			if (u_hide_bar == 1) showBar();
			receiveUser(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b])
		};
		arguments.callee.openCloseApp = function (name) {
			a(".arrowchat_appname_"+name).click();
		};
		arguments.callee.changeAppImage = function (name, image) {
			a(".arrowchat_appname_"+name+" img").attr("src", c_ac_path+image);
		};
		arguments.callee.addAppAlert = function (name, number) {
			if (a(".arrowchat_appname_"+name+" .arrowchat_tabalert").length > 0 && number > 0) {
				a(".arrowchat_appname_"+name+" .arrowchat_tabalert").html(number);
			} else if (!(a(".arrowchat_appname_"+name).hasClass("arrowchat_trayclick"))) {
				a("<div/>").css("top", "-11px").css("left", "6px").addClass("arrowchat_tabalert").html(number).appendTo(".arrowchat_appname_"+name);
			}
		};
		arguments.callee.getUser = function (b, c) {
			a.ajax({
				url: c_ac_path + "includes/json/receive/receive_user.php",
				data: {
					userid: b
				},
				type: "post",
				cache: false,
				dataType: "json",
				success: function (o) {
					if (o) {
						window[c](o);
					} else {
						window[c](0);
					}
				}
			});
		};
		arguments.callee.sendMessage = function (b, c) {
			c != "" && a.post(c_ac_path + "includes/json/send/send_message.php", {
				to: b,
				message: c
			}, function (d) {
				if (d) {
					if (d == "-1") {
						displayMessage("arrowchat_chatbox_message_flyout_" + b, lang[102], "error");
					} else {
						addMessageToChatbox(b, c, 1, 1, d, 1, 1);
					}
					a(".arrowchat_tabcontenttext", $user_popups[b]).scrollTop(a(".arrowchat_tabcontenttext", $user_popups[b])[0].scrollHeight)
				}
				K = 1;
			})
		};
		arguments.callee.getBaseUrl = function () {
			return k
		};
		arguments.callee.logout = function () {
			clearTimeout(Z);
			clearTimeout(Crref2);
			a.idleTimer("destroy");
			pushCancelAll();
			cancelJSONP();
			c_guests_login_msg = 1;
			u_id = "";
			closePopup($userstab_popup, $buddy_list_tab);
			closePopup($optionsbutton_popup, $optionsbutton);
			closePopup($modbutton_popup, $modbutton);
			closePopup($chatrooms_popup, $chatrooms_button);
			closePopup($applications_button_popup, $applications_button);
			if (m != "") {
				closePopup($application_button_popups[m], $application_buttons[m]);
				m = "";
			}
			if (j != "") {
				closePopup($user_popups[j], $users[j]);
				a(".arrowchat_closebox_bottom", $users[j]).removeClass("arrowchat_closebox_bottom_click");
				j = "";
			}
			a("#arrowchat_chatbox_left").remove();
			a("#arrowchat_chatboxes").remove();
			a("#arrowchat_buddy_list_tab").remove();
			a("#arrowchat_chatrooms_button").remove();
			a("#arrowchat_optionsbutton").remove();
			a("#arrowchat_modbutton").remove();
			a("#arrowchat_hide_bar_button").remove();
			buildMaintenance();
		};
	}
})(jqac);

jqac(document).ready(function () {
	if (u_logged_in != 1 && c_disable_arrowchat != 1) {
		jqac.arrowchat();
		jqac.arrowchat.runarrowchat();
	}
});


var ElementosClick=new Array();
document.onclick=captura_click;
function captura_click(e)
{
    var a;
    if(e==null)
    {
        a=event.srcElement
    }
    else
    {
        a=e.target
    }
    ElementosClick.push(a);
    if(a.className=="arrowchat_chatroom_message_name")
    {
        var b=a.parentNode.parentNode.parentNode.id;
        var c=b.substring(25);
        var d="arrowchat_popout_text_cr-"+c;
        var f=a.innerHTML;
        var g="@"+f.slice(0,-1);
        document.getElementById(d).nextSibling.lastChild.firstChild.value=g+" ";
        document.getElementById(d).nextSibling.lastChild.firstChild.focus();
        document.getElementById(d).nextSibling.lastChild.firstChild.click()

    }
}




setInterval("toniarroww()",3000);
function toniarroww()
{
    var a=document.getElementsByClassName("arrowchat_chatboxmessagecontent");
    for(i=0;
        i<a.length;
        i++)
    {
        if(a[i].firstChild.innerHTML===undefined)
        {
        }
        else
        {
            var b=a[i].firstChild.innerHTML;
            posicion=b.indexOf('youtu.be/');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+9);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                b="https://youtube.com/embed/"+porcion2;
                var d=document.createElement('iframe');
                d.setAttribute("src",b);
                a[i].appendChild(d);
                d.setAttribute('allowFullScreen', '')
                d.style.width="100%";
                d.style.height="360px";
                d.style.border="none";
                a[i].style.fontSize="0px";
                a[i].className="MyClass"
            }
            posicion=b.indexOf('watch?v=');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+8);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                b="https://youtube.com/embed/"+porcion2+"?allowfullscreen=true";
                var d=document.createElement('iframe');
                d.setAttribute("src",b);
                a[i].appendChild(d);
                d.setAttribute('allowfullscreen','1')
                d.setAttribute('webkitallowfullscreen','1')
                d.style.width="640px";
                d.style.height="360px";
                d.style.border="none";
                a[i].style.fontSize="0px";
                a[i].className="MyClass"
            }
            posicion=b.indexOf('vimeo.com/');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+10);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                b="https://player.vimeo.com/video/"+porcion2;
                var d=document.createElement('iframe');
                d.setAttribute("src",b);
                d.style.width="640px";
                d.style.height="360px";
                d.style.border="none";
                d.setAttribute('allowFullScreen', '')

                a[i].appendChild(d);
                a[i].style.fontSize="0px";
                a[i].className="MyClass"
            }
            posicion=b.indexOf('facebook.com/');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+13);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                b="https://www.facebook.com/plugins/video.php?href=https://facebook.com/"+porcion2;
                var d=document.createElement('iframe');
                d.setAttribute("src",b);
                d.style.width="auto";
                d.style.height="360px";

                d.style.border="none";
                d.setAttribute('allowFullScreen', '')
                a[i].appendChild(d);
                a[i].style.fontSize="0px";
                a[i].parentNode.style.backgroundColor="transparent";
                a[i].className="MyClass"
            }
            posicion=b.indexOf('.tumblr.com/post/');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+17);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                posicionn=b.indexOf('https://');
                porcion3=b.substring(8,posicion);
                enlacefinal="https://www.tumblr.com/video/"+porcion3+"/"+porcion2+"/700/";
                var d=document.createElement('iframe');
                d.setAttribute("src",enlacefinal);
                d.style.width="100%";
                d.style.height="476px";
                d.style.border="none";
                a[i].appendChild(d);
                a[i].style.fontSize="0px";
                a[i].className="MyClass"
            }
        }
    }
}
