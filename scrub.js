(function($) {
    "use strict";
    var _clamp;
    _clamp = function(val) {
        return Math.min(99, Math.max(0, val));
    };
    function Scrub(el) {
        var startingPercent, background, data;
        this.$el = $(el);
        data = this.$el.data();
        background = this._buildBackground(data.scrubSrc, data.scrubFrames);
        this.$bg = $('<div>', {style: ['height: ' + this.frameCount + '00%', 'position: absolute', 'background-repeat: no-repeat', 'top: 0; left: 0; width: 100%', background].join('; ')});
        this.$el = this.$el.append(this.$bg);
        startingPercent = data.scrubStartingPercent || 0;
        this.percent(startingPercent);
        return this;
    }
    Scrub.prototype._buildBackground = function(src, frames) {
        var urls, sizes, positions;
        if (typeof frames === 'number') {
            frames = [frames];
        } else {
            frames = frames.split(',');
        }
        this.frameCount = 0;
        urls = frames.map(function(count, i) {
            this.frameCount += +count;
            return 'url(' + src.replace('#', i + 1) + ')';
        }, this).join(', ');
        sizes = frames.map(function(count) {
            return '100% ' + (count / this.frameCount * 100) + '%';
        }, this).join(', ');
        positions = (function(_self) {
            var framecount = 0;
            return frames.map(function(count) {
                var container_height, image_height, percent, offset;
                count = +count;
                container_height = 100;
                image_height = (count / this.frameCount * 100);
                percent = (framecount / this.frameCount * 100);
                offset = percent / (container_height - image_height) * 100;
                framecount += count;
                return '0% ' + offset + '%';
            }, _self).join(', ');
        }(this));
        return ['background-image: ' + urls, 'background-size: ' + sizes, 'background-position: ' + positions].join('; ');
    };
    Scrub.prototype._getFrameOffset = function(frame) {
        return -100 * frame / (this.frameCount);
    };
    Scrub.prototype.percent = function percent(p) {
        var frame, offset;
        p = _clamp(p);
        frame = Math.floor(this.frameCount * p / 100);
        offset = this._getFrameOffset(frame);
        this.$bg.css('-webkit-transform', "translateY(" + offset + '%)');
        this.$bg.css('-ms-transform', "translateY(" + offset + '%)');
        this.$bg.css('transform', "translateY(" + offset + '%)');
        return frame;
    };
    $.fn.scrub = function() {
        return new Scrub(this);
    };
}(jQuery));