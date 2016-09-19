require(['jquery', 'lib/jquery.maskedinput-1.2.2'], function($) {
    'use strict';
    var siteRoot = coreEngine.siteRoot.substring(0, coreEngine.siteRoot.length - 1),
        Engine = {
            base_url: siteRoot + $('aside form').attr('action') + '/',
            search: function() {
                $('aside form').submit(function() {
                    return false;
                });
                $("#byDate").mask("99/9999").keypress(function(e) {
                    if (e.keyCode === 13) {
                        $("#btnByDate").click();
                    }
                    return false;
                });
                $("#btnByDate").click(function() {
                    document.location = Engine.base_url + $("#byDate").val();
                    return false;
                });
            },
            sorting: function() {
                var url = document.location.toString() + '/',
                    recent, page_views, comments_count;
                url = url.replace(Engine.base_url, '');
                url = url.split('/');
                recent = (url[2] !== 'comments_count') && (url[2] !== 'page_views') ? 'active' : '';
                comments_count = (url[2] === 'comments_count') ? 'active' : '';
                page_views = (url[2] === 'page_views') ? 'active' : '';
                $(".sort-link .recent").addClass(recent).click(function() {
                    if (!$(this).is('.active')) {
                        document.location = Engine.base_url + url[0] + '/' + url[1];
                    }
                    return false;
                });
                $(".sort-link .popular").addClass(page_views).click(function() {
                    var month = $('.header-a span.month').text(),
                        year = $('.header-a span.year').text(),
                        date;
                    if ($(this).is('.active')) {
                        return false;
                    }
                    date = new Date('01 ' + month + ' ' + year);
                    date = (date.getMonth() + 1) + "/" + date.getFullYear();
                    document.location = Engine.base_url + date + "/page_views";
                    return false;
                });
                $(".sort-link .comments").addClass(comments_count).click(function() {
                    var month = $('.header-a span.month').text(),
                        year = $('.header-a span.year').text(),
                        date;
                    if ($(this).is('.active')) {
                        return false;
                    }
                    date = new Date('01 ' + month + ' ' + year);
                    date = (date.getMonth() + 1) + "/" + date.getFullYear();
                    document.location = Engine.base_url + date + "/comments_count";
                    return false;
                });
                $(".digest-nav").trigger('mouseleave');
            }
        };
    $(document).ready(function() {
        Engine.search();
        Engine.sorting();
        coreEngine.sortOrder('monthly');
    });
});