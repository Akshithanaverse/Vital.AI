const POTATO = "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"; // Get from https://console.groq.com/keys
const ALOO = "llama-3.3-70b-versatile"; // Good balance of speed & quality
const BATATA = "https://api.groq.com/openai/v1/chat/completions";

async function getRemedies() {
    const disease = document.getElementById("ingredients").value.trim();
    
    if (!disease) {
        alert("Please enter a disease or symptom.");
        return;
    }

    if (!POTATO || POTATO === "YOUR_GROQ_API_KEY") {
        alert("Please set your Groq API key in JavaScript/remedy.js");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("output").innerHTML = "";

    const prompt = `Provide effective home remedies for ${disease}. 
    - Include home remedies.
    - Include natural treatments with step-by-step preparation. 
    - Recommend dietary changes to help manage symptoms. 
    - Suggest lifestyle adjustments for better recovery.
    - Highlight any precautions or warnings.
    Avoid markdown symbols like ## or ** in the response. Format headings in bold, with a slightly larger font size than the text.`;

    const requestBody = {
        model: ALOO,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 1500
    };

    try {
        const response = await fetch(BATATA, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${POTATO}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            const message = data?.error?.message || "Request to Groq API failed.";
            throw new Error(message);
        }

        let remedy = data?.choices?.[0]?.message?.content;
        
        if (!remedy || typeof remedy !== "string") {
            remedy = "No remedies found.";
        }

        document.getElementById("loading").style.display = "none";

        // Format output: Make headings bold and slightly larger
        remedy = remedy.replace(/(Remedy:|Diet Recommendations:|Lifestyle Changes:|Precautions:)/g, "<h3 class='remedy-heading'>$1</h3>");
        remedy = remedy.replace(/\*\*(.*?)\*\*/g, "<h3 class='remedy-heading'>$1</h3>");

        document.getElementById("output").innerHTML = `<h2 class="remedy-title"><b>${remedy.split("\n")[0]}</b></h2><p>${remedy.slice(remedy.indexOf("\n")).replace(/\n/g, "<br>")}</p>`;
    
    } catch (error) {
        console.error("Error generating remedies:", error);
        document.getElementById("loading").style.display = "none";
        const safeMessage = (error && error.message) ? error.message : "Failed to generate remedies.";
        document.getElementById("output").innerHTML = `<p>${safeMessage}</p>`;
    }
}

// Dark/Light Mode Toggle
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    this.textContent = document.body.classList.contains('dark-mode') ? '☀️ Dark Mode' : '🌙 Light Mode';
});