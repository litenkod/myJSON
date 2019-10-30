
'use strict';

const fs = require('fs');
const exec = require("child_process").exec
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

let itemCount = 0;
let answerArray = [];
let answerData = [];
const answerQ = ()  => {

	if(itemCount < inputData.length) {

		const currentQ = inputData[itemCount][0];

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
	const path = `${__dirname}`;

	try {
		const myJSON = JSON.stringify(answerArray);
		const data = fs.writeFileSync(filename, myJSON)
		const createdJSON = fs.readFileSync(filename);

		//file written successfully
		console.log(`\n \n--- JSON data file saved --- \n${filename}`);
		console.log('createdJSON: \n', JSON.parse(createdJSON));
		
	} catch (err) {
		console.error(err)
	}
	console.log(`Open file folder? `);
	readline.question(`Yes(y) : No(n): `, (answer) => {
		if(answer === 'Y' || answer === 'y' || answer === 'yes'){
			console.log(filename);
			
			exec(`cd ${path} && open .`, function (error) {
				if (error) throw error;
			});
			setTimeout(()=> {
				readline.close();
			}, 1000)
		} else {
			readline.close();
		}
	})
}


const dataType = (param) => {

	let input = param;
	// console.log('param: ', param);
	//Create array

	try {
		
		//Array
		if(input.includes('[')){
			input = input.replace(/'/g, '"');
			input = JSON.parse(input);
			// console.log(typeof input);
		}

		// if(input.includes('^[\d.,]+$)'){

		// }

	} catch (error) {
		console.log('error: ', error);
	}


	return input

}

'use strict';

let inputData;
const body = document.body;
const filenameInput = document.querySelector('#filenameInput');
const objectKeyInput = document.querySelector('#objectKey');
const objectValueInput = document.querySelector('#objectValue');
const nextNodeBtn = document.querySelector('#nextNodeBtn');
const nextAnswerBtn = document.querySelector('#nextAnswerBtn');
const createItemBtn = document.querySelector('#createItemBtn');
const saveFileBtn = document.querySelector('#saveFileBtn');
const copyJsonBtn = document.querySelector('#copyJsonBtn');
objectKeyInput.focus();

const hints = document.querySelectorAll('[data-hint]');
for (const hint of hints) {
	hint.addEventListener('mouseover', (event) => {
		const hintItem = event.target.getAttribute('data-hint');
		let currentHint = document.querySelector(`[data-hint-on="${hintItem}"]`);
		currentHint.classList.add('-demo');
		if(currentHint.classList.contains('-hide')){
			currentHint.disabled = true;
			currentHint.classList.remove('-hide');
			currentHint.classList.add('-hide2');
		}
	});

	hint.addEventListener('mouseleave', (event) => {
		const hintItem = event.target.getAttribute('data-hint');
		let currentHint = document.querySelector(`[data-hint-on="${hintItem}"]`);
		currentHint.classList.remove('-demo');
		if(currentHint.classList.contains('-hide2')){
			currentHint.disabled = false;
			currentHint.classList.remove('-hide2');
			currentHint.classList.add('-hide');
		}
	});

	hint.addEventListener('click', (event) => {
		const hintItem = event.target.getAttribute('data-hint');
		let currentHint = document.querySelector(`[data-hint-on="${hintItem}"]`);
		currentHint.focus();
	});

};

nextNodeBtn.addEventListener('click', ()=> {
	addNode();
});

createItemBtn.addEventListener('click', (event)=> {
	body.classList.remove('createView');
	body.classList.add('answerView');
	saveFileBtn.disabled = false;

	nextQuestion();
})

objectKeyInput.addEventListener("keyup", function(event) {
	if (event.code === 'Enter' && body.classList.contains('createView')) {
		event.preventDefault();
		addNode();
	}
});

objectValueInput.addEventListener("keyup", function(event) {
	if (event.code === 'Enter' && body.classList.contains('createView')) {
		event.preventDefault();
		addNode();
	}
	if (event.code === 'Enter' && body.classList.contains('answerView')){
		event.preventDefault();
		addItems();
	}
});

nextAnswerBtn.addEventListener('click', ()=> {
	addItems();
})

saveFileBtn.addEventListener('click', ()=> {
	downloadFile();
})

const addNode = () => {
	if(objectKeyInput.value !== undefined && objectKeyInput.value.length > 0) {
		saveNode(objectKeyInput.value, objectValueInput.value);
		objectKeyInput.value = '';
		objectValueInput.value = '';
		objectKeyInput.focus();
		if(saveNode.length >= 0){
			createItemBtn.classList.remove('-hide');
		}
	}
}

let countItem = 0;
let itemsArray = [];
let allItemsArray = [];
const nextQuestion = () => {
	
	if(countItem < nodeArray.length){

		objectKeyInput.disabled = true;
		objectKeyInput.value = nodeArray[countItem][0];
		objectValueInput.value = nodeArray[countItem][1];
		setTimeout(() => {
			objectValueInput.focus();
		}, 500);

	} else {

		const dataToSave = itemsArray.reduce(function(p, c) {
			p[c[0]] = c[1];
			return p;
		  }, {})

		allItemsArray.push(dataToSave);
		countItem = 0;
		itemsArray = [];

		displayNodeData();
		nextQuestion();

		document.querySelector('.item-count-number').classList.remove('-hide');
		document.querySelector('.item-count-number').innerHTML = allItemsArray.length;

	}
}

const addItems = () => {
	const answerValue = objectValueInput.value === '' ? nodeArray[countItem][1] : objectValueInput.value;
	itemsArray.push([nodeArray[countItem][0], answerValue]);
	countItem++;
	
	nextQuestion();
	
};

const nodeArray = [];
const saveNode = (key, value) => {
	nodeArray.push([key, value]);
	displayTemplateData();
}

const displayTemplateData = () => {
	const templateOutput = document.querySelector('#template');
	let templateHtml = '';
	nodeArray.map((item)=> {
		templateHtml += `${item[0]} : ${item[1]}<br>`;
	});
	templateOutput.innerHTML = templateHtml;
}

const displayNodeData = () => {
	const templateOutput = document.querySelector('#output');
	const addRow = JSON.stringify(allItemsArray).replace(/},/g, "},<br>");
	templateOutput.innerHTML = addRow;
}

const newDate = new Date(),
	d = newDate.toISOString().split('.')[0].replace('T','_'),
	defaultFilename = `MyJSON_${d}.json`

document.querySelector('#filenameLabel').setAttribute('title', `default filename: ${defaultFilename}`);

const downloadFile= () => {
	const filename = filenameInput.value !== '' ? `${filenameInput.value}.json` : `MyJSON_${d}.json`;
	const data = JSON.stringify(allItemsArray);
	const element = document.createElement('a');
	element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	body.appendChild(element);
	element.click();
	body.removeChild(element);
}
