let place = document.getElementById('location').innerText;
let month = document.getElementById('month').innerText;
let color = document.getElementById('color').innerText;
const user = document.getElementById('user').value
let personality = document.getElementById('personality').innerText;
let activity1 = document.getElementById('activity1').innerText;
let activity2 = document.getElementById('activity2').innerText;
const pokemonTeam = {
  'eat': ['snorlax','garchomp','gyarados'],
  'tempered': ['kingdra','haxorus','salamence'],
  'persistant': ['greninja','espeon','lucario'],
  'curious': ['gengar','dragonite','greninja'],
  'lose': ['blaziken','lucario','incineroar'],
  'sarcastic': ['gengar','charizard','infernape'],
  'sports': ['lucario','incineroar','greninja'],
  'music': ['noivern','crobat','gardevoir'],
  'gym': ['incineroar','heracross','medicham'],
  'games': ['greninja','umbreon','alakazam'],
  'hiking': ['tyranitar','garchomp','excadrill'],
  'cooking': ['snorlax','alakazam','infernape'],
  'sports2': ['blaziken','weavile','medicham'],
  'music2': ['milotic','alakazam','espeon'],
  'gym2': ['lucario','dragonite','haxorus'],
  'videoGames2': ['metagross','scizor','lucario'],
  'hiking2': ['volcarona','crobat','noivern'],
  'cooking2': ['volcarona','haxorus','espeon'],
  'East-Coast': ['kingdra','gyarados','blastoise'],
  'West-Coast': ['charizard','infernape','blaziken'],
  'South-Coast': ['volcarona','incineroar','dragonite'],
  'Mid-West': ['heracross','umbreon','venusaur'],
  'red': ['volcarona','blaziken','scizor'],
  'orange': ['charizard','volcarona','incineroar'],
  'yellow': ['dragonite','alakazam','umbreon'],
  'green': ['venusaur','tyranitar','haxorus'],
  'blue': ['blastoise','kingdra','gyarados'],
  'violet': ['crobat','gengar','espeon'],
  'black': ['umbreon','weavile','noivern'],
  'January': ['greninja','weavile','milotic'],
  'February': ['gyarados','blastoise','metagross'],
  'March': ['gardevoir','venusaur','medicham'],
  'April': ['kingdra','charizard','crobat'],
  'May': ['salamence','milotic','noivern'],
  'June': ['volcarona','snorlax','heracross'],
  'July': ['haxorus','weavile','excadrill'],
  'August': ['gardevoir','scizor','umbreon'],
  'September': ['espeon','greninja','garchomp'],
  'October': ['umbreon','gengar','alakazam'],
  'November': ['weavile','kingdra','milotic'],
  'December': ['weavile','gyarados','salamence']
}
let userStats = [ place, month, color, personality, activity1, activity2];
let pokemonNumInList = 0;

console.log(color);
console.log(activity2);
let pokemonList = []
const pokemonDis = document.getElementsByClassName('pokemonDisplay')

pickPokemon();

// picks a random pokemon based on profile stats
function pickPokemon() {

  userStats.forEach(function(val, i){
    let num = Math.random()
    let pokemon = pokemonTeam[val][Math.floor(num * pokemonTeam[val].length)];

    //pokemonList.indexOf(pokemon) === -1 ? pokemonList.push(pokemon) : pickPokemon();
    if(pokemonNumInList < 6){
      addOrNot(pokemon)
    }else{
      pokemonList.forEach(function(el,i){
        pokemonDis[i].style.background = `url(pokemon-images/${el}.jpg)`
      })
    }
  })

}

function addOrNot(poke){
  if(pokeCheck(poke)){
    pickPokemon();
  }else{
    pokemonList.push(poke)
    ++pokemonNumInList
  }
}

const save = document.getElementById('save')

save.addEventListener('click', function(){
  fetch('save',{
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'user': user,
      'poke1': pokemonList[0],
      'poke2': pokemonList[1],
      'poke3': pokemonList[2],
      'poke4': pokemonList[3],
      'poke5': pokemonList[4],
      'poke6': pokemonList[5]
    })
  })
})
//checks to see if pokemon is already in the team
function pokeCheck(p){
  let check = false;
  pokemonList.forEach(function(el){
    if (p === el){
      check = true;
    }
  })
  return check
}
