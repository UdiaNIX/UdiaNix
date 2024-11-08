document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o formulário mostrando apenas a primeira etapa
    showStep(1);

    const privacyCheckbox = document.getElementById('privacyTerms');
    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', function() {
            const wrapper = this.closest('.checkbox-wrapper');
            if (!this.checked) {
                wrapper.classList.add('error');
            } else {
                wrapper.classList.remove('error');
            }
        });
    }
});

function showStep(stepNumber) {
    // Oculta todas as etapas
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostra a etapa atual
    document.querySelector(`.step-${stepNumber}`).classList.add('active');
    
    // Atualiza os indicadores de progresso
    updateProgressIndicators(stepNumber);
}

function nextStep(currentStep) {
    if (validateStep(currentStep)) {
        showStep(currentStep + 1);
    }
}

function previousStep(currentStep) {
    showStep(currentStep - 1);
}

function validateStep(stepNumber) {
    const currentStep = document.querySelector(`.step-${stepNumber}`);
    const inputs = currentStep.querySelectorAll('input[required], textarea[required]');
    
    let isValid = true;
    inputs.forEach(input => {
        const wrapper = input.type === 'checkbox' 
            ? input.closest('.checkbox-wrapper')
            : input.closest('.input-wrapper');

        if (input.type === 'checkbox' && !input.checked) {
            isValid = false;
            wrapper.classList.add('error');
        } else if (input.type !== 'checkbox' && !input.value.trim()) {
            isValid = false;
            wrapper.classList.add('error');
        } else {
            wrapper.classList.remove('error');
        }
    });
    
    return isValid;
}

function updateProgressIndicators(stepNumber) {
    // Atualiza os indicadores de progresso
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
} 