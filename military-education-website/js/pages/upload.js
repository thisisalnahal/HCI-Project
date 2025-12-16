document.addEventListener('DOMContentLoaded', function() {
    // === Elements ===
    const stepVerify = document.getElementById('stepVerify');
    const stepUpload = document.getElementById('stepUpload');
    const stepSuccess = document.getElementById('stepSuccess');
    
    const verifyForm = document.getElementById('verifyForm');
    const uploadForm = document.getElementById('uploadForm');
    
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const fileIcon = document.querySelector('.file-icon');
    const removeFileBtn = document.getElementById('removeFile');
    const btnBack = document.getElementById('btnBack');
    const btnUpload = document.getElementById('btnUpload');
    
    let selectedFile = null;
    
    // === File Validation Settings ===
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxFileSize = 250 * 1024; // 250 KB
    
    // === Show Step ===
    function showStep(step) {
        stepVerify.classList.add('hidden');
        stepUpload.classList.add('hidden');
        stepSuccess.classList.add('hidden');
        
        step.classList.remove('hidden');
    }
    
    // === Verify Form Submit ===
    verifyForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const course = document.getElementById('uploadCourse').value;
        const nationalId = document.getElementById('uploadNationalId').value;
        
        // Validate
        if (!course) {
            showAlert('يرجى اختيار الدورة', 'error');
            return;
        }
        
        if (!nationalId || nationalId.length !== 14 || !/^\d+$/.test(nationalId)) {
            showAlert('الرقم القومي يجب أن يكون 14 رقم', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحقق...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            
            // Update student info
            document.getElementById('studentName').textContent = 'أحمد محمد علي خالد';
            document.getElementById('studentFaculty').textContent = 'كلية الحاسبات والمعلومات';
            document.getElementById('studentCourse').textContent = 
                document.getElementById('uploadCourse').options[
                    document.getElementById('uploadCourse').selectedIndex
                ].text;
            
            // Go to upload step
            showStep(stepUpload);
        }, 1500);
    });
    
    // === Drop Zone Click ===
    dropZone?.addEventListener('click', function() {
        fileInput.click();
    });
    
    // === Drag & Drop Events ===
    dropZone?.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    dropZone?.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    dropZone?.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // === File Input Change ===
    fileInput?.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFile(this.files[0]);
        }
    });
    
    // === Handle File ===
    function handleFile(file) {
        // Validate type
        if (!allowedTypes.includes(file.type)) {
            showAlert('نوع الملف غير مدعوم. يرجى رفع ملف PDF أو Word فقط.', 'error');
            return;
        }
        
        // Validate size
        if (file.size > maxFileSize) {
            showAlert('حجم الملف يجب أن يكون أقل من 250 كيلوبايت.', 'error');
            return;
        }
        
        selectedFile = file;
        
        // Update preview
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        // Update icon based on file type
        if (file.type === 'application/pdf') {
            fileIcon.innerHTML = '<i class="fas fa-file-pdf"></i>';
            fileIcon.classList.remove('word');
        } else {
            fileIcon.innerHTML = '<i class="fas fa-file-word"></i>';
            fileIcon.classList.add('word');
        }
        
        // Show preview, hide drop zone
        dropZone.style.display = 'none';
        filePreview.classList.remove('hidden');
        btnUpload.disabled = false;
    }
    
    // === Format File Size ===
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' bytes';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }
    }
    
    // === Remove File ===
    removeFileBtn?.addEventListener('click', function() {
        selectedFile = null;
        fileInput.value = '';
        filePreview.classList.add('hidden');
        dropZone.style.display = 'block';
        btnUpload.disabled = true;
    });
    
    // === Back Button ===
    btnBack?.addEventListener('click', function() {
        // Reset file
        selectedFile = null;
        fileInput.value = '';
        filePreview.classList.add('hidden');
        dropZone.style.display = 'block';
        btnUpload.disabled = true;
        
        // Go back to verify step
        showStep(stepVerify);
    });
    
    // === Upload Form Submit ===
    uploadForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedFile) {
            showAlert('يرجى اختيار ملف للرفع', 'error');
            return;
        }
        
        // Show loading
        btnUpload.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';
        btnUpload.disabled = true;
        
        // Simulate upload
        setTimeout(() => {
            // Generate receipt number
            const receiptNum = 'UP-2025-78-' + String(Math.floor(Math.random() * 99999)).padStart(5, '0');
            document.getElementById('receiptNumber').textContent = receiptNum;
            
            // Set upload date
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            document.getElementById('uploadDate').textContent = now.toLocaleDateString('ar-EG', options);
            
            // Show success step
            showStep(stepSuccess);
            
            // Reset button
            btnUpload.innerHTML = '<i class="fas fa-upload"></i> رفع البحث';
            btnUpload.disabled = false;
        }, 2000);
    });
    
    // === Download Receipt ===
    document.getElementById('btnDownloadReceipt')?.addEventListener('click', function() {
        showAlert('جاري تحميل إيصال الرفع...', 'success');
        // In real app, this would trigger PDF download
    });
    
    // === Show Alert ===
    function showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert-toast alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(alert);
        
        // Animate in
        setTimeout(() => alert.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }
    
    // === National ID Input - Numbers Only ===
    document.getElementById('uploadNationalId')?.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});