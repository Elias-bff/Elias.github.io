var interface = {
    repos:null,
    orbits:[],
    alerts:[],
    stack:0,


    init:function(){
        
    },

    alert:function(i){
        var alert = interface.alerts[i]
        var event = alert.onclick ? "style='cursor: pointer' onclick='"+alert.onclick+"'" : ""

        if (alert.image) {
            notifications.children[1].insertAdjacentHTML("afterend","<div "+event+"><img src='"+alert.image+"'><p>"+alert.body+"</p></div><whitespace></whitespace>")
        } else {
            notifications.children[1].insertAdjacentHTML("afterend","<div "+event+"><div style='background-color: hsl("+interface.stack+"deg 100 40)'>"+((i >= 9) ? i + 1 : "0"+(i + 1))+"</div><p>"+alert.body+"</p></div><whitespace></whitespace>")

            interface.stack += 45
        }
    },

    event:function(i){
        var evt = interface.events[i]
        var evt2 = interface.events[i + 1]
        var tmp = [
            "<div onclick='http.open(\"",
            "\")'>",
            "<h4>",
            "</h4><h3>",
            "</h3><p>",
            "</p></div>"
        ]

        news.children[0].insertAdjacentHTML("beforeend",tmp[0]+evt.link+tmp[1]+((evt.images.length > 0) ? "<img src='"+decodeURI(evt.images[Math.randInt(0, evt.images.length - 1)])+"'>" : "")+tmp[2]+evt.creation+tmp[3]+evt.name+tmp[4]+evt.commit+tmp[5])
        if (evt2){
            news.children[1].insertAdjacentHTML("beforeend",tmp[0]+evt2.link+tmp[1]+((evt2.images.length > 0) ? "<img src='"+decodeURI(evt2.images[Math.randInt(0, evt2.images.length - 1)])+"'>" : "")+tmp[2]+evt2.creation+tmp[3]+evt2.name+tmp[4]+evt2.commit+tmp[5])
        }
    }
}

var render = {
    canvas:document.getElementById('context'),
    context:document.getElementById('context').getContext('2d'),
    scale:[1980, 1080],

    // ↑ variables ↑ //

    aspectRatio:function() {
        render.middle = {
            x:solar.offsetLeft + solar.offsetWidth / 2,
            y:solar.offsetTop + solar.offsetHeight / 2
        }

        render.canvas.height = document.body.clientHeight
        render.canvas.width = document.body.clientWidth
    },

    tick:function() {
        render.context.reset()

        render.context.font = "15px Georgia";
        render.context.textAlign = "center"

        for (let i = 0; i < interface.repos.length; i++) {
            let radius = Math.min(interface.repos[i].size - (interface.repos[i].size ^ 40 - 50), 150)
            
            render.context.fillStyle = "#1c130e"
            render.context.arc(render.middle.x + interface.orbits[i][0], render.middle.y + interface.orbits[i][1], radius + 15, 0, 2 * Math.PI);
            render.context.fill()
        }

        for (let i = 0; i < interface.repos.length; i++) { //make into function later, another use case
            let radius = Math.min(interface.repos[i].size - (interface.repos[i].size ^ 40 - 50), 150)
            
            interface.orbits[i] = Math.rotate(0.002 - radius / 100000, 0, 0, interface.orbits[i][0], interface.orbits[i][1])
            
            let distance = Math.hypot(-interface.orbits[i][0], -interface.orbits[i][1])
            
            render.context.beginPath()
            render.context.strokeStyle = "#3e3432"
            render.context.arc(render.middle.x + interface.orbits[i][0], render.middle.y + interface.orbits[i][1], radius, 0, 2 * Math.PI);
            render.context.stroke()

            render.context.beginPath()
            render.context.arc(render.middle.x, render.middle.y, distance, 0, 2 * Math.PI);
            render.context.stroke()

            render.context.fillStyle = "white"
            render.context.fillText(Math.round(interface.orbits[i][0]) + ", " + Math.round(interface.orbits[i][1]), render.middle.x + interface.orbits[i][0], render.middle.y + interface.orbits[i][1])
            render.context.fillText(interface.repos[i].name, render.middle.x + interface.orbits[i][0], render.middle.y + interface.orbits[i][1] + 15)
        }


        window.requestAnimationFrame(render.tick)
    }
}

window.onload = function(){
    render.aspectRatio()

    http.get("https://script.google.com/macros/s/AKfycbwYXzcV_b1Db4hyCcrFZF0PRNho3KBUXkOcEhdpLIKsYeAbj9eEMwSdoSOQgdn27V2g/exec", function(git){
        interface.repos = git
        
        for (let i = 0; i < interface.repos.length; i++) {
            let radius = Math.min(interface.repos[i].size - (interface.repos[i].size ^ 40 - 50), 150)
            
            interface.orbits[i] = [radius * 2, 0]
        }

        render.tick()
    })

    http.get("https://script.google.com/macros/s/AKfycbzAjl6IyaJGFBmIliMVG9_7C_A2TXdfl9We38kzLJKzPmp93_7e-N29D55DUp_xXxl2/exec", function(alerts){
        interface.alerts = alerts

        for (let i = 0; i < alerts.length; i++) {
            if (i <= 6) {
                notifications.children[notifications.childElementCount - 2].remove()
                notifications.children[notifications.childElementCount - 2].remove()
            }

            interface.alert(i)
        }
    
        const style = document.createElement('style');
        
        document.head.appendChild(style);
        style.sheet.insertRule(".loading div { background: grey !important }", 0);

        alerthttp.classList = ""
        alerthttp.innerText = "NOTIFICATIONS - "+alerts.length+" -"
    })

    http.get("https://script.google.com/macros/s/AKfycbwKEO-Os1hQwq9yM2ejzLkHkRyFe2qEJG6kO0pmU9hO5wRkzXH5Inpum1TI4VFFg-xI/exec", function(events){
        interface.events = events

        for (let i = 0; i < events.length; i+=2) {
            interface.event(i)
        }
    })
}

window.onresize = function(){
    render.aspectRatio()
}