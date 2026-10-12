const items = [
    { name: "jon", age: 20 },
    { name: "linda", age: 22 },
    { name: "jon", age: 40 }
];

let jon = Boolean(items.find(item => item.name === "jon"));

console.log(jon);