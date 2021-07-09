function get1(selector){
	return document.querySelectorAll(selector)[0];
}
function arraySum(arr){
	let sum=0;
	arr.map(function(i){sum+=i})
	return sum;
}
function arraySupply(arr){
	let result=1;
	arr.map(function(i){result*=i})
	return result;
}

var 화학반응식, 반응속도, 상수, 평형상수, 반응지수, 반몰, 생몰;
var 반응물, 생성물;
var 가역여부;
var time=0;
var point=[[],[]];

var ctx = get1('canvas').getContext('2d');

function divide(a){
	for(let i=0; i<a.length; i++){
		if(isNaN(Number(a[i]))){
			return i==0 ? [1,a,1]:[Number(a.slice(0,i)),a.slice(i,a.length),1];
		}
	}
}

function get2(){
	상수 = Number(get1("[name=상수]").value);
	화학반응식 = get1("[name=화학반응식]").value.replaceAll(" ","");
	화학반응식 = 화학반응식.replaceAll("<","").split("->");
	반응물 = 화학반응식[0].split("+").map(i=>divide(i));
	생성물 = 화학반응식[1].split("+").map(i=>divide(i));
	let dcf = document.querySelectorAll('div.chemicalFormula');
	Array.from(dcf).slice(0,document.querySelectorAll("#a>div").length-1).map(function(i){get1('#a').removeChild(i)});
	Array.from(dcf).slice(document.querySelectorAll("#a>div").length-1,Array.from(dcf).length).map(function(i){get1('#b').removeChild(i)});
	for(let i=0; i<반응물.length; i++){
		let divElement = document.createElement("div");
		let text1 = document.createTextNode(반응물[i][1]+" : ");
		let text2 = document.createTextNode('M');
		let inputNumber = document.createElement("input");
		divElement.setAttribute('class',"chemicalFormula");
		inputNumber.setAttribute('style',"width:100px;");
		inputNumber.setAttribute('value',"1");
		inputNumber.setAttribute('type',"number");
		divElement.appendChild(text1);
		divElement.appendChild(inputNumber);
		divElement.appendChild(text2);
		get1("#a").appendChild(divElement);
	}
	for(let i=0; i<생성물.length; i++){
		let divElement = document.createElement("div");
		let text1 = document.createTextNode(생성물[i][1]+" : ");
		let text2 = document.createTextNode('M');
		let inputNumber = document.createElement("input");
		divElement.setAttribute('class',"chemicalFormula");
		inputNumber.setAttribute('style',"width:100px;");
		inputNumber.setAttribute('value',"0");
		inputNumber.setAttribute('type',"number");
		divElement.appendChild(text1);
		divElement.appendChild(inputNumber);
		divElement.appendChild(text2);
		get1("#b").appendChild(divElement);
	}
}
get2();

function line(x1,y1,x2,y2){
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.closePath();
}

function draw(){
	for(let j=0; j<2; j++){
		for(let i=0; i<point.length-1; i++){
			line(point[j][i][0],point[j][i][1],point[j][i+1][0],point[j][i+1][1]);
		}
	}

function update(){
	time += 0.03;
	평형상수 = Number(get1('[name=평형상수]').value);
	상수 = Number(get1('[name=상수]').value);
	let a = document.querySelectorAll('#a>div.chemicalFormula>input');
	for(let i = 0; i<a.length; i++){
		반응물[i][2] = Number(a[i].value);
	}
	let b = document.querySelectorAll('#b>div.chemicalFormula>input');
	for(let i = 0; i<b.length; i++){
		생성물[i][2] = Number(b[i].value);
	}
	let 분모 = arraySupply(반응물.map(i=>i[2]**i[0]));
	let 분자 = arraySupply(생성물.map(i=>i[2]**i[0]));
	반응지수 = 분자/분모;
	반응속도 = -상수*(반응지수-평형상수);
	반응물 = 반응물.map(function(i){return [i[0],i[1],i[2]-i[0]*3/100*반응속도]});
	생성물 = 생성물.map(function(i){return [i[0],i[1],i[2]+i[0]*3/100*반응속도]});
	get1('[name=반응속도]').value = 반응속도;
	get1('[name=반응지수]').value = 반응지수;
	반몰 = arraySum(반응물.map(i=>i[2]));
	get1('[name=반몰]').value = 반몰;
	생몰 = arraySum(생성물.map(i=>i[2]));
	get1('[name=생몰]').value = 생몰;
	for(let i = 0; i<a.length; i++){
		a[i].value = 반응물[i][2];
	}
	for(let i = 0; i<b.length; i++){
		b[i].value = 생성물[i][2];
	}
	point[0].push([time,반몰]);
point[1].push([time,생몰]);
draw();
}

var go;
function start(){
	quit();
	go = setInterval(update, 30);
}
function quit(){
	clearInterval(go);
}
