var http = {
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

        fetch("https://api.github.com/repos/grammyy/"+repo+"/contents" + (dir ? "/"+dir : "")).then(http => http.json()).then(json=>{
            if (dir) { dirs.innerHTML = "" }

            for (let i = 0; i < json.length; i++) {
                var cls = (json[i].type == "dir" ? "class='dir'": "")
                var folder = "http.explore(\""+repo+"\", \""+json[i].name+"\")"
                var file = ""
                
                if (dir) {
                    dirs.insertAdjacentHTML("beforeend","<small "+ cls +" ondblclick='"+ (json[i].type == "dir" ? folder : file) +"'>"+json[i].name+"</small>")
                } else {
                    files.insertAdjacentHTML("beforeend","<small "+ cls +" ondblclick='"+ (json[i].type == "dir" ? folder : file) +"'>"+json[i].name+"</small>")
                }
            }

            filehttp.innerText = "https://github.com/grammyy/"+ repo + (dir ? ("/" + dir) : "")
            filehttp.classList = ""
            filehttp.ondblclick = function(){
                http.open("https://github.com/grammyy/"+ repo + (dir ? ("/tree/main/" + dir) : ""))
            }
        })
    }
}