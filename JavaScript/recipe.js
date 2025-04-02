const API_KEY = "AIzaSyDDXsd4LTHzEPPTz0cEnEcJfbg4_fLRnMg"; // Replace with your actual API key
const MODEL_NAME = "gemini-1.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

async function generateRecipe() {
    const ingredients = document.getElementById("ingredients").value.trim();
    
    if (!ingredients) {
        alert("Please enter ingredients.");
        return;
    }

    document.getElementById("loading").style.display = "block"; // Show "Generating..." text
    document.getElementById("output").innerHTML = ""; // Clear previous recipe

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
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        let recipe = data.candidates?.[0]?.content?.parts?.[0]?.text || "No recipe found.";

        document.getElementById("loading").style.display = "none"; // Hide "Generating..." text

        // Remove markdown symbols like "##" and "**"
        recipe = recipe.replace(/##\s*/g, "").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

        document.getElementById("output").innerHTML = `<h2 class="recipe-title">${recipe.split("\n")[0]}</h2><p>${recipe.slice(recipe.indexOf("\n")).replace(/\n/g, "<br>")}</p>`;
    
    } catch (error) {
        console.error("Error generating recipe:", error);
        document.getElementById("output").innerHTML = "<p>Failed to generate recipe. Please try again.</p>";
    }
}

// Dark/Light Mode Toggle
document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});