document.addEventListener('DOMContentLoaded', function() {
    const examLoginForm = document.getElementById('examLoginForm');
    const nationalIdInput = document.getElementById('examNationalId');
    
    // === Setup Validation ===
    if (nationalIdInput) {
        setupRealTimeValidation(
            nationalIdInput,
            Validation.nationalId,
            'الرقم القومي يجب أن يكون 14 رقم'
        );
        
        // Only allow numbers
        nationalIdInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // === Form Submit ===
    examLoginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const course = document.getElementById('courseSelect').value;
        const nationalId = document.getElementById('examNationalId').value;
        const examCode = document.getElementById('examCode').value;
        
        // Validate
        if (!course) {
            alert('يرجى اختيار الدورة');
            return;
        }
        
        if (!Validation.nationalId(nationalId)) {
            showError(nationalIdInput, 'الرقم القومي يجب أن يكون 14 رقم');
            return;
        }
        
        if (!examCode.trim()) {
            alert('يرجى إدخال كود الاختبار');
            return;
        }
        
        // Simulate verification
        console.log('Verifying:', { course, nationalId, examCode });
        
        // Show loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحقق...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Redirect to exam page or show error
            const isValid = true; // Simulate validation result
            
            if (isValid) {
                if (confirm('تم التحقق من البيانات. هل أنت مستعد لبدء الاختبار؟')) {
                    // window.location.href = 'exam-test.html';
                    alert('سيتم توجيهك لصفحة الاختبار...');
                }
            } else {
                alert('البيانات غير صحيحة. يرجى التحقق من الرقم القومي وكود الاختبار.');
            }
        }, 1500);
    });
    
    // === Tips Cards Animation ===
    const tipCards = document.querySelectorAll('.tip-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    tipCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
});