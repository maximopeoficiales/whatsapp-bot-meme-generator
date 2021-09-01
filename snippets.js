let memesData = [];
document.querySelectorAll("#meme option").forEach((e,index) => {
    memesData.push({
        id: index,
        name: e.value, url: `https://apimeme.com/meme?meme=${e.value}&top=&bottom=`
    });
})
console.log(JSON.stringify(memesData, null, 2));