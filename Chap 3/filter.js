const filterItems = [
    { name: "jon", age: 20 },
    { name: "linda", age: 22 },
    { name: "jon", age: 40}
]

const result = filterItems.filter(item => item.name === "jon");

console.log(result);