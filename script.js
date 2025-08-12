// Global variables
let navbar, hamburger, navMenu, themeToggle, loadingScreen

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  navbar = document.getElementById("navbar")
  hamburger = document.getElementById("hamburger")
  navMenu = document.getElementById("navMenu")
  themeToggle = document.getElementById("themeToggle")
  loadingScreen = document.getElementById("loadingScreen")

  // Initialize all functionality
  initializeApp()
})

function initializeApp() {
  // Hide loading screen
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden")
    }
  }, 2000)

  // Initialize all components
  initializeTheme()
  initializeNavigation()
  initializeAnimations()
  initializeTypingEffect()
  initializeContactForm()
}

// Theme Management
function initializeTheme() {
  // Check for saved theme or default to light
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
}

function updateThemeIcon(theme) {
  if (themeToggle) {
    const icon = themeToggle.querySelector("i")
    if (icon) {
      icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
    }
  }
}

// Navigation
function initializeNavigation() {
  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", toggleMobileMenu)

    // Close menu when clicking on nav links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeMobileMenu)
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Navbar scroll effect and active link highlighting
  window.addEventListener("scroll", handleScroll)
}

function toggleMobileMenu() {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")

  // Prevent body scroll when menu is open
  document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "visible"
}

function closeMobileMenu() {
  hamburger.classList.remove("active")
  navMenu.classList.remove("active")
  document.body.style.overflow = "visible"
}

function handleScroll() {
  // Navbar scroll effect
  if (navbar) {
    if (window.pageYOffset > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  }

  // Update active navigation link
  updateActiveNavLink()
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight

    if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active")
    }
  })
}

// Animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"

        // Animate skill bars
        if (entry.target.classList.contains("skill-progress")) {
          const width = entry.target.getAttribute("data-width")
          setTimeout(() => {
            entry.target.style.width = width + "%"
          }, 200)
        }
      }
    })
  }, observerOptions)

  // Observe elements for animations
  document
    .querySelectorAll(".skill-progress, .project-card, .highlight-item, .stat-item, .tech-item, .contact-item")
    .forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })

  // Floating shapes animation
  animateFloatingShapes()
}

function animateFloatingShapes() {
  const shapes = document.querySelectorAll(".shape")
  shapes.forEach((shape, index) => {
    const duration = 6000 + index * 1000
    const delay = index * 2000

    setInterval(() => {
      const randomX = Math.random() * 20 - 10
      const randomY = Math.random() * 20 - 10
      shape.style.transform = `translate(${randomX}px, ${randomY}px)`
    }, duration)
  })
}

// Typing Effect
function initializeTypingEffect() {
  const typingText = document.getElementById("typingText")
  if (!typingText) return

  const texts = [
    "Full Stack Developer",
    "Node.js Expert",
    "MongoDB Specialist",
    "EJS Template Master",
    "Express.js Developer",
  ]

  let textIndex = 0
  let charIndex = 0
  let isDeleting = false

  function typeText() {
    const currentText = texts[textIndex]

    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1)
      charIndex--
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1)
      charIndex++
    }

    let typeSpeed = isDeleting ? 50 : 100

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length
      typeSpeed = 500
    }

    setTimeout(typeText, typeSpeed)
  }

  typeText()
}

// Contact Form
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm")
  if (!contactForm) return

  contactForm.addEventListener("submit", handleFormSubmit)

  // Form validation
  const inputs = contactForm.querySelectorAll("input, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", validateField)
    input.addEventListener("input", clearFieldError)
  })
}

function handleFormSubmit(e) {
  e.preventDefault()

  const form = e.target
  const formData = new FormData(form)
  const data = Object.fromEntries(formData)

  // Validate form
  if (!validateForm(data)) {
    showNotification("Please fill in all required fields.", "error")
    return
  }

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitBtn.disabled = true


// EmailJS Integration
emailjs.init({
    publicKey: "bdcafL2wuWkhzkLZj" //public key
});
  // Send email using EmailJS
if (emailjs) {
    emailjs
      .send("service_9ssyr9x", "template_se9i3xm", { // service and template key
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
      })
      .then(() => {
        showNotification("Message sent successfully!", "success");
        form.reset();
      })
      .catch(() => {
        showNotification("Failed to send message. Please try again.", "error");
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
} else {
    // Fallback - just show success message
    setTimeout(() => {
      showNotification("Message sent successfully!", "success");
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1000);
}
}

function validateForm(data) {
  return data.name && data.email && data.subject && data.message
}

function validateField(e) {
  const field = e.target
  const value = field.value.trim()

  if (field.hasAttribute("required") && !value) {
    showFieldError(field, "This field is required")
    return false
  }

  if (field.type === "email" && value && !isValidEmail(value)) {
    showFieldError(field, "Please enter a valid email address")
    return false
  }

  clearFieldError(field)
  return true
}

function showFieldError(field, message) {
  clearFieldError(field)

  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.textContent = message
  errorDiv.style.cssText = "color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;"

  field.parentNode.appendChild(errorDiv)
  field.style.borderColor = "#ef4444"
}

function clearFieldError(field) {
  const errorDiv = field.parentNode.querySelector(".field-error")
  if (errorDiv) {
    errorDiv.remove()
  }
  field.style.borderColor = ""
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Notification System
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification")
  if (!notification) return

  const notificationText = notification.querySelector(".notification-text")
  if (notificationText) {
    notificationText.textContent = message
  }

  notification.className = `notification ${type}`
  notification.classList.add("show")

  setTimeout(() => {
    notification.classList.remove("show")
  }, 4000)
}

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Performance optimization
window.addEventListener("scroll", debounce(handleScroll, 10))
