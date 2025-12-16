// === Form Validation Utilities ===

const Validation = {
    // Validate Egyptian National ID (14 digits)
    nationalId: function(value) {
        const regex = /^[0-9]{14}$/;
        return regex.test(value);
    },
    
    // Validate Egyptian Phone Number
    phone: function(value) {
        const regex = /^01[0-9]{9}$/;
        return regex.test(value);
    },
    
    // Validate Email
    email: function(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    },
    
    // Validate Required Field
    required: function(value) {
        return value.trim() !== '';
    },
    
    // Validate Min Length
    minLength: function(value, min) {
        return value.length >= min;
    },
    
    // Validate Max Length
    maxLength: function(value, max) {
        return value.length <= max;
    },
    
    // Validate File Size (in KB)
    fileSize: function(file, maxSizeKB) {
        return file.size <= maxSizeKB * 1024;
    },
    
    // Validate File Type
    fileType: function(file, allowedTypes) {
        return allowedTypes.includes(file.type);
    }
};

// === Show Error Message ===
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup?.querySelector('.form-error');
    
    input.classList.add('error');
    input.classList.remove('success');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

// === Show Success ===
function showSuccess(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup?.querySelector('.form-error');
    const successIcon = formGroup?.querySelector('.input-icon.success');
    
    input.classList.remove('error');
    input.classList.add('success');
    
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
    
    if (successIcon) {
        successIcon.classList.remove('hidden');
    }
}

// === Clear Validation ===
function clearValidation(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup?.querySelector('.form-error');
    const successIcon = formGroup?.querySelector('.input-icon.success');
    
    input.classList.remove('error', 'success');
    
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
    
    if (successIcon) {
        successIcon.classList.add('hidden');
    }
}

// === Real-time Validation ===
function setupRealTimeValidation(input, validationFn, errorMessage) {
    input.addEventListener('input', function() {
        if (this.value === '') {
            clearValidation(this);
            return;
        }
        
        if (validationFn(this.value)) {
            showSuccess(this);
        } else {
            showError(this, errorMessage);
        }
    });
}