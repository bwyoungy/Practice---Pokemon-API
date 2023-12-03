// Use IIFE
(()=>{ 
    "use strict"

    // Initialise global map to save Pokemon by Pokedex number and fill it
    let pokedex = new Map();
    loadPokemonFromAPI();
    
    // Bind loadPokemon function to get All button
    document.getElementById("getAllBtn").addEventListener("click", showPokemon);

    // Function to load all Pokemon to the pokedex
    async function loadPokemonFromAPI() {        
        try {
            // Fetch pokemon from API
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1017`);
            const pokemonAPI = await response.json();
            
            // Iterate over the pokemon recieved and save to pokedex by pokedex number (extracted from url using slice and converted to number)
            for (const pokemon of pokemonAPI.results) {
                pokedex.set(+(pokemon.url.slice(34,-1)), pokemon.name)
            }            
        }
        catch (error) {
            // Alert user there was a problem retrieving the information
            alert("There was an error retrieving the information from the Pokemon API. Please try reloading the page or reach out to us.");
        }
    }

    // Function to show Pokemon based on generation number selected
    function showPokemon() {
        // Initialise html with ul opening tag
        let html = "<ul>";

        // Iterate by index from 1 until the generation number wanted
        for(let i=1;i<=document.getElementById("generationSelect").value;i++) {
            // Add each pokemon's name as a list item
            html += `<li>${pokedex.get(i)}</li>`
        }
        // Close the ul tag
        html += "</ul>"
        
        // Set the div for showing pokemon with the list created
        document.getElementById("shownPokemon").innerHTML = html;
    }
})()