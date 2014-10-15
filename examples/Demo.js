Demo = {
    Loading: function (Option) {
        var LoaderId = "LoadingWrapper";
        if ($("#" + LoaderId).length > 0) {
            $("#" + LoaderId).remove();
        }
        if (Option) {
            var Loader = $("<div>");
            $(Loader).attr("id", LoaderId);
            $(Loader).attr("class", "ui-corner-all LoaddingWrapper");
            $(Loader).append($("<div class=\"Loadding\"></div>"));
            $("body").prepend($(Loader));
        }
    }
    , StartLoading: function () {
        Demo.Loading(true);
    }
    , StopLoading: function () {
        Demo.Loading(false);
    }
    , SetHeightWidth: function () {
        var WinHeight = $(window).height();
        $("div.RemoveHeight").each(function () {
            WinHeight -= $(this).outerHeight(true);
        });
        $("#ChartListContainer").width($("#ListContainer").width() + WinHeight);
    }
}