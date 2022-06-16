a=setInterval(function(){
    if(!document.body.children["root"].children[0].includes("Preload")){
        clearInterval(a)
        document.getElementsByTagName("div")[0].innerText = document.documentElement.innerHTML}},250)
