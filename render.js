const exts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"]
// ↑ supported image types for file explorer ↑ //

var interface = {
    repos: null,
    orbits: [],
    systems: [],
    alerts: [],
    stack: 0,
    offset: {x: 0, y: 0},
    scale: 1,
    rotate: 0,
    focus: null,
    
    // ↑ variables ↑ //

    svgs:{
        folder: "<svg viewBox='0 0 450 450' width='10' height='10'><g transform='translate(0, 0)'><path stroke='currentcolor' fill='currentcolor' d='M490.667,74.667H205.184L189.76,43.797C186.133,36.565,178.752,32,170.667,32H21.333C9.536,32,0,41.536,0,53.333v405.333 C0,470.464,9.536,480,21.333,480h469.333c11.797,0,21.333-9.536,21.333-21.333V181.333V96 C512,84.203,502.464,74.667,490.667,74.667z M469.333,160H247.851l-21.333-42.667h242.816V160z'/></path></g></svg>"
    },

    // ↑ templates ↑ //

    zoom:function(mouse) {
        if (mouse.target === render.canvases.main) {
            interface.scale = interface.scale - (interface.scale * mouse.deltaY / 1000)
            interface.scale = Math.max(0.001, interface.scale)
        }
    
        interface.offset = {
            x: interface.offset.x + (Math.norm(mouse.deltaY) * (-interface.offset.x / 9.8)),
            y: interface.offset.y + (Math.norm(mouse.deltaY) * (-interface.offset.y / 9.8))
        }

        if (!interface.focus && interface.scale >= 0.5) { //todo: make this a option
            render.closestSun(sun => {
                interface.focus = sun
            }, 250)
        }
    },

    randFocus:function() {
        var suns = Object.keys(interface.systems)
        var sun = suns[Math.floor(Math.random() * suns.length)]
        
        interface.focus = interface.systems[sun]
    },

    click:function(e) {
        Object.keys(interface.systems).forEach(sunKey => {
            const system = interface.systems[sunKey]
            const planets = system.planets
    
            planets.forEach(planet => {
                const planetX = render.middle.x + planet.x * interface.scale + interface.offset.x + system.x * interface.scale
                const planetY = render.middle.y + planet.y * interface.scale + interface.offset.y + system.y * interface.scale
                const planetRadius = (planet.size / 2) * interface.scale
                // ↑ calculate radius based on scale ↑
    
                if (Math.hypot(e.x - planetX, e.y - planetY) <= planetRadius) {
                    interface.focus = planet
                }
            })
        })

        if (interface.focus) {
            middle.children[0].innerText = interface.focus.name
        }
        //todo: add system clicking
    },

    assemble:function(repos) {
        var minPlanetSize = 50
    
        repos.forEach(repo => {
            var language = repo.language || "Other"
            var size =  Math.min(repo.size - (repo.size ^ 40 - 50), 150)
    
            if (!interface.systems[language]) {
                interface.systems[language] = {
                    sun: language,
                    planets: [],
                    moons: [],
                    x: Math.randInt(-10000, 10000),
                    y: Math.randInt(-10000, 10000)
                }
            }

            if (size >= minPlanetSize) {
                interface.systems[language].planets.push({
                    name: repo.name,
                    size: size,
                    x: Math.randInt(-200, 200),
                    y: Math.randInt(-200, 200),
                    sun: interface.systems[language]
                })
            } else {
                interface.systems[language].moons.push(repo)
            }
        })
    
        Object.keys(interface.systems).forEach(language => {
            var system = interface.systems[language]
    
            system.moons.forEach(moon => {
                var ranIndex = Math.floor(Math.random() * system.planets.length)
                var ranPlanet = system.planets[ranIndex]
                
                if (!ranPlanet.moons) {
                    ranPlanet.moons = []
                }
                
                moon.x = Math.randInt(-200, 200)
                moon.y = Math.randInt(-200, 200)
                moon.planet = ranPlanet
            })
        })
    },

    alert:function(i) {
        var alert = interface.alerts[i]
        var event = alert.onclick ? "style='cursor: pointer' onclick='"+alert.onclick+"'" : ""

        if (alert.image) {
            notifications.children[1].insertAdjacentHTML("afterend","<div "+event+"><img src='"+alert.image+"'><p>"+alert.body+"</p></div><whitespace></whitespace>")
        } else {
            notifications.children[1].insertAdjacentHTML("afterend","<div "+event+"><div style='background-color: hsl("+interface.stack+"deg 100 40)'>"+((i >= 9) ? i + 1 : "0"+(i + 1))+"</div><p>"+alert.body+"</p></div><whitespace></whitespace>")

            interface.stack += 45
        }
    },

    event:function(i) {
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

        // evt.link -> http.open
        // evt.image? -> img, random image
        // evt.creation -> h4
        // evt.name -> h3
        // evt.commit -> p

        news.children[0].insertAdjacentHTML("beforeend",tmp[0] + evt.link + tmp[1] + ((evt.images.length > 0) ? "<img src='" + decodeURI(evt.images[Math.randInt(0, evt.images.length - 1)]) + "'>" : "") + tmp[2] + evt.creation + tmp[3] + evt.name + tmp[4] + evt.commit + tmp[5])
        
        if (evt2){
            news.children[2].insertAdjacentHTML("beforeend",tmp[0] + evt2.link + tmp[1] + ((evt2.images.length > 0) ? "<img src='" + decodeURI(evt2.images[Math.randInt(0, evt2.images.length - 1)]) + "'>" : "") + tmp[2] + evt2.creation + tmp[3] + evt2.name + tmp[4] + evt2.commit + tmp[5])
        }
    },

    list:function() {

    },

    find:function(body, func, findDist = Infinity, x = 0, y = 0) {
        let result = null;
        
        Object.keys(body).forEach(obj => {
            let system = body[obj];
            
            let dx = system.x * interface.scale + interface.offset.x + x;
            let dy = system.y * interface.scale + interface.offset.y + y;
            let distance = Math.hypot(dx, dy);
            // ↑ get distance from each object to interface.offset ↑
    
            if (distance < findDist) {
                findDist = distance
                result = system
            }
        })
    
        func(result)
    }
}

