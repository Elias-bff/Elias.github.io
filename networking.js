var http = {
    viewImage:function(link) {
        lines.style.display = "none"
        code.style.display = "none"
        webview.style.display = "block"

        webview.src = link+"?raw=true"

        filehttp.innerText = link+"?raw=true"
        filehttp.ondblclick = function(){
            http.open(link)
        }
    },

    viewFile:function(link) {
        lines.style.display = "block"
        code.style.display = "block"
        webview.style.display = "none"

        filehttp.innerText = "LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING"
        filehttp.classList = "loading loadscroll"

        http.get(link, payload => {
            var lineStack = ""
            
            code.innerText = atob(payload.content)
            
            for (let i = 1; i <= (String(code.innerText).match(/\n/g) || '').length + 1; i++) {
                lineStack += i + "\n"
            }

            lines.innerText = lineStack.trim()

            filehttp.innerText = link
            filehttp.classList = ""
            filehttp.ondblclick = function(){
                http.open(link)
            }
        })
    },

    get:function(link, func) {
        fetch(link).then(http => http.json()).then(json=>{
            func(json)
        })
    },

    open: function(url) {
        var width = Math.floor(window.innerWidth * 0.8)
        var height = Math.floor(window.innerHeight * 0.8)
    
        var handle = window.open(
            url,
            url,
            "width="+width+",height="+height
        )
    
        if (!handle) {
            window.location = url
        }
    },

    explore: function(repo, dir) {
        filehttp.innerText = "LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING"
        filehttp.classList = "loading loadscroll"

        fetch("https://api.github.com/repos/grammyy/"+repo+"/contents" + (dir ? "/"+dir : "")).then(http => {
            if (http.ok) {
                return http.json()
            } else {
                return Promise.reject(http)
            }
            // ↑ checks for http errors ↑
        }).then(json=>{
            if (dir) { dirs.innerHTML = "" }

            for (let i = 0; i < json.length; i++) {
                var type = json[i].type == "dir"
                var cls = (type ? "class='dir'": "")
                // ↑ type ↑

                var folder = "http.explore(\""+repo+"\", \""+json[i].name+"\")"
                var file = exts.includes(json[i].name.split('.').pop().toLowerCase()) ? "http.viewImage(\""+json[i].html_url+"\")" : "http.viewFile(\""+json[i].url+"\")"
                // ↑ type's methods ↑
                
                if (dir) {
                    dirs.insertAdjacentHTML("beforeend","<small "+ cls +" ondblclick='"+ (type ? folder : file) +"'>"+(type ? interface.svgs.folder : "")+"<p>"+json[i].name+"</p>"+"</small>")
                } else {
                    files.insertAdjacentHTML("beforeend","<small "+ cls +" ondblclick='"+ (type ? folder : file) +"'>"+(type ? interface.svgs.folder : "")+"<p>"+json[i].name+"</p>"+"</small>")
                }
            }

            filehttp.innerText = "https://github.com/grammyy/"+ repo + (dir ? ("/" + dir) : "")
            filehttp.classList = ""
            filehttp.ondblclick = function() {
                http.open("https://github.com/grammyy/"+ repo + (dir ? ("/tree/main/" + dir) : ""))
            }
        }).catch(err => {
            filehttp.innerText = err + " : " + "https://github.com/repos/grammyy/"+repo+"/contents" + (dir ? "/"+dir : "")
            filehttp.classList = ""
            // ↑ catches error and puts it in the status bar ↑
        })
    }
}