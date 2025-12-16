document.addEventListener('DOMContentLoaded', function() {
    // === Elements ===
    const searchForm = document.getElementById('searchForm');
    const searchBtn = document.getElementById('searchBtn');
    const nationalIdInput = document.getElementById('resultNationalId');
    const inputStatus = document.getElementById('inputStatus');
    
    const resultSection = document.getElementById('resultSection');
    const resultSuccess = document.getElementById('resultSuccess');
    const resultNotFound = document.getElementById('resultNotFound');
    
    const btnDownloadPdf = document.getElementById('btnDownloadPdf');
    const btnPrint = document.getElementById('btnPrint');
    const btnTryAgain = document.getElementById('btnTryAgain');
    
    // === قاعدة بيانات وهمية للنتائج ===
    const resultsDatabase = {
        '00000000000000': {
            name: 'أحمد محمد علي خالد',
            faculty: 'كلية الحاسبات والمعلومات',
            course: 'دورة 78 - ديسمبر 2025',
            grade: '47/50',
            passed: true
        },
        '11111111111111': {
            name: 'محمد محمود عبدالعزيز احمد',
            faculty: 'كلية التجارة',
            course: 'دورة 76 - أكتوبر 2025',
            grade: '42/50',
            passed: true
        },
        '44444444444444': {
            name: 'يوسف محمد عبدالله حسن',
            faculty: 'كلية العلوم',
            course: 'دورة 77 - نوفمبر 2025',
            grade: '18/50',
            passed: false
        }
    };
    
    // === National ID Validation ===
    nationalIdInput?.addEventListener('input', function() {
        // Allow only numbers
        this.value = this.value.replace(/[^0-9]/g, '');
        
        const length = this.value.length;
        
        // Update status icon
        if (length === 0) {
            inputStatus.className = 'input-status';
            inputStatus.innerHTML = '';
            this.classList.remove('valid', 'invalid');
        } else if (length === 14) {
            inputStatus.className = 'input-status valid';
            inputStatus.innerHTML = '<i class="fas fa-check-circle"></i>';
            this.classList.remove('invalid');
            this.classList.add('valid');
        } else {
            inputStatus.className = 'input-status invalid';
            inputStatus.innerHTML = '<i class="fas fa-times-circle"></i>';
            this.classList.remove('valid');
            this.classList.add('invalid');
        }
    });
    
    // === Search Form Submit ===
    searchForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nationalId = nationalIdInput.value.trim();
        
        // Validate
        if (!nationalId) {
            showAlert('يرجى إدخال الرقم القومي', 'error');
            nationalIdInput.focus();
            return;
        }
        
        if (nationalId.length !== 14) {
            showAlert('الرقم القومي يجب أن يكون 14 رقم', 'error');
            nationalIdInput.focus();
            return;
        }
        
        // Show loading
        const originalContent = searchBtn.innerHTML;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري البحث...';
        searchBtn.disabled = true;
        
        // Hide previous results
        resultSection.classList.add('hidden');
        resultSuccess.classList.add('hidden');
        resultNotFound.classList.add('hidden');
        
        // Simulate API call
        setTimeout(() => {
            searchBtn.innerHTML = originalContent;
            searchBtn.disabled = false;
            
            // البحث في قاعدة البيانات
            const studentData = resultsDatabase[nationalId];
            
            if (studentData) {
                showSuccessResult(studentData);
            } else {
                showNotFoundResult();
            }
        }, 1500);
    });
    
    // === Show Success Result ===
    function showSuccessResult(data) {
        // Update result data
        document.getElementById('resultName').textContent = data.name;
        document.getElementById('resultFaculty').textContent = data.faculty;
        document.getElementById('resultCourse').textContent = data.course;
        document.getElementById('resultGrade').textContent = data.grade;
        
        // Update status
        const statusContainer = document.getElementById('resultStatusContainer');
        const statusElement = document.getElementById('resultStatus');
        
        if (data.passed) {
            statusContainer.classList.remove('fail');
            statusElement.className = 'item-value status-pass';
            statusElement.innerHTML = '<i class="fas fa-check-circle"></i> ناجح';
        } else {
            statusContainer.classList.add('fail');
            statusElement.className = 'item-value status-fail';
            statusElement.innerHTML = '<i class="fas fa-times-circle"></i> راسب';
        }
        
        // Show result card
        resultSection.classList.remove('hidden');
        resultSuccess.classList.remove('hidden');
        resultNotFound.classList.add('hidden');
        
        // Scroll to result
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    // === Show Not Found Result ===
    function showNotFoundResult() {
        resultSection.classList.remove('hidden');
        resultSuccess.classList.add('hidden');
        resultNotFound.classList.remove('hidden');
        
        // Scroll to result
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    // === Try Again Button ===
    btnTryAgain?.addEventListener('click', function() {
        // Hide results
        resultSection.classList.add('hidden');
        resultSuccess.classList.add('hidden');
        resultNotFound.classList.add('hidden');
        
        // Clear input
        nationalIdInput.value = '';
        nationalIdInput.classList.remove('valid', 'invalid');
        inputStatus.className = 'input-status';
        inputStatus.innerHTML = '';
        
        // Scroll to form and focus
        document.querySelector('.search-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        setTimeout(() => {
            nationalIdInput.focus();
        }, 500);
    });
    
    // === Download PDF Button ===
    btnDownloadPdf?.addEventListener('click', function() {
        const originalContent = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        this.disabled = true;
        
        setTimeout(() => {
            this.innerHTML = originalContent;
            this.disabled = false;
            showAlert('تم تحميل ملف PDF بنجاح', 'success');
        }, 1500);
    });
    
    // === Print Button ===
    btnPrint?.addEventListener('click', function() {
        window.print();
    });
    
    // === Show Alert Toast ===
    function showAlert(message, type = 'info') {
        // Remove existing alerts
        document.querySelectorAll('.alert-toast').forEach(el => el.remove());
        
        // Create alert
        const alert = document.createElement('div');
        alert.className = `alert-toast alert-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        alert.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(alert);
        
        // Show
        requestAnimationFrame(() => {
            alert.classList.add('show');
        });
        
        // Hide after 3 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }
    
    // === Enter Key Submit ===
    nationalIdInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // === Notes Cards Animation ===
    const noteCards = document.querySelectorAll('.note-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    noteCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.4s ease';
        observer.observe(card);
    });
});