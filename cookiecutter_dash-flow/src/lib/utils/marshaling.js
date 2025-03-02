
// to marshal shit from and to ReactFlow

const getJsonFromString = (wholeGraphString) => {

    const res = JSON.parse(wholeGraphString);

    console.log("res: ", res);

    return res;
}

const getStringFromJson = (wholeGraphJson) => {

    const exportedJson = wholeGraphJson.map((item)=>{
        return item;
    });
    const res = JSON.stringify(wholeGraphJson);

    console.log("res: ", res);

    return res;
}


export {getJsonFromString, getStringFromJson};