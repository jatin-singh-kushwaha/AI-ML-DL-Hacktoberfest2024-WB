const outputs=[];
const predictionpoint=300;
const k=3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
  
}

function runAnalysis() {
  const testSetSize = 100;
  const [testSet,trainingSet]=splitDataset(MinMax(outputs,3),testSetSize);

  // let numberCorrect=0;
  // for(let i=0;i< testSet.length;i++){
  //   const bucket=knn(trainingSet,testSet[i][0]);
  //   if (bucket==testSet[i][3]){
  //     numberCorrect++;
  //   }
  // }
  // console.log("accuracy",numberCorrect/testSetSize);

  _.range(1,20).forEach(k=>{
  const accuracy=_.chain(testSet)
    .filter(testpoint => knn(trainingSet,_.initial(testpoint),k)== testpoint[3])
    .size()
    .divide(testSetSize)
    .value();

    console.log("for k of",k,"Accuracy is",accuracy);
  });
}      

function knn(data,point,k){
  return _.chain(data)
  .map(row => [distance(_.initial(row) ,point),_.last(row)])
  .sortBy(row => row[0])
	.slice(0,k)
	.countBy(row =>row[1])
	.toPairs()
  .sortBy(row => row[1])
	.last()
	.first()
	.parseInt()
	.value();
}
//distance calculation 
function distance(pointA,pointB){
  return _.chain(pointA)
      .zip(pointB)
      .map(([a,b]) => (a-b)** 2)
      .sum()
      .value() ** 0.5; 
}

function splitDataset(data, testCount){
  const shuffled=_.shuffle(data);

  const testSet=_.slice(shuffled,0,testCount);
  const trainingSet=_.slice(shuffled,testCount);
  return [testSet,trainingSet];
}

function MinMax(data ,featureCount){
  const clonedData= _.cloneDeep(data);

  for(let i=0; i< featureCount;i++){
    const column = clonedData.map(row => row[i]);

    const max=_.max(column);
    const min= _.min(column);

  for(let j=0; j< clonedData.length;j++){
    clonedData[j][i]=(clonedData[j][i]- min)/(max-min);
  }  
  }
  return clonedData;
}


