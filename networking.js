var http = {
    get:function(link, func) {
        fetch(link).then(http => http.json()).then(json=>{
            func(json)
        })
    }
}