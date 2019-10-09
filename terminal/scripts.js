
'use strict';

const fs = require('fs');
const rawdata = fs.readFileSync('stock/stocks.json');
let stocks = JSON.parse(rawdata);
// console.log('stocks: ', stocks);
// console.log('__dirname: ', __dirname);
// console.log('_readline: ', _readline);

const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

let inputData;
const createObjectsArray = [];
let once = false;
const creatObjectTemplate = (prevData) => {

	const question = !once ? `\n--- Create object template --- \nKey : Value (default): ` : `Key : Value (default): `;
	once = true;

	readline.question(question, (answer) => {
		if(answer === '' || answer === 'xxx' || answer === 'exit'){
			inputData = createObjectsArray;
			answerQ();
			return null
		}

		let result;
		if(answer.includes(':')){
			result = answer.split(':')
			result[1] = dataType(result[1]);
		} else {
			result = [answer, ''];
		}

		// const result = answer.includes(':') ? answer.split(':') : [answer, ''];
		createObjectsArray.push(result);
		return creatObjectTemplate(answer);
	})

}

creatObjectTemplate();

var itemCount = 0;
var answerArray = [];
var answerData = [];
const answerQ = ()  => {

	if(itemCount < inputData.length) {

		var currentQ = inputData[itemCount][0];

		readline.question(`${currentQ}: `, (answer) => {
			if(answer === 'xxx'){
				return saveData();
			}

			const answerValue = answer === '' ? inputData[itemCount][1] : answer;
			answerData.push([inputData[itemCount][0],  dataType(answerValue)])
			itemCount++;
			return answerQ();
		})

	} else {

		itemCount = 0
		const dataToSave = answerData.reduce(function(p, c) {
			p[c[0]] = c[1];
			return p;
		  }, {});
		

		answerArray.push(dataToSave);

		answerData = [];
		console.log(`- Added items ${answerArray.length} -`);
		answerQ();
	}

}

function saveData() {

	const filename = `${__dirname}/datafile_${Date.now()}.json`;

	try {
		var myJSON = JSON.stringify(answerArray);
		const data = fs.writeFileSync(filename, myJSON)
		const createdJSON = fs.readFileSync(filename);

		//file written successfully
		console.log(`\n \n--- All data save to file --- \n${filename}`);
		console.log('createdJSON: \n', JSON.parse(createdJSON));
		
	} catch (err) {
		console.error(err)
	}

	readline.close();
}


const dataType = (param) => {

	let input = param;
	console.log('param: ', param);
	//Create array

	try {
		
		//Array
		if(input.includes('[')){
			input = input.replace(/'/g, '"');
			input = JSON.parse(input);
			console.log(typeof input);
		}

		// if(input.includes('^[\d.,]+$)'){

		// }

	} catch (error) {
		console.log('error: ', error);
	}


	return input

}