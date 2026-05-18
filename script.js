const API_URL = "https://script.google.com/macros/s/AKfycbwnHqmmRSodSKpAfRZTytHgJNTA4A5RopGvYDgHrUup3snPDQwaDn1rQt4pSSwXUX6lbQ/exec";

let students = [];

/* SAVE STUDENT */

async function saveStudent() {

    const studentName = document.getElementById("studentName").value.trim();

    const mobileNo = document.getElementById("mobileNo").value.trim();

    const enrollmentNo = document.getElementById("enrollmentNo").value.trim();

    const enrollmentDate = document.getElementById("enrollmentDate").value;

    const courseName = document.getElementById("courseName").value;

    const batchMonth = document.getElementById("batchMonth").value;

    const batchYear = document.getElementById("batchYear").value;

    if (!studentName || !enrollmentDate || !courseName) {

        alert("Please fill all required fields");

        return;
    }

    try {

        const formData = new FormData();

        formData.append("studentName", studentName);
        formData.append("mobileNo", mobileNo);
        formData.append("enrollmentNo", enrollmentNo);
        formData.append("enrollmentDate", enrollmentDate);
        formData.append("courseName", courseName);
        formData.append("batchMonth", batchMonth);
        formData.append("batchYear", batchYear);

        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        });

        clearForm();

        setTimeout(() => {

            loadStudents();

            alert("Saved Successfully ✅");

        }, 1000);

    } catch (error) {

        console.error(error);

        alert("Error Saving Data ❌");
    }
}


/* LOAD STUDENTS */

async function loadStudents() {

    try {

        const res = await fetch(API_URL);

        const data = await res.json();

        students = data;

        renderTable();

        updateDashboard();

    } catch (error) {

        console.error(error);
    }
}


/* RENDER TABLE */

function renderTable(data = students) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    data.forEach(student => {

        table.innerHTML += `

            <tr class="border-b hover:bg-gray-50">

                <td class="p-3">${student["SL No"] || ""}</td>

                <td class="p-3">${student["Student Name"] || ""}</td>

                <td class="p-3">${student["Mobile No"] || ""}</td>

                <td class="p-3">${student["Enrollment No"] || ""}</td>

                <td class="p-3">${student["Course Name"] || ""}</td>

                <td class="p-3">
                    ${student["Batch Month"] || ""} ${student["Batch Year"] || ""}
                </td>

                <td class="p-3">${student["Enrollment Date"] || ""}</td>

            </tr>

        `;
    });
}


/* DASHBOARD */

function updateDashboard() {

    document.getElementById("studentCount").innerText = students.length;

    const courses = [...new Set(

        students.map(s => s["Course Name"])

    )];

    document.getElementById("courseCount").innerText = courses.length;
}


/* SEARCH */

function searchStudent() {

    const search = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filtered = students.filter(student => {

        return (

            (student["Student Name"] || "")
            .toLowerCase()
            .includes(search)

            ||

            (student["Mobile No"] || "")
            .toLowerCase()
            .includes(search)

            ||

            (student["Enrollment No"] || "")
            .toLowerCase()
            .includes(search)

            ||

            (student["Course Name"] || "")
            .toLowerCase()
            .includes(search)
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

    document.getElementById("enrollmentNo").value = "";

    document.getElementById("enrollmentDate").value = "";

    document.getElementById("courseName").value = "";

    document.getElementById("batchMonth").value = "";

    document.getElementById("batchYear").value = "";
}


/* DARK MODE */

function toggleDarkMode() {

    document.body.classList.toggle("bg-gray-900");

    document.body.classList.toggle("text-white");
}


/* ON LOAD */

window.onload = loadStudents;