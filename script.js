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

    // University Header with Border
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text("University of Engineering & Technology Peshawar, Pakistan", 105, 20, { align: 'center' });

    // Add Border around Header
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 30);  // X, Y, Width, Height

    // Student Information
    const name = document.getElementById('name').value || 'N/A';
    const regNo = document.getElementById('regNo').value || 'N/A';
    const fatherName = document.getElementById('fatherName').value || 'N/A';

    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.text(`Registration No: ${regNo}`, 150, 40);
    doc.setFont('times', 'bold');
    doc.text("TRANSCRIPT", 105, 50, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.text(`Student's Name: ${name}`, 14, 60);
    doc.text(`Father's Name: ${fatherName}`, 150, 60);
    doc.text("Program: B.Sc. Computer Systems Engg", 14, 68);
    doc.text("Plan: B.Sc. Computer Systems Engg Major", 150, 68);

    // Line Under Transcript Heading
    doc.setLineWidth(0.5);
    doc.line(10, 52, 200, 52);  // X-start, Y-start, X-end, Y-end

    let yOffset = 80; // Initial offset for semesters

    // Loop through semesters and add tables
    for (let i = 1; i <= semesterCount; i++) {
        const semester = document.getElementById(`semester-${i}`);
        const semesterName = semester.querySelector('.semester-name').value || `Semester ${i}`;
        const gpa = semester.querySelector('.semester-gpa span').textContent || '0.00';

        // Add Semester Header
        doc.setFontSize(12);
        doc.setFont('times', 'bold');
        doc.text(semesterName, 14, yOffset);
        yOffset += 10;

        // Prepare data for the table (courses)
        const courses = semester.querySelectorAll('.course');
        const courseData = [];
        let totalCH = 0;
        let totalGP = 0;

        courses.forEach((course, index) => {
            const courseName = course.querySelector('.subject-name').value || 'N/A';
            const creditHours = parseFloat(course.querySelector('.credit-hours').value) || 0;
            const gradeValue = parseFloat(course.querySelector('.grade').value);
            const gradeText = course.querySelector('.grade').selectedOptions[0].text || 'N/A';

            totalCH += creditHours;
            totalGP += creditHours * gradeValue;
            courseData.push([`CSE ${index + 101}`, courseName, creditHours.toFixed(2), gradeText]);
        });

        // Table for courses - without yellow header, exact like the transcript
        doc.autoTable({
            startY: yOffset,
            head: [['Code', 'Title', 'CH', 'Grade']],
            body: courseData,
            theme: 'plain', // Plain table, no coloring
            headStyles: { fillColor: [0, 0, 0], textColor: [0, 0, 0] }, // Black headers with white text
            bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // White background, black text
            alternateRowStyles: { fillColor: [255, 255, 255] }, // No alternate row colors, plain
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 80 },
                2: { cellWidth: 30 },
                3: { cellWidth: 30 },
            },
        });

        // Calculate Semester SCH, SGP, SGPA
        const sgpa = totalGP / totalCH;
        yOffset = doc.lastAutoTable.finalY + 10;

        // Semester Summary
        doc.setFontSize(12);
        doc.text(`SCH: ${totalCH.toFixed(2)}`, 14, yOffset);
        doc.text(`SGP: ${totalGP.toFixed(2)}`, 50, yOffset);
        doc.text(`SGPA: ${sgpa.toFixed(2)}`, 100, yOffset);

        // Update the cumulative values for CGPA calculation
        yOffset += 10;
    }

    // Final CGPA Section
    const cgpa = document.getElementById('cgpaResult').textContent.split(' ')[1] || '0.00';
    doc.setFontSize(10);
    doc.text(`Overall Cumulative GPA (CGPA): ${cgpa}`, 14, yOffset);

    // Footer Section
    doc.setFontSize(7);
    doc.text("The Official Transcript carries the embossed stamp of the University", 14, doc.internal.pageSize.height - 30);
    doc.text("Errors and Omissions are subject to subsequent rectification", 14, doc.internal.pageSize.height - 20);
    doc.text("Transcript Prepared By: ___________________________", 14, doc.internal.pageSize.height - 10);
    doc.text("Controller of Examinations", 140, doc.internal.pageSize.height - 10);
    doc.text(`Date of issue: ${new Date().toLocaleDateString()}`, 140, doc.internal.pageSize.height - 20);

    // Save the PDF
    doc.save('transcript.pdf');
}
