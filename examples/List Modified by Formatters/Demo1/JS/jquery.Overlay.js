(function ($) {
    var ctrl = {
        defaults: {
            Class: ""
            , Content: function (Callback) {
                return "Overlay Content";
            }
            , Behaviour: "Popout"
			, HPosition: "Left"
            , VPosition: "Center"
            , OnActivated: function (Control) {
            }
            , BeforeDeactivate: function (Control) {
            }
            , OnDeactivated: function (Control) {
            }
        }
		, Initialize: function (Options) {
		    $(this).unbind("mousedown.OVR").bind("mousedown.OVR", function (mde) {
		        if ($(this).attr("ovr") == "true") {
		            return false;
		        }

		        if (mde.button == 2) return;
		        mde.stopPropagation();
		        var Target = $(this);
		        var Settings = $.extend({}, ctrl.defaults, Options || {});
		        $(this).bind("mouseup.OVR", function (mue) {

		            mue.stopPropagation();
		            $(this).unbind('mouseup.OVR');
		            $.when($(".Overlay").trigger("removeMenu")).done(function () {
		                Target.attr("ovr", true);
		                var Callback = function (Content) {
		                    var Overlay = $("<div>")
                                .attr("class", "Overlay")
                                .addClass(Settings.Class)
                            .bind("click.OVRON", function (mdeon) {
                                mdeon.stopPropagation();
                            });

		                    var Inner = $("<div style=\"position:relative;\">").html(Content);
		                    Overlay.append(Inner);
		                    
		                    var Pos = { x: mde.pageX, y: mde.pageY };
		                    Overlay.appendTo(document.body);

		                    var Coordinates = Target.offset();

		                    if (Settings.Behaviour == "Popout") {

		                        if (Settings.HPosition == "Center") {
		                            Pos.x = (Target.outerWidth() / 2) + Coordinates.left - (Overlay.outerWidth() / 2);
		                        }
		                        else if (Settings.HPosition == "Left") {
		                            Pos.x = Coordinates.left - Overlay.outerWidth();
		                        }
		                        else {
		                            Pos.x = Coordinates.left + Target.outerWidth();
		                        }

		                        if (Settings.VPosition == "Center") {
		                            Pos.y = (Target.outerHeight() / 2) + Coordinates.top - (Overlay.outerHeight() / 2);
		                        }
		                        else if (Settings.VPosition == "Top") {
		                            Pos.y = Coordinates.top - Overlay.outerHeight() - Target.outerHeight();
		                        }
		                        else {
		                            Pos.y = Coordinates.top + Target.outerHeight();
		                        }
		                    }
		                    else {
		                        var Coordinates = Target.offset();
		                        if (Settings.HPosition == "Center") {
		                            Pos.x = (Target.outerWidth() / 2) + Coordinates.left - (Overlay.outerWidth() / 2);
		                        }
		                        else if (Settings.HPosition == "Left") {
		                            Pos.x = Coordinates.left;
		                        }
		                        else {
		                            Pos.x = Target.outerWidth() + Coordinates.left - Overlay.outerWidth();
		                        }

		                        Pos.y = Coordinates.top;
		                        Pos.y += Target.outerHeight() - 1;
		                    }

		                    var Adjustment = Overlay.outerWidth();
		                    if (Pos.x + Adjustment > $(window).width()) {
		                        Pos.x -= Adjustment;
		                        Settings.HPosition = "Left";
		                    }

		                    Adjustment = Overlay.outerHeight();
		                    if (Pos.y + Adjustment > $(window).height()) {
		                        Pos.y -= Adjustment;
		                        Settings.VPosition = "Top";
		                    }

		                    Overlay.addClass(Settings.HPosition + Settings.VPosition).css({ left: Pos.x, top: Pos.y }).fadeIn();

		                    if (Pos.y + Overlay.outerHeight() > $(window).height()) {
		                        $.scrollTo(Overlay, 1000, { margin: true, axis: 'y' });
		                    }

		                    if (Settings.OnActivated) Settings.OnActivated(Target);

		                    Target.unbind("removeOverlay").bind("removeOverlay", function () {
		                        $(document).unbind('click.OVR');
		                        $(top).unbind("mousedown.OVR");
		                        if (Settings.BeforeDeactivate) Settings.BeforeDeactivate(Target);
		                        Overlay.remove();
		                        if (Settings.OnDeactivated) Settings.OnDeactivated(Target);
		                        Target.unbind("removeOverlay");
		                        Target.removeAttr("ovr");
		                    });

		                    setTimeout(function () { // Delay for Mozilla
		                        if (top && top != window) {
		                            $(top).bind("mousedown.OVR", function () {
		                                Target.trigger("removeOverlay");
		                                return false;
		                            });
		                        }
		                        $(document).bind("click.OVR", function () {
		                            Target.trigger("removeOverlay");
		                            return false;
		                        });
		                    }, 0);
		                }
		                Settings.Content(Target, Callback);
		            });
		        });
		    });
		}
    };

    $.fn.Overlay = function (param) {
        if (ctrl[param]) {
            if (typeof (ctrl[param]) == "function") {
                return ctrl[param].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else {
                return ctrl[param];
            }
        }
        else if (typeof param === 'object' || !param) {
            return ctrl.Initialize.apply(this, arguments);
        }
        else {
            $.error('Method ' + param + ' does not exist');
        }
    };

})(jQuery);