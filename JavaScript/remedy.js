
const MARZIPAN_SNORKEL = "AIzaSyCBoL4Cqc5w0VruBST3IEeEnAu1xxgJ80w"; 
const BUBBLEGUM_OCELOT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function getRemedies() {
    const disease = document.getElementById("ingredients").value.trim();

    if (!disease) {
        alert("Please enter a disease or symptom.");
        return;
    }

    if (!MARZIPAN_SNORKEL || MARZIPAN_SNORKEL === "YOUR_API_KEY_HERE") {
        alert("Please set your Gemini API key in remedy.js");
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
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
        }
    };

    try {
        const response = await fetch(`${BUBBLEGUM_OCELOT}?key=${MARZIPAN_SNORKEL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        // Handle errors
        if (!response.ok) {
            const message = data?.error?.message || `API Error: ${response.status}`;
            throw new Error(message);
        }

        // Check for valid response structure
        if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response structure from API");
        }

        let remedy = data.candidates[0].content.parts[0].text;

        if (!remedy || typeof remedy !== "string") {
            remedy = "No remedies found.";
        }

        document.getElementById("loading").style.display = "none";

        // Format output: Make headings bold and slightly larger
        remedy = remedy.replace(/(Remedy:|Home Remedies:|Diet Recommendations:|Dietary Changes:|Lifestyle Changes:|Lifestyle Adjustments:|Precautions:|Warnings:)/gi, "<h3 class='remedy-heading'>$1</h3>");
        remedy = remedy.replace(/\*\*(.*?)\*\*/g, "<h3 class='remedy-heading'>$1</h3>");

        // Split into title and content
        const lines = remedy.split("\n");
        const title = lines[0];
        const content = lines.slice(1).join("<br>");

        document.getElementById("output").innerHTML =
            `<h2 class="remedy-title"><b>${title}</b></h2>
            <p>${content}</p>`;

    } catch (error) {
        console.error("Error generating remedies:", error);
        document.getElementById("loading").style.display = "none";
        document.getElementById("output").innerHTML = 
            `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Dark/Light Mode Toggle
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    this.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});