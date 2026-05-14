let students = JSON.parse(localStorage.getItem("students")) || [];


// KEEP COURSE SELECTED
const savedCourse = localStorage.getItem("selectedCourse");

if (savedCourse) {
    document.getElementById("courseName").value = savedCourse;
}


// KEEP BATCH SELECTED
const savedBatch = localStorage.getItem("selectedBatch");

if (savedBatch) {
    document.getElementById("batch").value = savedBatch;
}


// LOAD STUDENTS
loadStudents();



// SAVE STUDENT
function saveStudent() {

    const studentId = document.getElementById("studentId").value;

    const student = {

        id: studentId ? Number(studentId) : Date.now(),

        studentName: document.getElementById("studentName").value.trim(),

        mobileNo: document.getElementById("mobileNo").value.trim(),

        courseName: document.getElementById("courseName").value,

        asnNo: parseInt(document.getElementById("asnNo").value),

        batch: formatMonth(document.getElementById("batch").value),

        enrollmentDate: formatDate(document.getElementById("enrollmentDate").value)
    };


    // REQUIRED VALIDATION
    if (
        !student.studentName ||
        !student.courseName ||
        !student.asnNo ||
        !student.enrollmentDate
    ) {
        return;
    }


    // DUPLICATE ASN CHECK
    const duplicateASN = students.find(s =>
        s.asnNo == student.asnNo &&
        s.id != student.id
    );

    if (duplicateASN) {
        return;
    }


    // DUPLICATE NAME CHECK
    const duplicateName = students.find(s =>
        s.studentName.toLowerCase() ==
        student.studentName.toLowerCase() &&
        s.id != student.id
    );

    if (duplicateName) {
        return;
    }


    // SAVE COURSE
    localStorage.setItem("selectedCourse", student.courseName);


    // SAVE BATCH
    localStorage.setItem(
        "selectedBatch",
        document.getElementById("batch").value
    );


    // UPDATE STUDENT
    if (studentId) {

        students = students.map(s =>
            s.id === Number(studentId) ? student : s
        );

    } else {

        // ADD STUDENT
        students.push(student);
    }


    // SAVE STORAGE
    localStorage.setItem("students", JSON.stringify(students));


    clearForm();
    loadStudents();

    // ✅ NEW: focus back to name field
    document.getElementById("studentName").focus();
}



// LOAD STUDENTS
function loadStudents(filteredStudents = students) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    filteredStudents.forEach((student, index) => {

        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${student.studentName}</td>
                <td>${student.mobileNo || ""}</td>
                <td>${student.courseName}</td>
                <td>${student.asnNo}</td>
                <td>${student.batch || ""}</td>
                <td>${student.enrollmentDate}</td>
                <td>
                    <button class="edit-btn"
                        onclick="editStudent(${student.id})">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteStudent(${student.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}



// EDIT STUDENT
function editStudent(id) {

    const student = students.find(s => s.id === id);

    document.getElementById("studentId").value = student.id;
    document.getElementById("studentName").value = student.studentName;
    document.getElementById("mobileNo").value = student.mobileNo;
    document.getElementById("courseName").value = student.courseName;
    document.getElementById("asnNo").value = student.asnNo;
    document.getElementById("batch").value = reverseMonth(student.batch);
    document.getElementById("enrollmentDate").value = reverseDate(student.enrollmentDate);

    window.scrollTo({ top: 0, behavior: "smooth" });
}



// DELETE STUDENT
function deleteStudent(id) {

    if (confirm("Delete this student?")) {

        students = students.filter(s => s.id !== id);

        localStorage.setItem("students", JSON.stringify(students));

        loadStudents();
    }
}



// SEARCH STUDENT
function searchStudent() {

    const value = document.getElementById("search").value.toLowerCase();

    const filtered = students.filter(student =>
        student.studentName.toLowerCase().includes(value) ||
        student.courseName.toLowerCase().includes(value) ||
        student.asnNo.toString().includes(value)
    );

    loadStudents(filtered);
}



// CLEAR FORM
function clearForm() {

    document.getElementById("studentId").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("mobileNo").value = "";

    // KEEP COURSE & BATCH
    document.getElementById("asnNo").value = "";
    document.getElementById("enrollmentDate").value = "";
}



// EXPORT EXCEL
function exportExcel() {

    const exportData = students.map((student, index) => ({
        "SL No": index + 1,
        "Student Name": student.studentName,
        "Mobile No": student.mobileNo,
        "Course Name": student.courseName,
        "ASN No": student.asnNo,
        "Batch": student.batch,
        "Enrollment Date": student.enrollmentDate
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "students.xlsx");
}



// FORMAT YYYY-MM TO MM/YYYY
function formatMonth(monthValue) {

    if (!monthValue) return "";

    const parts = monthValue.split("-");
    return `${parts[1]}/${parts[0]}`;
}



// REVERSE MM/YYYY TO YYYY-MM
function reverseMonth(monthValue) {

    if (!monthValue) return "";

    const parts = monthValue.split("/");
    return `${parts[1]}-${parts[0]}`;
}



// FORMAT YYYY-MM-DD TO DD/MM/YYYY
function formatDate(dateValue) {

    if (!dateValue) return "";

    const parts = dateValue.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}



// REVERSE DD/MM/YYYY TO YYYY-MM-DD
function reverseDate(dateValue) {

    if (!dateValue) return "";

    const parts = dateValue.split("/");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}