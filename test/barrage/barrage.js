/**
 * @description
 * @author duanjun
 * @date
 */

/*jshint browser: true, esversion: 6, vars: true, nomen: true, indent: 4, maxlen: 120, plusplus: true, sloppy: true*/
/*global define: true, require, $ , module, angular, __inline, console, phantom*/
(function () {
    var _requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback) {
            return setTimeout(callback, 17);
        };

    var _cancelAnimationFrame = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function (id) {
            clearTimeout(id);
        };

    var extend = function (target, clone) {
        for (var i in clone) {
            if (clone.hasOwnProperty(i) && clone[i] !== undefined) {
                target[i] = clone[i];
            }
        }
        return target;
    };

    function creatTextCanvas(textNode) {
        textNode = textNode || {};
        var text = textNode.text;
        var font = extend({
            fontStyle: 'normal',
            fontWeight: 'bolder',
            fontLineHeight: 30 * 1.5,
            fontSize: 30,
            fontFamily: 'sans-serif'
        }, textNode);

        var fontValue = [
            font.fontStyle,
            font.fontWeight,
            font.fontSize + 'px',
            font.fontFamily,
        ].join(' ');

        textNode = extend({
            textAlign: 'start',
            textBaseline: 'top',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: '#fff',
            shadowBlur: 2,
            fillStyle: "#fff",
        }, textNode);

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = fontValue;
        canvas.width = context.measureText(text).width;
        canvas.height = font.fontLineHeight;
        context.font = fontValue;
        extend(context, textNode);
        context.fillText(text, 0, 0);
        return canvas;
    }

    function Barrage(options) {
        options = options || {};
        var defaultOptions = {
            'container': 'barrageContainer',
            'rowHeight': 40,
            'bufferSize': 20,
            'speed': 4,
            'textPadding': 20
        };

        this.options = extend(defaultOptions, options);

        this.container = this.options.container.nodeType === 1 ?
            element : document.getElementById(this.options.container);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.textBuffer = []; //缓冲区词,避免耗费过多内存
        this.textTotalCount = 0; // 在屏幕中滚动的词的个数
        this.textRows = [];
    }

    Barrage.prototype = {
        init: function () {
            this.canvas.width = this.container.offsetWidth;
            this.canvas.height = this.container.offsetHeight;
            this.canvas.style.backgroundColor = "transparent";
            this.canvas.style.zIndex = 99999;
            this.textRows = new Array(Math.floor(this.canvas.height / this.options.rowHeight));
            this.animationFrameId = 0;
            this.open();
        },

        step: function () {
            this.clearScreen();
            var rowLength = this.textRows.length;

            function initOffset() {
                var preTextCanvas;
                if (!textCanvas.offset) {
                    textCanvas.offset = {
                        'x': this.canvas.width,
                        'y': i * this.options.rowHeight
                    };
                    //避免多个词重合在一起
                    if (j > 0) {
                        preTextCanvas = textArray[j - 1];
                        var offsetX = preTextCanvas.width + preTextCanvas.offset.x + this.options.textPadding;
                        if (offsetX > textCanvas.offset.x) {
                            textCanvas.offset.x = offsetX;
                        }
                    }
                }
            }
            for (var i = 0; i < rowLength; i++) {
                var textArray = this.textRows[i] || [];
                textArray = textArray.slice(0);
                var textArrayLength = textArray.length;
                for (var j = 0; j < textArrayLength; j++) {
                    var textCanvas = textArray[j];
                    initOffset.call(this, textCanvas);
                    textCanvas.offset.x -= this.options.speed;
                    this.context.drawImage(textCanvas, textCanvas.offset.x, textCanvas.offset.y);
                    if (textCanvas.offset.x < -textCanvas.width) {
                        for (var k = 0; k < this.textRows[i].length; k++) {
                            if (this.textRows[i][k] === textCanvas) {
                                this.textRows[i].splice(k, 1);
                                this.textTotalCount -= 1;
                                this._addText(this.textBuffer.shift());
                            }
                        }
                    }
                }
            }
            var self = this;
            this.animationFrameId = _requestAnimationFrame(function () {
                self.step();
            });
        },

        open: function () {
            this.container.appendChild(this.canvas);
            this.step();
        },

        close: function () {
            this.container.removeChild(this.canvas);
        },

        stop: function () {
            _cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = 0;
            this.canvas.style.display = 'none';
        },

        resume: function () {
            var self = this;
            this.canvas.style.display = 'block';
            if (!this.animationFrameId) {
                this.step();
            }
        },

        clearScreen: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        _addText: function (textNode) {
            if (!textNode) {
                return;
            }
            var rowIndex = Math.floor(Math.random() * this.textRows.length);
            if (!this.textRows[rowIndex]) {
                this.textRows[rowIndex] = [];
            }
            this.textRows[rowIndex].push(creatTextCanvas(textNode));
            this.textTotalCount += 1;
        },

        addText: function (textNode) {
            if (this.textTotalCount >= this.options.bufferSize) {
                this.textBuffer.push(textNode);
            } else {
                this._addText(textNode);
            }
        }
    };

    window.Barrage = Barrage;
})();
