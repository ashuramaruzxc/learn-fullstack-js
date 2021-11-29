function boundedEnum(context) {

    Array.prototype.forEach.call(context, (x, y) => {


        if (x instanceof Array || typeof x === "string") {
            bindAndRun();
        } else if (isIterable(x)) {
            x = Array.from(x);
            bindAndRun();
        } else if (typeof x == "object") {
            x = objToArr(x);
            bindAndRun()
        }


        function bindAndRun() {
            Array.prototype.forEach.bind(x, x => console.log(x))()
        }
    })


    function objToArr(obj) {
        const countries = [];

        for (let i in obj) {
            if (obj.hasOwnProperty(i))
                countries.push(obj[i]);
        }
        return countries;
    }

    function isIterable(obj) {
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

}


function myfunc() {
    boundedEnum(arguments);
}

myfunc("hello", {a: 3, b: 4}, [1, 2, 3, 4, 5], new Set([1, 2, 3, 4]));



