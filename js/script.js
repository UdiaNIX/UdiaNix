document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Validação em tempo real
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Submissão do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            try {
                // Aqui você adiciona sua lógica de envio do formulário
                await submitForm(form);
                
                showSuccess();
                form.reset();
            } catch (error) {
                showError();
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Enviar Solicitação <i class="fas fa-paper-plane"></i>';
            }
        }
    });
});

function validateField(field) {
    const wrapper = field.closest('.input-wrapper');
    const isValid = field.checkValidity();
    
    wrapper.classList.toggle('error', !isValid);
    
    return isValid;
}

function validateForm() {
    const activeStep = document.querySelector('.form-step.active');
    const fields = activeStep.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function nextStep() {
    if (validateForm()) {
        const currentStep = document.querySelector('.form-step.active');
        const nextStep = currentStep.nextElementSibling;
        
        if (nextStep && nextStep.classList.contains('form-step')) {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            
            updateProgress(parseInt(nextStep.id.replace('step', '')));
        }
    }
}

function prevStep() {
    const currentStep = document.querySelector('.form-step.active');
    const prevStep = currentStep.previousElementSibling;
    
    if (prevStep && prevStep.classList.contains('form-step')) {
        currentStep.classList.remove('active');
        prevStep.classList.add('active');
        
        updateProgress(parseInt(prevStep.id.replace('step', '')));
    }
}

function updateProgress(step) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((el, index) => {
        el.classList.toggle('active', index + 1 <= step);
    });
}

function showSuccess() {
    const formContent = document.querySelector('.contact-form > *:not(h2)');
    formContent.innerHTML = `
        <div class="success-message" style="text-align: center; padding: 2rem;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--color-primary);"></i>
            <h3>Mensagem Enviada com Sucesso!</h3>
            <p>Entraremos em contato em até 24 horas úteis.</p>
        </div>
    `;
}

function showError() {
    alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
}

async function submitForm(form) {
    // Simula um delay de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Aqui você implementaria a lógica real de envio do formulário
    return Promise.resolve();
}

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animação de entrada dos elementos
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.feature-card, .pricing-card, .testimonial').forEach(el => {
    observer.observe(el);
});

// Contador de visitantes (exemplo simples)
let visitorCount = localStorage.getItem('visitorCount') || 0;
visitorCount++;
localStorage.setItem('visitorCount', visitorCount);

// Adicionar classe active ao menu atual
function setActiveMenu() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

setActiveMenu();

// Adicionar animação de loading nos botões
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        }
    });
});