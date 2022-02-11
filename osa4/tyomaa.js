const testSet = require('./tests/testMaterial');
const listHelper = require('./utils/listHelper')

const reducer = (sum, item) => {
    return sum + item
}

const justOneBlog = testSet.blogs.filter(blog => blog._id==='5a422b3a1b54a676234d17f9');

let val = listHelper.mostBlogs(testSet.blogs);
//val = listHelper.mostBlogs(justOneBlog);
console.log(listHelper.mostLikes(testSet.blogs))
console.log(listHelper.mostLikes([]))
console.log(listHelper.mostLikes(justOneBlog))

//console.log(val)

/*
let foo = {}

foo["a"] = 6;

console.log("bar" in foo)
console.log("a" in foo)
console.log(foo["a"])
foo["a"] = foo["a"] + 1;
console.log(foo["a"])
*/
