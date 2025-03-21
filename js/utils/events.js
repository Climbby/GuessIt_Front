import { button, answersContainer, inputText } from '../domElements.js'
import { autoShrinkText, arraysEqual } from './funcs.js';

let dropdownItems;

export function initAutoComplete(users, randomUser) {  

  const dropdown = document.querySelector('#dropdown');

  inputText.addEventListener("input", () => {
    const input = inputText.value.toLowerCase();
    const userNames = users.map(user => user.nome);
    const filtered = userNames.filter(option => option.toLowerCase().includes(input));
    dropdown.innerHTML = "";

    if (input === "") {
      dropdown.style.display = "none";
      return;
    }

    if (filtered.length > 0) {
      filtered.forEach(option => {
        const item = document.createElement("div");
        item.textContent = option;

        item.onclick = () => {
          inputText.value = option;
          handleButtonClick(users, randomUser);  
          dropdown.style.display = "none";
        };
        dropdown.appendChild(item);
      });
      dropdown.style.display = "block";
      dropdownItems = dropdown.querySelectorAll('div');
      handleSelection(0);
    } 
    else {
      dropdown.style.display = "none";
    }
  });

  document.addEventListener("click", e => {
    if (e.target !== inputText) {
      dropdown.style.display = "none";
    }
    if (e.target == inputText && inputText.value !== "") {
      dropdown.style.display = "block";
    }
  });
}

export function submitAnswer(users, randomUser){

    button.addEventListener('click', () => {handleButtonClick(users, randomUser)});
}

export function inputTextSelection(users, randomUser){

  let selectedIndex = 0;

  inputText.addEventListener('keydown', event => {
  
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (selectedIndex < dropdownItems.length - 1) {
          selectedIndex++;
          handleSelection(selectedIndex);
        }        
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (selectedIndex > 0) {
          selectedIndex--;
          handleSelection(selectedIndex);
        }      
        break;
        
      case 'Enter':
        inputText.value = dropdownItems[selectedIndex].textContent;
        dropdown.style.display = "none";
        handleButtonClick(users, randomUser);   
        break;
    }
  });
};

function handleButtonClick(users, randomUser){

  const numCharacteristicas = Object.values(users[0]).length;

  users.forEach(person => {
    if (person.nome.toUpperCase() === inputText.value.toUpperCase()) { // if name is valid
      const newAnswer = document.createElement('div');
      newAnswer.classList.add('newAnswer');

      for (let i = 0; i < numCharacteristicas; i++) {
        const personVal = Object.values(person)[i];
        const randomVal = Object.values(randomUser)[i];
        const newCharacteristic = document.createElement('div');
        newCharacteristic.classList.add('newCharacteristic');
        newCharacteristic.textContent = personVal;

        if (personVal === person.id) continue;

        // Special logic for vibe
        if (personVal === person.vibe) {
          newCharacteristic.textContent = personVal.join(', ');
          personVal.forEach(caracteri => {
            if (randomVal.includes(caracteri)) {
              newCharacteristic.classList.add('contem');
            }
          });

          if (arraysEqual(personVal, randomVal)) {
            newCharacteristic.classList.remove('contem');
            newCharacteristic.classList.add('certo');
          }
        }

        // Altura logic
        if (personVal === person.altura) {
          if (personVal > randomVal) {
            newCharacteristic.textContent = personVal + ' ↓';
          } else if (personVal < randomVal) {
            newCharacteristic.textContent = personVal + ' ↑';
          }
        }

        if (personVal === randomVal) {
          newCharacteristic.classList.add('certo');
        }

        newAnswer.appendChild(newCharacteristic);
      }

      const index = users.indexOf(person);
      users.splice(index, 1);

      answersContainer.appendChild(newAnswer);
      autoShrinkText('.newAnswer', '.newCharacteristic');
    }
  });

  if (inputText.value.toUpperCase() === randomUser.nome.toUpperCase()) {
    const winner = document.createElement('p');
    winner.classList.add('ganhador');
    winner.textContent = `GANHASTE!! Era o ${randomUser.nome}`;
    answersContainer.appendChild(winner);
  }

  inputText.value = ""; 
}

function handleSelection(selectedIndex) {
  dropdownItems.forEach((item, index) => {
    item.classList.remove('selected'); // Remove old selection
    if (index === selectedIndex) {
      item.classList.add('selected'); // Add class to selected item
      item.scrollIntoView({
        block: 'nearest', // keeps it minimal (no big jump)
        behavior: 'smooth' // optional — smooth animation
      });
    }
  });
}