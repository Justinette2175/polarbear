
let avg;
let stdDev;
const pi = 3.1415;//Math.PI;

const probabilityDensityFunction = (x) => {
  const scalar = 1 / Math.pow( Math.pow(stdDev, 2) * 2 * pi, 0.5 );
  const eScalar = -1/2 * Math.pow(x - avg, 2) / Math.pow(stdDev, 2);
  return scalar * Math.exp(eScalar)
}

const getYValues = (numberOfValues) => {
  console.log('getYValues')
  const yValues = [];
  const minX = avg - 2*stdDev;
  const maxX = avg + 2*stdDev;
  const stepX = (maxX - minX) / (numberOfValues-1);

  for(let i = 0; i < numberOfValues; i++) {
    const xVal = minX + stepX * i;
    const yVal = probabilityDensityFunction(xVal);
    yValues.push(yVal);
  }
  console.log('getYValues', yValues);
  return yValues;
}

const extractFunctSteps = (avg_, stdDev_, numberOfValues) => {
  console.log('extractFunctSteps')
  avg = avg_ || 0;
  stdDev = stdDev_ || 1;

  return getYValues(numberOfValues)
}

exports.extractFunctSteps = extractFunctSteps;
