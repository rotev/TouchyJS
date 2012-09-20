/* 
 * Copyright 2011 DoAT. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this list of
 *      conditions and the following disclaimer.
 *
 *   2. Redistributions in binary form must reproduce the above copyright notice, this list
 *      of conditions and the following disclaimer in the documentation and/or other materials
 *      provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY Do@ ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of DoAT.
 */

/**
* This class handles resizing, cropping and sprites of scraped images.
* @class
*/
var Doat_Image = function(global_cfg) {

    var me = this,
    	base_config = {
            resizerUrl: 'http://doatresizer.appspot.com/?',
    		url: '',
    		width: 0,
    		height: 0,
    		encoding: 'jpeg',
    		padding: 1,
    		color: '#fff',
            quality: '80',
            ignoreRetina: false // by default, will return a double sized image for retina displays.
    	},
        resizer_keys = ['url', 'width', 'height', 'encoding', 'padding', 'color', 'quality'];

    // initiailize.
    init();

    function init() {

    	$.extend(base_config, global_cfg);
    }

    this.getSource = function(cfg) {

        var config = {};
        $.extend(config, base_config, cfg);

        if (!config.url) {
            alert('Must provide an image URL.');
            return;
        }

        if (!config.width || !config.height) {
            alert('Either image width or image height are not set.');
            return;
        }

        // If retina - double size.
        if (Doat.Env.isRetina() && !config.ignoreRetina) {
            config.width = config.width * 2;
            config.height = config.height * 2;
        }

        // Build source.
        var source = config.resizerUrl,
            key;

        for (var i = 0; i < resizer_keys.length; i++) {
            key = resizer_keys[i];

            // treat an array of urls differently.
            if (key === 'url' && (typeof config[key] === 'object')) {
                for (var j = 0; j < config[key].length; j++) {
                    source += (key + '=' + config[key][j] + '&');
                }
            } else {            
                source += (key + '=' + config[key] + '&');
            }
        }

        return source;
    }

    this.getImageTag = function(cfg) {

        var config = {};
        $.extend(config, base_config, cfg);

        var source = me.getSource(config);
        var size = '';

        if (Doat.Env.isRetina()) {
            size = 'style="width: ' + (config.width / 2) + 'px; height: ' + (config.height / 2) + 'px;"';
        }

        return '<img src="' + source + '" ' + size + '>';
    }

}