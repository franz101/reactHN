const fileName = "30256320.csv";
const exampleText =
  "53.0,1.36,0.54,79.42,0.53,0.61,1.67,15.87,48.0,0.41,1.65,86.36,1.07,0.3,0.78,9.43,35.0,0.81,0.89,32.08,1.98,0.36,1.14,62.74,34.0,62.52,0.48,0.63,23.72,1.45,6.01,5.19,26.0,0.41,0.34,1.69,5.48,0.2,0.46,91.42";

const categoriesLookup = {
  0: "CULTURE & ARTS",
  1: "EDUCATION",
  2: "BUSINESS",
  3: "HEALTH & LIVING",
  4: "SPORTS",
  5: "NEWS & POLITICS",
  6: "TECH & SCIENCE",
};

/* the data is chunked by 64
 so when the id is 562356 you take the closest multiple of 64. which is 562304. That is the name of the file 562304.csv */
const calculateIndex = (id) => {
  return Math.floor(id / 64) * 64;
};

/*
given the id and the content of the file return the result as a json */
const getCategoryPrediction = (index: number, textInput: string) => {
  //7 categories
  const size = 7 + 1;
  const cellsFlattend = textInput.split(",");
  const rows: string[][] = [];
  const result = {};

  //We want to reshape the cells of text
  //From shape (64)
  //To shape   (8,8)
  while (cellsFlattend.length) {
    rows.push(cellsFlattend.splice(0, size));
  }
  //sort ascending
  rows.reverse();

  //parse the results
  for (const row of rows) {
    // id: probabilties
    result[index + parseFloat(row[0])] = row.slice(1);
  }
  return result;
};

const listProbalitiesForPrediction = (prediction) => {
  const predictionProbalities = {};
  for (let i = 0; i < prediction.length; i++) {
    predictionProbalities[categoriesLookup[i]] = prediction[i];
  }
  return predictionProbalities;
};

export const getCategoryForIdCached = async (id: number) => {
  const index = calculateIndex(id);
  const csvData = await new Promise<any>((resolve, reject) => {
    // post request using fetch
    fetch(
      `https://franz101.github.io/hn_topic_data/predictions/export/${index}.csv`,
      {
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    )
      .then((res) => res.text())
      .then((data: any) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

  const predictions = getCategoryPrediction(index, csvData);
  const prediction = predictions[id];
  const predictionMax = Math.max(...prediction);
  const predictionCat = prediction.indexOf(predictionMax + "");
  return (
    categoriesLookup[predictionCat] + " (" + predictionMax + "%)"
    //\n" +
    //JSON.stringify(listProbalitiesForPrediction(prediction))
  );
};
