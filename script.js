const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("#transfer");
const fromText = document.querySelector("#fromText");
const toText = document.querySelector("#toText");
const icons = document.querySelectorAll("i");

selectTag.forEach((tag, id)=>{
    for(const countriesCode in countries){
       let selected;
       if(id == 0 && countriesCode == "en-GB"){
        selected = "selected";
       }else if(id == 1 && countriesCode == "hi-IN"){
        selected = "selected";
       }
       let option =  `<option value="${countriesCode}" ${selected}>${countries[countriesCode]}</option>`;
        tag.insertAdjacentHTML("beforeend",option);
    }
});

translateBtn.addEventListener(('click'), () =>{
    let Text = fromText.value;
    traslateFrom = selectTag[0].value,
    traslateTo = selectTag[1].value;
    if(!Text) return;
    toText.setAttribute("placeholder", "Translating...");

    let apiURL = 
    // `https://api.mymemory.translated.net/get?q=${Text}!&langpair=${traslateFrom}|${traslateTo}`;
    
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${traslateFrom}&tl=${traslateTo}&dt=t&q=${encodeURI(Text) }`;
    
    fetch(apiURL).then(res => res.json()).then(data =>{

        // toText.value = data.responseData.translatedText;

        toText.value = data[0][0][0];
        saveToHistory(Text, data[0][0][0]);


    });
});

icons.forEach(icon =>{
icon.addEventListener( 'click' , ({target}) =>{
       if(target.classList.contains("fa-copy")){
         if(target.id == "from"){
            navigator.clipboard.writeText(fromText.value);
         }else{
            navigator.clipboard.writeText(toText.value);
         }
       }
       else{
         let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
       }
});
});

 
// Language swap code

const swapBtn = document.getElementById("swapLangs");
swapBtn.addEventListener("click", () => {
  let tempLang = selectTag[0].value;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;

  let tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;
});


// Theme
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
});

// Clear button
document.getElementById("clearBtn").addEventListener("click", () => {
  fromText.value = "";
  toText.value = "";
});

const historyList = document.getElementById("historyList");
let translationHistory = JSON.parse(localStorage.getItem("translationHistory")) || [];

function updateHistoryUI() {
  historyList.innerHTML = ""; // Clear existing
  translationHistory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.original} ➜ ${item.translated}`;
    historyList.appendChild(li);
  });
}

function saveToHistory(original, translated) {
  translationHistory.unshift({ original, translated });
  if (translationHistory.length > 10) translationHistory.pop(); // Keep last 10 only
  localStorage.setItem("translationHistory", JSON.stringify(translationHistory));
  updateHistoryUI();
}

// Show history on page load
updateHistoryUI();


