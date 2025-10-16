import './styles/theme.css';
import './styles/layout.css';
import './styles/responsive.css';
import { initParallax, initScrollAnimations } from './parallax';
import { submitToGoogleSheets, isValidEmail } from './sheets';

/**
 * Main application entry point
 */

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🐾 PetWell Landing Page Initialized');

  // Initialize parallax effects
  initParallax();
  initScrollAnimations();

  // Setup form handling
  setupEmailForm();

  // Setup CTA buttons
  setupCTAButtons();
});

/**
 * Setup email form submission
 */
function setupEmailForm() {
  const form = document.getElementById('email-form') as HTMLFormElement;
  const statusEl = document.getElementById('form-status') as HTMLParagraphElement;

  if (!form || !statusEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      petName: formData.get('petName') as string,
      note: formData.get('note') as string,
    };

    // Validate
    if (!data.name || !data.email) {
      showStatus('Please fill in all required fields', 'error');
      return;
    }

    if (!isValidEmail(data.email)) {
      showStatus('Please enter a valid email address', 'error');
      return;
    }

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Submit to Google Sheets
    const result = await submitToGoogleSheets(data);

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText || 'Join the Waitlist';

    // Show result
    if (result.success) {
      showStatus(result.message, 'success');
      form.reset();
    } else {
      showStatus(result.message, 'error');
    }
  });

  function showStatus(message: string, type: 'success' | 'error') {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;
    statusEl.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 5000);
  }
}

/**
 * Setup CTA buttons to scroll to signup
 */
function setupCTAButtons() {
  const ctaButtons = document.querySelectorAll('[data-action="open-signup"]');

  ctaButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const signupSection = document.getElementById('signup');
      if (signupSection) {
        signupSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Add smooth scroll behavior for all anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href') || '');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
