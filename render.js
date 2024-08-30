var interface = {
    repos:null,
    orbits:[],
    alerts:[],
    stack:0,


    init:function(){
        
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

    http.get("https://api.github.com/users/grammyy/repos", function(git){ //convert to relay for stripped data later
        interface.repos = git
        
        for (let i = 0; i < interface.repos.length; i++) {
            let radius = Math.min(interface.repos[i].size - (interface.repos[i].size ^ 40 - 50), 150)
            
            interface.orbits[i] = [radius * 2, 0]
        }

        render.tick()
    })

    http.get("https://script.google.com/macros/s/AKfycbzAjl6IyaJGFBmIliMVG9_7C_A2TXdfl9We38kzLJKzPmp93_7e-N29D55DUp_xXxl2/exec", function(alerts){
        interface.alerts = alerts
        var stack = 0

        for (let i = 0; i < alerts.length; i++) {
            if (alerts[i].image) {
                notifications.children[1].insertAdjacentHTML("afterend","<div><img src=\""+alerts[i].image+"\"><p>"+alerts[i].body+"</p></div><whitespace></whitespace>")
            } else {
                notifications.children[1].insertAdjacentHTML("afterend","<div><div style=\"background-color: hsl("+stack+"deg 100 40)\">"+((i > 9) ? i + 1 : "0"+(i + 1))+"</div><p>"+alerts[i].body+"</p></div><whitespace></whitespace>")

                stack += 45
            }
        }
    
        alerthttp.classList = ""
        alerthttp.innerText = "NOTIFICATIONS - "+alerts.length+" -"
    })
}

window.onresize = function(){
    render.aspectRatio()
}