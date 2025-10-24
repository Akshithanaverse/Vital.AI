const POTATO = "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"; // Get from https://console.groq.com/keys
const ALOO = "llama-3.3-70b-versatile";
const BATATA = "https://api.groq.com/openai/v1/chat/completions";

async function generateRecipe() {
    const ingredients = document.getElementById("ingredients").value.trim();
    
    if (!ingredients) {
        alert("Please enter ingredients.");
        return;
    }

    if (!POTATO || POTATO === "YOUR_GROQ_API_KEY") {
        alert("Please set your Groq API key in JavaScript/recipe.js");
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

        let recipe = data?.choices?.[0]?.message?.content;
        
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

// Dark/Light Mode Toggle
document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        this.textContent = "☀️ Light Mode";
    } else {
        this.textContent = "🌙 Dark Mode";
    }
});