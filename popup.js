document.addEventListener('DOMContentLoaded', function () {
  var searchButton = document.getElementById('searchButton');

  // ボタンをクリックした時の処理
  searchButton.addEventListener('click', function () {
    searchOnMultipleEngines();
  });

  // 検索チェックリストの更新
  createSearchEnginesList();

  // 検索モードの読み出し
  getLocalStorage("search_mode")
    .then(data => {
      var checkedValue = data["search_mode"];
      loadRadioState(checkedValue);
      updateSearchEnginesList();
    });
  // チェック状態の読み出し
  var searchEnginesListDiv = document.getElementById('searchEnginesList');
  var checkboxes = searchEnginesListDiv.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function (checkbox) {
    var key_name = checkbox.id;
    getLocalStorage(key_name)
      .then(data => {
        var check_state = data[key_name];
        // 初インストール時はundifinedになるので対策
        if (check_state !== undefined) {
          checkbox.checked = check_state;
        }
      })
      .catch(error => {
        console.error(error);
      });
  });

  // ラジオボタン要素を取得する
  var radioButtons = document.getElementsByName('search_mode');
  // ラジオボタンごとにイベントリスナーを設定する
  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener('change', function () {
      saveRadioState()
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
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/search/results/all/?keywords='
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


// 状態をchrome storageへ保存する
function saveState(key_name, state) {
  chrome.storage.local.set({ [key_name]: state });
}

// コンポネントの選択状態をchrome storageから取得する
const getLocalStorage = (key_name) => new Promise(resolve => {
  chrome.storage.local.get(key_name, resolve);
});


// チェックされているラジオボタンを取得する
function getRadioState() {
  var radioButtons = document.getElementsByName('search_mode');
  var checkedValue = null;
  // ラジオボタンのリストをループしてチェックされているものを検索
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      checkedValue = radioButtons[i].value;
      break;
    }
  }
  return checkedValue;
}

// 拡張機能を開いた時に、前回のラジオボタンの状況を復元
function loadRadioState(checkedValue) {
  var pageRadio = document.getElementById("pageRadio");
  var imageRadio = document.getElementById("imageRadio");
  if (checkedValue === 'image') {
    imageRadio.checked = true;
  } else {
    pageRadio.checked = true;
  }
}

// ラジオボタンの状態を保存する
function saveRadioState() {
  var checkedValue = getRadioState();
  var key_name = "search_mode";
  saveState(key_name, checkedValue);
}

// 検索モードの選択状態を保存
function saveCheckBoxState() {
  var searchEnginesListDiv = document.getElementById('searchEnginesList');

  var checkboxes = searchEnginesListDiv.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach(function (checkbox) {
    saveState(checkbox.id, checkbox.checked);
  });

}

// 検索結果をエンジンごとにタブで開く関数
function searchOnMultipleEngines() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    var textarea = document.getElementById("myTextarea");
    var lines = textarea.value.split("\n");

    // チェックされているラジオボタンを取得する
    var checkedValue = getRadioState();

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

// チェックボックスリストを作成する関数
function createSearchEnginesList() {
  var searchEnginesListDiv = document.getElementById('searchEnginesList');

  // チェックされているラジオボタンを取得する
  var checkedValue = getRadioState();

  // チェックボックス判定
  searchEngines.forEach(function (searchEngine) {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = searchEngine.name;
    checkbox.checked = true;

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(searchEngine.name));
    label.htmlFor = searchEngine.name;

    // チェックボックスが変更されたときのイベントリスナーを追加
    checkbox.addEventListener('change', function () {
      saveCheckBoxState();
    });

    searchEnginesListDiv.appendChild(checkbox);
    searchEnginesListDiv.appendChild(label);
    searchEnginesListDiv.appendChild(document.createElement('br'));
  });
}


// 検索モードに応じてチェック状態を更新する
function updateSearchEnginesList() {
  var searchEnginesListDiv = document.getElementById('searchEnginesList');

  var checkboxes = searchEnginesListDiv.querySelectorAll('input[type="checkbox"]');

  // チェックされているラジオボタンを取得する
  var checkedValue = getRadioState();

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
