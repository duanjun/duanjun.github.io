/**
 * @description
 * @author duanjun
 * @date 2015/07/21
 */

/*jslint browser: true, vars: true, nomen: true, indent: 4, maxlen: 120, plusplus: true, sloppy: true*/
/*global define: true, require, $ */
angular.module('myApp', ['tagcloud'])
    .controller('myController', function ($scope, $timeout, $interval) {
        function getRandomByBoundary(min, max) {
            return Math.random() * (max - min) + min;
        }

        /*
         * @param min 随机数范围的开始数字
         * @param max 随机数范围结束数字
         * @param start 要随机的数字的开始数字
         * @param end 要随机的数字的结束数字
         * @param rate 要随机的数字随机概率 [start,end]出现在[min, max]中的概率
         * @return {Number}
         * */
        function getRandomByRate(min, max, start, end, rate) {
            var randomLen = end - start;
            var len = max - min;
            var result;
            if (randomLen / len === rate) {
                result = getRandomByBoundary(min, max);
            } else {
                var increased = (rate * len - randomLen) / (1 - rate);
                // 缩放回原来区间
                result = getRandomByBoundary(min, max + increased);
                if (start <= result && result <= (end + increased)) {
                    result = start + (result - start) * randomLen / (randomLen + increased);
                } else if ((end + increased) <= result && result <= (max + increased)) {
                    result = result - increased;
                }
            }
            return Math.round(result);
        }


        var tags = [
            '25',
            'pingxiang',
            'juyuan',
            'xiaoluling',
            'duanjun',
            'duanxiaoyu',
            'love',
            'beijing',
            'changsha',
            'xiangdong',
            'lashi',
            'xi\'an',
            'huashang',
            'love',
            '26',
            'jiangxi',
            'beidaihe',
            'qinhuangdao',
            'haibian',
            'richu',
            'aiqing',
            'memeda',
            'laopo',
            'laogong',
            'family'
        ];

        var sizeArr = ['small', 'large', 'medium', 'huge'];
        var colorArr = ['red', 'green', 'purple'];
        var fontArr = ['Lucida Console', 'Monaco', 'monospace'];


        $timeout(angular.noop, 2000)
            .then(function () {
                var _tags = [];
                angular.forEach(tags, function (tag) {
                    _tags.push({
                        text: tag,
                        font: fontArr[getRandomByRate(0, 3, 0, 3, 1)],
                        size: sizeArr[getRandomByRate(0, 3, 0, 3, 1)],
                        color: colorArr[getRandomByRate(0, 2, 0, 2, 1)]
                    });
                });
                $scope.tags = _tags;
                //$scope.tags = testTags;
            });

        $scope.tagClicked = function (tag) {};
    });
