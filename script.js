const API_URL = "https://script.google.com/macros/s/AKfycby4faax5wrl4ScBqO6I9q8guYBdTUKFN2o-mq8Pt_yngg_97eA6qvyU5fYY_mb9jF28og/exec";

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

    data.forEach((student, index) => {

        table.innerHTML += `

            <tr class="border-b hover:bg-gray-50">

                <td class="p-3">
                    ${student["SL No"] || index + 1}
                </td>

                <td class="p-3">
                    ${student["Student Name"] || ""}
                </td>

                <td class="p-3">
                    ${student["Mobile No"] || ""}
                </td>

                <td class="p-3">
                    ${student["Enrollment No"] || ""}
                </td>

                <td class="p-3">
                    ${student["Course Name"] || ""}
                </td>

                <td class="p-3">
                    ${student["Batch Month"] || ""} 
                    ${student["Batch Year"] || ""}
                </td>

                <td class="p-3">
                    ${formatDate(student["Enrollment Date"])}
                </td>

                <td class="p-3">

                    <button
                        onclick="editStudent(${index})"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">

                        Edit

                    </button>

                </td>

            </tr>

        `;
    });
}

function formatDate(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB");
}

function formatInputDate(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toISOString().split('T')[0];
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

    // ONLY CLEAR THESE
    document.getElementById("studentName").value = "";

    document.getElementById("mobileNo").value = "";

    document.getElementById("enrollmentNo").value = "";

    document.getElementById("enrollmentDate").value = "";

}

function editStudent(index) {

    const student = students[index];

    document.getElementById("studentName").value =
        student["Student Name"] || "";

    document.getElementById("mobileNo").value =
        student["Mobile No"] || "";

    document.getElementById("enrollmentNo").value =
        student["Enrollment No"] || "";

    document.getElementById("enrollmentDate").value =
        formatInputDate(student["Enrollment Date"]);

    document.getElementById("courseName").value =
        student["Course Name"] || "";

    document.getElementById("batchMonth").value =
        student["Batch Month"] || "";

    document.getElementById("batchYear").value =
        student["Batch Year"] || "";

    // REMOVE OLD RECORD FROM UI
    students.splice(index, 1);

    renderTable();
}

/* DARK MODE */

function toggleDarkMode() {

    document.body.classList.toggle("bg-gray-900");

    document.body.classList.toggle("text-white");
}


/* ON LOAD */

window.onload = loadStudents;