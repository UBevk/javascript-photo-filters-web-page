const img = new Image();
//img.src = "https://media.istockphoto.com/photos/cat-on-a-yellow-background-picture-id164666673?k=20&m=164666673&s=612x612&w=0&h=otC7kaBoEg-x0JPVFst1vxENcrDJp5QjzCptW0JHAjY=";
img.src = "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?cs=srgb&dl=pexels-philippe-donn-1133957.jpg&fm=jpg";
img.crossOrigin = "Anonymous";

canvas = document.createElement("canvas");
canvas.width = 600;
canvas.height = 400;

let foo = 0;
let startCordX = 0;
let startCordY = 0;
let stopCordX = 600;
let stopCordY = 400;

let risi = 0;

let padatki = [];
let where = 0;

canvas.addEventListener('mousedown', function(e){
    ctx.beginPath();
    ctx.strokeStyle = 'limegreen';
    ctx.lineWidth = 5;
    ctx.moveTo(e.offsetX, e.offsetY);
    ctx.lineTo(prejX, prejY);
    ctx.stroke();

    prejX = e.offsetX;
    prejY = e.offsetY;
})

canvas.addEventListener('click', function(e){
    let x = e.offsetX;
    let y = e.offsetY;

    if(foo == 0){
        startCordX = x;
        startCordY = y;
        foo = 1;
    }
    else if(foo == 1){
        stopCordX = x;
        stopCordY = y;
        foo = 0;
    }

    console.log("x: " + x);
    console.log("y: " + y);

    console.log("startX: " + startCordX);
    console.log("startY: " + startCordY);

    console.log("stopX: " + stopCordX);
    console.log("stopY: " + stopCordY);
}) 

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mousemove', sketch);

canvas.style.border = "solid black 5px";
document.body.appendChild(canvas); 
  
ctx = canvas.getContext("2d");

let defaultData;

window.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let slika = ctx.getImageData(0, 0, canvas.width, canvas.height);
    defaultData = slika.data;   
    padatki[0] = slika;
    histogram();
    customMatrix();
}

function ponastavi(){
    location.reload();
    where = 0;
}

function odstraniKanal(){
    let barva = document.querySelector('input[name="barva"]:checked').value;
    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height); //podatki o sliki
    let data = imgPixels.data; //pridobimo array pikslov

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
      
        if(barva == "red")
            data[i] = 0;
        else if(barva == "green")
            data[i+1] = 0;
        else if(barva == "blue")
            data[i+2] = 0;     
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1;

    histogram();
}

function poudariKanal(){
    let barva = document.querySelector('input[name="barva"]:checked').value;
    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data;

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
      
        if(barva == "red")
            data[i] = data[i] + 50;
        else if(barva == "green")
            data[i+1] = data[i+1] + 50;
        else if(barva == "blue")
            data[i+2] = data[i+2] + 50;
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1;

    histogram();
}

document.getElementById('kontrast').addEventListener('change', contrast);

function contrast(){
    let kontrast = document.getElementById('kontrast').value;
    kontrast = (kontrast/100) + 1;
    let c = 128 * (1 - kontrast);

    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height); 
    let data = imgPixels.data; 

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){

            data[i] = data[i]*kontrast + c;
            data[i+1] = data[i+1]*kontrast + c;
            data[i+2] = data[i+2]*kontrast + c;      
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push() = imgPixels;
    where = where+1;

    histogram();
}

document.getElementById('svetlost').addEventListener('change', brightness);

