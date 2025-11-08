
const TOASTED_FLAMINGO = "AIzaSyCSnC2-HsX1aDZIoB9L7NWxjNHYHVoiB8M"; 
const VORTEX_PICKLE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function generateRecipe() {
    const ingredients = document.getElementById("ingredients").value.trim();

    if (!ingredients) {
        alert("Please enter ingredients.");
        return;
    }

    if (!TOASTED_FLAMINGO || TOASTED_FLAMINGO === "YOUR_API_KEY_HERE") {
        alert("Please set your Gemini API key in recipe.js");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("output").innerHTML = "";

    const prompt = `Generate a structured recipe using these ingredients: ${ingredients}.
    - Recipe title (should be catchy)
    - Sustainability score of the recipe 
    - Structured ingredients list with quantities
    - Step-by-step instructions
    - Estimated cooking time and servings.
    Avoid markdown symbols like ## or ** in the response.
    Keep the language simple and suitable for students.`;

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
        const response = await fetch(`${VORTEX_PICKLE}?key=${TOASTED_FLAMINGO}`, {
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

        let recipe = data.candidates[0].content.parts[0].text;

        document.getElementById("loading").style.display = "none";
        
        // Simple formatting
        recipe = recipe.replace(/##\s*/g, "").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

        // Title = first line, rest = description
        const lines = recipe.split("\n");
        const title = lines[0];
        const content = lines.slice(1).join("<br>");

        document.getElementById("output").innerHTML =
            `<h2 class="recipe-title">${title}</h2>
            <p>${content}</p>`;

    } catch (error) {
        console.error("Error generating recipe:", error);
        document.getElementById("loading").style.display = "none";
        document.getElementById("output").innerHTML = 
            `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Dark/Light Mode Toggle
document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        this.textContent = "☀️ Light Mode";
    } else {
        this.textContent = "🌙 Dark Mode";
    }
});