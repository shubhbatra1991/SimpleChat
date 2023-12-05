const API_KEY="Your_api_key";
const API_URL="https://api.openai.com/v1/chat/completions";

const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const stopBtn = document.getElementById("stopBtn");
const resultText = document.getElementById("resultText");

let controller = null; //for stop


const generate = async() => {
    if(!promptInput.value){
        alert("please enter a prompt");
        return;
    }

    generateBtn.disabled = true;
    resultText.innerText = "Generating...";
    stopBtn.disabled = false; //for stop

    controller = new AbortController();
    const signal = controller.signal; //for stop
sssssssss
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
            signal, //forstop
        });
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        resultText.innerText= "";

        while(true){
            const chunk = await reader.read();
            const {done, value} = chunk;
            if(done){
                break;
            }
            const decodedChunk = decoder.decode(value);
            const lines = decodedChunk.split("\n");
            const parsedLines = lines.map(line => line.replace(/^data: /,"").trim()
            ).filter(line => line !== "" && line !== "[DONE]")
            .map((line )=> JSON.parse(line));

            for(const parsedLine of parsedLines){
                const { choices } = parsedLine
                const {delta} = choices[0]
                const {content} = delta;
                if(content){
                    resultText.innerText += content;
                }
            }
        }
        
    } catch(error){
        // for stop first 3 lines remove if else and let else be there
        if(signal.aborted){
            resultText.innerText = "Request Aborted.";
        } else{
            resultText.innerText = "Error occured while generating.";
            console.error("Error: ", error);
        }

    } finally{
        generateBtn.disabled = false;
       stopBtn.disabled = true;
       controller = null;
    }
};

const stop = () => {
    if(controller){
        controller.abort();
        controller = null;
    }
}

generateBtn.addEventListener("click", generate);
promptInput.addEventListener("keyup", (event) => {
    if(event==="Enter"){
        generate();
    }
});
stopBtn.addEventListener("click", stop);