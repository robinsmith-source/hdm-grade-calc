const table = document.querySelector("table:nth-of-type(2)");
const rows = Array.from(document.querySelectorAll("table:nth-of-type(2) tr"));
const basic = {grades: [], credits: []}, main = {grades: [], credits: []};
let current = basic;
let lastBasicRow = 0;

rows.forEach(row => {
    if (row.textContent.includes("Grundstudium")) current = basic;
    if (row.textContent.includes("Hauptstudium")) {
        current = main;
        lastBasicRow = row.rowIndex;
    }

    const gradeCell = row.querySelector("td:nth-child(6)");
    const creditCell = row.querySelector("td:nth-child(8)");

    if (gradeCell && creditCell) {
        const grade = parseFloat(gradeCell.innerText.trim().replace(",", "."));
        const credit = parseFloat(creditCell.innerText.trim());
        if (grade) {
            current.grades.push(grade);
            current.credits.push(credit);
        }
    }
});

const calculateAverage = ({grades, credits}) =>
    grades.reduce((acc, grade, i) => acc + grade * credits[i], 0) / credits.reduce((acc, credit) => acc + credit, 0);

const calculateTotalAverage = (thesis_grade) => {
    return calculateAverage(basic) * 0.15 + calculateAverage(main) * 0.7 + thesis_grade * 0.15;
}

const createAverageRow = (average) => {
    const avg_row = document.createElement('tr');
    avg_row.innerHTML = `
    <td class="tabelleheader" style="background:#3f4847" colspan="5">Noten Durchschnitt</td>
    <td class="tabelleheader average" style="background:#3f4847" colspan="7">${average.toFixed(2)}</td>
    </tr>`;
    return avg_row;
}

if (basic.grades.length > 0) {
    table.insertRow(lastBasicRow).before(createAverageRow(calculateAverage(basic)));
}
if (main.grades.length > 0) {
    table.appendChild(createAverageRow(calculateAverage(main)));
}

console.log("Total average: ", calculateTotalAverage(1.0));

// Create the thesis grade row and add an event listener to the input field
const thesisGrade = () => {
    const thesis_row = document.createElement('tr');
    thesis_row.innerHTML = `
    <td class="tabelleheader" style="background:#3f4847" colspan="5">Thesis Note</td>
    <td class="tabelleheader average" style="background:#3f4847" colspan="7"><input style="height: 10px; width:40px; font-weight:bold; font-size: 14px;" type="number" id="thesis_grade" value="1"/></td>
    </tr>`;
    const thesisInput = thesis_row.querySelector('#thesis_grade');
    thesisInput.addEventListener('input', updateTotalAverage);
    return thesis_row;
}

// Create the total average row
const simGrade = () => {
    const sim_row = document.createElement('tr');
    sim_row.id = 'totalAverageRow';
    sim_row.innerHTML = `
    <td class="tabelleheader" style="background:#3f4847" colspan="5">Geschätzte Endnote</td>
    <td class="tabelleheader average" style="background:#3f4847" colspan="7">${calculateTotalAverage(parseFloat(document.getElementById('thesis_grade').value)).toFixed(2)}</td>
    </tr>`;
    return sim_row;
}

// Update the total average when the thesis grade changes
const updateTotalAverage = () => {
    const totalGrade = calculateTotalAverage(parseFloat(document.getElementById('thesis_grade').value));
    const totalAverageRow = document.getElementById('totalAverageRow');
    totalAverageRow.querySelector('.average').innerText = totalGrade.toFixed(2);
}

table.appendChild(thesisGrade());
table.appendChild(simGrade());

