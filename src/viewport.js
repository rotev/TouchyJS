var Doat_Viewport = function(){
    var _this = this, _name = "Viewport",
        $container, currentSource,
        styleEl = {}, // what is this for?
        testHeight = {
            "portrait": 560,
            "landscape": 340
        },
        minHeight = {
            "portrait": 416,
            "landscape": 250
        },
        Storage,
        STORAGE_HEIGHT_KEY = "viewport-height",
        storedHeight,
        storedHeightTTL = 86400000, // 24h
        shouldRecalculate = false;
    
        this.STORAGE = "storage";
        this.ENV = "env";
        this.DETECTED = "detected";
    
    this.init = function(cfg){
        $container = cfg.$container;
        
        logger = cfg.logger;

        Storage = cfg.Storage;
        
        storedHeight = getStoredHeight() || {};
    };

    this.setHeight = function(data){ 

        // allow disabling setHeight from config.
        if (!Doat.config('setHeight')) {
            return;
        }

        // get current orientation (portrait/landscape)
        var key = getOrientationKey();

        // make sure data is defined, even if empty.
        !data && (data = {});
        
        if (styleEl[key]) {
            _this.hideAddressBar();
            setTimeout(_this.hideAddressBar, 1000);
            data.callback && data.callback();
            return false;
        }
        
        // If we already calculated the height, just set it.
        if (storedHeight[key]){
            setContainerHeight(storedHeight[key], key, _this.STORAGE, data.callback);

        // otherwise, calculate the height and then set it.
        } else {
            // get screen height from ENV
            var fixedHeight = TouchyJS.Env.getScreen().height;
            if (fixedHeight){
                //set height and store
                setContainerHeight(fixedHeight, key, _this.ENV, data.callback);
                _this.hideAddressBar();
                setStoredHeight(key, fixedHeight);
            }
            // calculate it
            else{
                // make it as high as possible and hide the addressbar
                var $testEl = $('<div id="viewportTestElement" style="height: 2000px; width: 100%;">&#160;</div>');
                $container.append($testEl);
                
                _this.hideAddressBar();
                
                // wait for it to hide
                setTimeout(function(){
                    setDelayedHeight(key, data.callback);
                }, 500); // minimum time it takes the browser to move the address bar up and get innerHeight right
            }
        }

        return true;
    };
    
    this.getHeight = function(){
        return {
            "value": $container.height(),
            "source": currentSource
        }
    };
    
    this.hideAddressBar = function(){

        if (window.TouchyJS.config('hideAddressBar')) {
            window.setTimeout(function(){
                window.scrollTo(0, 1);
            }, 0);
        }
    };
    
    this.shouldRecalculate = function(val){
        val && (shouldRecalculate = val);
        
        return shouldRecalculate;
    };
    
    this.getTestHeight = function(key){
        return testHeight[key];
    };
    
    function getOrientationKey(){
        return Doat.Env.getInfo().orientation.name;
    }
    
    function setDelayedHeight(key, cb){
        // make sure it's not below the minimum height (happens if the keyboard is up),
        // and that the address bar has moved.
        var scrollTop = ('scrollTop' in window) ? window.scrollTop : window.scrollY;

        if (window.innerHeight >= minHeight[key] && scrollTop){
            //set height and store
            setContainerHeight(window.innerHeight, key, _this.DETECTED, cb);
            setStoredHeight(key, window.innerHeight);
            _this.hideAddressBar();
        }
        else{
            setTimeout(function(){
                setDelayedHeight(key, cb);
            }, 200);
        }
    }
    
    function setStoredHeight(key, value){
        //storedHeight[key] = value;
        //Storage.set(STORAGE_HEIGHT_KEY, JSON.stringify(storedHeight), storedHeightTTL);
    }
    
    function getStoredHeight(){
        /*var val = null;

        try {
            val = Storage.get(STORAGE_HEIGHT_KEY);
            if (val){
                val = JSON.parse(val);
            }
        } catch(ex) {
            
        }
        
        return val;*/
       return undefined;
    }
    
    function setContainerHeight(height, key, source, cb){
        var style = document.createElement("style");
        style.id = "viewport-"+key;
        var html = "";
        html += ".orientation-"+key+"{min-height:"+height+"px; position: relative; top: auto; left:auto; bottom: auto; right: auto}";
        html += ".orientation-"+key+" #viewportTestElement {display: none}";
        style.innerHTML = html;
        document.getElementsByTagName("head")[0].appendChild(style);
        
        styleEl[key] = true;
        currentSource = source;
        
        var data = {};
        data[key] = { "height": height };
        Doat.Env.setScreen(data);
        
        cb && cb(source);
    }
};
