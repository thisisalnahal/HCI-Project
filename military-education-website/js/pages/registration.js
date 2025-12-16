document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const stepLines = document.querySelectorAll('.step-line');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    
    // === Setup Real-time Validation ===
    const nationalIdInput = document.getElementById('nationalId');
    const phoneInput = document.getElementById('phone');
    
    if (nationalIdInput) {
        setupRealTimeValidation(
            nationalIdInput, 
            Validation.nationalId, 
            'الرقم القومي يجب أن يكون 14 رقم'
        );
    }
    
    if (phoneInput) {
        setupRealTimeValidation(
            phoneInput,
            Validation.phone,
            'رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقم'
        );
    }
    
    // === Update Steps UI ===
    function updateStepsUI() {
        // Update step content
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update step indicators
        stepIndicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (stepNum === currentStep) {
                indicator.classList.add('active');
            } else if (stepNum < currentStep) {
                indicator.classList.add('completed');
            }
        });
        
        // Update step lines
        stepLines.forEach((line, index) => {
            if (index + 1 < currentStep) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });
        
        // Update buttons
        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
        
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }
    }
    
    // === Validate Current Step ===
    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                showError(input, 'هذا الحقل مطلوب');
                isValid = false;
            } else if (input.id === 'nationalId' && !Validation.nationalId(input.value)) {
                showError(input, 'الرقم القومي يجب أن يكون 14 رقم');
                isValid = false;
            } else if (input.id === 'phone' && !Validation.phone(input.value)) {
                showError(input, 'رقم الهاتف غير صحيح');
                isValid = false;
            }
        });
        
        // Special validation for step 3 (course selection)
        if (step === 3) {
            const courseSelected = document.querySelector('input[name="course"]:checked');
            if (!courseSelected) {
                alert('يرجى اختيار موعد الدورة');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // === Update Summary ===
    function updateSummary() {
        document.getElementById('summaryNationalId').textContent = 
            document.getElementById('nationalId').value || '-';
        document.getElementById('summaryName').textContent = 
            document.getElementById('fullName').value || '-';
        
        const facultySelect = document.getElementById('faculty');
        document.getElementById('summaryFaculty').textContent = 
            facultySelect.options[facultySelect.selectedIndex]?.text || '-';
        
        const levelSelect = document.getElementById('level');
        document.getElementById('summaryLevel').textContent = 
            levelSelect.options[levelSelect.selectedIndex]?.text || '-';
        
        const courseSelected = document.querySelector('input[name="course"]:checked');
        if (courseSelected) {
            const courseCard = courseSelected.closest('.course-option').querySelector('.course-name');
            document.getElementById('summaryCourse').textContent = courseCard?.textContent || '-';
        }
    }
    
    // === Next Button ===
    nextBtn?.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepsUI();
                
                // Update summary when reaching last step
                if (currentStep === totalSteps) {
                    updateSummary();
                }
                
                // Scroll to top of form
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
    // === Previous Button ===
    prevBtn?.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateStepsUI();
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    
    // === Form Submit ===
    form?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            alert('يجب الموافقة على الشروط والأحكام');
            return;
        }
        
        // Collect form data
        const formData = {
            nationalId: document.getElementById('nationalId').value,
            fullName: document.getElementById('fullName').value,
            birthDate: document.getElementById('birthDate').value,
            phone: document.getElementById('phone').value,
            faculty: document.getElementById('faculty').value,
            level: document.getElementById('level').value,
            studentId: document.getElementById('studentId').value,
            course: document.querySelector('input[name="course"]:checked')?.value
        };
        
        console.log('Form Data:', formData);
        
        // Show success message
        alert('تم التسجيل بنجاح! سيتم إرسال رسالة تأكيد على رقم الهاتف.');
        window.location.replace("../index.html");
        
        // Reset form (optional)
        // form.reset();
        // currentStep = 1;
        // updateStepsUI();
    });
    
    // Initialize
    updateStepsUI();
});