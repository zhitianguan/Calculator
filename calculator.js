function add (a,b){
    return a+b
}

function subtract (a,b){
    return a-b
}

function multiply (a,b){
    return a*b
}

function divide (a,b){
    return a/b
}

function isAnOperator (char){
    return (char==='+' || char==='-' || char==='÷' || char==='×' || char==='(' || char===')')
}

function splitDisplayInput (str){
    let operands = []
    let operators =[]
    let startIndex = 0; //the starting index to begin number extraction; initial value is 0

    //break up the text on display into operands & operators
    for (let i=0; i<str.length; i++){
        if (isAnOperator(str[i])){
            if (str[i]==='('){
                operators.push(str[i]);
                startIndex=i+1;
            }
            else if (i!== 0 && isAnOperator(str[i-1])){
                if (str[i]==='-'){
                    startIndex=i
                }
                else {
                    operators.push(str[i]);
                    startIndex=i+1;
                }
            }
            else {
                operands.push(str[startIndex]==='A'?ans:Number(str.substring(startIndex,i)));
                startIndex=i+1;            
                operators.push(str[i]);
            }
        }
    }
    //add the last operand if it was missed in the previous for loop
    if (str[str.length-1] !== ')'){
        if (str[str.length-1] === 's')
            operands.push(ans);
        else
            operands.push(Number(str.substring(startIndex)));
    }

    let result = {operands,operators}
    return result;
}

function calc2Nums (operator, a, b){
    switch(operator){
        case '+':
            return add(a,b)
        case '-':
            return subtract(a,b)
        case '×':
            return multiply(a,b)
        case '÷':
            return divide(a,b)
    }
}

/*

if can Find brackets, extract the content in bracket, call eval expression for content inside bracket

bulletproof if num of ( >  num of ), assume that theres are ) at the very end

ans key

*/
function evalExpression (input){
    while (input.operators.some(op => op==='(')){
        let openBrkt, closeBrkt, numOfBrkt = 0

        for (let i=0; i<input.operators.length; i++){
            if (input.operators[i] === '('){
                openBrkt = i;
                numOfBrkt++
            }
            else if (input.operators[i] === ')'){
                closeBrkt = i;
                break;
            }
        }
        let contentInBrkt = {operands: input.operands.slice(openBrkt-numOfBrkt+1,closeBrkt-numOfBrkt+1), 
                            operators: input.operators.slice(openBrkt+1,closeBrkt)}
        input.operands.splice(openBrkt-numOfBrkt+1, contentInBrkt.operands.length, evalExpression(contentInBrkt))
        input.operators.splice(openBrkt, closeBrkt-openBrkt+1)
    }
    
    if(input.operators.some(op => op==='×') || input.operators.some(op => op==='÷') ){
        for (let i=0; i<input.operators.length; i++){
            switch (input.operators[i]){
                case '×':
                    input.operands.splice(i, 2, calc2Nums('×',input.operands[i],input.operands[i+1]))
                    input.operators.splice(i, 1);
                    i--;
                    break;
                case '÷':
                    input.operands.splice(i, 2, calc2Nums('÷',input.operands[i],input.operands[i+1]))
                    input.operators.splice(i, 1);
                    i--;
                    break;
            }
        }
    }
    for (let i=0; i<input.operators.length; i++){
        switch (input.operators[i]){
            case '+':
                input.operands.splice(i, 2, calc2Nums('+',input.operands[i],input.operands[i+1]))
                input.operators.splice(i, 1);
                i--;
                break;
            case '-':
                input.operands.splice(i, 2, calc2Nums('-',input.operands[i],input.operands[i+1]))
                input.operators.splice(i, 1);
                i--;
                break;
        }
    }
    
    return Math.round((input.operands[0] + Number.EPSILON) * 1000000000000) / 1000000000000; 
}

