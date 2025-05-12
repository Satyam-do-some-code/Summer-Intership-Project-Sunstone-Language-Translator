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

