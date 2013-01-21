function Doat_Native_Link(){
    var _this = this, config, DEFAULT_KEY = "default", multipleLinkHandler;
    
    this.EXCEPTIONS = {
        "NOT_ENOUGH_ARGUMENTS": new Error("Missing arguments")
    };
    
    this.init = function(cfg) {
        !cfg.env && (cfg.env = Doat && Doat.Env && Doat.Env.getInfo().os.name);
        
        if (!cfg || !cfg.urls || !cfg.env){
            throw _this.EXCEPTIONS.NOT_ENOUGH_ARGUMENTS;
            return false;
        }
        
        config = getRelevantConfig(cfg);
                
        if (config.matched) {
            multipleLinkHandler = _this.getMultipleLinkHandler(config); // change cfg to config. I hope this works :(
            cfg.onMatch && cfg.onMatch.call(_this, config);
        } else {
            cfg.onNoMatch && cfg.onNoMatch.call(_this, config);
        }
        
        return config;
    };
    
    this.open = function(){

        multipleLinkHandler.open(config.urls);

        // if (!(config.urls instanceof Array)) {
        //     location.href = config.urls.url;
        //     return true;
        // }
        // else{
        //     multipleLinkHandler.open(config.urls);
        // }
    };
    
    this.getMultipleLinkHandler = function(cfg){

        if (cfg.hasHost) {
            return new DoATHost(cfg);
        } else {
            // some defaults.
            !cfg.title && (cfg.title = 'Launching '+document.title+' app');
            !cfg.closeButton && (cfg.closeButton = {"text": "Cancel"});
            !cfg.group && (cfg.group = "group");

            return new Dialog(cfg);
        }
    };
    
    function getRelevantConfig(cfg) {
        var envOs= cfg.env, matchedKey, config = { "element": cfg.element, "group": cfg.group };
        
        for (var k in cfg.urls){         
            // Split by ',' if, for example, sent "web,iphone,default"
            var splitP = k.split(',');
            for (var i=0, iLen = splitP.length; i<iLen; i++){
                var os = splitP[i].trim();
                if (os === envOs){
                    matchedKey = k;
                    break;
                }
            }
            if (matchedKey){break;}
        }
        
        // default if not found
        !matchedKey && cfg.urls[DEFAULT_KEY] && (matchedKey = DEFAULT_KEY);
        
        // add params to config
        if (matchedKey) {
            config.urls = cfg.urls[matchedKey];
            config.matched = matchedKey;
        }
        
        return config;
    }
    
    function Dialog(cfg){
        var initialized = false,
            o, a, title = cfg.title,
            group = cfg.group,
            linksContainer,
            styleRules = '#doatOpenWin ul { list-style-type: none; }' +
                            '#doatOpenWin ul li { padding: 6px 0; }' +
                            '#doatOpenWin ul li a { color: #fff; text-decoration: none; font-size: 13px; }' +
                                                    
                                '#alertView{'+
                                        'text-align: center;' +
                                        'width: 250px;' +
                                        'position: absolute;' +                                     
                                        'left: 50%;' +
                                        'margin-left: -135px;' +
                                        'border: 2px solid #fff;' +
                                        'border-radius: 20px;' +
                                        '-moz-border-radius: 20px;' +
                                        '-webkit-border-radius: 20px;' +
                                        'background:  rgba(59, 80, 119, 0.9) ;' +
                                        'box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);' +
                                        '-moz-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);' +
                                        '-webkit-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);' +
                                        'overflow:hidden;' +
                                        'z-index:1000;' +
                                        'padding:10px;' +
                                        'display:none;' +
                                '}'+
                                '#alertView div#shine {' +
                                    'position: absolute;' +
                                    'top: -1474px;' +
                                    'height: 1500px;' +
                                    'width: 1500px;' +
                                    'border-radius: 1500px;' +
                                    '-moz-border-radius: 1500px;' +
                                    '-webkit-border-radius: 1500px;' +
                                    'background: rgb(255, 255, 255);' +
                                    'left: -626px;' +
                                    'background: -webkit-gradient(' +
                                    'linear,' +
                                    'left bottom,' +
                                    'left top,' +
                                    'color-stop(0, rgba(59,81,119, 0.5)),' +
                                    'color-stop(0.06, rgba(255,255,255, 0.5))' +
                                    ');' +
                                    'background:    -moz-linear-gradient(' +
                                    'center bottom,' +
                                    'rgba(59,81,119, 0.5) 0%,' +
                                    'rgba(255,255,255, 0.5) 4%' +
                                    ');' +
                                    'opacity: 1;' +
                                    'filter: alpha(opacity = 05);' +
                                    'z-index: 5;' +
                                '}'+
                                '#alertView h2, #alertView p{'+
                                    'color: white;' +
                                    'margin: 0;' +
                                    'padding: 5px 10px;' +
                                    'font: 12px / 1.1em Helvetica, Arial, sans-serif;' +
                                    'position: relative;' +
                                    'z-index: 20;' +
                                '}'+
                                '#alertView h2{'+
                                    'text-align:center;' +
                                    'font: 18px / 1.1em Helvetica, Arial, sans-serif;' +
                                '}'+
                                '#alertView div.button.white{'+                                 
                                    'background: -webkit-gradient(' +
                                    'linear,' +
                                    'left bottom,' +
                                    'left top,' +
                                    'color-stop(0.13, rgb(62,73,101)),' +
                                    'color-stop(0.43, rgb(62,73,101)),' +
                                    'color-stop(1, rgb(221,222,224))' +
                                    ');' +
                                    'background: -moz-linear-gradient(' +
                                    'center bottom,' +
                                    'rgb(62,73,101) 13%,' +
                                    'rgb(62,73,101) 43%,' +
                                    'rgb(221,222,224) 100%' +
                                    ');' +               
                                '}'+
                                '#alertView div.button{'+
                                    'margin: 0 auto 6px;' +
                                    'display: block;' +
                                    'background: rgb(69, 90, 129);' +
                                    'border: 1px solid rgb(59, 80, 119);' +
                                    'border: 1px solid rgba(59, 80, 119, 1);' +
                                    'border-radius: 5px;' +
                                    '-moz-border-radius: 5px;' +
                                    '-webkit-border-radius: 5px;' +
                                    'background: -webkit-gradient(' +
                                    'linear,' +
                                    'left bottom,' +
                                    'left top,' +
                                    'color-stop(0.13, rgb(62,73,101)),' +
                                    'color-stop(0.43, rgb(62,73,101)),' +
                                    'color-stop(1, rgb(221,222,224))' +
                                    ');' +
                                    'background: -moz-linear-gradient(' +
                                    'center bottom,' +
                                    'rgb(62,73,101) 13%,' +
                                    'rgb(62,73,101) 43%,' +
                                    'rgb(221,222,224) 100%' +
                                    ');' +               
                                '}'+
                                '#alertView div.button p{'+
                                    'text-align: center;' +
                                    'margin: 0;' +
                                    'padding: 0;' +
                                '}'+
                                '#alertView div.button p a{' +
                                    'color: #333333;' +
                                    'color: rgba(255, 255, 255, 1);' +
                                    'text-decoration: none;' +
                                    'font: bold 14px/1.2em Helvetica, Arial, sans-serif;' +
                                    'margin: 0;' +
                                    'display: block;' +
                                    'padding: 7px 0 10px;' +
                                    'text-shadow: 0 1px 1px #5E5E5E;' +
                                    'border-radius: 5px;' +
                                    '-moz-border-radius: 5px;' +
                                    '-webkit-border-radius: 5px;' +
                                '}'+
                                 
                                '#alertView div.button p a:active {'+
                                    '-moz-box-shadow: 0 0 15px white;' +
                                    '-webkit-box-shadow: 0 0 15px white;' +
                                '}';

        // extend configuration.
        // var myConfig = {};
        // myConfig = $.extend(true, myConfig, config, cfg); // extend the global configuration with the cfg received now.
        // $.extend is not working as expected.
        var myConfig = {
            'urls': cfg.urls ? cfg.urls : config.urls
        }

        function getAvailableUrlTypes(cfg) {

            var types = [],
                urls = cfg.urls;

            if (urls.hasOwnProperty('native')) types.push('native');
            if (urls.hasOwnProperty('fallback')) types.push('fallback');

            // Arrays aren't supported in this version of NativeLink.
            // if (urls instanceof Array) {
            //     for (var i = 0; i < urls.length; i++) {
            //         types.push(i);
            //     }
            // }

            return types;
        }

        
        this.open = function(){
            if (localStorage.getItem(group) !== null) {
                var urlType = localStorage.getItem(group),
                    url = myConfig.urls[urlType].url;

                location.href = url;
                return;
            }
            !initialized && init();
                      
            // instead of looping through an array of links and creating a button for each one,
            // we'll assume we have exactly two possible links: native and fallback.
            getAvailableUrlTypes(myConfig).forEach(function(type) {
                
                var config = myConfig.urls[type],
                    b = new Button(),
                    el = b.init(config);

                el.addEventListener("click", function(){
                    a.style.display = "none";
                }, false);

                if (config.remember){
                    el.addEventListener("click", function(){
                        localStorage.setItem(group, type);
                    }, false);
                }
                
                linksContainer.appendChild(el);
            });

            // The old code is here for legacy:
            // myConfig.urls.forEach(function(config){
            //     var b = new Button();
                
            //     var el = b.init(config);
            //     el.addEventListener("click", function(){
            //         a.style.display = "none";
            //     }, false);
            //     if (config.remember){
            //         el.addEventListener("click", function(){
            //             localStorage.setItem(group, config['type']);
            //         }, false);
            //     }
                
            //     linksContainer.appendChild(el);
            // });
            
            a.style.display = 'block';
            a.style.top = document.body.scrollTop + 40 + 'px';
        };
        
        function init(){
            create('style',"head", {'innerHTML': styleRules});
            render();
        }
        
        function render(){
            o = create("div", document.body, {
                "id": "doatOpenWin"
            });
            a = create("div", o, {
                "id": "alertView"
            });
            create("h2", a, {
                "innerHTML": '<h2>'+title+'</h2>'
            });
            linksContainer = create("div", a, {
                "class": "links"
            });
            create("div", a, {
                "class": "button",
                "id": "cancelButton",
                "innerHTML": "<p><a href='javascript://'>"+cfg.closeButton.text+"</a></p>"
            }).addEventListener('click', function(){
                a.style.display = 'none';
                cfg.closeButton.callback && cfg.closeButton.callback(); 
            }, false);
            
            create("div", a, {
                "id": "shine"
            });
        }
        
        function Button(){
            var _this = this, el;
            
            this.init = function(config){
                var el = create("div", null, {
                    "class": "button",
                    "innerHTML": '<p><a href="' + config.url + '" ' + ((config.newWindow) ? 'target="_blank"' : '') + '>' + config.label + '</a></p>'
                });
                
                return el;
            };
        }
    }
    
    function DoATHost(){
        this.open = function(){
            var url = 'doatJS://OpenLink';
            
            config.forEach(function(config){
                url += '/'+_escape(config.url);
            });
            alert(url);
            location.href = url;
        };
        
        function _escape(url){
            return encodeURIComponent(encodeURIComponent(url));
        }
    }
    
    /*
     * create
     */
    var create = function(tagName, parent, props, fn, adjacentNode) {
        (parent === "head") && (parent = document.getElementsByTagName("head")[0]);
        var doc = parent ? parent.ownerDocument : document,
            o = doc.createElement(tagName);
            
        if (props) for (var p in props) {
            if (p == 'style') {
                var styles = props[p];
                for (var s in styles) o.style.setProperty(s, styles[s], "");
            } else if (p === 'innerHTML'){
                o[p] = props[p];
            } else o.setAttribute(p, props[p]);
        }
        fn && (o.onload = fn);
        parent && parent.insertBefore(o, adjacentNode);
        return o;
    };
}