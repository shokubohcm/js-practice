'use strict';

const storage = localStorage;

const table = document.querySelector('table');     // 表
const todo = document.getElementById('todo');      // TODO
const priority = document.querySelector('select'); // 優先度
const deadline = document.querySelector('input[type="date"]');  // 締切
const submit = document.getElementById('submit');  // 登録ボタン

let list = [];

document.addEventListener('DOMContentLoaded', () => {
  const json = storage.todoList;
  if (json == undefined) {
    return;
  }

  list = JSON.parse(json);
  for (const existing_item of list) {
    addItem(existing_item);
  }
});

const addItem = (item) => {
  const tr = document.createElement('tr');

  for (const prop in item) {
    const td = document.createElement('td');
    if (prop == 'done') {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item[prop];
      td.appendChild(checkbox);
      checkbox.addEventListener('change', checkBoxListener);
    } else {
      td.textContent = item[prop];
    }
    tr.appendChild(td);
  }

  table.append(tr);
};

const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName('tr'));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};

submit.addEventListener('click', () => {
  const item={};

  if (todo.value != '') {
    item.todo = todo.value;
  } else {
    item.todo = 'ダミーTODO';
  };

  item.priority = priority.value;
  
  if (deadline.value != '') {
    item.deadline = deadline.value;
  } else {
    const date = new Date();
    item.deadline = date.toLocaleDateString();
  };

  item.done = false;

  todo.value = '';
  priority.value = '普';
  deadline.value = '';

  addItem(item);

  list.push(item);
  storage.todoList = JSON.stringify(list);
});

const filterButton = document.createElement('button'); // ボタン要素を生成
filterButton.textContent = '優先度（高）で絞り込み';
filterButton.id = 'priority';  // CSSでの装飾用
const main = document.querySelector('main');
main.appendChild(filterButton);

filterButton.addEventListener('click', () => {
  clearTable();

  for (const item of list) {
    if (item.priority == '高') {
      addItem(item);
    }
  }
});

const remove = document.createElement('button');
remove.textContent = '完了したTODOを削除する';
remove.id = 'remove';  // CSS装飾用
const br = document.createElement('br'); // 改行したい
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener('click', () => {
  clearTable();

  list = list.filter((item) => item.done == false);

  for (const item of list) {
    addItem(item);
  }

  storage.todoList = JSON.stringify(list);
});

const checkBoxListener = (ev) => {
  const trList = Array.from(document.getElementsByTagName('tr'));
  const currentTr = ev.currentTarget.parentElement.parentElement;
  const idx = trList.indexOf(currentTr) - 1;
  list[idx].done = ev.currentTarget.checked;
  storage.todoList = JSON.stringify(list);
};