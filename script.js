// Initialize matrices
let matrixA = [];
let matrixB = [];

// Navigation functionality
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('href').substring(1);
        scrollToSection(target);
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
    });
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Matrix initialization
function initializeMatrices() {
    updateMatrixSize('A');
    updateMatrixSize('B');
}

function updateMatrixSize(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    
    const container = document.getElementById(`matrix${matrixName}`);
    container.innerHTML = '';
    
    const grid = document.createElement('div');
    grid.className = 'matrix-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.value = '0';
            input.id = `m${matrixName}_${i}_${j}`;
            input.addEventListener('input', () => updateMatrixData(matrixName));
            grid.appendChild(input);
        }
    }
    
    container.appendChild(grid);
    updateMatrixData(matrixName);
}

function updateMatrixData(matrixName) {
    const rows = parseInt(document.getElementById(`rows${matrixName}`).value);
    const cols = parseInt(document.getElementById(`cols${matrixName}`).value);
    
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`m${matrixName}_${i}_${j}`).value) || 0;
            matrix[i][j] = value;
        }
    }
    
    if (matrixName === 'A') {
        matrixA = matrix;
    } else {
        matrixB = matrix;
    }
}

function toggleMatrixB() {
    const operation = document.getElementById('operation').value;
    const matrixBContainer = document.getElementById('matrixBContainer');
    
    if (['determinant', 'inverse', 'transpose'].includes(operation)) {
        matrixBContainer.style.display = 'none';
    } else {
        matrixBContainer.style.display = 'block';
    }
}

// Matrix operations
function addMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < a[i].length; j++) {
            result[i][j] = a[i][j] + b[i][j];
        }
    }
    return result;
}

function subtractMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < a[i].length; j++) {
            result[i][j] = a[i][j] - b[i][j];
        }
    }
    return result;
}

function multiplyMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function determinant(matrix) {
    if (matrix.length === 2 && matrix[0].length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    if (matrix.length === 3 && matrix[0].length === 3) {
        return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
               matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
               matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
    }
    
    return "Determinan untuk matriks 4x4+ tidak didukung";
}

function transpose(matrix) {
    const result = [];
    for (let i = 0; i < matrix[0].length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            result[i][j] = matrix[j][i];
        }
    }
    return result;
}

function inverse(matrix) {
    if (matrix.length === 2 && matrix[0].length === 2) {
        const det = determinant(matrix);
        if (det === 0) return "Matriks singular, tidak memiliki invers";
        
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    }
    
    return "Invers untuk matriks 3x3+ tidak didukung";
}

function formatNumber(num) {
    if (Math.abs(num) < 0.00001) return "0";
    return parseFloat(num.toFixed(6)).toString();
}

function displayMatrix(matrix) {
    if (typeof matrix === 'string') {
        return `<p>${matrix}</p>`;
    }
    
    let html = '<div class="matrix-display">';
    for (let i = 0; i < matrix.length; i++) {
        html += '<div class="matrix-row">';
        for (let j = 0; j < matrix[i].length; j++) {
            html += `<span class="matrix-cell">${formatNumber(matrix[i][j])}</span>`;
        }
        html += '</div>';
    }
    html += '</div>';
    return html;
}

function calculate() {
    const operation = document.getElementById('operation').value;
    let result = null;
    
    try {
        switch (operation) {
            case 'add':
                if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
                    result = "Ukuran matriks tidak cocok untuk penjumlahan";
                    break;
                }
                result = addMatrices(matrixA, matrixB);
                break;
                
            case 'subtract':
                if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
                    result = "Ukuran matriks tidak cocok untuk pengurangan";
                    break;
                }
                result = subtractMatrices(matrixA, matrixB);
                break;
                
            case 'multiply':
                if (matrixA[0].length !== matrixB.length) {
                    result = "Jumlah kolom matriks A harus sama dengan jumlah baris matriks B";
                    break;
                }
                result = multiplyMatrices(matrixA, matrixB);
                break;
                
            case 'determinant':
                if (matrixA.length !== matrixA[0].length) {
                    result = "Determinan hanya bisa dihitung untuk matriks persegi";
                    break;
                }
                result = determinant(matrixA);
                break;
                
            case 'inverse':
                if (matrixA.length !== matrixA[0].length) {
                    result = "Invers hanya bisa dihitung untuk matriks persegi";
                    break;
                }
                result = inverse(matrixA);
                break;
                
            case 'transpose':
                result = transpose(matrixA);
                break;
                
            default:
                result = "Operasi tidak dikenal";
        }
        
        document.getElementById('result').innerHTML = displayMatrix(result);
    } catch (error) {
        document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function clearResult() {
    document.getElementById('result').innerHTML = '';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMatrices();
    toggleMatrixB();
    
    // Add event listeners
    document.getElementById('operation').addEventListener('change', toggleMatrixB);
    document.getElementById('rowsA').addEventListener('change', () => updateMatrixSize('A'));
    document.getElementById('colsA').addEventListener('change', () => updateMatrixSize('A'));
    document.getElementById('rowsB').addEventListener('change', () => updateMatrixSize('B'));
    document.getElementById('colsB').addEventListener('change', () => updateMatrixSize('B'));
});