function brightness(){
    let svetlost = document.getElementById('svetlost').value;
    ctx.filter = `brightness(${svetlost}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    histogram();
}

function grayscale(){
    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data; 

    for(let y = 0; y < 800; y++){
        for(let x = 0; x < canvas.width; x++){
            let i = (y * 2) * canvas.width + x * 4;
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1;

    histogram();
}

function tresholding(){
    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data;

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
      
        if(data[i] > 126){
            data[i] = 255;
            data[i+1] = 255;
            data[i+2] = 255;
        }       
        else{
            data[i] = 0;
            data[i+1] = 0;
            data[i+2] = 0;
        }
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1;

    histogram();
}


function boxblur(){

    grayscale();

    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data;
    let sum = 0;

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
      
        sum = data[i-(4*canvas.width)-4] + data[i-(4*canvas.width)] +
        data[i-(4*canvas.width)+4] + data[i-4] + data[i] + data[i+4]
        + data[i+(4*canvas.width)-4] + data[i+(4*canvas.width)] + data[i+(4*canvas.width)+4];

        data[i] = sum * (1/9);
        data[i+1] = sum * (1/9);
        data[i+2] = sum * (1/9);
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1;

    histogram();

    return data;
}

function sobel(){

    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height); 
    let data = imgPixels.data; 
    let sum = 0;
    let arr = [];
    let arr2 = [];

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        
        sum = data[i-(4*canvas.width)-4]*1 + data[i-(4*canvas.width)]*0 + data[i-(4*canvas.width)+4]*(-1) 
        + data[i-4]*2 + data[i]*0 + data[i+4]*(-2) 
        + data[i+(4*canvas.width)-4]*1 + data[i+(4*canvas.width)]*0 + data[i+(4*canvas.width)+4]*(-1);
        arr[i] = sum;

        sum = data[i+1-(4*canvas.width)-4]*1 + data[i+1-(4*canvas.width)]*0 + data[i+1-(4*canvas.width)+4]*(-1) 
        + data[i+1-4]*2 + data[i+1]*0 + data[i+1+4]*(-2) 
        + data[i+1+(4*canvas.width)-4]*1 + data[i+1+(4*canvas.width)]*0 + data[i+1+(4*canvas.width)+4]*(-1);
        arr[i+1] = sum;

        sum = data[i+2-(4*canvas.width)-4]*1 + data[i+2-(4*canvas.width)]*0 + data[i+2-(4*canvas.width)+4]*(-1) 
        + data[i+2-4]*2 + data[i+2]*0 + data[i+2+4]*(-2) 
        + data[i+2+(4*canvas.width)-4]*1 + data[i+2+(4*canvas.width)]*0 + data[i+2+(4*canvas.width)+4]*(-1);
        arr[i+2] = sum;

        arr[i+3] = data[i+3];
    }

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        
        sum = data[i-(4*canvas.width)-4]*1 + data[i-(4*canvas.width)]*2 + data[i-(4*canvas.width)+4]*1
        + data[i-4]*0 + data[i]*0 + data[i+4]*0 
        + data[i+(4*canvas.width)-4]*(-1) + data[i+(4*canvas.width)]*(-2) + data[i+(4*canvas.width)+4]*(-1);
        arr2[i] = sum;

        sum = data[i+1-(4*canvas.width)-4]*1 + data[i+1-(4*canvas.width)]*2 + data[i+1-(4*canvas.width)+4]*1
        + data[i+1-4]*0 + data[i+1]*0 + data[i+1+4]*0 
        + data[i+1+(4*canvas.width)-4]*(-1) + data[i+1+(4*canvas.width)]*(-2) + data[i+1+(4*canvas.width)+4]*(-1);
        arr2[i+1] = sum;

        sum = data[i+2-(4*canvas.width)-4]*1 + data[i+2-(4*canvas.width)]*2 + data[i+2-(4*canvas.width)+4]*1
        + data[i+2-4]*0 + data[i+2]*0 + data[i+2+4]*0 
        + data[i+2+(4*canvas.width)-4]*(-1) + data[i+2+(4*canvas.width)]*(-2) + data[i+2+(4*canvas.width)+4]*(-1);
        arr2[i+2] = sum;

        arr2[i+3] = data[i+3];
    }

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        arr[i] += arr2[i];
        arr[i+1] += arr2[i+1];
        arr[i+2] += arr2[i+2];
        arr[i+3] += arr2[i+3];
    }

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        data[i] = arr[i];
        data[i+1] = arr[i+1];
        data[i+2] = arr[i+2];
        data[i+3] = arr[i+3];
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1;

    histogram();
}

function laplace(){

    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data;
    let sum = 0;
    let arr = [];

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){

        sum = data[i-(4*canvas.width)-4]*0 + data[i-(4*canvas.width)] + data[i-(4*canvas.width)+4]*0 
        + data[i-4] + data[i]*(-4) + data[i+4]
        + data[i+(4*canvas.width)-4]*0 + data[i+(4*canvas.width)] + data[i+(4*canvas.width)+4]*0;
        arr[i] = sum;

        sum = data[i+1-(4*canvas.width)-4]*0 + data[i+1-(4*canvas.width)] + data[i+1-(4*canvas.width)+4]*0 
        + data[i+1-4] + data[i+1]*(-4) + data[i+1+4]
        + data[i+1+(4*canvas.width)-4]*0 + data[i+1+(4*canvas.width)] + data[i+1+(4*canvas.width)+4]*0;
        arr[i+1] = sum;

        sum = data[i+2-(4*canvas.width)-4]*0 + data[i+2-(4*canvas.width)] + data[i+2-(4*canvas.width)+4]*0 
        + data[i+2-4] + data[i+2]*(-4) + data[i+2+4]
        + data[i+2+(4*canvas.width)-4]*0 + data[i+2+(4*canvas.width)] + data[i+2+(4*canvas.width)+4]*0;
        arr[i+2] = sum;

        arr[i+3] = data[i+3];
    }

   for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        data[i] = arr[i];
        data[i+1] = arr[i+1];
        data[i+2] = arr[i+2];
        data[i+3] = arr[i+3];
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1;

    histogram();

    return arr;
}


function sharpening(){

    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data; 

    let arr = laplace();

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        data[i] -= arr[i];
        data[i+1] -= arr[i+1];
        data[i+2] -= arr[i+2];
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1;

    histogram();
}

function unsharpMasking(){
    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data; 

    let blur = boxblur();
    let razlika = [];

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        razlika[i] = data[i] - blur[i];
        razlika[i+1] = data[i+1] - blur[i+1];
        razlika[i+2] = data[i+2] - blur[i+2];
    }

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        data[i] += razlika[i];
        data[i+1] += razlika[i+1];
        data[i+2] += razlika[i+2];
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1;

    histogram();
}


function gaussian(){

    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let bla = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data;
    let sum = 0;

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        sum = data[i-(4*canvas.width)-4] + data[i-(4*canvas.width)]*2 + data[i-(4*canvas.width)+4]
        + data[i-4]*2 + data[i]*4 + data[i+4]*2
        + data[i+(4*canvas.width)-4] + data[i+(4*canvas.width)]*2 + data[i+(4*canvas.width)+4];

        data[i] = sum * 1/16;
        data[i+1] = sum * 1/16;
        data[i+2] = sum * 1/16;
    }
    
    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    
    padatki.push(bla);
    where = where+1;

    histogram();
}

function undo(){
    console.log(padatki);
    console.log("where: "+where);

    if(where >= 1){
        ctx.putImageData(padatki[where-1], 0, 0, 0, 0, canvas.width, canvas.height);
        where = where-1;
    }

   histogram();
}

function redo(){
    console.log(padatki);
    console.log("where: "+where);

    if(where < padatki.length){
        where = where+1;
        ctx.putImageData(padatki[where], 0, 0, 0, 0, canvas.width, canvas.height);
    }

    histogram();
}

let red = [];
let green = [];
let blue = [];


function histogram(){

    red[0] = 0;
    red[1] = 0;
    red[2] = 0;
    red[3] = 0;
    red[4] = 0;

    green[0] = 0;
    green[1] = 0;
    green[2] = 0;
    green[3] = 0;
    green[4] = 0;

    blue[0] = 0;
    blue[1] = 0;
    blue[2] = 0;
    blue[3] = 0;
    blue[4] = 0;

    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data;

    for(let i = 0; i < (canvas.width * canvas.height); i+=4){

        if(data[i] >= 0 && data[i] <= 51){
            red[0]++;
        }
        else if(data[i] >= 51 && data[i] <= 102){
            red[1]++; 
        }
        else if(data[i] >= 102 && data[i] <= 153){
            red[2]++; 
        }
        else if(data[i] >= 153 && data[i] <= 204){
            red[3]++; 
        }
        else if(data[i] >= 204 && data[i] <= 255){
            red[4]++; 
        }

        if(data[i+1] >= 0 && data[i+1] <= 51){
            green[0]++;
        }
        else if(data[i+1] >= 51 && data[i+1] <= 102){
            green[1]++; 
        }
        else if(data[i+1] >= 102 && data[i+1] <= 153){
            green[2]++; 
        }
        else if(data[i+1] >= 153 && data[i+1] <= 204){
            green[3]++; 
        }
        else if(data[i+1] >= 204 && data[i+1] <= 255){
            green[4]++; 
        }

        if(data[i+2] >= 0 && data[i+2] <= 51){
            blue[0]++;
        }
        else if(data[i+2] >= 51 && data[i+2] <= 102){
            blue[1]++; 
        }
        else if(data[i+2] >= 102 && data[i+2] <= 153){
            blue[2]++; 
        }
        else if(data[i+2] >= 153 && data[i+2] <= 204){
            blue[3]++; 
        }
        else if(data[i+2] >= 204 && data[i+2] <= 255){
            blue[4]++; 
        }

    }


    const cha = document.getElementById('chart');
    const myChart = new Chart(cha, {
        type: 'line',
        data: {
            labels: ['0-51', '51-102', '102-153', '153-204', '204-255'],
            datasets: [{
                label: 'Green',
                data: [green[0], green[1], green[2], green[3], green[4]],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.1)',
                ],  
                borderColor: 'rgba(0, 255, 0, 1)', 
            },
            {
                label: 'Blue',
                data: [blue[0], blue[1], blue[2], blue[3], blue[4]],
                backgroundColor: [
                    'rgba(0, 0, 255, 0.1)',
                ],
                borderWidth: 2,
                borderColor: 'rgba(0, 0, 255, 1)', 
            },
            {
                label: 'Red',
                data: [red[0], red[1], red[2], red[3], red[4]],
                backgroundColor: [
                    'rgba(255, 0, 0, 0.1)',
                ],
                borderWidth: 2,
                borderColor: 'rgba(255, 0, 0, 1)', 
            }],
            
        },
        
    });
}

// RISANJE
let coord = {x:0 , y:0}; 
   
let paint = false;
    

function getPosition(event){
  coord.x = event.clientX - canvas.offsetLeft;
  coord.y = event.clientY - canvas.offsetTop;
}

let color;
  
function startPainting(event){

    color = document.getElementById('barva').value;  

    if(document.getElementById('risanje').checked){ 
        paint = true;
        getPosition(event);
    }  
    else{
        paint = false;
    }
}
function stopPainting(){
    
    paint = false;

    if(document.getElementById('risanje').checked){
        let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
        padatki.push(imgPixels);
        where = where+1;
        histogram();
    }
}
    
function sketch(event){
  if (!paint) return;
  ctx.beginPath();
    
  ctx.lineWidth = 30;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';

  ctx.moveTo(coord.x, coord.y);
   
  getPosition(event);
   
  ctx.lineTo(coord.x , coord.y);
  ctx.stroke();
}

let x;
let matArr = [];

function customMatrix(){

    if(document.getElementById("matrika")){
        document.getElementById("matrika").remove();
    }

    x = document.getElementById("velikostMatrike").value;
    let div = document.createElement("div");
    div.id = "matrika";
    document.getElementById("polje").appendChild(div);

    let st = 0;

    for(let i = 0; i < x; i++){
        for(let j = 0; j < x; j++){
            let input = document.createElement("input");
            input.type = 'number';
            input.id = 'matrix'+st;
            input.style.width = '55px';
            input.style.height = '55px';
            input.style.fontSize = '30px';
            input.style.textAlign = 'center';
            input.min = "1";
            input.step = "1";
            document.getElementById("matrika").appendChild(input);
            st++;
        }
        document.getElementById("matrika").appendChild(document.createElement("br"));
    }

}

function uporabiMatriko(){

    let st = 0;

    for(let i = 0; i < x; i++){
        for(let j = 0; j < x; j++){
            matArr[st] = document.getElementById("matrix"+st).value;
            st++;
        }
    }

    let imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgPixels.data;
    let sum = 0;
    let arr = [];
    let check = 0;
    let checkFoo = 0;

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){

        let foo = Math.floor(x/2)*(-1);
        let vrstica = Math.floor(x/2)*(-1); // *2

        st = 0;
        sum1 = 0, sum2 = 0, sum3 = 0;

        for(let j = 0; j < x*x; j++){
              
            sum1 += data[i+(4*canvas.width*vrstica)+(foo*4)]*matArr[st];
            sum2 += data[(i+1)+((4*canvas.width*vrstica)+foo*4)]*matArr[st];
            sum3 += data[(i+2)+((4*canvas.width*vrstica)+foo*4)]*matArr[st];

            if(i==0){
                console.log("foo: "+foo);
                console.log("vrstica: "+vrstica);
                console.log("sestevek: "+i+(4*canvas.width)*vrstica+foo);
            }

            st++;

            if(foo == Math.floor(x/2)){
                checkFoo = 1;
                vrstica++;
            }
            else if(foo == Math.floor(x/2)*(-1)){
                checkFoo = 0;
            }

            if(checkFoo == 0)
                foo++;
            else{
                foo = Math.floor(x/2)*(-1);
                checkFoo = 0;
            }        
        }

        arr[i] = sum1;
        arr[i+1] = sum2;
        arr[i+2] = sum3;
        arr[i+3] = data[i+3];
    }

    for(let i = 0; i < (canvas.width * canvas.height)*4; i+=4){
        data[i] = arr[i];
        data[i+1] = arr[i+1];
        data[i+2] = arr[i+2];
        data[i+3] = arr[i+3];
    }

    ctx.putImageData(imgPixels, 0, 0, startCordX, startCordY, stopCordX - startCordX, stopCordY - startCordY);
    padatki.push(imgPixels);
    where = where+1; 
}


/* 
- popoln nadzor nad jedrom (custom matrike, custom dimenzij)
*/