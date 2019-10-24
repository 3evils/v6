(function (a) {
    function oa(r, ea) {
        r = typeof r === "string" ? document.getElementById(r) : r;
        var O = r.cloneNode(false);
        O.innerHTML = ea;
        r.parentNode.replaceChild(O, r);
        return O
    }
    a.arrowchat = function () {
        function P() {
			clearTimeout(Z);
            a.ajax({
                url: c_ac_path + "includes/json/receive/receive_buddylist.php?mobile=1",
                cache: false,
                type: "post",
                dataType: "json",
                success: function (b) {
                    Va(b);
                }
            });
			if (typeof c_list_heart_beat != "undefined") {
				var BLHT = c_list_heart_beat * 1000;
			} else {
				var BLHT = 60000;
			}
            Z = setTimeout(function () {
                P()
            }, BLHT)
        }
        function Sa(b) {
            var c = b.substr(19);
			a(".back_buttons").html(lang[113]);
            I(c, uc_name[c], uc_status[c], uc_avatar[c], uc_link[c])
        }
        function Va(b) {
            var c = {},
                d = "",
				alert_show = "";
            c.available = "";
            c.busy = "";
            c.offline = "";
            c.away = "";
            onlineNumber = buddylistreceived = 0;
            b && a.each(b, function (i, e) {
                if (i == "buddylist") {
                    buddylistreceived = 1;
                    totalFriendsNumber = onlineNumber = 0;
                    a.each(e, function (l, f) {
						avatar = "";
                        longname = renderHTMLString(f.n).length > 25 ? renderHTMLString(f.n).substr(0, 25) + "..." : f.n;
                        if (f.s == "available" || f.s == "away" || f.s == "busy") onlineNumber++;
                        totalFriendsNumber++;
						if (a("#arrowchat_userlist_" + f.id + " .mobile_alert").is(":visible"))
							alert_show = ' style="display:block"';
						else
							alert_show = '';
						if (c_disable_avatars != 1)
							avatar = '<div class="mobile_avatar"><img src="'+f.a+'" /></div>';
                        c[f.s] += '<li data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text" id="arrowchat_userlist_' + f.id + '"><a data-transition="slide" href="#page2" class="ui-link-inherit user-window">' + avatar + '<span class="list_name">' +longname + '</span><div class="mobile_alert"' + alert_show + '>'+lang[115]+'</div></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
                        uc_status[f.id] = f.s;
                        uc_name[f.id] = f.n;
                        uc_avatar[f.id] = f.a;
                        uc_link[f.id] = f.l;
						
						if (a("#arrowchat_user_" + f.id).length > 0) {
							var status = f.s;
							if (status == "available")
								status = lang[1];
							if (status == "away")
								status = lang[240];
							if (status == "offline")
								status = lang[241];
							if (status == "busy")
								status = lang[216];
							a("#username-header").html('<div id="name-header">' + f.n + '<span class="arrowchat_username_arrow"> </span></div><div id="status-header">' + status + '</div>');
						}
                    })
                }
                if (buddylistreceived == 1) {
					for (buddystatus in c) {
						if (c.hasOwnProperty(buddystatus)) {
							if (c[buddystatus] != "") {
								a("#buddylist-container-available").html('<li role="heading" data-role="list-divider" id="online-users-count" class="ui-li ui-li-divider ui-btn ui-bar-d ui-btn-up-undefined">' + lang[111] + '</li>' + c['available'] + c['busy']);
								a("#buddylist-container-away").html('<li role="heading" data-role="list-divider" id="online-users-count" class="ui-li ui-li-divider ui-btn ui-bar-d ui-btn-up-undefined">' + lang[112] + '</li>' + c['away']);
							}
						}
					}
					a(".user-window").unbind("click");
                    a(".user-window").click(function (l) {
                        Sa(a(this).parent().attr("id"));
						var c = a(this).parent().attr("id").substr(19);
						a("#arrowchat_userlist_" + c + " .mobile_alert").hide();
                    });
					a("#back-button").unbind("click");
					a("#back-button").click(function () {
						j = "";
					});
                    R = onlineNumber;
                    totalFriendsNumber == 0 && a("#arrowchat_popout_friends").html('<div class="arrowchat_nofriends">' + lang[8] + "</div>");
					a("#buddylist-container-away").css("margin-top", "15px");
					if (c_chatrooms == 1 && (a.cookie('ac_show_chatroom') == 1 || typeof(a.cookie('ac_show_chatroom')) == "undefined")) {
						a("#buddylist-container-available").css("margin-top", "15px");
					}
                    buddylistreceived = 0
                }
            })
        }
		function cancelJSONP() {
			if (typeof CHA != "undefined") {
				clearTimeout(CHA);
			}
			if (typeof xOptions != "undefined") {
				xOptions.abort();
			}
		}
		function loadChatroomList() {
			if (a.mobile.activePage.attr("id") == "page1") {
				if (chatroomreceived == 0) {
					a("#buddylist-container-chatroom").html('<li role="heading" data-role="list-divider" id="chatroom-list" class="ui-li ui-li-divider ui-btn ui-bar-d ui-btn-up-undefined">' + lang[128] + '</li>');
				}
				a.ajax({					
					url: c_ac_path + "includes/json/receive/receive_chatroom_list.php",
					cache: false,
					type: "post",
					dataType: "json",
					data: {
						chatroom_window: '-1',
						chatroom_stay: '-1'
					},
					success: function (b) {
						buildChatroomList(b);
					}
				});
			} else {
				crtimeout = setTimeout(function () {
					loadChatroomList()
				}, 6E4);
			}
		}
		function buildChatroomList(b) {
			var chatroomlist = "";
			var c = {}, alert_show = '';
			b && a.each(b, function (i, e) {
				if (i == "chatrooms") {
					a.each(e, function (l, f) {
						if (f.t == 2) {
							alink = '<a href="#password-page" id="arrowchat_chatroom_'+f.id+'" data-rel="dialog" data-transition="slidedown" class="ui-link-inherit chatroom-window-password">';
						} else {
							alink = '<a data-transition="slide" id="arrowchat_chatroom_'+f.id+'" href="#page3" class="ui-link-inherit chatroom-window">';
						}
						if (a("#arrowchat_chatroom_" + f.id + " .mobile_alert").is(":visible"))
							alert_show = ' style="display:block"';
						else
							alert_show = '';
						chatroomlist += '<li data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text arrowchat_chatroomlist_' + f.t + '">' + alink + '<div class="mobile_avatar_chatroom"><img src="' + c_ac_path + "themes/" + u_theme + '/images/icons/' + f.img + '"></div><div class="chatroom_name_wrapper"><div class="chatroom_name">' + f.n + '</div><div class="chatroom_desc">' + f.d + '</div></div><div class="chatroom_count">'+f.c+lang[35]+'</div><div class="mobile_alert"' + alert_show + '>'+lang[115]+'</div></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
					});
				}
			});
			chatroomreceived = 1;
			a("#buddylist-container-chatroom").html('<li role="heading" data-role="list-divider" id="chatroom-list" class="ui-li ui-li-divider ui-btn ui-bar-d ui-btn-up-undefined">' + lang[128] + '</li>');
			a("#buddylist-container-chatroom").append(chatroomlist);
			a(".chatroom-window").click(function (l) {
				chatroomListClicked(a(this).attr('id'));
				loadChatroom(Ccr, crt[Ccr]);
			});
			a(".chatroom-window-password").click(function (l) {
				chatroomListClicked(a(this).attr('id'));
			});
			a("#submit-chatroom-password").click(function() {
				loadChatroom(Ccr, crt[Ccr], a("#room-password").val());
				a("#room-password").val('');
			});
			crtimeout = setTimeout(function () {
				loadChatroomList()
			}, 6E4);
		}
		function chatroomListClicked(b) {
			var c = b.substr(19);
			if (retain_ccr != 0 && c_push_engine == 1) {changePushChannel("chatroom"+retain_ccr, 0);}
			a("#arrowchat_chatroom_" + c + " .mobile_alert").hide();
			a(".back_buttons").html(lang[113]);
			Ccr = c;
			Ccr2 = c;
		}
		function changePushChannel(name, connect) {
			if (connect == 1) {
				push.subscribe({ "channel" : name, "callback" : function(data) { pushReceive(data); } });
			} else {
				push.unsubscribe({ "channel" : name });
			}
		}
		function loadChatroom(b, c, pass) {
			hideSmileyButton();
			hideGiphyButton();
			a('#arrowchat_chatroom_chat_content').html('<div class="arrowchat_message_history_loading" style="text-align:center;padding:5px 0;"><img src="' + c_ac_path + 'themes/' + u_theme + '/images/img-loading.gif" alt="Loading" /></div>');
			retain_ccr = b;
			var global_mod = 0,
				global_admin = 0,
				admin_markup = "";
			chatroom_mod = 0;
			chatroom_admin = 0;
			chatroomreceived = 1;
			a.ajax({
				url: c_ac_path + "includes/json/receive/receive_chatroom_room.php",
				data: {
					chatroomid: b,
					chatroom_window: '-1',
					chatroom_stay: '-1',
					chatroom_pw: pass
				},
				type: "post",
				cache: false,
				dataType: "json",
				success: function (o) {
					a(".arrowchat_message_history_loading").remove();
					if (o) {
						clearTimeout(Crref2);
						var no_error = true;
						var error_received = 0;
						o && a.each(o, function (i, e) {
							if (i == "error") {
								a.each(e, function (l, f) {
									no_error = false;
									Ccr = 0;
									chatroomreceived = 0;
									if (error_received  == 0) {
										a.mobile.changePage( "#page1", { transition: "none", changeHash: true });
										a.mobile.changePage( "#chatroom-error", { transition: "slidedown", changeHash: true });
										a("#chatroom-error-content").html(f.m);
									}
									error_received = 1;
								});
							}
						});
						if (no_error) {
							Crref2 = setTimeout(function () {
								receiveChatroom(b)
							}, 30000);
							if (c_push_engine != 1) {
								cancelJSONP();
								H();
							} else {
								changePushChannel("chatroom"+b, 1);
							}
							if (typeof crt2[b] != "undefined") {
								a("#chatroom-header").html(crt2[b]);
							}
							a("#textinput2").keydown(function (h) {
								return chatroomKeydown(h, a(this))
							});
							a("#textinput2").keyup(function (h) {
								return chatroomKeyup(h, a(this))
							});
							a("#textinput2").bind('blur', function() {
								scrollOnPage3();
							});
							a("#send_button_chatroom").click(function () {
								var c = a("#textinput2");
								var i = a(c).val();
								i = i.replace(/^\s+|\s+$/g, "");
								a(c).val("");
								if (c_send_room_msg == 1 && i != "") {
									a("#chatroom-error-content").html(lang[209]);
									a.mobile.changePage( "#chatroom-error", { transition: "slidedown", changeHash: true });
								} else {
									if (i != "") {
										ion.sound.play("send_mobile");
										a.ajax({
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
											success: function (o) {
												var no_error = true;
												if (o) {
													o && a.each(o, function (i, e) {
														if (i == "error") {
															a.each(e, function (l, f) {
																no_error = false;
																a("#chatroom-error-content").html(f.m);
																a.mobile.changePage( "#chatroom-error", { transition: "slidedown", changeHash: true });
															});
														}
													});
													
													if (no_error) {
														addMessageToChatroom(o, u_name, i);
														scrollOnPage3();
													}
												}
											}
										});
									}
								}
								a("#textinput2").focus();
							});
							$chatroom_chat = a(".chat_room_content");
							$chatroom_chat.html('<div id="arrowchat_chatroom_chat_content"></div>');
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
											a("#chatroom-header").html(crt2[b]);
										}
									});
								}
								if (i == "chat_users") {
									var longname;
									a("#chatroom-users-list").html('');
									a.each(e, function (l, f) {
										if ((global_admin == 1 || global_mod == 1) && (f.t == 1 || f.t == 4)) {
											admin_markup = '<div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_make_mod_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[52] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_silence_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[161] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_ban_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[53] + '</div></div>';
										}
										if (global_admin == 1 && f.t == 2) {
											admin_markup = '<div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_remove_mod_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[54] + '</div></div>';
										}
										longname = renderHTMLString(f.n);
										avatar = "";
										if (c_disable_avatars != 1)
											avatar = '<div class="mobile_avatar"><img src="'+f.a+'" /></div>';
										f.n = renderHTMLString(f.n).length > 16 ? renderHTMLString(f.n).substr(0, 16) + "..." : f.n;
										a("#chatroom-users-list").append('<li data-theme="a" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-a arrowchat_chatroom_admin_' + f.t + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text" id="arrowchat_chatroom_user_' + f.id + '"><a data-transition="slide" href="#" class="ui-link-inherit user-window">' + avatar + '<span class="list_name">' + f.n + '</span></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>');
										if (f.t == 2) {
											a("#arrowchat_chatroom_title_" + f.id).html(longname + '<br/>' + lang[44]);
										} else if (f.t == 3) {
											a("#arrowchat_chatroom_title_" + f.id).html(longname + '<br/>' + lang[45]);
										} else if (f.t == 4) {
											a("#arrowchat_chatroom_title_" + f.id).html(longname + '<br/>' + lang[212]);
										}
										if (f.id != u_id) {
											setUserOptions(f, global_admin, global_mod);
										}
									});
									a("#user-options").bind("pagehide",function(){
										scrollOnPage3();
									});
								}
								if (i == "chat_history") {
									d = "";
									var sender_avatar = '',
										arrow = '';
									a.each(e, function (l, f) {
										var regex = new RegExp('^(^|\\s)(@' + u_name + ')(\\s|$)', 'i');
										f.m = f.m.replace(regex, '$1<span class="arrowchat_at_user">$2</span>$3');
										if (typeof(blockList[f.userid]) == "undefined") {
											var title = "";
											if (f.mod == 1)
												title = lang[137];
											if (f.admin == 1)
												title = lang[136];
											l = "";
											var image_msg = "";
											fromname = f.n;
											if (f.n == u_name) {
												l = " arrowchat_self";
												sender_avatar = '';
												arrow = 'send';
											} else {
												if (c_disable_avatars != 1)
													sender_avatar = '<div class="arrowchat_sender_avatar"><img src="' + f.a + '" /></div>';
												arrow = 'from';
											}
											if (f.m.substr(0, 4) == "<div") {
												image_msg = " arrowchat_image_msg";
											}
											var sent_time = new Date(f.t * 1E3);
											if (f.global == 1) {
												d += '<div class="arrowchat_message_wrapper arrowchat_clearfix"><div class="arrowchat_chatroom_box_message arrowchat_chatroom_global" id="arrowchat_chatroom_message_' + f.id + '"><div class="arrowchat_chatroom_message_content arrowchat_global_chatroom_message">' + f.m + "</div></div></div>"
											} else {
												if (image_msg != "" && l == "") {
													d += '<div class="arrowchat_message_wrapper arrowchat_clearfix">'+sender_avatar+'<div class="arrowchat_chatroom_name">' + fromname + title + '</div><div class="arrowchat_chatroom_box_message' + l + image_msg + '" id="arrowchat_chatroom_message_' + f.id + '"><div class="arrowchat_chatroom_message_content"><span class="arrowchat_chatroom_msg">' + f.m + "</span></div></div></div>";
												} else {
													d += '<div class="arrowchat_message_wrapper arrowchat_clearfix">'+sender_avatar+'<div class="arrowchat_chatroom_box_message' + l + image_msg + '" id="arrowchat_chatroom_message_' + f.id + '"><div class="arrowchat_chatroom_message_content"><div class="arrowchat_chatroom_name">' + fromname + title + '</div><span class="arrowchat_chatroom_msg">' + f.m + "</span></div></div></div>";
												}
											}
										}
									});
									a(".chat_room_content #arrowchat_chatroom_chat_content").html(d);
									showTimeAndTooltip();
								}
								if (i == "room_info") {
									a.each(e, function (l, f) {										
										if (f.welcome_msg != "") {
											var message = stripslashes(f.welcome_msg);
											message = replaceURLWithHTMLLinks(message);
											$chatroom_chat.append('<div class="arrowchat_message_wrapper arrowchat_clearfix"><div class="arrowchat_chatroom_box_message arrowchat_chatroom_global" id="arrowchat_chatroom_welcome_msg"><div class="arrowchat_chatroom_message_content arrowchat_global_chatroom_message">' + message + "</div></div></div>");
										}
									});
								}
							});
							a('#page3').bind('pageshow',function(){a('html, body').animate({scrollTop: 5E4}, 0)});
							a(".arrowchat_chatroom_msg>div>img,.arrowchat_emoji_text>img").one("load", function() {
								a('#page3').bind('pageshow',function(){a('html, body').animate({scrollTop: 5E4}, 0)});
								a('html, body').animate({scrollTop: 5E4}, 0);
							}).each(function() {
								if(this.complete) a(this).load();
							});
							if (c_disable_avatars == 1) {
								a(".arrowchat_chatroom_avatar").addClass("arrowchat_hide_avatars");
								a(".arrowchat_chatroom_message_avatar").addClass("arrowchat_hide_avatars");
							}
						}
					}
				}
			})
		}
		function setUserOptions(f, global_admin, global_mod) {
			a('#arrowchat_chatroom_user_' + f.id).click(function() {
				a.mobile.changePage("#user-options", { transition: "slidedown", changeHash: true });
				a("#user-options h1").html(f.n);
				if (f.b != 1 || global_admin == 1) {
					msg_button = '<a id="msg_button" href="#page2" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[41]+'</span></span></a>';
				} else {
					msg_button = '';
				}
				if (f.l != "" && f.l != "#") {
					visit_button = '<a id="visit_button" href="'+f.l+'" data-ajax="false" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[42]+'</span></span></a>';
				} else {
					visit_button = '';
				}
				block_button = '<a id="block_button" href="#" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[84]+'</span></span></a>';
				ban_button = '<a id="ban_button" href="#" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[53]+'</span></span></a>';
				silence_button = '<a id="silence_button" href="#" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[161]+'</span></span></a>';
				mod_button = '<a id="mod_button" href="#" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[52]+'</span></span></a>';
				remove_mod_button = '<a id="remove_mod_button" href="#" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[54]+'</span></span></a>';
				a("#user-options-content").html(msg_button + visit_button + block_button);
				if ((global_admin == 1 || global_mod == 1)) {
					a("#user-options-content").append(mod_button + silence_button + ban_button);
				}
				if (global_admin == 1) {
					a("#user-options-content").append(remove_mod_button);
				}
				a("#msg_button").click(function() {
					a("#arrowchat_userlist_" + f.id + " .mobile_alert").hide();
					a(".back_buttons").html(lang[113]);
					I(f.id, uc_name[f.id], uc_status[f.id], uc_avatar[f.id], uc_link[f.id]);
					receiveHistory(f.id);
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						userid: u_id,
						focus_chat: f.id,
						tab_alert: 1
					}, function () {});
					j = f.id;
					Ccr = 0;
					scrollOnPage2();
				});
				a("#block_button").click(function() {
					a("#user-options").dialog('close');
					a.ajax({
						url: c_ac_path + "includes/json/send/send_settings.php",
						type: 'POST',
						data: {
							block_chat: f.id
						},
						success: function() {
							if (typeof(blockList[f.id]) == "undefined") {
								blockList[f.id] = f.id;
							}
							P();
						}
					})
				});
				a("#mod_button").click(function() {
					a("#user-options").dialog('close');
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chatroom_mod: f.id,
						chatroom_id: Ccr
					}, function () {});
				});
				a("#remove_mod_button").click(function() {
					a("#user-options").dialog('close');
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chatroom_remove_mod: f.id,
						chatroom_id: Ccr
					}, function () {});
				});
				a("#ban_button").click(function() {
					var ban_length = prompt(lang[57]);
					if (ban_length != null && ban_length != "" && !(isNaN(ban_length))) {
						a.post(c_ac_path + "includes/json/send/send_settings.php", {
							chatroom_ban: f.id,
							chatroom_id: Ccr,
							chatroom_ban_length: ban_length
						}, function () {a("#user-options").dialog('close');});
					}
				});
				a("#silence_button").click(function() {
					var silence_length = prompt(lang[162]);
					if (silence_length != null && silence_length != "" && !(isNaN(silence_length))) {
						a.post(c_ac_path + "includes/json/send/send_settings.php", {
							chatroom_silence: f.id,
							chatroom_id: Ccr,
							chatroom_silence_length: silence_length
						}, function () {a("#user-options").dialog('close');});
					}
				});
			});
		}
		function setPrivateUserOptions(b) {
			a('#username-header').unbind("click");
			a('#username-header').click(function() {
				a.mobile.changePage("#user-options", { transition: "slidedown", changeHash: true });
				a("#user-options h1").html(uc_name[b]);
				if (c_enable_moderation == 1) {
					moderation_button = '<a id="spam_button" href="#" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[167]+'</span></span></a>';
				} else {
					moderation_button = '';
				}
				block_button = '<a id="block_button" href="#page1" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[84]+'</span></span></a>';
				clear_button = '<a id="clear_button" href="#" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[24]+'</span></span></a>';
				profile_button = '<a id="profile_button" target="_blank" href="' + uc_link[b] + '" data-theme="b" data-role="button" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-hover-b ui-btn-up-b"><span class="ui-btn-inner"><span class="ui-btn-text">'+lang[42]+'</span></span></a>';
				a("#user-options-content").html(profile_button + clear_button + block_button + moderation_button);
				a("#block_button").click(function() {
					a.ajax({
						url: c_ac_path + "includes/json/send/send_settings.php",
						type: 'POST',
						data: {
							block_chat: b
						},
						success: function() {
							if (typeof(blockList[b]) == "undefined") {
								blockList[b] = b;
							}
							P();
						}
					});
				});
				a("#clear_button").click(function() {
					a("#user-options").dialog('close');
					a("#arrowchat_user_" + b).html('');
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						clear_chat: b
					}, function () {});
				});
				a("#spam_button").click(function() {
					a("#user-options-content").html(lang[168]);
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						report_from: u_id,
						report_about: b
					}, function () {});
				});
			});
		}
		function addMessageToChatroom(b, c, d) {
			var title = "",important = "", image_msg = "";
				sender_avatar = "";
			if (chatroom_mod == 1)
				title = lang[137];
			if (chatroom_admin == 1)
				title = lang[136];
			d = d.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>").replace(/\"/g, "&quot;");
			d = replaceURLWithHTMLLinks(d);
			d = smileyreplace(d);
			if (d.substr(0, 4) == "<div") {
				image_msg = " arrowchat_image_msg";
			}
			if (a("#arrowchat_chatroom_message_" + b).length > 0) {
			} else {
				$chatroom_chat.append('<div class="arrowchat_message_wrapper arrowchat_clearfix"><div class="arrowchat_chatroom_box_message arrowchat_self' + image_msg + '" id="arrowchat_chatroom_message_' + b + '"><div class="arrowchat_chatroom_message_content"><div class="arrowchat_chatroom_name">' + c + title + '</div><span class="arrowchat_chatroom_msg">' + d + '</span></div></div></div>');
				scrollOnPage3();
			}
			showTimeAndTooltip();
			a("#textinput2").focus();
		}
		function receiveChatroom(c) {
			var global_mod = 0,
				global_admin = 0,
				admin_markup = "";
			chatroom_mod = 0;
			chatroom_admin = 0;
			if (Ccr == c) {
				a.ajax({
					url: c_ac_path + "includes/json/receive/receive_chatroom.php",
					cache: false,
					type: "post",
					data: {
						chatroomid: c
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
										chatroomreceived = 0;
										loadChatroomList();
										a("#chatroom-error-content").html(f.m);
										a.mobile.changePage( "#chatroom-error", { transition: "slidedown", changeHash: true });
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
										var longname;
										a("#chatroom-users-list").html("");
										a.each(e, function (l, f) {
											if ((global_admin == 1 || global_mod == 1) && (f.t == 1)) {
												admin_markup = '<div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_make_mod_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[52] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_silence_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[161] + '</div></div><div class="arrowchat_chatroom_options_padding"><div id="arrowchat_chatroom_ban_user_' + f.id + '" class="arrowchat_chatroom_flyout_text">' + lang[53] + '</div></div>';
											}
											longname = renderHTMLString(f.n);
											f.n = renderHTMLString(f.n).length > 16 ? renderHTMLString(f.n).substr(0, 16) + "..." : f.n;
											avatar = "";
											if (c_disable_avatars != 1)
												avatar = '<div class="mobile_avatar"><img src="'+f.a+'" /></div>';
											a("#chatroom-users-list").append('<li data-theme="a" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-a arrowchat_chatroom_admin_' + f.t + '"><div class="ui-btn-inner ui-li"><div class="ui-btn-text" id="arrowchat_chatroom_user_' + f.id + '"><a data-transition="slide" href="#" class="ui-link-inherit user-window">' + avatar + '<span class="list_name">' + f.n + '</span></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>');
											uc_avatar[f.id] = f.a;
											if (f.id != u_id) {
												setUserOptions(f, global_admin, global_mod);
											}
										});
									}
								});
								if (c_disable_avatars == 1) {
									a(".arrowchat_chatroom_avatar").addClass("arrowchat_hide_avatars");
									a(".arrowchat_chatroom_message_avatar").addClass("arrowchat_hide_avatars");
								}
							}
						}
					}
				});
				clearTimeout(Crref2);
				Crref2 = setTimeout(function () {
					receiveChatroom(c)
				}, 6E4)
			}
		}
        function DTitChange(name) {
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
				mess = mess.replace(/^\[e-([^\]]+)\]$/g, function(match, contents, offset, s) 
					{
						return '<span class="arrowchat_emoji_text arrowchat_emoji_32"><img src="' + c_ac_path + 'includes/emojis/img/32/' + contents + '.png" alt="" data-id="' + contents + '.png" /> </span>';
					}
				);
				mess = mess.replace(/\[e-(.*?)\]/g, function(match, contents, offset, s) 
					{
						return '<span class="arrowchat_emoji_text"><img src="' + c_ac_path + 'includes/emojis/img/16/' + contents + '.png" alt="" data-id="' + contents + '.png" /> </span>';
					}
				);
				for (i = 0; i < Smiley.length; i++) {
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
        function Oa(b) {
            I(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b], 0)
        }
        function sa(b, c, d) {
            if (uc_name[b] == null || uc_name[b] == "") setTimeout(function () {
                sa(b, c, d)
            }, 500);
            else {
                Oa(b);
                if (c == 0) {
                    a("#arrowchat_userlist_" + b + " .mobile_alert").hide();
                } else {
                    a("#arrowchat_userlist_" + b + " .mobile_alert").show();
                }
                y[b] = c;
            }
        }
        function S() {
            var b = "",
                c = 0;
            for (chatbox in y) if (y.hasOwnProperty(chatbox)) if (y[chatbox] != null) {
                b += chatbox + "|" + y[chatbox] + ",";
                if (y[chatbox] > 0) c = 1
            }
            Ka = c;
            b.slice(0, -1)
        }
        function H() {
			cancelJSONP();
            var url = c_ac_path + "includes/json/receive/receive_core.php?hash=" + u_hash_id + "&init=" + acsi + "&room[]=" + Ccr2;
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
							if (e == "popout") {
								window.close();
							}
                            if (e == "typing") {
                                a.each(l, function (f, h) {
                                    if (h.is_typing == "1") {
                                        receiveTyping(h.typing_id);
                                    } else {
                                        receiveNotTyping(h.typing_id);
                                    }
                                });
                            }
							if (e == "chatroom") {
								var d1 = 0,
									d2 = "";
								a.each(l, function (f, h) {
									if (h.action == 1) {
										a("#arrowchat_chatroom_message_" + h.m + " .arrowchat_chatroom_msg").html(lang[159] + h.n);
									} else {
										if (typeof(blockList[h.userid]) == "undefined") {
											addChatroomMessage(h.id, h.n, h.m, h.userid, h.t, h.global, h.mod, h.admin, h.chatroomid);
										}
										d2 = h;
										d1++;
									}
								});
								showTimeAndTooltip();
								if (typeof d2 != "undefined" && d1 > 0) {
									if (typeof(blockList[d2.userid]) == "undefined") {
										if (d2.userid != u_id) {
											u_chatroom_sound == 1 && Ua();
										}
									}
								}
							}
                            if (e == "messages") {
								var play_sound = 0;
                                a.each(l, function (f, h) {
									receiveMessage(h.id, h.from, h.message, h.sent, h.self, h.old);
									play_sound = 1;
                                });
                                K = 1;
                                d != 1 && u_sounds == 1 && play_sound == 1 && acsi != 1 &&  Ua();
                                D = E;
								showTimeAndTooltip();
                            }
                        });
                    }
                    if ($ != 1 && w != 1) {
                        K++;
                        if (K > 4) {
                            D *= 2;
                            K = 1
                        }
                        if (D > 12E3) D = 12E3
                    }
                    acsi++;
                    window.onblur = function () {
                        window_focus = false
                    };
                    window.onfocus = function () {
                        window_focus = true
                    };
					if (isAway == 1) {
						var CHT = c_heart_beat * 1000 * 3;
					} else {
						var CHT = c_heart_beat * 1000;
					}
					if (c_push_engine != 1) {
						CHA = setTimeout(function () {
							H()
						}, CHT);
					}
                }
            });
        }
        function X(b, c, d, i, e, l, f) {
            aa[b] != 1 && I(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b], 0, 1);
            if (uc_name[b] == null || uc_name[b] == "") setTimeout(function () {
                X(b, c, d, i, e, l, f)
            }, 500);
            else {
				receiveNotTyping(b);
                var h = "",
				arrow = "from";
                if (parseInt(d) == 1) {
                    fromname = u_name;
					fromid = u_id;
                    h = " arrowchat_self";
					arrow = "send";
                } else {
					fromname = uc_name[b];
					fromid = b;
				}
				var full_name = fromid, image_msg = "";
                if (parseInt(l) == 1) c = c.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>").replace(/\"/g, "&quot;");
                c = replaceURLWithHTMLLinks(c);
                c = smileyreplace(c);
                d != 1 && u_sounds == 1 && Ua();
                separator = ":&nbsp;&nbsp;";
				if (c.substr(0, 4) == "<div") {
					image_msg = " arrowchat_image_msg";
				}
                if (a("#arrowchat_message_" + e).length > 0) a("#arrowchat_message_" + e + " .arrowchat_chatboxmessagecontent").html(c);
                else {
                    sentdata = "";
                    if (f != null) sentdata = ha(new Date(f * 1E3));
					if (c_show_full_name != 1) {
						if (fromname.indexOf(" ") != -1) fromname = fromname.slice(0, fromname.indexOf(" "));
					}
                    var o = uc_name[b];
                    if (o.indexOf(" ") != -1) o = o.slice(0, o.indexOf(" "));
                    if (f - B > 180) {
                        a("#arrowchat_user_" + b).append('<div class="arrowchat_ts_wrapper">' + sentdata + '</div><div class="arrowchat_message_wrapper arrowchat_clearfix"><div class="arrowchat_chatboxmessage' + h + image_msg + '" id="arrowchat_message_' + e + '"><div class="arrowchat_chatboxmessagecontent" style="margin-left: 0">' + c + "</div></div></div>");
                        B = f;
                        N = full_name;
                    } else a("#arrowchat_user_" + b).append('<div class="arrowchat_message_wrapper arrowchat_clearfix"><div class="arrowchat_chatboxmessage' + h + image_msg + '" id="arrowchat_message_' + e + '"><div class="arrowchat_chatboxmessagecontent" style="margin-left: 0">' + c + "</div></div></div>");
					scrollOnPage2();
					showTimeAndTooltip();
                }
                j != b && i != 1 && sa(b, 1, 1)
            }
			a("#textinput1").focus();
        }
		function showTimeAndTooltip() {
			a(".arrowchat_lightbox").click(function () {
				a.slimbox(a(this).attr('data-id'), '<a target="_blank" href="'+a(this).attr('data-id')+'">'+lang[70]+'</a>', {resizeDuration:1, overlayFadeDuration:1, imageFadeDuration:1, captionAnimationDuration:1});
			});
		}
        function za(b, c) {
            if (uc_name[b] == null || uc_name[b] == "") setTimeout(function () {
                za(b, c)
            }, 500);
            else {
                a("#arrowchat_user_" + b).append(c);
                G[b] = 1;
            }
        }
        function ya(b) {
            if (uc_name[b] == null || uc_name[b] == "") setTimeout(function () {
                ya(b)
            }, 500);
            else j != b && a("#arrowchat_popout_user_" + b).click()
        }
        function Ua() {
            ion.sound.play("new_message_mobile");
        }
        function I(b, c, d, e, l, f, h) {
            if (!(b == null || b == "")) if (uc_name[b] == null || uc_name[b] == "") if (aa[b] != 1) {
                aa[b] = 1;
                a.ajax({
                    url: c_ac_path + "includes/json/receive/receive_user.php",
                    data: {
                        userid: b
                    },
                    type: "post",
                    cache: false,
                    success: function (o) {
                        if (o) {
                            c = uc_name[b] = o.n;
                            d = uc_status[b] = o.s;
                            e = uc_avatar[b] = o.a;
                            l = uc_link[b] = o.l;
                            aa[b] = 0;
                            if (c != null) {
                                qa(b, c, d, e, l, f, h)
                            } else {
                                a.post(c_ac_path + "includes/json/send/send_settings.php", {
                                    userid: u_id,
                                    unfocus_chat: b
                                }, function () {})
                            }
                        }
                    }
                })
            } else setTimeout(function () {
                I(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b], f, h)
            }, 500);
            else qa(b, uc_name[b], uc_status[b], uc_avatar[b], uc_link[b], f, h)
        }
        function ha(b) {
            var c = "am",
                d = b.getHours(),
                i = b.getMinutes(),
                e = b.getDate();
            b = b.getMonth();
			var g = d;
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
			if (c_us_time != 1) {
				return e != Na ? '<span class="arrowchat_ts">' + l[b] + " " + e + f + ", " + g + ":" + i + "</span>" : '<span class="arrowchat_ts">' + g + ":" + i + "</span>"
			} else {
				return e != Na ? '<span class="arrowchat_ts">' + l[b] + " " + e + f + ", " + d + ":" + i + c + "</span>" : '<span class="arrowchat_ts">' + d + ":" + i + c + "</span>"
			}
        }
        function receiveHistory(b, times) {
			if (times) {} else times = 1;
			if (times > 1) {
				a('<div class="arrowchat_message_history_loading" style="text-align:center;padding:5px 0;"><img src="' + c_ac_path + 'themes/' + u_theme + '/images/img-loading.gif" alt="Loading" /></div>').prependTo(a("#arrowchat_user_" + b));
			} else {
				hideSmileyButton();
				hideGiphyButton();
				a('.chat_user_content').html('<div class="arrowchat_message_history_loading" style="text-align:center;padding:5px 0;"><img src="' + c_ac_path + 'themes/' + u_theme + '/images/img-loading.gif" alt="Loading" /></div>');
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
							a("#arrowchat_user_" + b).html("");
                        B = null;
                        var d = "",
							sender_avatar = "",
							arrow = "",
                            i = uc_name[b],
							unhide_avatars = [];
                        a.each(c, function (e, l) {
                            e == "messages" && a.each(l, function (f, h) {
                                f = "";
								numMessages++;
                                if (h.self == 1) {
                                    fromname = u_name;
									fromid = u_id;
                                    f = " arrowchat_self";
                                    _aa5 = _aa4 = "";
									sender_avatar = '';
									arrow = 'send';
                                } else {
                                    fromname = i;
									fromid = b;
                                    _aa4 = '<a target="_blank" href="' + uc_link[b] + '">';
                                    _aa5 = "</a>";
									if (c_disable_avatars != 1)
										sender_avatar = '<div class="arrowchat_sender_avatar"><img src="' + uc_avatar[b] + '" /></div>';
									arrow = 'from';
                                }
								var full_name = fromid;
								var image_msg = "";
                                var o = new Date(h.sent * 1E3);
								if (c_show_full_name != 1) {
									if (fromname.indexOf(" ") != -1) fromname = fromname.slice(0, fromname.indexOf(" "));
								}
								if (h.message.substr(0, 4) == "<div") {
									image_msg = " arrowchat_image_msg";
								}
								if (a("#arrowchat_message_" + h.id).length > 0) {
									a("#arrowchat_message_" + h.id + " .arrowchat_chatboxmessagecontent").html(h.message);
								} else {
									if (h.sent - B > 180 || B == null) {
										d += '<div class="arrowchat_ts_wrapper">' + ha(o) + '</div><div class="arrowchat_message_wrapper arrowchat_clearfix">'+sender_avatar+'<div class="arrowchat_chatboxmessage' + f + image_msg + '" id="arrowchat_message_' + h.id + '"><div class="arrowchat_chatboxmessagecontent" style="margin-left:0">' + h.message + "</div></div></div>";
										B = h.sent;
										N = full_name;
									} else d += '<div class="arrowchat_message_wrapper arrowchat_clearfix">'+sender_avatar+'<div class="arrowchat_chatboxmessage' + f + image_msg + '" id="arrowchat_message_' + h.id + '"><div class="arrowchat_chatboxmessagecontent" style="margin-left:0">' + h.message + "</div></div></div>"
								}
                            })
                        });
						var current_top_element = a("#arrowchat_user_" + b).children('div').first('div');
                        if (times > 1) {
							a(d).prependTo(a("#arrowchat_user_" + b).first('div'));
						} else {
							a("#arrowchat_user_" + b).html("<div>" + d + "</div>");
						}
						showTimeAndTooltip();
						var previous_height = 0;
						current_top_element.prevAll().each(function() {
						  previous_height += a(this).outerHeight();
						});
						if (times == 1) {
							a('#page2').bind('pageshow',function(){a('html, body').animate({scrollTop: 5E4}, 0)});
							a('html, body').animate({scrollTop: 5E4}, 0);
						} else {
							a('html, body').animate({scrollTop: previous_height}, 0);
						}
						a('body').unbind('touchmove');
						a('body').on('touchmove', function(e) { 
							if (a.mobile.activePage.attr("id") == "page2") {
								scroll_position = a(this).scrollTop();
								if (scroll_position <= 10 && history_ids[b] != 1) {
									history_ids[b] = 1;
									if (numMessages == 20) {
										times++;
										receiveHistory(b, times);
									}
								}
							}
						});
						if (times == 1) {
							a(".arrowchat_chatboxmessagecontent>div>img,.arrowchat_emoji_text>img").one("load", function() {
								a('#page2').bind('pageshow',function(){a('html, body').animate({scrollTop: 5E4}, 0)});
								a('html, body').animate({scrollTop: 5E4}, 0);
							}).each(function() {
								if(this.complete) a(this).load();
							});
						}
                    }
                }
            })
        }
        function ea(atid) {
            a.post(c_ac_path + "includes/json/send/send_typing.php", {
                userid: u_id,
                typing: atid,
                untype: 1
            }, function () {});
            fa = -1
        }
		function chatroomKeyup(b, $element) {
			scrollOnPage3();
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
					a("#chatroom-error-content").html(lang[209]);
					a.mobile.changePage( "#chatroom-error", { transition: "slidedown", changeHash: true });
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
							ion.sound.play("send_mobile");
						},
						error: function () {
						},
						success: function (o) {
							var no_error = true;
							if (o) {
								o && a.each(o, function (i, e) {
									if (i == "error") {
										a.each(e, function (l, f) {
											no_error = false;
											a("#chatroom-error-content").html(f.m);
											a.mobile.changePage( "#chatroom-error", { transition: "slidedown", changeHash: true });
										});
									}
								});
								
								if (no_error) {
									addMessageToChatroom(o, u_name, i);
									scrollOnPage3();
								}
							}
						}
					});
				}
				return false
			}
		}
        function O(b, c, d) {
            clearTimeout(pa);
            pa = setTimeout(function () {
                ea(d)
            }, 5E3);
            if (fa != d) {
                a.post(c_ac_path + "includes/json/send/send_typing.php", {
                    userid: u_id,
                    typing: d
                }, function () {});
                fa = d
            }
            if (b.keyCode == 13 && b.shiftKey == 0) {
                var i = a(c).val();
                i = i.replace(/^\s+|\s+$/g, "");
                a(c).val("");
                a(c).focus();
				if (c_send_priv_msg == 1 && i != "") {
					a.mobile.changePage( "#user-error", { transition: "slidedown", changeHash: true });
					a("#user-error-content").html(lang[209]);
				} else {
					if (i != "") { 
						ion.sound.play("send_mobile");
						a.post(c_ac_path + "includes/json/send/send_message.php", {
							userid: u_id,
							to: d,
							message: i
						}, function (e) {
							if (e) {
								X(d, i, "1", "1", e, 1, Math.floor((new Date).getTime() / 1E3));
								scrollOnPage2();
							}
							K = 1;
							if (D > E) {
								D = E;
								clearTimeout(Y);
								Y = setTimeout(function () {
									H()
								}, E)
							}
						});
					}
				}
                return false
            }
        }
        function Ca(b, c, d) {
			
        }
		function uploadProcessing(chatroom) {
			var ts67 = Math.round(new Date().getTime());
			var path = c_ac_path.replace("../", "/");
			var b1 = "#uploadifive-arrowchat_upload_button",
				b2 = "#arrowchat_upload_button",
				b3 = ".chat_user_content";
			if (chatroom == 1) {
				b1 = "#uploadifive-arrowchat_upload_button2";
				b2 = "#arrowchat_upload_button2";
				b3 = ".chat_room_content";
			}
			if (a(b1).length > 0)
				a(b2).uploadifive('destroy');
			a(b2).uploadifive({
				'uploadScript': path + 'includes/classes/class_uploads.php',
				'buttonText': ' ',
				'buttonClass': 'arrowchat_upload_user_button',
				'removeCompleted' : true,
				'formData': {
					'unixtime': ts67,
					'user': u_id
				},
				'queueID' : 'arrowchat_user_upload_queue',
				'height': 25,
				'width': 24,
				'multi': false,
				'auto': true,
				'fileType': 'image/*',
				'fileSizeLimit' : c_max_upload_size + 'MB',
				'onError': function (file, errorCode, errorMsg, errorString) {
					
				},
				'onCancel': function (file) {
					
				},
				'onUploadComplete': function (file) {
					var uploadType = "file",
						fileType = file.type.toLowerCase();
					if (fileType == "image/jpeg" || fileType == "image/gif" || fileType == "image/jpg" || fileType == "image/png")
						uploadType = "image";
					
					var sendUrl = "includes/json/send/send_message.php";
					var messageID = "arrowchat_message_";
					if (chatroom == 1) {
						sendUrl = "includes/json/send/send_message_chatroom.php";
						messageID = "arrowchat_chatroom_message_";
					}
					
					a.post(c_ac_path + sendUrl, {
						userid: u_id,
						username: u_name,
						chatroomid: Ccr,
						to: j,
						message: uploadType + "{" + ts67 + "}{" + file.name + "}"
					}, function (e) {
						if (a("#" + messageID + e).length) {} else {
							if (uploadType == "image") {
								a(b3).append('<div class="arrowchat_message_wrapper arrowchat_clearfix"><div class="arrowchat_chatboxmessage arrowchat_self" id="' + messageID + e + '"><div class="arrowchat_chatboxmessagecontent" style="margin-left:0"><div class="arrowchat_image_message"><img data-id="' + c_ac_path + 'public/download.php?file=' + ts67 + '" src="' + c_ac_path + 'public/download.php?file=' + ts67 + '_t" alt="Image" class="arrowchat_lightbox"></div></div></div></div>');
								a(".arrowchat_chatboxmessagecontent>div>img,.arrowchat_emoji_text>img").one("load", function() {
									scrollOnPage2();
									scrollOnPage3();
								}).each(function() {
									if(this.complete) a(this).load();
								});
							} else {
								a(b3).append('<div class="arrowchat_message_wrapper arrowchat_clearfix"><div class="arrowchat_chatboxmessage arrowchat_self" id="' + messageID + e + '"><div class="arrowchat_chatboxmessagecontent" style="margin-left:0">' + lang[69] + '<br /><a href="' + c_ac_path + 'public/download.php?file=' + ts67 + '">' + file.name + '</a></div></div></div>');
							}
						}
						if (a(".arrowchat_smiley_button").hasClass('emoji_clicked')) {
							a(".arrowchat_smiley_button").removeClass('emoji_clicked');
							a(".smiley_box_wrapper").hide();
						}
						hideSmileyButton();
						hideGiphyButton();
						a("#page2").css("padding-bottom", a("#page2 .ui-footer").outerHeight() + "px");
						a("#page3").css("padding-bottom", a("#page3 .ui-footer").outerHeight() + "px");
						scrollOnPage2();
						scrollOnPage3();
					});
					uploadProcessing(chatroom);
				}
			});
		}
		function hideSmileyButton() {
			if (a(".arrowchat_smiley_button").hasClass('emoji_clicked')) {
				a(".arrowchat_smiley_button").removeClass('emoji_clicked');
				a(".smiley_box_wrapper").hide();
			}
			if (a(".arrowchat_smiley_button2").hasClass('emoji_clicked')) {
				a(".arrowchat_smiley_button2").removeClass('emoji_clicked');
				a(".smiley_box_wrapper").hide();
			}
		}
		function hideGiphyButton() {
			if (a(".arrowchat_giphy_button").hasClass('giphy_clicked')) {
				a(".arrowchat_giphy_button").removeClass('giphy_clicked');
				a(".arrowchat_giphy_image_wrapper").hide();
				a(".arrowchat_giphy_search_wrapper").hide();
				a("#send_button").show();
				a("#textinput1").show();
			}
			if (a(".arrowchat_giphy_button2").hasClass('giphy_clicked')) {
				a(".arrowchat_giphy_button2").removeClass('giphy_clicked');
				a(".arrowchat_giphy_image_wrapper2").hide();
				a(".arrowchat_giphy_search_wrapper2").hide();
				a("#send_button_chatroom").show();
				a("#textinput2").show();
			}
		}
		function initGiphy(chatroom) {
			var b1 = ".arrowchat_giphy_button",
				b2 = ".arrowchat_giphy_image_wrapper",
				b3 = ".arrowchat_giphy_search_wrapper",
				b4 = ".arrowchat_giphy_search",
				b5 = "#send_button",
				b6 = "#textinput1",
				b7 = ".giphy_cancel",
				selector = 1;
			if (chatroom == 1) {
				b1 = ".arrowchat_giphy_button2";
				b2 = ".arrowchat_giphy_image_wrapper2";
				b3 = ".arrowchat_giphy_search_wrapper2";
				b4 = ".arrowchat_giphy_search2";
				b5 = "#send_button_chatroom";
				b6 = "#textinput2";
				b7 = ".giphy_cancel2";
				selector = 2;
			}
			a(b1).unbind('click');
			a(b1).click(function() {
				if (a(this).hasClass('giphy_clicked')) {
					a(b1).removeClass('giphy_clicked');
					a(b2).hide();
					a(b3).hide();
					a(b5).show();
					a(b6).show();
					a(b6).focus();
				} else {
					hideSmileyButton();
					a(b4).val('');
					a(b1).addClass('giphy_clicked');
					a(b2).show();
					a(b3).show();
					a(b5).hide();
					a(b6).hide();
					a(b4).focus();
					loadGiphy('https://api.giphy.com/v1/gifs/trending?api_key=IOYyr4NK5ldaU&limit=20', selector);
				}
				a("#page2").css("padding-bottom", a("#page2 .ui-footer").outerHeight() + "px");
				a("#page3").css("padding-bottom", a("#page3 .ui-footer").outerHeight() + "px");
				setTimeout(function () {
					a('html, body').animate({scrollTop: 5E4}, 0);
				}, 500);
			});
			a(b4).unbind('keyup');
			a(b4).keyup(function () {
				a(b2).html('<div class="arrowchat_loading_icon"></div>');
				if (a(b4).val() == '')
					loadGiphy('https://api.giphy.com/v1/gifs/trending?api_key=IOYyr4NK5ldaU&limit=20', selector);
				else
					loadGiphy('https://api.giphy.com/v1/gifs/search?api_key=IOYyr4NK5ldaU&limit=20&q=' + a(b4).val(), selector);
			});
			a(b7).click(function() {
				hideGiphyButton();
			});
		}
		function initEmoji(chatroom) {
			var b1 = ".arrowchat_smiley_button",
				b2 = "smiley_box_wrapper2",
				b3 = "#textinput1";
			if (chatroom == 1) {
				b1 = ".arrowchat_smiley_button2";
				b2 = "smiley_box_wrapper3";
				b3 = "#textinput2";
			}
			a(b1).unbind('click');
			a(b1).click(function() {
				if (a(this).hasClass('emoji_clicked')) {
					a(b1).removeClass('emoji_clicked');
					a(".smiley_box_wrapper").hide();
				} else {
					hideGiphyButton();
					a(b1).addClass('emoji_clicked');
					a(".smiley_box_wrapper").show();
					document.getElementById(b2).scrollLeft = 0;
					var emoji_array = ["animals", "food", "activities", "travel", "objects", "symbols", "flags", "custom"];
					if (emoji_loaded != 1 || emoji_loaded_chatroom != 1) {
						a.ajax({
							url: c_ac_path + 'includes/emojis/emoji_smileys.php',
							type: "GET",
							cache: true,
							success: function(html) {
								if (chatroom == 1)
									emoji_loaded_chatroom = 1;
								else
									emoji_loaded = 1;
								a(".smiley_box_wrapper").html('<div class="emoji_box">' + html + '</div>');
								for (index = 0; index < emoji_array.length; ++index) {
									loadEmojis(emoji_array[index], chatroom);
								}
							}
						});
					}
				}
				a("#page2").css("padding-bottom", a("#page2 .ui-footer").outerHeight() + "px");
				a("#page3").css("padding-bottom", a("#page3 .ui-footer").outerHeight() + "px");
				setTimeout(function () {
					a('html, body').animate({scrollTop: 5E4}, 0);
				}, 500);
			});
			a(b3).focus(function() {
				a(b1).removeClass('emoji_clicked');
				a(".smiley_box_wrapper").hide();
				a("#page2").css("padding-bottom", a("#page2 .ui-footer").outerHeight() + "px");
				a("#page3").css("padding-bottom", a("#page3 .ui-footer").outerHeight() + "px");
				setTimeout(function () {
					a('html, body').animate({scrollTop: 5E4}, 0);
				}, 500);
			});
		}
		function loadEmojis(id, chatroom) {
			var b1 = "#textinput1";
			if (chatroom == 1) {
				b1 = "#textinput2";
			}
			a.ajax({
				url: c_ac_path + 'includes/emojis/emoji_' + id + '.php',
				type: "GET",
				cache: true,
				success: function(html) {
					a(".smiley_box_wrapper").append('<div class="emoji_box ' + id + '">' + html + '</div>');
					a(".arrowchat_emoji").unbind('click');
					a(".arrowchat_emoji").click(function () {
						if (a(this).hasClass("arrowchat_emoji_custom"))
							var smiley_code = a(this).children('img').attr("data-id");
						else
							var smiley_code = '[e-' + a(this).children('img').attr("data-id").replace('.png', '') + ']';
						var existing_text = a(b1).val();
						a(b1).val('').val(existing_text + smiley_code);
					});
				}
			});
		}
		function loadGiphy(url, selector) {
			var b1 = ".arrowchat_giphy_image_wrapper";
			if (selector == 2) {
				b1 = ".arrowchat_giphy_image_wrapper2";
			}
			a.ajax({
				url: url,
				type: "get",
				cache: false,
				dataType: "json",
				success: function (results) {
					results && a.each(results, function (i, e) {
						if (i == "data") {
							a(b1).html('');
							var new_width = 0;
							a.each(e, function (l, f) {
								new_width = Math.round((110/(f.images.original.height/f.images.original.width)));
								a(b1).append('<img class="arrowchat_giphy_image" src="' + f.images.original.url + '" alt="" style="height:110px;width:' + new_width + 'px" width="' + new_width + '" />');
							});
							a(".arrowchat_giphy_image").click(function () {
								var giphy_src = a(this).attr('src');
								if (selector == 2) {
									a.post(c_ac_path + "includes/json/send/send_message_chatroom.php", {
										userid: u_id,
										username: u_name,
										chatroomid: Ccr,
										message: "giphy{" + a(this).attr('height') + "}{" + a(this).attr('src') + "}"
									}, function (e) {
										if (a("#arrowchat_chatroom_message_" + e).length) {} else {
											a("#arrowchat_chatroom_chat_content").append('<div class="arrowchat_message_wrapper arrowchat_clearfix"><div class="arrowchat_chatroom_box_message arrowchat_self arrowchat_image_msg" id="arrowchat_chatroom_message_' + e + '"><div class="arrowchat_chatroom_message_content"><div class="arrowchat_giphy_message"><img class="arrowchat_lightbox" data-id="' + giphy_src + '" src="' + giphy_src + '" alt="" style="width:179px"></div></div></div></div>');
										}
										scrollOnPage3();
									});
								} else {
									a.post(c_ac_path + "includes/json/send/send_message.php", {
										userid: u_id,
										to: j,
										username: u_name,
										chatroomid: Ccr,
										message: "giphy{" + a(this).attr('height') + "}{" + a(this).attr('src') + "}"
									}, function (e) {
										if (a("#arrowchat_message_" + e).length) {} else {
											a(".chat_user_content").append('<div class="arrowchat_message_wrapper arrowchat_clearfix"><div class="arrowchat_chatboxmessage arrowchat_self arrowchat_image_msg" id="arrowchat_message_' + e + '"><div class="arrowchat_chatboxmessagecontent" style="margin-left:0"><div class="arrowchat_giphy_message"><img class="arrowchat_lightbox" data-id="' + giphy_src + '" src="' + giphy_src + '" alt="" style="width:179px"></div></div></div></div>');
										}
										scrollOnPage2();
									});
								}
								hideGiphyButton();
								if (selector == 2)
									a("#textinput2").focus();
								else
									a("#textinput1").focus();
							});
						}
					});
				}
			});
		}
        function qa(b, c, d, e, l, f, h) {
			if  (!a("#buddylist-container-recent .ui-li").length) {
				a("#buddylist-container-recent").prepend('<li role="heading" data-role="list-divider" id="recent-list" class="ui-li ui-li-divider ui-btn ui-bar-d ui-btn-up-undefined">' + lang[176] + '</li>');
				if (c_chatrooms == 1 && (a.cookie('ac_show_chatroom') == 1 || typeof(a.cookie('ac_show_chatroom')) == "undefined")) {
					a("#buddylist-container-recent").css("margin-top", "15px");
				}
			}

			if (a("#arrowchat_user_" + b).length > 0) {
			
			} else {
                shortname = renderHTMLString(c).length > 12 ? renderHTMLString(c).substr(0, 12) + "..." : c;
                longname = renderHTMLString(c).length > 25 ? renderHTMLString(c).substr(0, 25) + "..." : c;
				if (c_disable_avatars != 1)
					avatar = '<div class="mobile_avatar"><img src="'+e+'" /></div>';
				if (a("#arrowchat_userlist_" + b).length > 0) {} else {
					a("#buddylist-container-recent").append('<li data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text" id="arrowchat_userlist_' + b + '"><a data-transition="slide" href="#page2" class="ui-link-inherit user-window">' + avatar + '<span class="list_name">'+ longname + '</span><div class="mobile_alert">'+lang[115]+'</div></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>');
				}
                a("#textinput1").keydown(function (h) {
                    return O(h, this, j)
                });
                a("#textinput1").keyup(function (h) {
                    return Ca(h, this, j)
                });
				a("#textinput1").bind('blur', function() {
					scrollOnPage2();
				});
				a("#send_button").unbind('click');
				a("#send_button").click(function () {
					var c = a("#textinput1");
					var i = a(c).val();
					i = i.replace(/^\s+|\s+$/g, "");
					a(c).val("");
					if (c_send_priv_msg == 1 && i != "") {
						a.mobile.changePage( "#user-error", { transition: "slidedown", changeHash: true });
						a("#user-error-content").html(lang[209]);
					} else {
						if (i != "") {
							ion.sound.play("send_mobile");
							a.post(c_ac_path + "includes/json/send/send_message.php", {
								userid: u_id,
								to: j,
								message: i
							}, function (e) {
								if (e) {
									X(j, i, "1", "1", e, 1, Math.floor((new Date).getTime() / 1E3));
									scrollOnPage2();
								}
								K = 1;
								if (D > E) {
									D = E;
									clearTimeout(Y);
									Y = setTimeout(function () {
										H()
									}, E)
								}
							});
						}
					}
					a("#textinput1").focus();
				});
				a("#arrowchat_userlist_" + b).unbind("click");
				a("#arrowchat_userlist_" + b).click(function () {
					a(".chat_user_content").attr("id", "arrowchat_user_" + b);
					if (typeof(uc_name[b]) != "undefined") {
						setPrivateUserOptions(b);
						var status = uc_status[b];
						if (status == "available")
							status = lang[1];
						if (status == "away")
							status = lang[240];
						if (status == "offline")
							status = lang[241];
						if (status == "busy")
							status = lang[216];
						a("#username-header").html('<div id="name-header">' + uc_name[b] + '<span class="arrowchat_username_arrow"> </span></div><div id="status-header">' + status + '</div>');
						a('#page2').bind('pageshow',function(){document.title = uc_name[b]});
					}
					var tba = 0;
                    if (a("#arrowchat_userlist_" + b + " .mobile_alert").is(":visible")) {
                        tba = 1;
                        a("#arrowchat_userlist_" + b + " .mobile_alert").hide();
                        G[b] = 0;
                        y[b] = 0;
                        S()
                    }
					if (j != "") {
						j = ""
					}
					receiveHistory(b);
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						userid: u_id,
						focus_chat: b,
						tab_alert: tba
					}, function () {});
					j = b;
				});
				y[b] = 0;
				G[b] = 0;
			}
			if (f == 1) {
				a(".chat_user_content").attr("id", "arrowchat_user_" + b);
				if (typeof(uc_name[b]) != "undefined") {
					setPrivateUserOptions(b);
					var status = uc_status[b];
					if (status == "available")
						status = lang[1];
					if (status == "away")
						status = lang[240];
					if (status == "offline")
						status = lang[241];
					if (status == "busy")
						status = lang[216];
					a("#username-header").html('<div id="name-header">' + uc_name[b] + '<span class="arrowchat_username_arrow"> </span></div><div id="status-header">' + status + '</div>');
					a('#page2').bind('pageshow',function(){document.title = uc_name[b]});
					document.title = uc_name[b];
				}
				var tba = 0;
				if (a("#arrowchat_userlist_" + b + " .mobile_alert").is(":visible")) {
					tba = 1;
					a("#arrowchat_userlist_" + b + " .mobile_alert").hide();
					G[b] = 0;
					y[b] = 0;
					S()
				}
				if (j != "") {
					j = ""
				}
				receiveHistory(b);
				a.post(c_ac_path + "includes/json/send/send_settings.php", {
					userid: u_id,
					focus_chat: b,
					tab_alert: tba
				}, function () {});
				j = b;
				a.mobile.changePage( "#page2", { transition: "none", changeHash: true });
			}
        }
		function stripslashes(str) {
			str=str.replace(/\\'/g,'\'');
			str=str.replace(/\\"/g,'"');
			str=str.replace(/\\0/g,'\0');
			str=str.replace(/\\\\/g,'\\');
			return str;
		}
		function scrollOnPage2() {
			if (a.mobile.activePage.attr("id") == "page2"){a('html, body').animate({scrollTop: 5E4}, 0);}
		}
		function scrollOnPage3() {
			if (a.mobile.activePage.attr("id") == "page3"){a('html, body').animate({scrollTop: 5E4}, 0);}
		}
		function receiveMessage(id, from, message, sent, self, old) {
			if (j != from) {
				a("#arrowchat_userlist_" + from + " .mobile_alert").show();
				if (a.mobile.activePage.attr("id") != "page1"){a(".back_buttons").html(lang[113] + ' (1)');}
			}
			var c = "",
			sender_avatar = '',
			arrow = '',
			ma = id;
			clearTimeout(dtit3);
			if (j == from && uc_name[from] != "" && uc_name[from] != null) {
				receiveNotTyping(from);
				var container = a('body')[0].scrollHeight - a('body').scrollTop() - 100;
				var container2 = a('body').outerHeight();
				var o = uc_name[from];
				if (uc_status[from] == "offline") {
					P();
				}
				f = "";
				if (self == 1) {
					fromname = u_name;
					fromid = u_id;
					f = " arrowchat_self";
					_aa5 = _aa4 = "";
					sender_avatar = '';
					arrow = 'send';
				} else {
					DTitChange(uc_name[from]);
					fromname = o;
					fromid = from;
					_aa4 = '<a target="_blank" href="' + uc_link[from] + '">';
					_aa5 = "</a>";
					if (c_disable_avatars != 1)
						sender_avatar = '<div class="arrowchat_sender_avatar"><img src="' + uc_avatar[from] + '" /></div>';
					arrow = 'from';
				}
				var full_name = fromid;
				var image_msg = "";
				message = stripslashes(message);
				message = replaceURLWithHTMLLinks(message);
				if (message.substr(0, 4) == "<div") {
					image_msg = " arrowchat_image_msg";
				}
				if (a("#arrowchat_message_" + id).length > 0) {
					a("#arrowchat_message_" + id + " .arrowchat_chatboxmessagecontent").html(message);
				} else {
					o = new Date(sent * 1E3);
					if (c_show_full_name != 1) {
						if (fromname.indexOf(" ") != -1) fromname = fromname.slice(0, fromname.indexOf(" "));
					}
					if (sent - B > 180 || B == null) {
						c += '<div class="arrowchat_ts_wrapper">' + ha(o) + '</div><div class="arrowchat_message_wrapper arrowchat_clearfix">'+sender_avatar+'<div class="arrowchat_chatboxmessage' + f + image_msg + '" id="arrowchat_message_' + id + '"><div class="arrowchat_chatboxmessagecontent" style="margin-left:0">' + message + "</div></div></div>";
						B = sent;
						N = full_name;
					} else {
						c += '<div class="arrowchat_message_wrapper arrowchat_clearfix">'+sender_avatar+'<div class="arrowchat_chatboxmessage' + f + image_msg + '" id="arrowchat_message_' + id + '"><div class="arrowchat_chatboxmessagecontent" style="margin-left:0">' + message + "</div></div></div>";
					}
					za(from, c);
				}
			} else {
				message = stripslashes(message);
				X(from, message, self, old, id, 0, sent);
			}
			if (j != from && self != 1 && old != 1 && acsi != 1 && !a(".arrowchat_message_box").is(":visible")) {
				message = stripslashes(message);
				message = replaceURLWithHTMLLinks(message);
				a(".message_avatar").html('<img src="' + uc_avatar[from] + '" alt="" />');
				a(".message_username").html(uc_name[from]);
				a(".message_msg").html(message);
				clearTimeout(message_timeout);
				a(".arrowchat_message_box").show("slide", { direction: "up"}, 250);
				message_timeout = setTimeout(function () {
					a(".arrowchat_message_box").hide("slide", { direction: "up"}, 250);
				}, 5000);
				a(".arrowchat_message_box").unbind('click');
				a(".arrowchat_message_box").click(function() {
					clearTimeout(message_timeout);
					a(".arrowchat_message_box").hide("slide", { direction: "up"}, 250);
					I(from, uc_name[from], uc_status[from], uc_avatar[from], uc_link[from], 1);
					if (a("#arrowchat_userlist_" + from + " .mobile_alert").length)
						a("#arrowchat_userlist_" + from + " .mobile_alert").hide();
					a(".back_buttons").html(lang[113]);
				});
			}
			if (container <= container2) {
				scrollOnPage2();
				a(".arrowchat_chatboxmessagecontent>div>img,.arrowchat_emoji_text>img").one("load", function() {
					a('#page2').bind('pageshow',function(){a('html, body').animate({scrollTop: 5E4}, 0)});
					a('html, body').animate({scrollTop: 5E4}, 0);
				}).each(function() {
					if(this.complete) a(this).load();
				});
			}
		}
		function receiveTyping(id) {
			var container = a("body")[0].scrollHeight - a("body").scrollTop() - 100;
			var container2 = a("body").outerHeight();
			if (a("#arrowchat_user_" + id).length) {
				a("#arrowchat_user_" + id).append('<div class="arrowchat_message_wrapper arrowchat_clearfix" id="arrowchat_typing_message_' + id + '"><div class="arrowchat_sender_avatar"><img src="' + uc_avatar[id] + '"></div><div class="arrowchat_chatboxmessage"><div class="arrowchat_chatboxmessagecontent" style="margin-left:0"><div class="arrowchat_is_typing arrowchat_is_typing_chat"><div class="arrowchat_typing_bubble"></div><div class="arrowchat_typing_bubble"></div><div class="arrowchat_typing_bubble"></div></div></div></div></div>');
				if (container <= container2) {
					scrollOnPage2();
				}
				clearTimeout(typingTimeout);
				typingTimeout = setTimeout(function () {
					receiveNotTyping(id)
				}, 30000);
			}
		}
		function receiveNotTyping(id) {
			if (a("#arrowchat_user_" + id).length) {
				clearTimeout(typingTimeout);
				if (a("#arrowchat_typing_message_" + id).length) {
					a("#arrowchat_typing_message_" + id).remove();
				}
			}
		}
		function pushSubscribe() {
			if (c_push_engine == 1) {
				push.subscribe({ "channel" : "u"+u_id, "callback" : function(data) { pushReceive(data); } });
			}
		}
		function pushReceive(data) {
			if ("typing" in data) {
				receiveTyping(data.typing.id);
			}
			if ("nottyping" in data) {
				receiveNotTyping(data.nottyping.id);
			}
			if ("messages" in data) {
				receiveMessage(data.messages.id, data.messages.from, data.messages.message, data.messages.sent, data.messages.self, data.messages.old);
				u_sounds == 1 && Ua();
				showTimeAndTooltip();
				K = 1;
				D = E;
			}
			if ("chatroommessage" in data) {
				if (typeof(blockList[data.chatroommessage.userid]) == "undefined")
				{
					addChatroomMessage(data.chatroommessage.id, data.chatroommessage.name, data.chatroommessage.message, data.chatroommessage.userid, data.chatroommessage.sent, data.chatroommessage.global, data.chatroommessage.mod, data.chatroommessage.admin, data.chatroommessage.chatroomid);
					if (data.chatroommessage.userid != u_id) {
						u_chatroom_sound == 1 && Ua();
					}
				}
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
			var container = a('body')[0].scrollHeight - a('body').scrollTop() - 100;
			var container2 = a('body').outerHeight();
			var title = "", l = "", important = "", image_msg = "",
				sender_avatar = "",
				self = "",
				arrow = "";
			if (mod == 1)
				title = lang[137];
			if (admin == 1)
				title = lang[136];
			if (userid == u_id) {
				self = " arrowchat_self";
				arrow = "send";
			} else {
				if (c_disable_avatars != 1)
					sender_avatar = '<div class="arrowchat_sender_avatar"><img src="' + image + '" /></div>';
				arrow = "from";
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
				if (global == 1) {
					a("<div/>").addClass("arrowchat_message_wrapper").addClass("arrowchat_clearfix").html('<div class="arrowchat_chatroom_box_message arrowchat_chatroom_global" id="arrowchat_chatroom_message_' + id + '"><div class="arrowchat_chatroom_message_content arrowchat_global_chatroom_message">' + message + "</div></div>").appendTo($chatroom_chat);
				} else {
					if (image_msg != "" && self == "") {
						a("<div/>").addClass("arrowchat_message_wrapper").addClass("arrowchat_clearfix").html(sender_avatar+'<div class="arrowchat_chatroom_name">' + name + title + '</div><div class="arrowchat_chatroom_box_message' + self + image_msg + '" id="arrowchat_chatroom_message_' + id + '"><div class="arrowchat_chatroom_message_content"><span class="arrowchat_chatroom_msg">' + message + "</span></div></div>").appendTo($chatroom_chat);
					} else {
						a("<div/>").addClass("arrowchat_message_wrapper").addClass("arrowchat_clearfix").html(sender_avatar+'<div class="arrowchat_chatroom_box_message' + self + image_msg + '" id="arrowchat_chatroom_message_' + id + '"><div class="arrowchat_chatroom_message_content"><div class="arrowchat_chatroom_name">' + name + title + '</div><span class="arrowchat_chatroom_msg">' + message + "</span></div></div>").appendTo($chatroom_chat);
					}
				}
				if (Ccr != chatroomid && global != 1) {
					a("#arrowchat_chatroom_" + chatroomid + " .mobile_alert").show();
					if (a.mobile.activePage.attr("id") != "page1"){a(".back_buttons").html(lang[113] + ' (1)');}
				}
			}
			if (container <= container2) {
				a(".arrowchat_chatroom_msg>div>img,.arrowchat_emoji_text>img").one("load", function() {
					a('#page3').bind('pageshow',function(){a('html, body').animate({scrollTop: 5E4}, 0)});
					a('html, body').animate({scrollTop: 5E4}, 0);
				}).each(function() {
					if(this.complete) a(this).load();
				});
				scrollOnPage3();
			}
			showTimeAndTooltip();
		}
		function getSettingsCookies() {
			if (c_chatrooms != 1) {
				a('#chatroom-settings-container').hide();
			}
			if (typeof(a.cookie('ac_show_chatroom')) == "undefined") {
				a.cookie('ac_show_chatroom', 1);
			}
			if (typeof(a.cookie('ac_show_idle')) == "undefined") {
				a.cookie('ac_show_idle', 1);
			}
			if (a.cookie('ac_show_chatroom') == 1) {
				a('#flip-show-chatroom').val('on');
			} else {
				a('#flip-show-chatroom').val('off');
				a('#buddylist-container-chatroom').hide();
				if (a('#buddylist-container-recent .ui-li').length) {
					a('#buddylist-container-recent').css('margin-top', '-15px');
					a('#buddylist-container-available').css('margin-top', '15px');
				} else
					a('#buddylist-container-available').css('margin-top', '-15px');
			}
			if (a.cookie('ac_show_idle') == 1) {
				a('#flip-show-idle').val('on');
			} else {
				a('#flip-show-idle').val('off');
				a('#buddylist-container-away').hide();
			}
			if (a.cookie('ac_hide_mobile') == 1) {
				a('#flip-hide-mobile').val('on');
			} else {
				a('#flip-hide-mobile').val('off');
			}
			a("#flip-show-chatroom").bind("change", function() {
				if (a("#flip-show-chatroom").val() == "on") {
					a.cookie('ac_show_chatroom', 1);
					a('#buddylist-container-chatroom').show();
					if (a('#buddylist-container-recent .ui-li').length)
						a('#buddylist-container-recent').css('margin-top', '15px');
					else
						a('#buddylist-container-available').css('margin-top', '15px');
				} else {
					a.cookie('ac_show_chatroom', 0);
					a('#buddylist-container-chatroom').hide();
					if (a('#buddylist-container-recent .ui-li').length)
						a('#buddylist-container-recent').css('margin-top', '-15px');
					else
						a('#buddylist-container-available').css('margin-top', '-15px');
				}
			});
			a("#flip-show-idle").bind("change", function() {
				if (a("#flip-show-idle").val() == "on") {
					a.cookie('ac_show_idle', 1);
					a('#buddylist-container-away').show();
				} else {
					a.cookie('ac_show_idle', 0);
					a('#buddylist-container-away').hide();
				}
			});
			a("#flip-hide-mobile").bind("change", function() {
				if (a("#flip-hide-mobile").val() == "on") {
					a.cookie('ac_hide_mobile', 1, { path: '/' });
				} else {
					a.cookie('ac_hide_mobile', 0, { path: '/' });
				}
			});
		}
		function settingsButtonClick() {
			u_is_guest == 1 && c_guest_name_change == 1 && u_guest_name == "" && a("#change-name-wrapper").show();
			a("#settings-button").click(function() {
				a.ajax({
					url: c_ac_path + "includes/json/receive/receive_block_list.php",
					type: "get",
					cache: false,
					dataType: "json",
					success: function (b) {
						if (b && b != null) {
							a("#unblock-mobile").html("");
							a("<option/>").attr("value", "0").html(lang[118]).appendTo(a("#unblock-mobile"));
							a.each(b, function (e, l) {
								a.each(l, function (f, h) {
									a("<option/>").attr("value", h.id).html(h.username).appendTo(a("#unblock-mobile"));
								});
							});
						}
					}
				});
			});
			a("#change-name").keydown(function (h) {
				if (h.keyCode == 13) {
					a.mobile.changePage( "#page1", { transition: "none", changeHash: true });
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						chat_name: a(this).val()
					}, function (data) {
						if (data != "1") {
							a.mobile.changePage( "#user-error", { transition: "slidedown", changeHash: true });
							a("#user-error-content").html(data);
						} else {
							a("#change-name-wrapper").hide();
							u_name = a(this).val();
						}
					});
				}
			});
			a('#unblock-mobile').on('change', function() {
				var unblock_chat_user = a("#unblock-mobile").val();
				a.mobile.changePage( "#page1", { transition: "none", changeHash: true });
				a("#unblock-mobile").html("<option>" + lang[118] + "</option>");
				if (unblock_chat_user != "0") {
					a.post(c_ac_path + "includes/json/send/send_settings.php", {
						unblock_chat: unblock_chat_user
					}, function () {
						if (typeof(blockList[unblock_chat_user]) != "undefined") {
							blockList.splice(unblock_chat_user, 1);
						}
						P();
					});
				}
			});
			a(".mobile_search").on('keyup input', function (e) {
				if (typeof(searchxhr) != "undefined") searchxhr.abort();
				a(".arrowchat_search_not_found").remove();
				a("#buddylist-container-chatroom").hide();
				a("#buddylist-container-recent").hide();
				a("#buddylist-container-away").hide();
				a("#buddylist-container-available").hide();
				a("<div/>").attr("class", "arrowchat_search_not_found arrowchat_nofriends").html('<div class="arrowchat_loading_icon"></div>').prependTo("#page1 .ui-content");
				clearTimeout(Z);
				var i = 0,
					c = "",
					d = "",
					f = a(this).val();
				if (f.length < 2) {
					a(".arrowchat_search_not_found").remove();
					if (a.cookie('ac_show_chatroom') == 1) a("#buddylist-container-chatroom").show();
					a("#buddylist-container-recent").show();
					if (a.cookie('ac_show_idle') == 1) a("#buddylist-container-away").show();
					a("#buddylist-container-available").show();
					if (buddylisttest == 2) P();
					buddylisttest = 1;
				} else {
					buddylisttest = 2;
					var avatar = "";
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
										if (c_disable_avatars != 1) {
											if (typeof(uc_avatar[h.id]) != "undefined")
												avatar = '<div class="mobile_avatar"><img src="'+uc_avatar[h.id]+'" /></div>';
											else
												avatar = '<div class="mobile_avatar"><img src="'+h.avatar+'" /></div>';
										}
										c += '<li data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text" id="arrowchat_userlist_' + h.id + '"><a data-transition="slide" href="#page2" class="ui-link-inherit user-window">' + avatar + '<span class="list_name">' +h.name + '</span></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></li>';
										i++;
										uc_name[h.id] = h.name;
										uc_status[h.id] = h.status;
										uc_avatar[h.id] = h.avatar;
										uc_link[h.id] = '#';
									});
								});
								if (i == 0) {
									a(".arrowchat_search_not_found").html(lang[26]);
								} else {
									a(".arrowchat_search_not_found").remove();
									a("#buddylist-container-available").css('margin-top','-15px').show().html(c);
									a('<li role="heading" data-role="list-divider" class="ui-li ui-li-divider ui-btn ui-bar-d ui-btn-up-undefined">'+lang[12]+'</li>').prependTo("#buddylist-container-available");
									a(".user-window").unbind("click");
									a(".user-window").click(function (l) {
										a(".mobile_search").val('');
										if (c_chatrooms == 1 && (a.cookie('ac_show_chatroom') == 1 || typeof(a.cookie('ac_show_chatroom')) == "undefined")) a("#buddylist-container-chatroom").show();
										if (a.cookie('ac_show_idle') == 1 || typeof(a.cookie('ac_show_idle')) == "undefined") a("#buddylist-container-away").show();
										a("#buddylist-container-recent").show();
										P();
										Sa(a(this).parent().attr("id"));
									});
								}
							}
						}
					});
				}
			});
		}
		function renderHTMLString(string) {
			var render = a("<div/>").attr("id", "arrowchat_render").html(string).appendTo('body');
			var new_render = a("#arrowchat_render").html();
			render.remove();
			return new_render;
		}
        var bounce = 0,
            bounce2 = 0,
			buddylisttest = 1,
			searchxhr,
            count = 0,
			message_timeout,
			typingTimeout,
            V = {},
			retain_ccr = 0,
            dtit = document.title,
            dtit2 = 1,
            dtit3, window_focus = true,
            xa = {},
            j = "",
            crou = "",
            $ = 0,
            w = 0,
            bli = 1,
			isAway = 0,
            chatroomreceived = 0,
            W = false,
            Y, Z, crtimeout, E = 3E3,
            Crref2, Ccr = -1,
			Ccr2 = 0,
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
			history_ids = {},
            Aa = new Date,
            Na = Aa.getDate(),
            ab = Math.floor(Aa.getTime() / 1E3),
            acsi = 1,
            Q = 0,
			emoji_loaded = 0,
			emoji_loaded_chatroom = 0,
			premade_smiley = [],
            fa = -1,
            acp = "Powered By ArrowChat",
            pa = 0,
            B, N;
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
        arguments.callee.videoWith = function (b) {
            var win = window.open(c_ac_path + 'video_chat.php?rid=' + b, 'audiovideochat', "status=no,toolbar=no,menubar=no,directories=no,resizable=no,location=no,scrollbars=no,width=650,height=610");
            win.focus();
        };
		function buildMaintenance() {
			var language = lang[58];
			var extraHTML = "";
			if (c_chat_maintenance != 0 || c_db_connection == 1 || c_disable_arrowchat == 1)
				if (c_db_connection == 1)
					language = "We could not connect to the database. Please try again later.";
				else
					language = lang[27];
			else {
				if (c_login_url != "")
					extraHTML = '<div class="arrowchat_login_button_wrapper"><a target="_blank" class="arrowchat_login_button" href="' + c_login_url + '">' + lang[239] + '</a></div>';
			}
			a("body").html('<div style="text-align:center;padding-top:30px;font-size:16px;font-family:\'Open Sans\',Helvetica,Arial,sans-serif">' + language + '</div>' + extraHTML);
		}
		function Xa() {
			a.ajax({					
				url: c_ac_path + "includes/json/receive/receive_init.php",
				cache: false,
				type: "get",
				dataType: "json",
				success: function (b) {}
			});
			if (c_chat_maintenance != 0 || c_db_connection == 1 || u_id == "" || c_disable_arrowchat == 1) {				
				buildMaintenance();
			} else {
				var hash_tag = window.location.hash;
				var hash = false;
				if (hash_tag.search(/#chatwith-/) >= 0) {
					hash = true;
					hash_tag = hash_tag.replace('#chatwith-', '');
				}
				a.mobile.changePage( "#page1", { transition: "none", changeHash: true });
				if (u_id != "") {
					if (c_push_engine == 1) {
						push = PUBNUB.init({
							publish_key   : c_push_publish,
							subscribe_key : c_push_subscribe
						});
					}
					if (c_push_engine == 1) {
						pushSubscribe();
					}
					settingsButtonClick();
					H();
					P();
					if (c_chatrooms == 1) {
						loadChatroomList();
					}
					a("#back-button-chatroom").click(function () {
						clearTimeout(Crref2);
						Ccr2 = Ccr;
						Ccr = 0;
					});
					a("#user-panel").on("panelbeforeclose", function (event, ui) {
						scrollOnPage3();
					});
					var recent_chat = false;
					if (u_chat_open != 0) {
						if (hash) {
							if (hash_tag == u_chat_open) {
								I(u_chat_open, uc_name[u_chat_open], uc_status[u_chat_open], uc_avatar[u_chat_open], uc_link[u_chat_open], 1);
								hash = false;
							} else
								I(u_chat_open, uc_name[u_chat_open], uc_status[u_chat_open], uc_avatar[u_chat_open], uc_link[u_chat_open], "0");
						} else
							I(u_chat_open, uc_name[u_chat_open], uc_status[u_chat_open], uc_avatar[u_chat_open], uc_link[u_chat_open], "0");
						recent_chat = true;
					}
					for (var d = 0; d < unfocus_chat.length; d++) {
						if (typeof(unfocus_chat[d] != "undefined")) {
							if (hash) {
								if (hash_tag == unfocus_chat[d]) {
									I(unfocus_chat[d], uc_name[unfocus_chat[d]], uc_status[unfocus_chat[d]], uc_avatar[unfocus_chat[d]], uc_link[unfocus_chat[d]], 1);
									hash = false;
								} else
									I(unfocus_chat[d], uc_name[unfocus_chat[d]], uc_status[unfocus_chat[d]], uc_avatar[unfocus_chat[d]], uc_link[unfocus_chat[d]], "0");
							} else
								I(unfocus_chat[d], uc_name[unfocus_chat[d]], uc_status[unfocus_chat[d]], uc_avatar[unfocus_chat[d]], uc_link[unfocus_chat[d]], "0");
							recent_chat = true;
						}
					}
					if (recent_chat && !a("#buddylist-container-recent .ui-li").length) {
						a("#buddylist-container-recent").prepend('<li role="heading" data-role="list-divider" id="recent-list" class="ui-li ui-li-divider ui-btn ui-bar-d ui-btn-up-undefined">' + lang[176] + '</li>');
						if (c_chatrooms == 1 && (a.cookie('ac_show_chatroom') == 1 || typeof(a.cookie('ac_show_chatroom')) == "undefined")) {
							a("#buddylist-container-recent").css("margin-top", "15px");
						}
					}
				} else {
					a("#buddylist-container-available").html("<li>"+lang[116]+"</li>");
				}
				getSettingsCookies();
				ion.sound({
					sounds: [
						{
							name: "new_message_mobile"
						},
						{
							name: "send_mobile"
						}
					],
					path: c_ac_path + "themes/" + u_theme + "/sounds/",
					preload: true,
					volume: 1.0
				});
				if (hash) {
					if (a.isNumeric(hash_tag) && hash_tag != u_id) {
						a.mobile.changePage( "#page2", { transition: "none", changeHash: false });
						if (a("#arrowchat_userlist_" + hash_tag).length) {
							a("#arrowchat_userlist_" + hash_tag).click();
						} else {
							I(hash_tag, uc_name[hash_tag], uc_status[hash_tag], uc_avatar[hash_tag], uc_link[hash_tag], 1);
						}
					}
				}
				if (c_chatroom_transfer == 1) {uploadProcessing(1);}else{a("#arrowchat_upload_button2").hide()}
				if (c_file_transfer == 1) {uploadProcessing(0);}else{a("#arrowchat_upload_button").hide()}
				if (c_giphy != 1) {initGiphy(0);}else{a(".arrowchat_giphy_button").hide()}
				if (c_giphy_chatroom != 1) {initGiphy(1);}else{a(".arrowchat_giphy_button2").hide()}
				if (c_disable_smilies != 1) {initEmoji(0);initEmoji(1);}else{a(".arrowchat_smiley_button2").hide();a(".arrowchat_smiley_button").hide()}
			}
		}
        a.ajaxSetup({
            scriptCharset: "utf-8",
            cache: false
        });
        arguments.callee.runarrowchat = function () {
            Xa()
        };
    }
})(jqac);
(jqac);
jqac(document).ready(function () {
    jqac.arrowchat();
    jqac.arrowchat.runarrowchat()
});