'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const mainForm = document.querySelector('#main-form');
  const form = document.querySelector('form');
  const submitButton = form.querySelector('button');
  const ul = document.querySelector('.main ul');
  const input = form.querySelector('input');
  const clearButton = mainForm.querySelector('#clear-button');
  
  // Function to display time on screen 
  const displayClock = () => {
    const timeDate = new Date();
    const clock = document.querySelector("#clock");
    const date = document.querySelector('#date');
    
    let hours = timeDate.getHours() % 12;
    let minutes = timeDate.getMinutes();
    let dayOrNight = '';
    
    if (hours.toString().length < 2) {
      hours = '0' + hours;
    }
    
    if (minutes.toString().length < 2) {
      minutes = '0' + minutes;
    }

    if (timeDate.getHours() <= 12) {
      dayOrNight = 'AM';
    } else {
      dayOrNight = 'PM';
    }
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[timeDate.getDay()];
    
    const clockOutput = hours + ' : ' + minutes + ' ' + dayOrNight;
    const dateOutput = 'Looks like another ' + today;
    
    clock.textContent = clockOutput;
    date.textContent = dateOutput;
  }
  
  window.onload = clockFunction = () => {
    displayClock();
    setInterval(displayClock, 1000)
  }
  
  
  // Code for creating list items and giving functionality begins here  


  // Create an array for list items to be stored for local storage
  let itemsArray; 
  if (localStorage.getItem('items') === null) {
    itemsArray = [];
  } else {
    itemsArray = JSON.parse(localStorage.getItem('items'));
  }
  
  // Create an array for checked list items to be stored for local storage
  let checkedArray;
  if (localStorage.getItem('checked') === null) {
    checkedArray = [];
  } else {
    checkedArray = JSON.parse(localStorage.getItem('checked'));
  }
  
  // Creates error message for when the input is empty
  const errorMessage = document.createElement('p');
  mainForm.appendChild(errorMessage);
  
  // Function to set list items to local storage
  const setLocalStorage = (key, array) => {
    return localStorage.setItem(key, JSON.stringify(array));
  }

  // Submit task into input field
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value === '') {
      errorMessage.textContent = 'Please enter a task';
    } else {
      itemsArray.push(input.value);
      setLocalStorage('items', itemsArray);
      createListContent(input.value);
      input.value = '';
      errorMessage.textContent = ''; 
    }
  });
 
  // Generate list item and append onto list 
  const createListContent = text => {
    const span = document.createElement('span');
    const li = document.createElement('li');
    span.textContent = text;
    li.appendChild(span);
    ul.appendChild(li);
    createButtons(li);
  }
  
  //Create and attach buttons onto list items
  const createButtons = li => {
    const listItem = li.firstElementChild;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    li.insertBefore(checkbox, listItem);
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.className = 'remove';
    li.insertBefore(removeButton, listItem.nextElementSibling);
  }
  
  // Give functionality to the delete button
  ul.addEventListener('click', (e) => {
    if (e.target.className === 'remove') {
      const li = e.target.parentNode;
      const liItemName = e.target.previousSibling.textContent;
      ul.removeChild(li);
      
      for (let i = 0; i < itemsArray.length; i++) {
        if (liItemName === itemsArray[i]) {
          itemsArray.splice(i, 1);
          setLocalStorage('items', itemsArray);
        }
      }
      
      for (let i = 0; i < checkedArray.length; i++) {
         if (liItemName === checkedArray[i]) {
          checkedArray.splice(i, 1);
          setLocalStorage('checked', checkedArray);
        }
      }
    }
  });
  
  // Clear list items on screen
  clearButton.addEventListener('click', (e) => {
    ul.innerHTML = '';
    // Clear items on local storage array
    itemsArray = [];
    setLocalStorage('items', itemsArray);
  })

  // Apply a class on checked list items
  ul.addEventListener('change', (e) => {
    const li = e.target.parentNode;
    const liItemName = e.target.nextElementSibling.textContent;
    if (e.target.checked) {
      li.className = 'checked';
      checkedArray.push(liItemName);
      setLocalStorage('checked', checkedArray);
    } else {
      li.className = '';
      for (let i = 0; i < checkedArray.length; i++) {
        if (liItemName === checkedArray[i]) {
          checkedArray.splice(i, 1);
          setLocalStorage('checked', checkedArray);
        }
      }
    }
  });
  
  // Loop through local storage to create list items and display on page on refresh
  for (let i = 0; i < itemsArray.length; i++) {
    createListContent(itemsArray[i]);
    for (let j = 0; j < checkedArray.length; j++) {
      if (itemsArray[i] === checkedArray[j]) {
        const localStorageLi = ul.getElementsByTagName('LI')[i];
        const localStorageCheckbox = localStorageLi.querySelector('input');
        localStorageLi.className = 'checked';
        localStorageCheckbox.checked = true;
      }
    }
  }
});
