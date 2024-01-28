document.addEventListener('DOMContentLoaded', function () {
  var searchButton = document.getElementById('searchButton');
  var searchInput = document.getElementById('searchInput');

  // ボタンをクリックした時の処理
  searchButton.addEventListener('click', function () {
    searchOnMultipleEngines();
  });

  // Enterキーが押された時の処理
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // デフォルトのEnterキーの挙動を無効化
      searchOnMultipleEngines();
    }
  });

  showSearchEnginesList();

});

// 検索エンジンのリスト
var searchEngines = [
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?t=h_&q=' },
  { name: 'Yandex', url: 'https://yandex.com/search/?text=' },
];
// nameをキーとしてurlを返す連想配列を作成
var searchEngineMap = {};
searchEngines.forEach(function (engine) {
  searchEngineMap[engine.name] = engine.url;
});

function searchOnMultipleEngines() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    var searchInput = document.getElementById('searchInput').value;

    var selectedTabs = [];
    // var searchEnginesListDiv = document.getElementById('searchEnginesList');
    var checkboxes = document.querySelectorAll('#searchEnginesList input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
      console.log(checkbox.id + ': ' + checkbox.checked);

      if (checkbox.checked) {
        var searchQuery = encodeURIComponent(searchInput);
        var base_url = searchEngineMap[checkbox.id];
        var searchURL = base_url + searchQuery;
        chrome.tabs.create({ url: searchURL });
      }

    });

    selectedTabs.forEach(function (tab) {
      searchEngines.forEach(function (searchEngine) {
        var searchURL = searchEngine.url + encodeURIComponent(tab.title);
        chrome.tabs.create({ url: searchURL });
      });
    });
  });
}

// 検索エンジン一覧
function showSearchEnginesList() {
  var searchEnginesListDiv = document.getElementById('searchEnginesList');


  searchEngines.forEach(function (searchEngine) {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = searchEngine.name;
    checkbox.checked = true;

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(searchEngine.name));
    label.htmlFor = searchEngine.name;

    searchEnginesListDiv.appendChild(checkbox);
    searchEnginesListDiv.appendChild(label);
    searchEnginesListDiv.appendChild(document.createElement('br'));
  });
}
