$(function(){
    $(document).on("mousedown", function(e) {
        $(".show-table").css({
            "z-index": ""
        });
        $(".bursted-button").removeClass("bursted");
        $(".balloons .fancy-button.blocked").remove();
        if ($(".balloons .fancy-button").length == 0) {
            $(".balloons").fadeOut();
            // Show the navigate button
            $(".navigations").fadeIn();
        }
    });
    $(document).on("click", ".navigations .review-barriers", function(e) {
        $(this).addClass("active");
        $(this).bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(){
            $(this).removeClass('active');
            $(".balloons").html("");
            render();

        });
        $(".navigations").fadeOut();
        // Show the navigate button
        $(".balloons").fadeIn();
    });
    $(document).on("click", ".show-table", function(e) {
        if (!$(this).hasClass("showed")) {
            $("body").addClass("table-showed");
            $(this).addClass("showed");
            $(this).html("Hide benefits");

            $(".benefits").addClass("showed");
            $(".benefits").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                $(this).find("table").fadeIn();

            });
        } else {
            $("body").removeClass("table-showed");
            $(this).removeClass("showed");
            $(this).html("Show All Benefits");

            $(".benefits").find("table").fadeOut(400, function() {
                $(".benefits").removeClass("showed");
                $(".benefits").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                });
            });
        }
    });
    $(document).on("mousedown", ".balloons .fancy-button", function(){
        // Hide the popup when click another
        $(".bursted-button").removeClass("bursted bursted-button");
        // Correct size of the text
        fixSizePopup($(this));

        var mq_sx = window.matchMedia( "(max-width: 480px)" );
        if (mq_sx.matches) {
            $(this)
                .addClass("stop")
                .css({
                    left: ($(window).width() - $(this).width())/2
                });
        } else {
            var buttonPos = {
                left: parseFloat($(this).css("left").split("px")[0]),
                top: parseFloat($(this).css("top").split("px")[0])
            };
            var $shape = $(this).find(".tooltip-shape");
            var pos = $shape.offset();
            if (pos.left < 0) {
                $(this)
                    .addClass("stop")
                    .css({
                        left: buttonPos.left - pos.left
                    });
            }

            if (pos.left + $shape.outerWidth() > $(window).width()) {
                $(this)
                    .addClass("stop")
                    .css({
                        left: buttonPos.left - Math.abs((pos.left + $shape.outerWidth() - $(window).width()))
                    });
            }

            if (pos.top + $shape.outerHeight() > $(window).height()) {
                $(this)
                    .addClass("stop")
                    .css({
                        top: buttonPos.top - Math.abs((pos.top + $shape.outerHeight() - $(window).height()))
                    });
            }

            if (pos.top < 0) {
                $(this)
                    .addClass("stop")
                    .css({
                        top: buttonPos.top - pos.top
                    });
            }
        }

        $(this).bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(){
            $(this).removeClass('active');
            $(this).addClass("blocked");
            $(this).find(".button").width($(this).find(".button").width());
            // Remove the ball
            $(this).find(".left-frills, .right-frills").fadeOut();
            $(this).find(".barrier").fadeOut();
            $(this).find(".ball").addClass("transparent");

            $(this).find(".button").addClass("bursted-button");

            $(".show-table").css({
                // "z-index": "-1"
                "z-index": "999"
            });
        });
        $(this).addClass("active");

        if (!$(this).hasClass("blocked")) {
            $(this).find(".button").addClass("bursted");
        }

        $(".balloons .fancy-button.blocked").remove();
    });
    $(document).on("mouseout", ".fancy-button", function(){
        //$(this).find(".button").removeClass("bursted");
    });

    function fixSizePopup($container) {
        var originContainer = {
            width: 170,
            height: 130,
            bottom: 20,
            left: 20,
            right: 20,
            top: 15
        }
        var originPopup = {
            width: originContainer.width - originContainer.left - originContainer.right,
            height: originContainer.height - originContainer.top - originContainer.bottom
        }

        var newPopupWidth = calculateWidth();

        var newContainer = {};
        newContainer.width = newPopupWidth/(originPopup.width/originContainer.width);
        newContainer.height = newContainer.width*originContainer.height/originContainer.width;
        newContainer.top = newContainer.width*originContainer.top/originContainer.width;
        newContainer.left = newContainer.width*originContainer.left/originContainer.width;


        $container.find(".tooltip-shape").css({
            width: newContainer.width,
            height: newContainer.height,
            left: ($container.width()-newContainer.width)/2
        });
        $container.find(".tooltip-content").css({
            top: newContainer.top,
            left: newContainer.left
        });

        // Set the popup position
        var popupPos = {
           top: $container.find(".tooltip-shape").offset().top
        }

        if (popupPos.top < 0) {
            $container.find(".tooltip-shape").addClass("up-side-down").css({
                top: $container.height()
            });
            $container.find(".tooltip-content").css({
                top: "",
                bottom: newContainer.top + 5,

            });
        }

        function calculateWidth() {
            var currentPopup = {
                width: $container.find(".tooltip-content").outerWidth(),
                height: $container.find(".tooltip-content").outerHeight()
            }
            var desiredHeight = currentPopup.width*originPopup.height/originPopup.width;

            if (desiredHeight < currentPopup.height) {
                $container.find(".tooltip-content").width(currentPopup.width + 10);
                return calculateWidth();
            } else {
                return currentPopup.width;
            }
        }
    };

    function renderTable() {
        var table = $(".benefits table");
        for (var i = 0; i < barrier_list.length; i++) {
            var $tpl = "<tr>";
            //$tpl += "<td>" + barrier_list[i].barrier + "</td>";
            $tpl += "<td>" + barrier_list[i].solution + "</td>";
            $tpl += "</tr>";
            table.find("tbody").append($tpl);
        }
    };

    function render() {
        $(".balloons .fancy-button").remove();

        var movingHeight = $(window).height() - 200;
        var movingWidth = $(window).width() - 200;
        var speed = 5000;
        var mq_lg = window.matchMedia( "(min-width: 768px)" );
        var mq_md = window.matchMedia( "(max-width: 768px)" );
        var mq_sx = window.matchMedia( "(max-width: 480px)" );
        if (mq_sx.matches) {
            movingHeight = $(".balloons").height();
            movingWidth = $(window).width() - 100;
            speed = 5400;
        } else if (mq_md.matches) {

        } else if (mq_lg.matches) {
        }

        for (var i = 0; i < barrier_list.length; i++) {
            var $tpl = $(".tpl-sample").clone();
            $tpl.find(".barrier").html(barrier_list[i].barrier);
            $tpl.find(".solution").html(barrier_list[i].solution);
            $tpl.removeClass("tpl-sample blocked review-barriers");
            $tpl.find("figure").addClass("color"+ (i+1));

            // Append to container
            $(".balloons").append($tpl);
        }

        //randomPos($(".balloons"), randomMargin);
        $(".balloons .fancy-button").movingBubble({
            maxHeight: movingHeight,
            maxWidth: movingWidth,
            minDuration: speed,
            deltaDuration: 10
        })
        .click(function(){
            $(this).movingBubble('stop');
        })
        .hover(function(){
            $(this).movingBubble('stop');
        }, function(){
            if (!$(this).hasClass("blocked") && !$(this).hasClass("active")) {
                $(this).movingBubble('toggle');
            }
        });

        $(".balloons .fancy-button").css("bottom", "auto");

        // Resize text to fit container
        FontFaceOnload('Raleway-SemiBold', {
            success: function() {
                $(".balloons .stage").each(function(i, el) {
                    reduceFont($(el));
                });
            },
            error: function() {
                $(".balloons .stage").each(function(i, el) {
                    reduceFont($(el));
                });
            },
            timeout: 5000 // in ms. Optional, default is 10 seconds
        });
    }

    function randomPos($container, randomMargin) {
        var originHeight = $container.height();

        $container.find(".bubble").each(function(i, el) {
            // Random pos
            $(el).css({
                "margin": randomIntFromInterval(randomMargin.top) + randomIntFromInterval(randomMargin.left) + randomIntFromInterval(randomMargin.bottom) + randomIntFromInterval(randomMargin.right)
            });
        });

        var newHeight = $container.height();

        if (newHeight > originHeight) {
            $container.find(".bubble").each(function(i, el) {
                // Random pos
                $(el).css({
                    "margin": ""
                });
            });
            randomPos($container, randomMargin);
        } else {
            return;
        }
    }

    function reduceFont($container) {
        var currentTextHeight = $container.find(".barrier").height();
        var currentTextWidth = $container.find(".barrier").width();
        var containerHeight = $container.height();
        var containerWidth = $container.width();
        var innerSquareWidth = getGeoVal(containerHeight);

        if (currentTextHeight/containerHeight > 0.95 &&
            !$container.find("figure.ball").hasClass("expanded") &&
            currentTextWidth/containerWidth > 0.95) {
            $container.find("figure.ball").addClass("expanded");
            reduceFont($container);
        } else if (currentTextHeight > innerSquareWidth || currentTextWidth / containerWidth > 0.8) {
            var fontSize = parseFloat($container.find(".barrier").css("font-size").split("px")[0]);
            $container.find(".barrier").css({
                "font-size": (fontSize - 0.2) + "px",
                //"width": (currentTextWidth - 1) + "px"
            });
            reduceFont($container);
            if (fontSize < 10) return;
        } else {
            return;
        }
    }

    function getGeoVal(squareWidth) {
        var radius = squareWidth;
        var innerSquareSide = Math.sqrt(radius * radius * 2);
        var innerSquareWidth = innerSquareSide * 0.5;

        return innerSquareWidth;
    }

    function randomIntFromInterval(value) {
        var min = value[0];
        var max = value[1];
        return Math.floor(Math.random()*(max-min+1)+min) + "px ";
    }

    renderTable();
    render();
    $(window).on("resize", function() {
        $(".show-table.showed").click();
        $(".navigations").hide();
        // Show the navigate button
        $(".balloons").show();
        if (!/Mobi/i.test(navigator.userAgent)) {
            render();
        }
    });

});
