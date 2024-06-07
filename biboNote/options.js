document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadWebpages();
  document.getElementById('filterCategory').addEventListener('change', loadWebpages);
  document.getElementById('deleteSelected').addEventListener('click', deleteSelectedWebpages);
  document.getElementById('deleteCategoryButton').addEventListener('click', deleteCategory);
});

function loadCategories() {
  chrome.storage.sync.get({categories: []}, (data) => {
    const filterCategorySelect = document.getElementById('filterCategory');
    const deleteCategorySelect = document.getElementById('deleteCategory');
    filterCategorySelect.innerHTML = '';
    deleteCategorySelect.innerHTML = '<option value="">Select a Category to Delete</option>';
    data.categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      filterCategorySelect.appendChild(option);

      const deleteOption = document.createElement('option');
      deleteOption.value = category;
      deleteOption.textContent = category;
      deleteCategorySelect.appendChild(deleteOption);
    });
  });
}

function loadWebpages() {
  const filterCategory = document.getElementById('filterCategory').value;
  chrome.storage.sync.get({webpages: []}, (data) => {
    const tbody = document.querySelector('#webpagesTable tbody');
    tbody.innerHTML = '';
    data.webpages.forEach((page, index) => {
      if (!filterCategory || page.category === filterCategory) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><input type="checkbox" data-index="${index}"></td><td>${page.title}</td><td><a href="${page.url}" target="_blank">${page.url}</a></td><td>${page.category}</td><td>${page.date}</td>`;
        tbody.appendChild(tr);
      }
    });
  });
}

function deleteSelectedWebpages() {
  chrome.storage.sync.get({webpages: []}, (data) => {
    const checkboxes = document.querySelectorAll('#webpagesTable tbody input[type="checkbox"]:checked');
    const indexesToDelete = Array.from(checkboxes).map(checkbox => parseInt(checkbox.getAttribute('data-index')));
    const newWebpages = data.webpages.filter((_, index) => !indexesToDelete.includes(index));
    chrome.storage.sync.set({webpages: newWebpages}, loadWebpages);
  });
}

function deleteCategory() {
  const selectedCategory = document.getElementById('deleteCategory').value;
  if (!selectedCategory) return;

  chrome.storage.sync.get({categories: [], webpages: []}, (data) => {
    const newCategories = data.categories.filter(category => category !== selectedCategory);
    const newWebpages = data.webpages.filter(page => page.category !== selectedCategory);

    chrome.storage.sync.set({categories: newCategories, webpages: newWebpages}, () => {
      loadCategories();
      loadWebpages();
    });
  });
}
