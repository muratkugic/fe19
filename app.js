const pokemonSection = document.querySelector('.pokemon_section');
const hero = document.querySelector('.hero');
const btn = document.querySelector('.btn');
const battle = document.querySelector('.fight');
let arr = [];

hero.addEventListener('click', createCard);

async function createCard(e) {
    if (e.target !== e.currentTarget) {
        let src = e.target.src;
        let name = src.slice(26, -4);
        let pokemon = await getData(name);

        let health = pokemon.stats[5].stat.name;
        let healthValue = pokemon.stats[5].base_stat;
        let attack = pokemon.stats[4].stat.name;
        let attackValue = pokemon.stats[4].base_stat;
        let defense = pokemon.stats[3].stat.name;
        let defenseValue = pokemon.stats[3].base_stat;   

        const card = document.createElement('div');
        card.classList.add('pokemon_card');
        card.innerHTML = `
        <div class="wrapper">
            <div class="pokemon_card__image">
                <img src="img/${pokemon.name}.png" class="pokemon_image" alt="">
            </div>
            <div class="pokemon_card__name">
                ${pokemon.name}
            </div>

        <div class="pokemon_card__unit_stats">

            <div class="one-third">
                <div class="stat-name">${health}</div>
                <div class="stat">${healthValue}</div>
            </div>

            <div class="one-third">
                <div class="stat-name">${attack}</div>
                <div class="stat">${attackValue}</div>
            </div>

            <div class="one-third no_border">
                <div class="stat-name">${defense}</div>
                <div class="stat">${defenseValue}</div>
            </div>

        </div>

    </div>
    `;

        pokemonSection.append(card);

        // Create pokemon object
        let po = {
            "name": pokemon.name,
            "hp": healthValue,
            "ap": attackValue,
            "df": defenseValue
        };

        // Add pokemon to array
        arr.push(po);
    }
    checkCardCount();
    e.stopPropagation();
}

battle.addEventListener('click', () => {
    if (arr.length === 2) {
        rumble();
    }
});

const rumble = () => {
    let totalHp1 = arr[0].hp + arr[0].df;
    let ap1 = Math.floor(Math.random() * Math.floor(arr[0].ap));
    let totalHp2 = arr[1].hp + arr[1].df;
    let ap2 = Math.floor(Math.random() * Math.floor(arr[1].ap));
    let name1 = arr[0].name;
    let name2 = arr[1].name;

    let toggle = 0;
    while (totalHp1 > 0) {
        if (toggle === 0) {
            totalHp1 = totalHp1 - ap2;
            if (totalHp1 <= 0) {
                addWinnerDiv(name2);
                break;
            }
            ap2 = Math.floor(Math.random() * Math.floor(arr[1].ap));
            toggle = 1;
        }
        else {
            totalHp2 = totalHp2 - ap1;
            if (totalHp2 <= 0) {
                addWinnerDiv(name1);
                break;
            }
            ap1 = Math.floor(Math.random() * Math.floor(arr[0].ap));
            toggle = 0;
        }
    }
}


let addWinnerDiv;
$(() => {
    addWinnerDiv = (pokemonWinner) => {
        $(".winner").append(`<h1>The winner is ${pokemonWinner}</h1>`);
        $("h1").addClass("win-text");
    }
});


btn.addEventListener('click', () => {
    let winDiv = document.querySelectorAll('.win-text');
    if (winDiv) {
        for (const div of winDiv) {
            div.remove();
        }
    }
    
    let cardDivs = document.querySelectorAll('.pokemon_card')
    for (const card of cardDivs) {
        card.remove();
    }
    hero.addEventListener('click', createCard);
    arr = [];
});

const checkCardCount = () => {
    if (pokemonSection.childElementCount === 2) {
        hero.removeEventListener('click', createCard);
    }
}

const getData = async (name) => {
    let res = await fetch('https://pokeapi.co/api/v2/pokemon/' + name);
    let data = await res.json();
    return data;
}
