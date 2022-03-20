console.log("Hei");

const needle = "pamautti pilluA";
const haystack = "alli pamautti pillua mapilla";
const password = "lo"

console.log(haystack.toLowerCase().includes(needle.toLowerCase()))

if(password.length < 3) {
    console.log("Too short password")
}