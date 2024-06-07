document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
});

document.getElementById('saveForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const category = document.getElementById('category').value;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab) {
    const title = tab.title;
    const url = tab.url;
    const date = new Date().toLocaleString();

    chrome.storage.sync.get({webpages: []}, (data) => {
      const webpages = data.webpages;
      webpages.push({title, url, category, date});
      chrome.storage.sync.set({webpages}, () => {
        document.getElementById('status').textContent = 'Saved successfully!';
        setTimeout(() => {
          document.getElementById('status').textContent = '';
        }, 3000);
      });
    });
  }
});

document.getElementById('addCategoryForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const newCategory = document.getElementById('newCategory').value;

  chrome.storage.sync.get({categories: []}, (data) => {
    const categories = data.categories;
    categories.push(newCategory);
    chrome.storage.sync.set({categories}, () => {
      loadCategories();
      document.getElementById('newCategory').value = '';
    });
  });
});

function loadCategories() {
  chrome.storage.sync.get({categories: []}, (data) => {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '';
    data.categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  });
}
