let editingIndex = null;
let currentContributors = [];

window.onload = function () {
  const savedEntries = JSON.parse(localStorage.getItem('fundingEntries')) || [];
  refreshTable(savedEntries);
  updateTotalFundingNeeded(savedEntries);
};

function addContributor() {
  const name = document.getElementById('contributorName').value.trim();
  const amount = parseFloat(document.getElementById('contributorAmount').value);

  if (!name || isNaN(amount)) {
    alert("Please enter a valid name and amount.");
    return;
  }

  currentContributors.push({ name, amount });
  document.getElementById('contributorName').value = '';
  document.getElementById('contributorAmount').value = '';
  updateContributorPreview();
  function updateContributorPreview() {
  const preview = document.getElementById('contributorPreview');
  if (currentContributors.length === 0) {
    preview.innerHTML = 'No withdrawer added yet.';
  } else {
  }
}

}

function addOrUpdateFunding() {
  const total = parseFloat(document.getElementById('totalFunds').value);
  const usedInput = parseFloat(document.getElementById('usedFunds').value);
  const funder = document.getElementById('funderName').value;

  if (isNaN(total) || isNaN(usedInput) || !funder) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const totalContributed = currentContributors.reduce((sum, c) => sum + c.amount, 0);

  const used = usedInput + totalContributed;

  const needed = total - used;

  const entry = {
    funder,
    total,
    used,
    needed,
    contributors: [...currentContributors],
    timestamp: new Date().toISOString()
  };

  const entries = JSON.parse(localStorage.getItem('fundingEntries')) || [];

  if (editingIndex !== null) {
    entry.timestamp = entries[editingIndex].timestamp;
    entries[editingIndex] = entry;
    editingIndex = null;
    document.getElementById('addBtn').innerText = 'Add Funding';
  } else {
    entries.push(entry);
  }

  localStorage.setItem('fundingEntries', JSON.stringify(entries));
  refreshTable(entries);
  clearForm();
  updateTotalFundingNeeded(entries);
  currentContributors = [];
  updateContributorPreview();

}

function refreshTable(entries) {
  const table = document.getElementById('fundingTable');
  table.innerHTML = '';

  entries.forEach((entry, index) => {
    const row = table.insertRow();

    row.insertCell(0).innerHTML = `
      <strong>${entry.funder}</strong><br>
      <small>Contributors:<br>
        ${entry.contributors && entry.contributors.length > 0
          ? entry.contributors.map(c => `${c.name} (₹${c.amount})`).join('<br>')
          : 'None'}
      </small>
    `;

    row.insertCell(1).innerText = `₹${entry.total}`;
    row.insertCell(2).innerText = `₹${entry.used}`;
    row.insertCell(3).innerText = `₹${entry.needed}`;

    const actionCell = row.insertCell(4);
    actionCell.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.onclick = function () {
      document.getElementById('totalFunds').value = entry.total;
      document.getElementById('usedFunds').value = entry.used;
      document.getElementById('funderName').value = entry.funder;
      currentContributors = [...entry.contributors];
      editingIndex = index;
      document.getElementById('addBtn').innerText = 'Update Funding';
    };
    actionCell.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.onclick = function () {
      entries.splice(index, 1);
      localStorage.setItem('fundingEntries', JSON.stringify(entries));
      refreshTable(entries);
      updateTotalFundingNeeded(entries);
    };
    actionCell.appendChild(deleteBtn);
  });
}

function updateTotalFundingNeeded(entries) {
  const totalNeeded = entries.reduce((sum, entry) => sum + entry.needed, 0);
  document.getElementById('totalFundingNeeded').innerText =
    ``;
}

function sortEntries(order) {
  const entries = JSON.parse(localStorage.getItem('fundingEntries')) || [];
  entries.sort((a, b) => {
    const timeA = new Date(a.timestamp);
    const timeB = new Date(b.timestamp);
    return order === 'asc' ? timeA - timeB : timeB - timeA;
  });
  refreshTable(entries);
  updateTotalFundingNeeded(entries);
}

function clearForm() {
  document.getElementById('totalFunds').value = '';
  document.getElementById('usedFunds').value = '';
  document.getElementById('funderName').value = '';
  document.getElementById('contributorName').value = '';
  document.getElementById('contributorAmount').value = '';

}
