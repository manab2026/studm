const API_URL = "https://script.google.com/macros/s/AKfycbzbV__RllG9fcqRdYMS_dRh7YtwH4xf1HpQ-AlNlXK2Rsq0uNM7H5n6AkDd5uHxQw1i7w/exec";

let students = [];

/* SAVE STUDENT */

async function saveStudent() {

    const studentName = document.getElementById("studentName").value.trim();

    const mobileNo = document.getElementById("mobileNo").value.trim();

    const asnNo = document.getElementById("asnNo").value.trim();

    const enrollmentDate = document.getElementById("enrollmentDate").value;

    const courseName = document.getElementById("courseName").value;

    const batch = document.getElementById("batch").value;

    /* VALIDATION */

    if (!studentName || !asnNo || !enrollmentDate || !courseName) {

        alert("Please fill all required fields");

        return;
    }

    const studentData = {
        studentName,
        mobileNo,
        asnNo,
        enrollmentDate,
        courseName,
        batch
    };

    try {
const res = await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(studentData)
});

const text = await res.text();

if (text.includes("SUCCESS")) {
    alert("Saved in Google Sheet ✅");
} else {
    alert("Error: " + text);
}

    } catch (error) {

        console.error(error);

        alert("Error Saving Student");
    }
}

/* RENDER TABLE */

function renderTable(data = students) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    data.forEach((student, index) => {

        table.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>${student.studentName}</td>

                <td>${student.mobileNo}</td>

                <td>${student.courseName}</td>

                <td>${student.asnNo}</td>

                <td>${student.batch}</td>

                <td>${student.enrollmentDate}</td>

            </tr>
        `;
    });
}

/* SEARCH */

function searchStudent() {

    const search = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = students.filter(student => {

        return (

            (student.studentName || "").toLowerCase().includes(search) ||

            (student.mobileNo || "").toLowerCase().includes(search) ||

            (student.courseName || "").toLowerCase().includes(search) ||

            (student.asnNo || "").toString().includes(search)
        );
    });

    renderTable(filtered);
}

/* EXPORT EXCEL */

function exportExcel() {

    const table = document.getElementById("studentTableExcel");

    const workbook = XLSX.utils.table_to_book(table, {

        sheet: "Students"
    });

    XLSX.writeFile(workbook, "Student_Data.xlsx");
}

/* CLEAR FORM */

function clearForm() {

    document.getElementById("studentName").value = "";

    document.getElementById("mobileNo").value = "";

    document.getElementById("asnNo").value = "";

    document.getElementById("enrollmentDate").value = "";

    document.getElementById("courseName").value = "";

    document.getElementById("batch").value = "";
}