'use strict';
/*eslint */

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true}, 
    {name: 'bread', checked: false}
  ],
  hideCompleted: false,
  search: [
  ],
};


function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <input class="input-box hidden" type="text" name="hidden-input-box" placeholder="${item.name}">
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
    
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
    
  return items.join('');
}


function renderShoppingList() {
  let filteredItems = [ ...STORE.items ];
  if(STORE.hideCompleted){
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
  handleUserInput();
}


function renderSearchList() {
  let Items = [ ...STORE.search];
    
  const searchListItemsString = generateShoppingItemsString(Items);
  $('.js-shopping-list').html(searchListItemsString);
  handleUserInput();
}
    


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    if(newItemName === '') return;
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function checkItemToSearchList(itemName){
  console.log('Checking for item');
  STORE.items.forEach(element => {
    if(element['name'].startsWith(itemName)){
      STORE.search.push({name: element['name'], checked: element['checked']});
    }
  });
}

function removeFromSearchList(){
  STORE.search = [];
}

function handleItemSearch(){
  $('#js-shopping-list-search-form').submit(function(event) {
    event.preventDefault();
    console.log('Handle item search ran');
    const newItemSearch = $('.js-shopping-list-search-entry').val();
    if(newItemSearch === '') return;
    console.log(newItemSearch);
    checkItemToSearchList(newItemSearch);
    renderSearchList();
    removeFromSearchList();
  });  

}

function toggleHideItems(){
  STORE.hideCompleted= !STORE.hideCompleted;
}

function handleToggleHideClick(){
  $('#toggle-completed-filter').click(() => {
    toggleHideItems();
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


function removeListItem(itemIndex){
  console.log('Removing item from shopping list at index' + itemIndex);
  STORE.items.splice(itemIndex,1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    removeListItem(itemIndex);
    renderShoppingList();
  });
}

function handleEditItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    console.log('handle Edit Item Ran');
    const parentIndexHidden = $(event.currentTarget).closest('li').find('.hidden');
    const parentIndexShoppingItem = $(event.currentTarget).closest('li').find('.shopping-item');
    parentIndexHidden.hasClass('hidden') ? parentIndexHidden.removeClass('hidden') : parentIndexHidden.addClass('hidden');
    parentIndexShoppingItem.hasClass('hidden') ? parentIndexShoppingItem.removeClass('hidden') : parentIndexShoppingItem.addClass('hidden');
  });
}

function addUserInput(itemIndex, value){
  if(value === ''){
    return;
  }
  STORE.items[itemIndex].name = value;
  if(STORE.items[itemIndex].checked === true){
    STORE.items[itemIndex].checked = false;
  }
}

function handleUserInput() {
  $('.input-box').keyup(function (event){
    if(event.which === 13){
      console.log("hello world");
      const itemIndex = getItemIndexFromElement(event.currentTarget);
      addUserInput(itemIndex, event.currentTarget.value);
      renderShoppingList();
    }
  });
}



// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleItemSearch();
  handleDeleteItemClicked();
  handleEditItemClicked();
  handleToggleHideClick();
  handleUserInput();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);