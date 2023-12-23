// e.g htmlElement("#id")
// e.g htmlElement(".class")
// e.g htmlElement("tag")
const htmlElement = (id) => document.querySelector(id);

// e.g cssClass("#id", "add", "myClass")
// e.g cssClass(".class", "remove", "myClass")
// e.g cssClass("tag", "toggle", "myClass")
const cssClass = (selector="", action="", cssClass="", element=htmlElement(selector)) => {
  switch (action) {
    case "add":
      element.classList.add(cssClass);
      break;
    case "remove":
      element.classList.remove(cssClass);
      break;
    case "toggle":
      element.classList.toggle(cssClass);
      break;
    default:
      break;
  }
}
  
// e.g changeText("#id", "lorem ipso")
// e.g changeText(".class", "lorem ipso")
// e.g changeText("tag", "lorem ipso")
const changeText = (selector="", txt="", element=htmlElement(selector)) => element.textContent=txt;
//const changeText = (selector="", txt="", element=$(selector)) => element.text(txt);

// e.g addGlobalEventListener("click", "selector", nextQ)
function addGlobalEventListener(typeOfEvent="", selector="", callback, stopPropagation=true) {
  document.addEventListener(typeOfEvent, (eventObj) => {
    if (eventObj.target.matches(selector)) callback();
    if (stopPropagation) eventObj.stopPropagation();
  })
}

// Timer object 
const timeElement = htmlElement("#q-timer")
const Timer = {
  timerInterval: undefined,
  timeoutInterval: undefined,
  timeoutSet: (callBack, ms=1000)=> Timer.timeoutInterval = setTimeout(callBack, ms),
  timeoutClr: ()=> clearTimeout(Timer.timeoutInterval),
  setActive : (bool = timeElement.dataset.active)=> timeElement.dataset.active = bool.toString(), 
  active : ()=> String(timeElement.dataset.active),
  setTime : (time = Timer.getTime())=> timeElement.textContent = `${time}s`,
  getTime : ()=> parseInt(timeElement.textContent),
  start : (ms=1000)=> {Timer.timerInterval = setInterval(Timer.countdown, ms); Timer.setActive(true)},
  stop : ()=> {clearInterval(Timer.timerInterval); Timer.setActive(false)},
  deductTime : (time)=> timeElement.textContent=Timer.getTime()-time,
  countdown: ()=> {Timer.deductTime(1); if(Timer.getTime()<1) Timer.outOfTime();},
  outOfTime: ()=> {Timer.setTime(0); endScreen();},
}

// e.g soundVar("path/to/soundFile.wav")
const soundVar = (src="", audio=document.createElement("audio"), set=audio.setAttribute("src", src)) => audio
const correct = soundVar("assets/sfx/correct.wav");
const incorrect = soundVar("assets/sfx/incorrect.wav");
const soundsLibrary = {
  sounds: {
    correct : correct,
    incorrect : incorrect}, 
  stop : (s = Object.values(soundsLibrary.sounds)) => s.forEach(sound => {sound.pause(); sound.currentTime = 0;}),
  play : (stop = soundsLibrary.stop())=> ({
    correct : ()=> soundsLibrary.sounds.correct.play(),
    incorrect : ()=> soundsLibrary.sounds.incorrect.play(),}),
}

document.addEventListener('DOMContentLoaded', function () {
   // Trigger the Trivia Level Modal on page load
   //var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
   //myModal.show();
   
   // SU: attempt to fix slider jumping when page loads
   //const qSlider = document.createElement("input");
   const qSlider = htmlElement("#q-slider");
   //qSlider.setAttribute("type","range");
   //qSlider.setAttribute("min","32");
   //qSlider.setAttribute("max","64");
   qSlider.setAttribute("value", localStorage.getItem("q-font-size")||"48");
   $('#q-a').css("font-size", `${localStorage.getItem("q-font-size")||"48"}px`);
   //qSlider.setAttribute("id","q-slider");
   //qSlider.setAttribute("step","4");
   //htmlElement(".small-font").after(qSlider)
});

/* MT */
// slider for Q/A font size 
$("#q-slider").on("input", function () {
  $('#q-a').css("font-size", $(this).val() + "px");
  /* SU: storing font size to local storage */
  localStorage.setItem("q-font-size", $(this).val())
});

// get the questions from API
const getQuestions = (mode, number) => {
  const url = `https://opentdb.com/api.php?amount=${number}&category=18&difficulty=${mode}&type=multiple`;  

  fetch(url)
  .then(response => response.json())
  .then(data => console.log(data.results))
}

// getQuestions('easy', 10)
