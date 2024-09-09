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
    }
}