var render = {
    canvases: {
        main: document.getElementById("context"),
        overlay: document.getElementById("overlay"),
        info: document.getElementById("info")
    },

    context: {
        main: document.getElementById("context").getContext("2d"),
        overlay: document.getElementById("overlay").getContext("2d"),
        info: document.getElementById("info").getContext("2d")
    },

    scale: [1980, 1080],

    // ↑ variables ↑ //

    forRepo:function(func) {
        for (let i = 0; i < interface.repos.length; i++) {
            func(interface.repos[i], i)
        }
    },

    closestSun:function(func, findDist = Infinity, x = 0, y = 0) {
        interface.find(interface.systems, func, findDist, x, y);
    },
    
    closestPlanet:function(func, findDist = Infinity, x = 0, y = 0) {
        render.closestSun(system => {
            if (system && system.planets) {
                interface.find(system.planets, func, findDist, x, y);
            }
        }, findDist, x, y);
    },

    aspectRatio:function() {
        render.middle = {
            x: solar.offsetLeft + solar.offsetWidth / 2,
            y: solar.offsetTop + solar.offsetHeight / 2,
            // ↑ main context center ↑

            info: {
                x: info.offsetWidth / 2,
                y: info.offsetHeight / 2
            }
        }

        render.canvases.main.width = document.body.clientWidth
        render.canvases.main.height = document.body.clientHeight

        render.canvases.overlay.width = document.body.clientWidth
        render.canvases.overlay.height = document.body.clientHeight
        
        render.canvases.info.width = info.offsetWidth
        render.canvases.info.height = info.offsetHeight
    },

    arc:function(x, y, radius, startAngle, endAngle, fill = false, pie = false, context = render.context.main) {
        context.beginPath()
        
        if (pie) {
            context.moveTo(x, y)
            context.arc(x, y, radius, startAngle, endAngle)
            context.moveTo(x, y)
        } else {
            context.arc(x, y, radius, startAngle, endAngle)
        }

        if (fill) {
            context.fill()
        } else {
            context.stroke()
        }
    },

    tick:function() {
        render.context.main.reset()
        render.context.overlay.reset()

        render.context.main.font = "15px Georgia";
        render.context.main.textAlign = "center"

        if (interface.focus) {
            var x, y
                
            if (!interface.focus.planets) {
                x = -(interface.focus.sun.x + interface.focus.x) * interface.scale
                y = -(interface.focus.sun.y + interface.focus.y) * interface.scale
            } else {
                x = -(interface.focus.x) * interface.scale
                y = -(interface.focus.y) * interface.scale
            }
    
            interface.offset.x += (x - interface.offset.x) * 0.08
            interface.offset.y += (y - interface.offset.y) * 0.08
        }
        
        Object.keys(interface.systems).forEach(sun => {
            var planets = interface.systems[sun].planets
            var moons = interface.systems[sun].moons
            var xy = Math.rotate(0.0001, 0, 0, interface.systems[sun].x, interface.systems[sun].y)
            var x = (render.middle.x + interface.systems[sun].x * interface.scale + interface.offset.x)
            var y = (render.middle.y + interface.systems[sun].y * interface.scale + interface.offset.y)
            
            interface.systems[sun].x = xy[0]
            interface.systems[sun].y = xy[1]
            
            var dist = Math.hypot(-interface.systems[sun].x, -interface.systems[sun].y)

            render.context.main.strokeStyle = "#3e3432"
            render.arc((render.middle.x + interface.offset.x), (render.middle.y + interface.offset.y), dist * interface.scale, 0, 2 * Math.PI);

            render.context.main.fillStyle = "white"
            render.context.main.font = "15px serif"
            render.context.main.textAlign = "left"
            render.context.main.fillText(sun, x + 220 * interface.scale, y + 5)

            planets.forEach(planet => {
                var xy = Math.rotate(0.002 - planet.size / 100000, 0, 0, planet.x, planet.y)
                var x = (render.middle.x + planet.x * interface.scale + interface.offset.x + interface.systems[sun].x * interface.scale)
                var y = (render.middle.y + planet.y * interface.scale + interface.offset.y + interface.systems[sun].y * interface.scale)
                
                planet.x = xy[0]
                planet.y = xy[1]
                
                var dist = Math.hypot(-planet.x, -planet.y)
                
                render.context.main.strokeStyle = "#3e3432"

                render.arc((render.middle.x + interface.offset.x + interface.systems[sun].x * interface.scale), (render.middle.y + interface.offset.y + interface.systems[sun].y * interface.scale), dist * interface.scale, 0, 2 * Math.PI);
                render.arc(x, y, (planet.size / 2) * interface.scale, 0, 2 * Math.PI);

                if (interface.scale > 0.2) {
                    render.context.main.fillStyle = "white"
                    render.context.main.font = 15 * interface.scale + "px serif"
                    render.context.main.textAlign = "center"
                    render.context.main.fillText(planet.name, x, y + 4)
                }
            })

            moons.forEach(moon => {
                var xy = Math.rotate(0.002 - moon.size / 100000, 0, 0, moon.x, moon.y)
                var x = (render.middle.x + moon.x * interface.scale + interface.offset.x + interface.systems[sun].x * interface.scale + moon.planet.x * interface.scale)
                var y = (render.middle.y + moon.y * interface.scale + interface.offset.y + interface.systems[sun].y * interface.scale + moon.planet.y * interface.scale)
                
                moon.x = xy[0]
                moon.y = xy[1]
                
                var dist = Math.hypot(-moon.x, -moon.y)
                
                render.context.overlay.strokeStyle = "#3e3432"

                //render.arc((render.middle.x + interface.offset.x + interface.systems[sun].x * interface.scale + moon.planet.x * interface.scale), (render.middle.y + interface.offset.y + interface.systems[sun].y * interface.scale + moon.planet.y * interface.scale), dist * interface.scale, 0, 2 * Math.PI)
                render.arc(x, y, (moon.size / 2) * interface.scale, 0, 2 * Math.PI, false, false, render.context.overlay)

                if (interface.scale > 0.15) {
                    render.context.overlay.fillStyle = "white"
                    render.context.overlay.font = 5 * interface.scale + "px serif"
                    render.context.overlay.textAlign = "center"
                    render.context.overlay.fillText(moon.name, x, y + 4)
                }
            })
        })

        interface.rotate += 0.0007

        render.context.info.reset()

        render.context.info.fillStyle = "#e5e2db"
        render.arc(render.middle.info.x, render.middle.info.y, render.middle.info.x / 1.5, 0 , 2 * Math.PI, true, false, render.context.info)

        render.context.info.fillStyle = "#ffffff40"
        render.arc(render.middle.info.x, render.middle.info.y, render.middle.info.x / 1.3, interface.rotate, interface.rotate + Math.PI / 2, true, true, render.context.info)
        render.arc(render.middle.info.x, render.middle.info.y, render.middle.info.x / 1.3, interface.rotate + Math.PI, interface.rotate + (3 * Math.PI) / 2, true, true, render.context.info)

        render.context.info.fillStyle = "white"
        render.arc(render.middle.info.x, render.middle.info.y, render.middle.info.x / 1.8, 0 , 2 * Math.PI, true, false, render.context.info)

        render.context.info.fillStyle = "#ddd4c7"
        render.arc(render.middle.info.x, render.middle.info.y, render.middle.info.x / 4.5, 0 , 2 * Math.PI, true, false, render.context.info)

        render.context.info.strokeStyle = "#a9a090"
        render.arc(render.middle.info.x, render.middle.info.y, render.middle.info.x / 1.8, 0 , 2 * Math.PI, false, false, render.context.info)
        render.arc(render.middle.info.x, render.middle.info.y, render.middle.info.x / 4.5, 0 , 2 * Math.PI, false, false, render.context.info)

        window.requestAnimationFrame(render.tick)
    }
}

