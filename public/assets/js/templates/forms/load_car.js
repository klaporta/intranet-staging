/**
 * User: cravelo
 * Date: 9/23/13 1:27 PM
 */

/*jslint browser: true, white: true, plusplus: true */
/*global jQuery*/

jQuery(function($){
	'use strict';

	var Engine = {
		submit: function(){
			$("#submitCar").button();
			$("#resetCar").button();
		},
		organizer: function(){
			$("#organizer_name").autocomplete({
				minLength: 2,
				source: function(request, response) {
					var myResponse = function(json){
						json.push({
							'id': 'custom',
							'value': $('#organizer_name').val()
						});

						response(json);
					};

					coreEngine.getJSON("who/search/qkey/display_name/q/" + base64.encode(request.term), "", myResponse);
				},
				select: function(event, ui){
					if (ui.item.id){
						$("#organizer").val(ui.item.id);
					}
				}
			}).keyup(function(e){
					if (e.keyCode !== 13){
						$("#organizer").val('');
					}
				});
		},
		description: function(){
			$("#event_desc").tinymce({
				// Location of TinyMCE script
				script_url: coreEngine.siteRoot + 'assets/js/lib/tinymce/tiny_mce.js?' + (new Date()).getTime(),
				content_css: coreEngine.siteRoot + "assets/css/screen.css",

				theme : "advanced",
				theme_advanced_buttons1 : "fullscreen,|,bold,italic,underline,strikethrough,forecolor,backcolor,sub,sup",
				theme_advanced_buttons2 : "undo,redo,|,link,unlink,|,spellchecker,|,bullist,numlist,|,outdent,indent",
				theme_advanced_buttons3 : "",
				theme_advanced_toolbar_location : "top",
				theme_advanced_toolbar_align : "center",
				theme_advanced_statusbar_location : "none",
				theme_advanced_resizing : false,

				plugins: "paste,fullscreen,spellchecker",
				paste_strip_class_attributes: "all",
				paste_remove_spans: true,
				paste_postprocess : function(pl, o) {
					// remove extra line breaks
					o.node.innerHTML = o.node.innerHTML.replace(/<p.*>\s*(<br>|&nbsp;)\s*<\/p>/ig, "");
				},

				width: "100%"
			});
		},
		dateTime: function(){
			var allDayClick = function(){
					var $startTime = $("#start_time"),
						$endTime = $("#end_time");

					if (this.checked){
						$startTime.val("12:00 am").attr("disabled", true);
						$endTime.val("11:59 pm").attr("disabled", true);
					}else{
						$startTime.removeAttr("disabled");
						$endTime.removeAttr("disabled");
					}
				},
				$allDayEvent = $("#allDayEvent");

			$.mask.definitions['1'] = '[01]';
			$.mask.definitions['3'] = '[0-3]';
			$.mask.definitions['5'] = '[0-5]';
			$.mask.definitions.p = '[ap]';
			$.mask.definitions.m = '[m]';

			$("#start_date, #end_date").mask("9999-19-39");
			$("#start_time, #end_time").mask("19:59 pm");

			$('#start_date').datepicker({
				onSelect: function(dateText){
					var selectedDate = Date.parse(dateText),
						$endDate = $("#end_date"),
						end_date = Date.parse($endDate.val());

					if (end_date < selectedDate){
						$endDate.val(dateText);
					}
				},
				dateFormat: "yy-mm-dd"
			});

			$('#end_date').datepicker({
				beforeShow: function(){
					return {
						minDate: new Date($("#start_date").val() + ' 03:54:00 GMT-0400')//time is irrelevant
					};
				},
				onSelect: function(dateText){
					var selectedDate = Date.parse(dateText + ' 03:54:00 GMT-0400'),//time is irrelevant
						$startDate = $("#start_date"),
						start_date = Date.parse($startDate.val() + ' 03:54:00 GMT-0400');//time is irrelevant

					if (start_date > selectedDate){
						this.value = $startDate.val();
					}
				},
				dateFormat: "yy-mm-dd"
			});

			$allDayEvent.click(allDayClick);
			if ($allDayEvent.is(':checked')){
				allDayClick.call($allDayEvent.get(0));
			}
		},
		recurrence: function(){
			var $recurrence = $('#recurrence');

			$('#recurrenceTabs').find('div').hide();

			$recurrence.find('li input').click(function(){
				$("div[id^=tabs]").each(function(){
					$(this).hide();
				});

				$("#tabs-" + this.value).show();
			});

			$recurrence.find("li input:checked").click();

			$("#monthly_day, #monthly_1").focus(function(){
				$("#monthly_choice_1").attr("checked", "true");
			});

			$("#monthly_2, #monthly_cardinal, #monthly_weekday").focus(function(){
				$("#monthly_choice_2").attr("checked", "true");
			});

			$("#yearly_month, #yearly_month_day").focus(function(){
				$("#yearly_choice_1").attr("checked", "true");
			});

			$("#yearly_cardinal, #yearly_weekday, #yearly_cardinal_month").focus(function(){
				$("#yearly_choice_2").attr("checked", "true");
			});
		},
		validate: function(){
			var empty = [],//will hold every required text element. (can't be empty)
				$start_date = $("#start_date"),
				$start_time = $("#start_time"),
				$end_time = $("#end_time"),
				start_date, end_date, start_time, end_time, weekly, isEmpty;

			empty.push($("#event_title"));
			empty.push($("#organizer_name"));

			empty.push($start_date);
			empty.push($start_time);
			empty.push($end_time);

			//validate organizer
			if ($("#organizer").val() === ""){
				$.message("You didn't select an Organizer from Who's Who so it won't be linked.",
					'warning');
			}

			//Make sure the end date is not before the start date
			start_date = Date.parse($start_date.val() + ' 03:54:00 GMT-0400');//time is irrelevant
			end_date = Date.parse($("#end_date").val() + ' 03:54:00 GMT-0400');//time is irrelevant
			if (end_date < start_date ){
				$.message("The end date cannot be earlier than the start date, please correct this and try again.",
					'error');
				return false;
			}
			//Make sure the end time is not before the start time
			//the date is irrelevant but necessary to create the date object
			start_time = new Date("November 8, 1985 " + $start_time.val());
			end_time = new Date("November 8, 1985 " + $end_time.val());
			if ((end_time < start_time) && (end_date === start_date)){
				$.message("The end time cannot be earlier than the start time, please correct this and try again.",
					'error');
				return false;
			}

			//Recurrence
			if ($("#recurrence1").is(':checked')){ //daily cannot be empty
				empty.push($("#daily"));
			}else if ($("#recurrence2").is(':checked')){ //make sure at least one week_day is selected
				weekly = false;
				empty.push($("#weekly"));

				$("input[id^=weekly]").each(function(i, item){
					if (item.checked){
						weekly = true;
					}

					return !item.checked;
				});

				if (!weekly){
					$("#tabs-2").find("span").addClass("input_invalid");
					$.message("You selected weekly recurrence but didn't select any weekday. Please select at " +
						"least one weekday to continue.", "error");

					return false;
				}
			}else if($("#recurrence3").is(':checked')){
				if ($("#monthly_choice_1").is(":checked")){
					empty.push($("#monthly_day"));
					empty.push($("#monthly_1"));
				}else{
					empty.push($("#monthly_2"));
				}
			}else if($("#recurrence4").is(':checked')){
				empty.push($("#yearly"));
				if ($("#yearly_choice_1").is(":checked")){
					empty.push($("#yearly_month_day"));
				}
			}

			//validate
			$("form input, form textarea, #tabs-2 span").removeClass("input_invalid");
			isEmpty = false;
			$(empty).each(function(i, item){//check each text field in the array for text or value
				if (!((item.val() !== "") || (item.text() !== ""))){
					item.addClass("input_invalid");
					$.message("Please make sure you fill every required field before your create the event.",
						"error");
					isEmpty = true;
					return false;
				}

				return true;
			});

			return !isEmpty;
		},
		saveClick: function(){
			//validate and submit the form ----------------------------------------------------------------------------
			$("#saveForm, #changeEvent").button().click(function(){
				var events = [], //array to hold all events that need to be created based on recurrence
					event = {},//event object to be constructed with all event columns as in the DB.
					start_time = new Date("November 8, 1985 " + $("#start_time").val()), //the date is irrelevant
					end_time = new Date("November 8, 1985 " + $("#end_time").val()),   //the date is irrelevant
					postData;

				//populate event object
				if ($("#event_id").length > 0){
					event.event_id = $("#event_id").val();
				}
				event.event_title = $("#event_title").val();
				event.where = $("#where option:selected").text();
				event.where_room = $("#where_room").val();
				event.all_day = $("#allDayEvent").is(":checked");
				event.organizer = $("#organizer").val();
				event.organizer_name = $("#organizer_name").val();
				event.event_desc = $("#event_desc").val();
				event.start_date = $("#start_date").val();
				event.end_date = $("#end_date").val() ||  null;
				event.start_time = start_time.getHours() + ":" + start_time.getMinutes() + ":" + start_time.getSeconds();
				event.end_time = end_time.getHours() + ":" + end_time.getMinutes() + ":" + end_time.getSeconds();
				event.rec_serial  = base64.encode($("#recurrenceForm").serialize());
				event.sections = (function(){
					var sections = [],
						getSections = function(){
							var id = $(this).attr("id");

							sections.push(id.substr(1));
						};

					$('#sections').find('li.ui-selected').each(getSections);
					$('ul.sections-other li').each(getSections);

					return sections;
				}());
				if (event.sections.length === 0){
					if (!window.confirm("You haven't selected any calendars or sections to publish your event to. Is this what you want?")){
						return;
					}
				}

				//check which recurrence was selected and create event objects accordingly
				$("#recurrence").find("li input").each(function(){
					var yearly, monthly_day,
						$monthly_1 = $("#monthly_1"),
						$yearly_month = $("#yearly_month"),
						$yearly_month_day = $("#yearly_month_day"),
						$yearly_cardinal_month = $("#yearly_cardinal_month");

					if(this.checked){
						switch (this.value){
							case "0": break; //none
							case "1": //daily
								event.rec_factor = "+" + $("#daily").val() + " days";
								event.rec_rule = null;
								break;
							case "2": //weekly
								event.rec_serial  = base64.encode($("#recurrenceForm").serialize());
								event.rec_factor = "+"+ $("#weekly").val() +" week";
								event.rec_rule = null;
								$("input[id^=weekly]").each(function(i, item){
									if (item.checked){
										event.start_date = "next " + item.name + " "+$("#start_date").val();
										events.push($.extend(true, {}, event));
									}
								});
								event = null;
								break;
							case "3": //monthly
								if ($("#monthly_choice_1").is(":checked")){
									monthly_day = $("#monthly_day").val();

									event.start_date = event.start_date.substring(0, 8) + monthly_day;
									event.rec_factor = "+"+ $monthly_1.val() +" month";
									if (monthly_day === 31){
										$.message("WARNING: Not every month has 31 days, the event will be scheduled on the last day of every "+$monthly_1.val()+" month(s).", 'ui-state-hightlight');
										event.rec_rule = 'last day of %B %Y';
										event.start_date = event.start_date.substring(0, 8) + "01";
									}else{
										if (monthly_day > 28){
											$.message("WARNING: This event will be scheduled monthly every "+$monthly_1.val()+" month(s) on the day specified with the exception of February where it will happen on the last day.", 'ui-state-highlight');
										}
										event.rec_rule = null;
									}
								}else{
									event.rec_rule = $("#monthly_cardinal").find("option:selected").text() + " " +
										$("#monthly_weekday").find("option:selected").text() + " of %B %Y";
									event.rec_factor = '+'+ $("#monthly_2").val() +' month';
									event.start_date = event.start_date.substring(0, 8) + "01";
								}
								break;
							case "4": //yearly
								yearly = $("#yearly").val();
								event.rec_factor = '+'+ yearly +' year';

								if ($("#yearly_choice_1").is(":checked")){
									event.start_date = event.start_date.substring(0, 5) +
										(parseInt($yearly_month.val(), 10) + 1) + "-" + $yearly_month_day.val();
									if (($yearly_month.val() === 2) && ($yearly_month_day.val() > 28)){
										$.message("WARNING: The day you entered is not available every year so " +
											"the event will be scheduled on the last day of February yearly every "+
											yearly +" year(s).", 'ui-state-highlight');
										event.rec_rule = "last day of February %Y";
									}else{
										event.rec_rule = null;
									}
								}else{
									event.start_date = event.start_date.substring(0, 5) +
										$yearly_cardinal_month.val() +"-01";
									event.rec_rule = $("#yearly_cardinal").val() + " " +
										$("#yearly_weekday").val() + " of " +
										$yearly_cardinal_month.find("option:selected").text() + " %Y";
								}
								break;
							default: //treat as 0
						}

						if (event !== null){//event might be null is user didn't select a day of the week.
							events.push(event);
						}
					}

					return !this.checked;
				});//recurrence each

				//validate
				if (Engine.validate()){
					postData  = "events=" + base64.encode(JSON.stringify(events));
					//alert(postData);
					//$(this).attr('disabled', true).find('>span').text('Saving...');
					if (this.id === "saveForm"){
						coreEngine.ajax("calendar/newevent", postData, Engine.callback);
					}else{
						coreEngine.ajax("calendar/saveevent", postData, Engine.callback);
					}
				}

				return false;
			});//save form
		},
		callback: function(results){
			if (results.isError){
				$.message(results.errorStr, 'error');
				$("#recurrence").find("li input").attr('disabled', false).find("> span").text('Try Again');
			}else{
				if (results.data){
					document.location = coreEngine.siteRoot + results.data;
				}else{
					$.message("The server returned an unexpected error. Try again later. If the problem persists " +
						"contact the Helpdesk.", 'error');
				}
			}
		},
		loadRecurrence: function(){
			//	$('#recurrenceForm').
		}


};
	Engine.saveClick();
	//Engine.submit();

});


