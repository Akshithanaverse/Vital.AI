const API_KEY = "AIzaSyDc-9RM2Oeev_kZIVcYPtbkx-H6KbOqgAE"; // TODO: replace with your Gemini API key
const MODEL_NAME = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;


async function getRemedies() {
    const disease = document.getElementById("ingredients").value.trim(); // Fixed ID mismatch
    
    if (!disease) {
        alert("Please enter a disease or symptom.");
        return;
    }

    if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY") {
        alert("Please set your Gemini API key in JavaScript/remedy.js (API_KEY).");
        return;
    }

    document.getElementById("loading").style.display = "block"; // Show "Generating..." text
    document.getElementById("output").innerHTML = ""; // Clear previous remedies

    const prompt = `Provide effective home remedies for ${disease}. 
    - Include home remedies.
    - Include natural treatments with step-by-step preparation. 
    - Recommend dietary changes to help manage symptoms. 
    - Suggest lifestyle adjustments for better recovery.
    - Highlight any precautions or warnings.
    Avoid markdown symbols like ## or ** in the response. Format headings in bold, with a slightly larger font size than the text.`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            const message = data?.error?.message || "Request to Gemini API failed.";
            throw new Error(message);
        }

        const parts = data?.candidates?.[0]?.content?.parts;
        let remedy = Array.isArray(parts)
            ? parts.map(p => p.text).filter(Boolean).join("\n")
            : data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!remedy || typeof remedy !== "string") {
            remedy = "No remedies found.";
        }

        document.getElementById("loading").style.display = "none"; // Hide "Generating..." text

        // Format output: Make headings bold and slightly larger
        remedy = remedy.replace(/(Remedy:|Diet Recommendations:|Lifestyle Changes:|Precautions:)/g, "<h3 class='remedy-heading'>$1</h3>");
        remedy = remedy.replace(/\*\*(.*?)\*\*/g, "<h3 class='remedy-heading'>$1</h3>"); // Bold any additional headings

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
