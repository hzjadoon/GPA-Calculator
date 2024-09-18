let semesterCount = 1;

function addCourse(semesterId) {
    const semesterDiv = document.getElementById(semesterId);
    const coursesTable = semesterDiv.querySelector('.courses');
    const courseCount = coursesTable.children.length + 1;

    const courseRow = document.createElement('tr');
    courseRow.classList.add('course');
    courseRow.innerHTML = `
        <td>${courseCount}</td>
        <td><input type="text" class="subject-name" required></td>
        <td><input type="number" class="credit-hours" required></td>
        <td>
            <select class="grade">
                <option value="4.00">A</option>
                <option value="3.67">A-</option>
                <option value="3.33">B+</option>
                <option value="3.00">B</option>
                <option value="2.67">B-</option>
                <option value="2.33">C+</option>
                <option value="2.00">C</option>
                <option value="1.67">C-</option>
                <option value="1.33">D+</option>
                <option value="1.00">D</option>
                <option value="0.00">F</option>
            </select>
        </td>
    `;
    coursesTable.appendChild(courseRow);
}

function addSemester() {
    semesterCount++;
    const semestersDiv = document.getElementById('semesters');
    const semesterDiv = document.createElement('div');
    semesterDiv.classList.add('semester');
    semesterDiv.id = `semester-${semesterCount}`;
    semesterDiv.innerHTML = `
        <h2>Semester ${semesterCount}</h2>
        <input type="text" class="semester-name" placeholder="Semester Name e.g. Fall 2024">
        <table>
            <thead>
                <tr>
                    <th>Serial No.</th>
                    <th>Course Name</th>
                    <th>Credit Hours</th>
                    <th>Grades</th>
                </tr>
            </thead>
            <tbody class="courses">
                <tr class="course">
                    <td>1</td>
                    <td><input type="text" class="subject-name" required></td>
                    <td><input type="number" class="credit-hours" required></td>
                    <td>
                        <select class="grade">
                            <option value="4.00">A</option>
                            <option value="3.67">A-</option>
                            <option value="3.33">B+</option>
                            <option value="3.00">B</option>
                            <option value="2.67">B-</option>
                            <option value="2.33">C+</option>
                            <option value="2.00">C</option>
                            <option value="1.67">C-</option>
                            <option value="1.33">D+</option>
                            <option value="1.00">D</option>
                            <option value="0.00">F</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
        <button type="button" class="add-course-btn" onclick="addCourse('semester-${semesterCount}')">Add Subject</button>
        <div class="semester-gpa">SGPA: <span>0.00</span></div>
    `;
    semestersDiv.appendChild(semesterDiv);
}

function calculateCGPA() {
    let totalQualityPoints = 0;
    let totalCreditHours = 0;

    for (let i = 1; i <= semesterCount; i++) {
        const semester = document.getElementById(`semester-${i}`);
        const courses = semester.querySelectorAll('.course');
        let semesterQualityPoints = 0;
        let semesterCreditHours = 0;

        courses.forEach(course => {
            const creditHours = parseFloat(course.querySelector('.credit-hours').value);
            const grade = parseFloat(course.querySelector('.grade').value);

            if (!isNaN(creditHours) && !isNaN(grade)) {
                semesterQualityPoints += creditHours * grade;
                semesterCreditHours += creditHours;
            }
        });

        const semesterGPA = semesterQualityPoints / semesterCreditHours;
        semester.querySelector('.semester-gpa span').textContent = semesterCreditHours ? semesterGPA.toFixed(2) : '0.00';

        totalQualityPoints += semesterQualityPoints;
        totalCreditHours += semesterCreditHours;
    }

    const cgpa = totalQualityPoints / totalCreditHours;
    document.getElementById('cgpaResult').textContent = `CGPA: ${totalCreditHours ? cgpa.toFixed(2) : '0.00'}`;
}

function resetForm() {
    document.getElementById('cgpaForm').reset();
    document.getElementById('semesters').innerHTML = '';
    semesterCount = 0;
    addSemester();
    document.getElementById('cgpaResult').textContent = 'CGPA: 0.00';
}
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title Section
    doc.setFontSize(18);
    doc.text("Homeschool Transcript", 14, 20);
    
    // Personal Details
    const name = document.getElementById('name').value || 'N/A';
    const regNo = document.getElementById('regNo').value || 'N/A';
    const fatherName = document.getElementById('fatherName').value || 'N/A';

    doc.setFontSize(12);
    doc.text(`Full Name: ${name}`, 14, 30);
    doc.text(`Registration No: ${regNo}`, 14, 40);
    doc.text(`Father's Name: ${fatherName}`, 14, 50);
    
    let yOffset = 60; // Initial offset for semesters

    // Loop through semesters and add tables
    for (let i = 1; i <= semesterCount; i++) {
        const semester = document.getElementById(`semester-${i}`);
        const semesterName = semester.querySelector('.semester-name').value || `Semester ${i}`;
        const gpa = semester.querySelector('.semester-gpa span').textContent || '0.00';

        // Add Semester Header
        doc.setFontSize(14);
        doc.text(`Semester ${i}: ${semesterName}`, 14, yOffset);
        yOffset += 10;

        // Add SGPA
        doc.setFontSize(12);
        doc.text(`SGPA: ${gpa}`, 14, yOffset);
        yOffset += 10;

        // Prepare data for the table (courses)
        const courses = semester.querySelectorAll('.course');
        const courseData = [];
        courses.forEach((course, index) => {
            const serialNo = course.querySelector('td').textContent || `${index + 1}`;
            const courseName = course.querySelector('.subject-name').value || 'N/A';
            const creditHours = course.querySelector('.credit-hours').value || '0';
            const grade = course.querySelector('.grade').selectedOptions[0].text || 'N/A';
            courseData.push([serialNo, courseName, creditHours, grade]);
        });

        // Use autoTable to create the table for courses
        doc.autoTable({
            startY: yOffset,
            head: [['Serial No.', 'Course Name', 'Credit Hours', 'Grades']],
            body: courseData,
            theme: 'grid', // To get table lines
            headStyles: { fillColor: [248, 199, 28] }, // Yellow header
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // White background, black text
            alternateRowStyles: { fillColor: [240, 240, 240] }, // Alternate row colors for clarity
        });

        // Update the yOffset to continue below the table
        yOffset = doc.lastAutoTable.finalY + 10;
    }

    // Final CGPA Section
    const cgpa = document.getElementById('cgpaResult').textContent.split(' ')[1] || '0.00';
    doc.setFontSize(14);
    doc.text(`Overall Cumulative GPA: ${cgpa}`, 14, yOffset);

    doc.save('transcript.pdf');
}