function calculator () {
    topLine.textContent = bottomLine.textContent + ' = ';

    //replace all ans with their values first
    let str = bottomLine.textContent.split('Ans').join(ans)

    //replace multiple + - opertors 
    str = str.split('--').join('+')
    str = str.split('++').join('+')
    str = str.split('-+').join('-')
    str = str.split('+-').join('-')

    let input = splitDisplayInput(str);
    ans = evalExpression(input)
    bottomLine.textContent = ans;
    pressedEqsLast = true;
}

function addNumToDisplay (e){
    if(bottomLine.textContent.length <= 13) {
        if (pressedEqsLast === true){
            topLine.textContent += bottomLine.textContent;
            bottomLine.textContent = e.target.textContent;
        }
        else if (bottomLine.textContent==='0' && e.target.textContent!=='.') 
            bottomLine.textContent = e.target.textContent;
        else{
            bottomLine.textContent += e.target.textContent;
        }
        pressedEqsLast = false;
    }
}

//÷ ×
function addOpToDisplay (e){
    let prevChar = bottomLine.textContent[bottomLine.textContent.length-1];
    let prevPrevChar = bottomLine.textContent.length >=2?bottomLine.textContent[bottomLine.textContent.length-2]:null
    if (pressedEqsLast === true){
        if (bottomLine.textContent.length + topLine.textContent.length > 13)
            topLine.textContent = ans;
        else {
            topLine.textContent += ans;
        }
        bottomLine.textContent = 'Ans' + e.target.textContent;
    }
    else if (isAnOperator(prevChar) && isAnOperator(prevPrevChar)){
        //not allow user to enter three operators in a row
    }
    else if (e.target.textContent!=='-' && isAnOperator(prevChar)){
        //not allow user to enter 2 operators in a row unless the second one is -)
    }
    else if (bottomLine.textContent.length <= 13)
        bottomLine.textContent += e.target.textContent;
    pressedEqsLast = false;
}

function addAnsToDisplay (e){
    if(bottomLine.textContent.length <= 13) {
        if (ans===undefined){
            alert ("No value has been stored in Ans yet.")
            return;
        }
        else if (pressedEqsLast === true){
            topLine.textContent += bottomLine.textContent;
            bottomLine.textContent = 'Ans';
        }
        else {
            bottomLine.textContent += 'Ans';
        }
        pressedEqsLast = false;
    }
}

function addBrktToDisplay (e){
    if(bottomLine.textContent.length <= 13) {
        if (pressedEqsLast === true){
            topLine.textContent += bottomLine.textContent;
            bottomLine.textContent = e.target.textContent;
        }
        else if (e.target.textContent===')' && !bottomLine.textContent.includes('(')){
            //not allow user to enter a closing bracket without first entering a opening one
        }
        else if (e.target.textContent==='(' && bottomLine.textContent==='0')
            bottomLine.textContent = e.target.textContent;
        else 
            bottomLine.textContent += e.target.textContent;
        pressedEqsLast = false;
    }
}


function resetDisplay (){
    topLine.textContent = ''
    bottomLine.textContent = '0'
    pressedEqsLast = false
}


//buttons
const numberKeys = document.querySelectorAll('.number')
const operatorKeys = document.querySelectorAll('.operator')
const bracketKeys = document.querySelectorAll('.bracket')
const equalsKey = document.querySelector('#equals')
const resetKey = document.querySelector('#reset')
const ansKey = document.querySelector('#ans')

let pressedEqsLast = false;
let ans

//display
const topLine = document.querySelector('#topLine')
const bottomLine = document.querySelector('#bottomLine')

//add event listeners to btns
numberKeys.forEach(numKey => numKey.addEventListener('click', addNumToDisplay))
operatorKeys.forEach(operatorKey => operatorKey.addEventListener('click', addOpToDisplay))
bracketKeys.forEach(bracketKey => bracketKey.addEventListener('click', addBrktToDisplay))
resetKey.addEventListener('click', resetDisplay)
equalsKey.addEventListener('click', calculator)
ansKey.addEventListener('click', addAnsToDisplay)



