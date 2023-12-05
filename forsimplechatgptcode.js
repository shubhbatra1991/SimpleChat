const API_KEY="your api key";
const API_URL="https://api.openai.com/v1/chat/completions";

const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const stopBtn = document.getElementById("stopBtn");
const resultText = document.getElementById("resultText");


const generate = async() => {
    if(!promptInput.value){
        alert("please enter a prompt");
        return;
    }

    generateBtn.disabled = true;
    resultText.innerText = "Generating...";

    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`
            },
            body:JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: promptInput.value}],
                stream: true,
            }),
        });
        const data = await response.json()
        resultText.innerText = data.choices[0].message.content;
        
    } catch(error){
        resultText.innerText = "Error occured while generating.";
        console.error("Error: ", error);
    } finally{
        generateBtn.disabled = false;
    }
};

generateBtn.addEventListener("click", generate);
promptInput.addEventListener("keyup", (event) => {
    if(event==="Enter"){
        generate();
    }
});
