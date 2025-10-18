const POTATO = "AIzaSyAXuA3Da9yh5vF34iLrbUiSnohZPh-8bJ0"; // TODO: replace with your Gemini API key
const ALOO = "gemini-2.5-flash";
const BATATA = `https://generativelanguage.googleapis.com/v1beta/models/${ALOO}:generateContent?key=${POTATO}`;

async function generateRecipe() {
    const ingredients = document.getElementById("ingredients").value.trim();
    
    if (!ingredients) {
        alert("Please enter ingredients.");
        return;
    }

    if (!POTATO || POTATO === "YOUR_GEMINI_API_KEY") {
        alert("Please set your Gemini API key in JavaScript/recipe.js (API_KEY).");
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
    Avoid markdown symbols like ## or ** in the response.`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const response = await fetch(BATATA, {
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
        let recipe = Array.isArray(parts)
            ? parts.map(p => p.text).filter(Boolean).join("\n")
            : data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!recipe || typeof recipe !== "string") {
            recipe = "No recipe found.";
        }

        document.getElementById("loading").style.display = "none";

        recipe = recipe.replace(/##\s*/g, "").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

        document.getElementById("output").innerHTML = `<h2 class="recipe-title">${recipe.split("\n")[0]}</h2><p>${recipe.slice(recipe.indexOf("\n")).replace(/\n/g, "<br>")}</p>`;
    
    } catch (error) {
        console.error("Error generating recipe:", error);
        document.getElementById("loading").style.display = "none";
        const safeMessage = (error && error.message) ? error.message : "Failed to generate recipe.";
        document.getElementById("output").innerHTML = `<p>${safeMessage}</p>`;
    }
}

// Dark/Light Mode Toggle - FIXED
document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        this.textContent = "☀️ Light Mode";
    } else {
        this.textContent = "🌙 Dark Mode";
    }
});