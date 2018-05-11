document.addEventListener('DOMContentLoaded', () => {
  const mainForm = document.querySelector('#main-form');
  const form = document.querySelector('form');
  const submitButton = form.querySelector('button');
  const ul = document.querySelector('.main ul');
  const input = form.querySelector('input');
  
  const displayClock = () => {
    const timeDate = new Date();
    const clock = document.querySelector("#clock");
    const date = document.querySelector('#date');
    
    let hours = timeDate.getHours() % 12;
    let minutes = timeDate.getMinutes();
    let seconds = timeDate.getSeconds();
    
    if (hours.toString().length < 2) {
      hours = '0' + hours;
    }
    
    if (minutes.toString().length < 2) {
      minutes = '0' + minutes;
    }
    
    if (seconds.toString().length < 2) {
      seconds = '0' + seconds;
    }
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[timeDate.getDay()];
    
    const clockOutput = hours + ' : ' + minutes + ' . ' + seconds;
    const dateOutput = 'Looks like another ' + today;
    
    clock.textContent = clockOutput;
    date.textContent = dateOutput;
  }
  
  window.onload = clockFunction = () => {
    displayClock();
    setInterval(displayClock, 1000)
  }
  
  
  
  
  let itemsArray;
  if (localStorage.getItem('items') === null) {
    itemsArray = [];
  } else {
    itemsArray = JSON.parse(localStorage.getItem('items'));
  }
  
  let checkedArray;
  if (localStorage.getItem('checked') === null) {
    checkedArray = [];
  } else {
    checkedArray = JSON.parse(localStorage.getItem('checked'));
  }
  
  // Creates error message for when the input is empty
  const errorMessage = document.createElement('p');
  mainForm.appendChild(errorMessage);
  
  // Submit task into input field
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value === '') {
      errorMessage.textContent = 'Please enter a task';
    } else {
      itemsArray.push(input.value);
      localStorage.setItem('items', JSON.stringify(itemsArray));
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
  
  // Create and attach buttons onto list items
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
  
  // Give functionality to the delete list item button
  ul.addEventListener('click', (e) => {
    if (e.target.className === 'remove') {
      const li = e.target.parentNode;
      const liItemName = e.target.previousSibling.textContent;
      ul.removeChild(li);
      
      for (let i = 0; i < itemsArray.length; i++) {
        if (liItemName === itemsArray[i]) {
          itemsArray.splice(i, 1);
          localStorage.setItem('items', JSON.stringify(itemsArray));
        }
      }
      
      for (let i = 0; i < checkedArray.length; i++) {
         if (liItemName === checkedArray[i]) {
          checkedArray.splice(i, 1);
          localStorage.setItem('checked', JSON.stringify(checkedArray));
        }
      }
    }
  });
  
  // Apply a class on checked list items
  ul.addEventListener('change', (e) => {
    const li = e.target.parentNode;
    const liItemName = e.target.nextElementSibling.textContent;
    if (e.target.checked) {
      li.className = 'checked';
      checkedArray.push(liItemName);
      localStorage.setItem('checked', JSON.stringify(checkedArray));
    } else {
      li.className = '';
      for (let i = 0; i < checkedArray.length; i++) {
        if (liItemName === checkedArray[i]) {
          checkedArray.splice(i, 1);
          localStorage.setItem('checked', JSON.stringify(checkedArray));
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
