import resumes from "../assets/dummyData.js";

const tbody = document.getElementById("resumeTableBody");

// Toggle filter sections based on candidate type
document.getElementById("filterType").addEventListener("change", () => {
  const type = document.getElementById("filterType").value;
  document
    .getElementById("fresherFilters")
    .classList.toggle("d-none", type !== "Fresher");
  document
    .getElementById("experiencedFilters")
    .classList.toggle("d-none", type !== "Experienced");
  renderTable();
});

function getFilterValues() {
  const type = document.getElementById("filterType").value;
  const filters = {
    gender: document.getElementById("filterGender").value,
    type: type,
  };

  if (type === "Fresher") {
    filters.internship = document.getElementById("filterInternship").value;
    filters.department = document.getElementById("filterFresherDept").value;
    filters.relocate = document.getElementById("filterRelocateFresher").value;
  } else if (type === "Experienced") {
    filters.department = document.getElementById("filterExpDept").value;
    filters.exp = document.getElementById("filterExp").value;
    filters.notice = document.getElementById("filterNotice").value;
    filters.relocate = document.getElementById("filterRelocateExp").value;
  }

  return filters;
}

function matchExperience(expString, filterExp) {
  const years = parseInt(expString);
  if (filterExp === "0-3") return years >= 0 && years <= 3;
  if (filterExp === "3-5") return years > 3 && years <= 5;
  if (filterExp === "5+") return years > 5;
  return true;
}

function renderTable() {
  const filters = getFilterValues();
  tbody.innerHTML = "";

  const filtered = resumes.filter((res) => {
    if (filters.gender && res.gender !== filters.gender) return false;
    if (filters.type && res.type !== filters.type) return false;

    if (filters.type === "Fresher") {
      if (filters.internship && res.internship !== filters.internship)
        return false;
      if (filters.department && res.department !== filters.department)
        return false;
      if (filters.relocate && res.relocate !== filters.relocate) return false;
    } else if (filters.type === "Experienced") {
      if (filters.department && res.department !== filters.department)
        return false;
      if (filters.notice && res.notice !== filters.notice) return false;
      if (filters.relocate && res.relocate !== filters.relocate) return false;
      if (filters.exp && !matchExperience(res.exp, filters.exp)) return false;
    }

    return true;
  });

  filtered.forEach((res) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${res.id}</td>
            <td>${res.name}</td>
            <td>${res.title}</td>
            <td>${res.exp}</td>
            <td>${res.email}</td>
            <td>${res.contact}</td>
            <td><a href="#" class="text-decoration-none table-download-btn">Download</a></td>
          `;
    tbody.appendChild(row);
  });
}

document
  .querySelectorAll(".form-select")
  .forEach((el) => el.addEventListener("change", renderTable));

renderTable();
