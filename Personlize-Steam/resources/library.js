function traceMethodCalls(obj){
    return new Proxy(obj, {
        get(target, methodName, receiver) {
            const originMethod = target[methodName];
            return function(...args) {
                s.insertAdjacentHTML("afterbegin","<p style='margin:0;text-align:right;color:red;white-space:nowrap'>"+args+"</p>")
                return originMethod.apply(this, args);}}})}
console = traceMethodCalls(console)