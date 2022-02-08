const testCases = [
    '09-1234556',
    '040-22334455',
    '040-22-334455',
    '1234556',
    '1-22334455',
    '10-22-334455',
    '10-45678',
    '030-5678'
];

for(let i = 0; i < testCases.length; i++){
    let ve3 = new RegExp('^[0-9]{2}-[0-9]{5,}$|^[0-9]{3}-[0-9]{4,}$');
    console.log(testCases[i], ve3.test(testCases[i]));
}