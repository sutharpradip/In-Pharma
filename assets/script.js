document.addEventListener("DOMContentLoaded", () => {
  const eye = document.getElementById("eye");
  const pass = document.getElementById("login-password");

  if (eye && pass) {
    eye.addEventListener("click", () => {
      const type = pass.getAttribute("type");
      if (type === "password") {
        pass.setAttribute("type", "text");
        eye.querySelector("i").classList.remove("fa-eye");
        eye.querySelector("i").classList.add("fa-eye-slash");
      } else {
        pass.setAttribute("type", "password");
        eye.querySelector("i").classList.remove("fa-eye-slash");
        eye.querySelector("i").classList.add("fa-eye");
      }
    });
    console.log("click");
  }
});

import resumes from "../assets/dummyData.js";

let loadedCount = 0;
const batchSize = 8;
let isLoading = false;

// Toggle filter sections based on candidate type
const tbody = document.getElementById("resumeTableBody");

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

let filteredResumes = [];

function renderTable() {
  const filters = getFilterValues();
  const skeleton = document.getElementById("skeletonContainer");

  // Clear old rows, show skeleton
  tbody.innerHTML = "";
  skeleton.innerHTML = generateSkeletonRows(5);
  filteredResumes = [];

  // ✅ Filter and prepare data immediately
  filteredResumes = resumes.filter((res) => {
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

  loadedCount = 0;

  // ✅ After 1 second, hide skeleton and show first batch
  setTimeout(() => {
    // skeleton.innerHTML = "";
    loadMoreData(); // Show data immediately after skeleton ends
  }, 800);
}

function loadMoreData() {
  if (isLoading) return;
  isLoading = true;

  const skeleton = document.getElementById("skeletonContainer");
  skeleton.innerHTML = generateSkeletonRows(5);

  setTimeout(() => {
    const nextBatch = filteredResumes.slice(
      loadedCount,
      loadedCount + batchSize
    );

    // Append after delay
    nextBatch.forEach((res) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${res.id}</td>
        <td>${res.name}</td>
        <td>${res.title}</td>
        <td>${res.exp}</td>
        <td>${res.email}</td>
        <td>${res.contact}</td>
        <td><div class="d-inline-flex  gap-2"><a href="#" class="text-decoration-none table-download-btn"><i class="fa-solid fa-eye"></i></a> <a href="#" class="text-decoration-none table-download-btn"><i class="fa-solid fa-download"></i></a></div></td>
      `;
      tbody.appendChild(row);
    });

    loadedCount += batchSize;
    isLoading = false;
    skeleton.innerHTML = "";
  }, 800);
}

document.querySelector(".table-area").addEventListener("scroll", function () {
  const container = this;
  if (
    container.scrollTop + container.clientHeight >=
    container.scrollHeight - 10
  ) {
    if (loadedCount < filteredResumes.length) {
      loadMoreData();
    }
  }
});

document
  .querySelectorAll(".form-select")
  .forEach((el) => el.addEventListener("change", renderTable));

renderTable();

function generateSkeletonRows(count) {
  let skeletonHTML = "";
  for (let i = 0; i < count; i++) {
    skeletonHTML += `
      <div class="skeleton-row d-flex gap-3 align-items-center px-3 py-2">
        <div class="skeleton-box flex-grow-1" style="height: 50px; background: #E6EBFB; border-radius: 4px;"></div>
      </div>
    `;
  }
  return skeletonHTML;
}
