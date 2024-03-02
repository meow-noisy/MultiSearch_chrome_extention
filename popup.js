document.addEventListener('DOMContentLoaded', function () {
  var searchButton = document.getElementById('searchButton');

  // ボタンをクリックした時の処理
  searchButton.addEventListener('click', function () {
    searchOnMultipleEngines();
  });

  showSearchEnginesList();


  // ラジオボタン要素を取得する
  var radioButtons = document.getElementsByName('search_mode');
  // ラジオボタンごとにイベントリスナーを設定する
  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener('change', function () {
      updateSearchEnginesList();
    });
  });

});

// 検索エンジンのリスト
var searchEngines = [
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    im_url: 'https://www.google.com/search?tbm=isch&q='
  },
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?t=h_&q=',
    im_url: 'https://duckduckgo.com/?iax=images&ia=images&t=h_&q='
  },
  {
    name: 'Yandex',
    url: 'https://yandex.com/search/?text=',
    im_url: 'https://yandex.com/images/search?text='
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/results?search_query=',
    im_url: 'https://www.youtube.com/results?search_query='
  },
];
// nameをキーとしてurlを返す連想配列を作成
var searchEngineMap = {};
searchEngines.forEach(function (engine) {
  searchEngineMap[engine.name] = engine.url;
});
var searchEngineMapImage = {};
searchEngines.forEach(function (engine) {
  if ("im_url" in engine) {
    searchEngineMapImage[engine.name] = engine.im_url;
  }
});


// タブを開く
function searchOnMultipleEngines() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    var textarea = document.getElementById("myTextarea");
    var lines = textarea.value.split("\n");

    // チェックされているラジオボタンを取得する
    var radioButtons = document.getElementsByName('search_mode');
    var checkedValue = null;
    // ラジオボタンのリストをループしてチェックされているものを検索
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        checkedValue = radioButtons[i].value;
        break;
      }
    }

    lines.forEach(searchInput => {
      // 空白行の場合は処理をスキップして次の行へ
      if (searchInput.trim() === '') {
        return;
      }

      var checkboxes = document.querySelectorAll('#searchEnginesList input[type="checkbox"]');

      // タブを開く
      checkboxes.forEach(function (checkbox) {

        if (checkbox.checked && !checkbox.disabled) {
          var searchQuery = encodeURIComponent(searchInput);
          if (checkedValue === 'image') {
            var base_url = searchEngineMapImage[checkbox.id];
          } else {
            var base_url = searchEngineMap[checkbox.id];
          }
          var searchURL = base_url + searchQuery;
          chrome.tabs.create({ url: searchURL });
        }

      });

    });
  });
}

// 検索エンジン一覧
function showSearchEnginesList() {
  var searchEnginesListDiv = document.getElementById('searchEnginesList');

  // チェックされているラジオボタンを取得する
  var radioButtons = document.getElementsByName('search_mode');
  var checkedValue = null;
  // ラジオボタンのリストをループしてチェックされているものを検索
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      checkedValue = radioButtons[i].value;
      break;
    }
  }

  // チェックボックス判定
  searchEngines.forEach(function (searchEngine) {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = searchEngine.name;
    checkbox.checked = true;
    if (checkedValue === 'image') {
      if (!('im_url' in searchEngine)) {
        checkbox.disabled = false;
      } else {
        checkbox.disabled = true;
      }
    }

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(searchEngine.name));
    label.htmlFor = searchEngine.name;

    searchEnginesListDiv.appendChild(checkbox);
    searchEnginesListDiv.appendChild(label);
    searchEnginesListDiv.appendChild(document.createElement('br'));
  });
}

function updateSearchEnginesList() {
  var searchEnginesListDiv = document.getElementById('searchEnginesList');

  var checkboxes = searchEnginesListDiv.querySelectorAll('input[type="checkbox"]')

  // チェックされているラジオボタンを取得する
  var radioButtons = document.getElementsByName('search_mode');
  var checkedValue = null;
  // ラジオボタンのリストをループしてチェックされているものを検索
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      checkedValue = radioButtons[i].value;
      break;
    }
  }

  checkboxes.forEach(function (checkbox) {
    if (checkedValue === 'image') {
      for (var i = 0; i < searchEngines.length; i++) {
        if (searchEngines[i].name === checkbox.id) {
          engine_idx = i;
          break;
        }
      }

      if (!('im_url' in searchEngines[i])) {
        checkbox.disabled = true;
      }
    } else {
      checkbox.disabled = false;
    }
  });

}
