/**
 * AEEC Heavy Freight Transport Corp.
 * Script principal - Optimizado para despliegue
 * Versión: 2.0.0
 */

// ===== INICIALIZACIÓN =====
(function() {
    'use strict';

    // Esperar a que el DOM esté completamente cargado
    document.addEventListener('DOMContentLoaded', initApp);

    /**
     * Función principal de inicialización
     */
    function initApp() {
        // Configuración global
        const CONFIG = {
            EMAILJS_PUBLIC_KEY: 'HQmVYyQx46yJHwo-U',
            EMAILJS_SERVICE_ID: 'service_vqrkhse',
            EMAILJS_TEMPLATE_ID: 'template_6l140wl',
            ANIMATION_DURATION: 500,
            NOTIFICATION_DURATION: 5000,
            SCROLL_OFFSET: 100
        };

        // Inicializar módulos
        initEmailJS(CONFIG);
        initCurrentYear();
        initMobileMenu();
        initFleetCarousel();
        initContactForm(CONFIG);
        initSmoothScroll();
        initHeaderScroll();
        initScrollAnimations();
        initMapTooltips();
    }

    // ===== MÓDULO: EMAILJS =====
    function initEmailJS(config) {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(config.EMAILJS_PUBLIC_KEY);
            console.log('EmailJS inicializado correctamente');
        } else {
            console.error('EmailJS no está disponible');
        }
    }

    // ===== MÓDULO: AÑO ACTUAL =====
    function initCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // ===== MÓDULO: MENÚ MÓVIL =====
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) return;

        // Toggle menú
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Cerrar menú al hacer clic en enlaces
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Actualizar enlace activo
                navLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ===== MÓDULO: CARRUSEL DE FLOTA =====
    function initFleetCarousel() {
        const carouselTrack = document.querySelector('.carousel-track');
        const fleetItems = document.querySelectorAll('.fleet-item');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!carouselTrack || !fleetItems.length || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        
        function getItemsPerView() {
            const width = window.innerWidth;
            if (width < 576) return 1;
            if (width < 768) return 2;
            if (width < 992) return 3;
            return 4;
        }

        function updateCarousel() {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, fleetItems.length - itemsPerView);
            currentIndex = Math.min(currentIndex, maxIndex);
            
            const itemWidth = fleetItems[0]?.offsetWidth || 250;
            const gap = 30;
            const translateX = -currentIndex * (itemWidth + gap);
            
            carouselTrack.style.transform = `translateX(${translateX}px)`;
            
            // Actualizar estado de botones
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            
            // Accesibilidad
            prevBtn.setAttribute('aria-disabled', currentIndex === 0);
            nextBtn.setAttribute('aria-disabled', currentIndex >= maxIndex);
        }

        function nextSlide() {
            const itemsPerView = getItemsPerView();
            if (currentIndex < fleetItems.length - itemsPerView) {
                currentIndex++;
                updateCarousel();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Soporte para teclado
        prevBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                prevSlide();
            }
        });
        
        nextBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            }
        });

        // Optimización para resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel();
            }, 150);
        });

        // Inicializar
        updateCarousel();
    }

    // ===== MÓDULO: FORMULARIO DE CONTACTO =====
    function initContactForm(config) {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;

        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const submitSpinner = document.getElementById('submitSpinner');
        const formMessage = document.getElementById('form-message');

        // Validaciones
        const validators = {
            name: (value) => value.trim().length >= 2,
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
            phone: (value) => value.trim().length >= 7,
            service: (value) => value && value !== '',
            message: (value) => value.trim().length >= 10
        };

        const errorMessages = {
            name: 'Por favor, ingrese un nombre válido (mínimo 2 caracteres)',
            email: 'Por favor, ingrese un correo electrónico válido',
            phone: 'Por favor, ingrese un teléfono válido (mínimo 7 dígitos)',
            service: 'Por favor, seleccione un servicio',
            message: 'Por favor, ingrese un mensaje (mínimo 10 caracteres)'
        };

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Obtener valores
            const formData = {
                name: document.getElementById('name')?.value.trim() || '',
                email: document.getElementById('email')?.value.trim() || '',
                phone: document.getElementById('phone')?.value.trim() || '',
                service: document.getElementById('service')?.value || '',
                message: document.getElementById('message')?.value.trim() || ''
            };

            // Validar campos
            for (const [field, value] of Object.entries(formData)) {
                if (!validators[field](value)) {
                    showFormMessage(errorMessages[field], 'error');
                    highlightInvalidField(field);
                    return;
                }
            }

            // Preparar para envío
            setLoadingState(true);

            // Preparar parámetros para EmailJS
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone,
                service: formData.service,
                message: formData.message,
                date: new Date().toLocaleString('es-EC', {
                    timeZone: 'America/Guayaquil',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            try {
                if (typeof emailjs === 'undefined') {
                    throw new Error('EmailJS no está disponible');
                }

                const response = await emailjs.send(
                    config.EMAILJS_SERVICE_ID,
                    config.EMAILJS_TEMPLATE_ID,
                    templateParams
                );

                console.log('Email enviado exitosamente:', response.status);
                
                showFormMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                showNotification('¡Mensaje enviado con éxito!', 'success');
                contactForm.reset();
                
                // Limpiar campos destacados
                document.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
                    .forEach(field => field.style.borderColor = '');

            } catch (error) {
                console.error('Error al enviar email:', error);
                showFormMessage('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
                showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
            } finally {
                setLoadingState(false);
            }
        });

        // Funciones auxiliares del formulario
        function setLoadingState(isLoading) {
            if (!submitBtn || !submitText || !submitSpinner) return;
            
            submitBtn.disabled = isLoading;
            submitText.textContent = isLoading ? 'Enviando...' : 'Enviar Mensaje';
            submitSpinner.style.display = isLoading ? 'inline-block' : 'none';
        }

        function showFormMessage(message, type) {
            if (!formMessage) return;
            
            formMessage.textContent = message;
            formMessage.className = '';
            formMessage.classList.add(type === 'success' ? 'message-success' : 'message-error');
            formMessage.style.display = 'block';
            
            // Auto-ocultar después de 5 segundos
            setTimeout(() => {
                if (formMessage) {
                    formMessage.style.display = 'none';
                }
            }, 5000);
        }

        function highlightInvalidField(fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.style.borderColor = 'var(--error)';
                field.focus();
                
                // Remover destacado después de 3 segundos
                setTimeout(() => {
                    if (field) {
                        field.style.borderColor = '';
                    }
                }, 3000);
            }
        }
    }

    // ===== MÓDULO: NOTIFICACIONES =====
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // ===== MÓDULO: SCROLL SUAVE =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || !href) return;
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 100;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== MÓDULO: HEADER SCROLL =====
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        function updateHeader() {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 5px 20px rgba(13, 27, 38, 0.1)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.boxShadow = '0 5px 20px rgba(13, 27, 38, 0.08)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            }
        }

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader(); // Estado inicial
    }

    // ===== MÓDULO: ANIMACIONES SCROLL =====
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Dejar de observar después de animar
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar elementos para animación
        const animatedElements = document.querySelectorAll(
            '.service-card, .fleet-item, .about-text, .contact-container, .hero-content, .stats-grid'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    // ===== MÓDULO: TOOLTIPS DEL MAPA =====
    function initMapTooltips() {
        const mapPoints = document.querySelectorAll('.map-point');
        
        mapPoints.forEach(point => {
            // Eventos para desktop
            point.addEventListener('mouseenter', function() {
                const label = this.querySelector('.point-label');
                if (label) {
                    label.style.opacity = '1';
                    label.style.top = '-40px';
                }
            });
            
            point.addEventListener('mouseleave', function() {
                const label = this.querySelector('.point-label');
                if (label) {
                    label.style.opacity = '0';
                    label.style.top = '-30px';
                }
            });

            // Soporte para teclado
            point.addEventListener('focus', function() {
                const label = this.querySelector('.point-label');
                if (label) {
                    label.style.opacity = '1';
                    label.style.top = '-40px';
                }
            });
            
            point.addEventListener('blur', function() {
                const label = this.querySelector('.point-label');
                if (label) {
                    label.style.opacity = '0';
                    label.style.top = '-30px';
                }
            });
        });
    }

})();