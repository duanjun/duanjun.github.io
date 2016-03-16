/**
 * @description
 * @author duanjun
 * @date 2015/07/21
 */

/*jslint browser: true, vars: true, nomen: true, indent: 4, maxlen: 120, plusplus: true, sloppy: true*/
/*global define: true, require, $ , angular*/

'use strict';
angular.module('tagcloud', [])
    .constant('uniqueCanvasId', {
        current: 0,
        next: function next() {
            this.current += 1;
            return this.current;
        }
    })
    .directive('tagCloud', function (uniqueCanvasId, $timeout, $interval) {
        return {
            restrict: 'E',
            scope: {
                tags: '=',
                tagClicked: '&'
            },
            template: '<canvas id="{{canvasId}}" style="width:100%">'
                + '<ul class="weighted">'
                + '    <li ng-repeat="tag in tags">'
                + '        <a class="{{tag.font}} {{tag.color}} {{tag.size}}" data-weight="{{tag.value}}" ng-click="tagClicked({tag:tag})">'
                + '            {{tag.text}}'
                + '        </a>'
                + '    </li>'
                + '</ul>'
                + '</canvas>',

            link: function (scope, element) {
                var canvasId = scope.canvasId = 'canvas' + uniqueCanvasId.next(),
                    started = false,
                    starting = false;

                scope.$watch('tags', function () {
                    if (starting && !started) {
                        return;
                    }
                    if (!started) {
                        $timeout(function () {
                            TagCanvas.textFont = 'Impact,"Arial Black",sans-serif';
                            TagCanvas.textColour = '#00f';
                            TagCanvas.textHeight = 25;
                            TagCanvas.outlineColour = '#f60';
                            TagCanvas.outlineThickness = 5;
                            TagCanvas.outlineOffset = 1;
                            TagCanvas.outlineMethod = 'block';
                            TagCanvas.maxSpeed = 0.06;
                            TagCanvas.noTagsMessage = false;
                            TagCanvas.minBrightness = 0.1;
                            TagCanvas.depth = 0.95;
                            TagCanvas.pulsateTo = 0.2;
                            TagCanvas.pulsateTime = 0.75;
                            TagCanvas.minTags = 100;
                            TagCanvas.repeatTags = 2;
                            TagCanvas.decel = 0.9;
                            TagCanvas.reverse = true;
                            TagCanvas.initial = [0.120, -0.060];
                            TagCanvas.hideTags = false;
                            TagCanvas.shadow = '#ccf';
                            TagCanvas.shadowBlur = 3;
                            TagCanvas.wheelZoom = false;
                            TagCanvas.fadeIn = 800;
                            //TagCanvas.radiusX = 1.5;
                            TagCanvas.stretchX = 1.5;
                            try {
                                TagCanvas.Start(canvasId, null, {
                                    textFont: null,
                                    textColour: null,
                                    weight: true
                                });
                            } catch (e) {}
                            started = true;
                        }, 500);
                        starting = true;
                    } else {
                        $timeout(function () {
                            TagCanvas.Update(canvasId);
                        });
                    }
                }, true);

                var canvas = element.find('canvas');
                canvas.css('width', '100%').css('height', '100%');

                function resize() {
                    if (canvas.prop('offsetWidth') && canvas.prop('offsetHeight')) {
                        canvas.attr('width', canvas.prop('offsetWidth'))
                            .attr('height', canvas.prop('offsetHeight'));
                    }
                }
                var resizeInterval = $interval(resize, 500);
                resize();

                scope.$on('$destroy', function () {
                    $interval.cancel(resizeInterval);
                    TagCanvas.Stop(canvasId);
                });
            }
        };
    });
