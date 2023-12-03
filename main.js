// Use IIFE
(()=>{ 
    "use strict"

    // Initialise global map to save Pokemon by Pokedex number and fill it
    let pokedex = new Map();
    loadPokemonFromAPI();

    // Save pokemon display object as a variable to save times accessing DOM
    pokemonDisplay = document.getElementById("pokemonDisplay");
    
    /* Bind functions to buttons */
    document.getElementById("getAllBtn").addEventListener("click", showPokemon);
    document.getElementById("searchBtn").addEventListener("click", searchPokemon);
    document.getElementById("getFreqAbilityBtn").addEventListener("click", getMostFrequentAbility);

    // Clear display by setting innerHTML to empty
    document.getElementById("clearBtn").addEventListener("click", ()=>{
        pokemonDisplay.innerHTML = "";
    });

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

        // Save the generation indicies from value hardcoded in HTML, using split to have an array of first dex number and last dex number
        let genIndices = document.getElementById("generationSelect").value.split(",");

        // Iterate by index from beginning until end of generation, based on indices in select option
        for(let i=+(genIndices[0]);i<=+(genIndices[1]);i++) {
            // Add each pokemon's name as a list item
            html += `<li>${pokedex.get(i)}</li>`
        }
        // Close the ul tag
        html += "</ul>"
        
        // Set the div for showing pokemon with the list created
        pokemonDisplay.innerHTML = html;
    }

    // Function to search pokemon
    async function searchPokemon() {
        // Get searchTerm from user's search and convert to lowercase to avoid mismatch due to capital letters
        const searchTerm = document.getElementById("searchBox").value.toLowerCase();

        // Initialise html with opening div tag
        let html = "<div>";

        if ([...pokedex.values()].includes(searchTerm)) {
            const searchedPokemon = await getPokemonFromAPIbyName(searchTerm);

            // Save abilities and moves to array
            const pokeAbilities = searchedPokemon.abilities.map(item => item.ability.name);
            const pokeMoves = searchedPokemon.moves.map(item => item.move.name);

            // Add pokemon data to html
            html += `
            <div>
                <img src="${searchedPokemon.sprites.other["official-artwork"].front_default}" alt="${searchTerm}" height="150px">
            </div>
            <div>
                <h3>${searchTerm}</h3>
                Type: ${searchedPokemon.types[0].type.name} ${searchedPokemon.types[1] !== undefined ? searchedPokemon.types[1].type.name : ""} <br>
                Abilities: ${pokeAbilities.join(", ")} <br>
                Moves: ${pokeMoves.join(", ")}
            </div>`;
        }
        else {
            // Print user a message that there were no search results
            html += `There is no Pokemon named "${searchTerm}" in the Pokedex`;
        }

        // Close div tag
        html += "</div>";

        // Set the div for showing pokemon with search result
        pokemonDisplay.innerHTML = html;
    }

    async function getPokemonFromAPIbyName(pokeName) {        
        try {
            // Fetch pokemon from API
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
            const pokemon = await response.json();
            
            return pokemon;            
        }
        catch (error) {
            // Alert user there was a problem retrieving the information
            alert("There was an error retrieving the information from the Pokemon API. Please try reloading the page or reach out to us.");
        }
    }

    // Function to search for most frequent ability in the Pokemon
    async function getMostFrequentAbility() {
        // Create map to count abilities - key is the ability name, value is the count
        const abilityCount = new Map();

        // Initialise variables to track max count of abilities and name of most frequent ability
        let maxCount = 0;
        let mostFrequentAbility = "";

        // Iterate over all the Pokemon in the pokedex
        for (const pokeName of pokedex.values()) {
            // In each iteration get the information about the current pokemon from the API
            const currPokemon = await getPokemonFromAPIbyName(pokeName);

            // Iterate over the abilities of the pokemon
            for (const item of currPokemon.abilities) {
                // Save abilityName for clarity
                let abilityName = item.ability.name;
                // Initialise abilityCounter as 1 (if first time ability is encountered)
                let abilityCounter = 1;

                // Check if ability has been encountered already
                // If so, save the counter ad the current count plus one
                // Otherwise the counter stays 1 as default
                if (abilityCount.has(abilityName)) abilityCounter = abilityCount.get(abilityName)+1;
                
                // Set the new ability count
                abilityCount.set(abilityName, abilityCounter);

                // Check if the ability count is more than the maximum so far
                // If so save the new maximum and the name of the most frequent ability so far
                if (abilityCounter > maxCount) {
                    maxCount = abilityCounter;
                    mostFrequentAbility = abilityName;
                }
            }
        }

        // Display most frequent ability to HTML
        pokemonDisplay.innerHTML = `The most frequent ability is ${mostFrequentAbility} with ${maxCount} pokemon having it.`

    }

    // Function to get information about a pokemon by it's name
    async function getPokemonFromAPIbyName(pokeName) {        
        try {
            // Fetch pokemon from API
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
            const pokemon = await response.json();
            
            return pokemon;            
        }
        catch (error) {
            // Alert user there was a problem retrieving the information
            alert("There was an error retrieving the information from the Pokemon API. Please try reloading the page or reach out to us.");
        }
    }

})()