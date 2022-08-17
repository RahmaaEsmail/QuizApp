let count =document.querySelector('.count span')
let bulletsElement=document.querySelector('.bullets')
let bullets=document.querySelector('.bullets .spans')
let quizArea=document.querySelector('.quiz-area')
let quizAnswer=document.querySelector('.quiz-answer')
let submitBtn=document.querySelector('.submit')
let resultAnswer=document.querySelector('.result')
let quiz=document.querySelector('.quiz-all')
let count_down=document.querySelector('.count-down')
var currentIndex=0;
let right_answer=0;
let intervalCount;
function getQuestions()
{
let myRequest=new XMLHttpRequest();

myRequest.onreadystatechange=function()
{
    if (this.readyState === 4 && this.status === 200) {
        let questionsObject = JSON.parse(this.responseText);
        let qcount=questionsObject.length;
  
        createCountAndBullet(qcount)
    
        // add questions
        addQuestions(questionsObject[currentIndex],qcount)

        // countdown
        countDown(7,qcount)
       submitBtn.onclick=function()
       {
        let rightAnswer=questionsObject[currentIndex].right_answer
        currentIndex++;
        submitAnswer(rightAnswer,qcount)
       
        // next qusetion
        quizArea.innerHTML=''
        quizAnswer.innerHTML=''
        addQuestions(questionsObject[currentIndex],qcount)


        // handle bullet
        handleBullets()
         
        // countdown
        clearInterval(intervalCount)
        countDown(7,qcount)

        // show result
        showResult(qcount)
       }
        
  }
}

myRequest.open("GET",`html_questions.json`,true);
myRequest.send();
}
getQuestions()


function createCountAndBullet(num)
{
  
    count.innerHTML=num;
    
    for(var i=0;i<num;i++)
    {
        let theBullet = document.createElement("span");
        if(i===0)
        {
            theBullet.className = "on";
        }
        bullets.appendChild(theBullet);
    
}
}


function addQuestions(obj,count)
{
    if(currentIndex <count)
    {

    let questionTitle=document.createElement('h2');
    let questionTxt=document.createTextNode(obj.title);
    questionTitle.appendChild(questionTxt)
    quizArea.appendChild(questionTitle)
   

    for(var i=1;i<=4;i++)
    {


    let divAns=document.createElement('div')
    divAns.className='answer p-2';

    let radioInput=document.createElement('input');
    radioInput.name='questions';
    radioInput.type='radio';
    radioInput.id=`asnwer_${i}`;
    radioInput.dataset.answer=obj[`answer_${i}`]

    if(i===1)
    {
        radioInput.checked=true
    }

    let label=document.createElement('label');
    label.htmlFor=`asnwer_${i}`;
    label.className='ms-2';
    
    let labelTxt=document.createTextNode(obj[`answer_${i}`]);
    label.appendChild(labelTxt);

    divAns.appendChild(radioInput)
    divAns.appendChild(label)
 
    quizAnswer.appendChild(divAns)
    }
    }
    
}


function submitAnswer(rAnswer,count)
{
    var choosenAnswer;
    let inputs=document.getElementsByName('questions');
    for(var i=0;i<inputs.length;i++)
    {
        if(inputs[i].checked)
        {
            choosenAnswer=inputs[i].dataset.answer;
        }
    }
  if(rAnswer===choosenAnswer)
  {
    right_answer++;
  }
 
}

function handleBullets()
{
    let bulletsSpans=document.querySelectorAll('.bullets .spans span');
    let arrayOfBullets=Array.from(bulletsSpans);
    arrayOfBullets.forEach((span,index)=>{
        if(index===currentIndex)
         span.className='on'
    })
}


function showResult(count)
{
    let theResults;
    if(currentIndex === count)
    {
        quizAnswer.remove()
        quizArea.remove()
        submitBtn.remove()
        bulletsElement.remove()
        quiz.remove()

        if(right_answer >(count/2) && right_answer <count)
        {
            theResults =`<h4><span class="fw-bold good">Good </span> ,You Answered ${right_answer} from ${count}</h4>`
        }
        else if(right_answer === count)
        {
            theResults =`<h4><span class='fw-bold perfect'>Perfect</span> ,You Answered ${right_answer} from ${count}</h4>`
        }
        else{
            theResults =`<h4><span class='fw-bold bad'>Bad</span>,You Answered ${right_answer} from ${count}</h4>`
        }
        resultAnswer.innerHTML=theResults
    }
    

}


function countDown(duration,count)
{
    if(currentIndex<count)
    {
     let minutes,seconds;
     intervalCount=setInterval(function()
     {
         minutes=parseInt(duration/60);
         seconds=parseInt(duration%60);

         minutes=minutes<10 ?`0${minutes}`:minutes;
         seconds=seconds<10 ?`0${seconds}`:seconds;
        
         count_down.innerHTML=`${minutes}:${seconds}`
         if(--duration <0)
         {
            clearInterval(intervalCount)
            submitBtn.click()
         }
     },1000)
    }
}