window.onload = function() {
    render.aspectRatio()

    http.get("https://script.google.com/macros/s/AKfycbwYXzcV_b1Db4hyCcrFZF0PRNho3KBUXkOcEhdpLIKsYeAbj9eEMwSdoSOQgdn27V2g/exec", function(git){
        interface.repos = git
        
        interface.assemble(git)
        
        interface.randFocus()
    })

    http.get("https://script.google.com/macros/s/AKfycbzAjl6IyaJGFBmIliMVG9_7C_A2TXdfl9We38kzLJKzPmp93_7e-N29D55DUp_xXxl2/exec", function(alerts){
        interface.alerts = alerts

        for (let i = 0; i < alerts.length; i++) {
            if (i <= 5) {
                notifications.children[notifications.childElementCount - 2].remove()
                notifications.children[notifications.childElementCount - 2].remove()
            }

            interface.alert(i)
        }
    
        var style = document.createElement("style");
        
        document.head.appendChild(style);
        style.sheet.insertRule(".loading div { background: grey !important }", 0);

        alerthttp.classList = ""
        alerthttp.innerText = "NOTIFICATIONS - "+alerts.length+" -"
    })

    http.get("https://script.google.com/macros/s/AKfycbwKEO-Os1hQwq9yM2ejzLkHkRyFe2qEJG6kO0pmU9hO5wRkzXH5Inpum1TI4VFFg-xI/exec", function(events) {
        interface.events = events
        news.children[0].innerHTML = ""
        news.children[2].innerHTML = ""

        for (let i = 0; i < events.length; i+=2) {
            interface.event(i)
        }
    })

    http.explore("grammyy.github.io")
    http.explore("grammyy.github.io", "packaging")

    render.canvases.main.addEventListener("mousemove", (mouse) => {
        if (mouse.buttons === 1) {
            interface.offset = {
                x: mouse.movementX + interface.offset.x,
                y: mouse.movementY + interface.offset.y
            }

            if (interface.focus) {
                interface.focus = null
            }
        }
    })

    solar.onclick = interface.click

    solar.onmouseenter = function() {
        document.addEventListener("wheel", interface.zoom)
    }

    solar.onmouseout = function() {
        document.removeEventListener("wheel", interface.zoom)
    }

    render.tick()
}

window.onresize = function(){
    render.aspectRatio()
}