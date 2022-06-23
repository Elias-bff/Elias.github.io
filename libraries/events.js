function AddEvent(object,id,func){
    if(object.attachEvent)object.attachEvent("on"+id,function(){func.call(object)})
    else if(object.addEventListener)object.addEventListener(id,func,false)}