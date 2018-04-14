$(function(){
    $(document).on("mousedown", function(e) {
        $(".show-table").css({
            "z-index": ""
        });
        $(".bursted-button").removeClass("bursted");
        if ($(".bricks .fancy-button.blocked:not(.odd, .empty)").length == barrier_list.length) {
            $(".bricks").fadeOut();
            // Show the navigate button
            $(".navigations").addClass("showed");
        }
    });
    $(document).on("click", ".navigations .review-barriers", function(e) {
        $(".navigations").removeClass("showed");
        // Show the navigate button
        $(".bricks").fadeIn();
        render();
    });
    $(document).on("click", ".show-table", function(e) {
        if (!$(this).hasClass("showed")) {
            $("body").addClass("table-showed");
            $(this).addClass("showed");
            $(this).html("Hide barriers");

            $(".benefits").addClass("showed");

            $(".benefits").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                $(this).find("table").fadeIn();

            });
        } else {
            $("body").removeClass("table-showed");
            $(this).removeClass("showed");
            $(this).html("Show All Barriers");

            //$(".navigations").removeClass("showed");
            $(".benefits").find("table").fadeOut(400, function() {
                $(".benefits").removeClass("showed");
                $(".benefits").one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                });
            });
        }
    });
    $(document).on("mousedown", ".fancy-button", function(){
        // Hide the popup when click another
        $(".bursted-button").removeClass("bursted bursted-button");
        // Correct size of the text
        fixSizePopup($(this));

        $(this).bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(){
            $(this).removeClass('active');
            $(this).addClass("blocked");
            $(this).find(".button").width($(this).find(".button").width());
            // Hide brick after click
            $(this).find(".barrier").slideUp();
            $(this).find(".button").addClass("transparent");

            $(this).find(".button").addClass("bursted-button");

            $(".show-table").css({
                // "z-index": "-1" Edited by Chandrahas
                "z-index": "999"
            });
        });

        if (!$(this).hasClass("odd") && !$(this).hasClass("blocked")) {
            $(this).addClass("active");
            $(this).find(".button").addClass("bursted");
        }
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
            top: 20
        }
        var originPopup = {
            width: originContainer.width - originContainer.left - originContainer.right,
            height: originContainer.height - originContainer.top - originContainer.bottom
        }

        // Reset the top-left value
        $container.find(".tooltip-content").css({
            top: "",
            left: ""
        });
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
                bottom: newContainer.top + 10,

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
            $tpl += "<td>" + barrier_list[i].barrier + "</td>";
            $tpl += "<td>" + barrier_list[i].solution + "</td>";
            $tpl += "</tr>";
            table.find("tbody").append($tpl);
        }
    };

    function render() {
        $(".bricks").html("");

        var texture = ["brick1", "brick2", "brick3"];
        var mq_lg = window.matchMedia( "(min-width: 768px)" );
        var mq_md = window.matchMedia( "(max-width: 768px)" );
        var mq_sx = window.matchMedia( "(max-width: 480px)" );
        var brickCount = 1;
        var stop = 0;
        if (mq_sx.matches) {
            brickCount = 1;
        } else if (mq_md.matches) {
            brickCount = 2;
            stop = 0;
        } else if (mq_lg.matches) {
            brickCount = 3;
            stop = 1;
        }

        // Add missing bricks
        var missingBricks = calculateMissingPieces(barrier_list.length, brickCount);
        for (var i = 0; i < missingBricks.length; i++) {
            barrier_list.push({
                barrier: null,
                solution: null
            });
        }

        // Add fill-in-gap bricks row
        var rowBricks = fillInGaps(missingBricks.step, barrier_list.length, brickCount);
        var postRowCount = 2;
        var postBricksCount = 0;
        if (rowBricks.additionStep > 2) {
            postBricksCount = postRowCount*(brickCount*2 - 1)/2;
            for (var i = 0; i < postBricksCount; i++) {
                barrier_list.unshift({
                    barrier: null,
                    solution: null
                });
            }
        }
        for (var i = 0; i < rowBricks.length - postBricksCount; i++) {
            barrier_list.push({
                barrier: null,
                solution: null
            });
        }

        for (var i = 0; i < barrier_list.length; i++) {
            var $tpl = $(".tpl-sample").clone();

            if (barrier_list[i].barrier !== null && barrier_list[i].solution !== null) {
                $tpl.find(".barrier").html(barrier_list[i].barrier);
                $tpl.find(".solution").html(barrier_list[i].solution);
                $tpl.removeClass("tpl-sample");
                $tpl.removeClass("blocked");
            } else {
                $tpl.find(".barrier").html("");
                $tpl.find(".solution").html("");
                $tpl.removeClass("tpl-sample");
                $tpl.addClass("empty");
            }

            // Apply style
            var step = brickCount*2 - 1;
            if (i % step == 0 || brickCount == 1) {
                var $tpls = $(".tpl-sample").clone();
                $tpls.removeClass("tpl-sample");
                $tpls.addClass("odd").find(".barrier").html("");

                $(".bricks").append($tpls);
            }

            // Append to container
            $(".bricks").append($tpl);

            if (i % step == stop || brickCount == 1) {
                var $tpls = $(".tpl-sample").clone();
                $tpls.removeClass("tpl-sample");
                $tpls.addClass("odd").find(".barrier").html("");

                $(".bricks").append($tpls);
            }
            $tpl.find(".left-frills").css({
                right: $(window).width()/(brickCount == 1 ? 2 : brickCount)
            });
            $tpl.find(".right-frills").css({
                left: $(window).width()/(brickCount == 1 ? 2 : brickCount)
            });

        }

        // Remove empty brick item
        barrier_list = barrier_list.filter(function(obj) {
            return obj.barrier !== null && obj.solution !== null;
        });

        $(".fancy-button .button").each(function(i, el) {
            var randClass = texture[Math.floor(Math.random()*texture.length)];
            $(el).addClass(randClass);
        });

        // Resize text to fit container
        FontFaceOnload('Raleway-SemiBold', {
            success: function() {
                $(".fancy-button").not(".tpl-sample").not(".odd").each(function(i, el) {
                    reduceFont($(el));
                });
            },
            error: function() {
                $(".fancy-button").not(".tpl-sample").not(".odd").each(function(i, el) {
                    reduceFont($(el));
                });
            },
            timeout: 5000 // in ms. Optional, default is 10 seconds
        });
    }

    function calculateMissingPieces(count, maxCol) {
        var step = 0;
        var actualCount = 0;
        while (actualCount < count) {
            if (step % 2 == 1) {
                actualCount += (maxCol == 1 ? 1 : maxCol);
            } else {
                actualCount += (maxCol == 1 ? 1 : maxCol-1);
            }

            step++;
        }

        return {
            length: actualCount - count,
            step: step
        };
    }

    function fillInGaps(actualStep, count, maxCol) {
        var step = 0;
        var actualCount = count;
        var maxStep = Math.floor($(window).height()/$(".fancy-button").outerHeight());
        while (step < maxStep) {
            if (step >= actualStep) {
                if (step % 2 == 1) {
                    actualCount += (maxCol == 1 ? 1 : maxCol);
                } else {
                    actualCount += (maxCol == 1 ? 1 : maxCol-1);
                }
            }

            step++;
        }

        return {
            length: actualCount - count,
            additionStep: maxStep - actualStep
        }
    }

    function reduceFont($container) {
        var currentTextHeight = $container.find(".barrier").height();
        var containerHeight = $container.height();

        if (currentTextHeight/containerHeight > 0.95) {
            var fontSize = parseFloat($container.find(".barrier").css("font-size").split("px")[0]);
            var lineHeight = parseFloat($container.find(".barrier").css("line-height").split("px")[0]);

            $container.find(".button.tooltip").css({
                "font-size": (fontSize - 0.3) + "px",
                "line-height": (lineHeight - 1)  + "px"
            });
            reduceFont($container);
        } else {
            var currentTextWidth = $container.find(".barrier").width();
            var containerWidth = $container.width();

            if (currentTextWidth/containerWidth <= 1 && currentTextHeight/containerHeight < 0.7) {
                $container.find(".button.tooltip").css({
                    "line-height": ""
                });
            }
            return;
        }
    }


    render();
    renderTable();
    $(window).on("resize", function() {
        $(".show-table.showed").click();
        $(".navigations").removeClass("showed");
        // Show the navigate button
        $(".bricks").show();
        if (!/Mobi/i.test(navigator.userAgent)) {
            render();
        }
    });

});
