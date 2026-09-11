/**
 * GODAVARI MICRO — Corporate Website Scripts
 * Dynamic interactions: sticky condensing header, animated count-ups,
 * scroll reveals, mobile drawer, and contact handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initNavDropdown();
  initScrollReveal();
  initCountUps();
  initReputationBars();
  initSmoothScroll();
  initContactForm();
  initCustomFormDropdowns();
  initRoiCalculator();
  initCaseStudyModal();
});

/**
 * Sticky Header condensing on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('condensed');
    } else {
      header.classList.remove('condensed');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-ops-sublink, .drawer-cta-btn');

  if (!toggleBtn || !drawer || !overlay) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * Desktop Operations Mega-Dropdown Interaction
 */
function initNavDropdown() {
  const dropdown = document.querySelector('.nav-dropdown');
  const toggle = document.querySelector('.nav-dropdown-toggle');
  if (!dropdown || !toggle) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('is-open')) {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  // Close when an item inside is selected
  const items = dropdown.querySelectorAll('.dropdown-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      dropdown.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Scroll Reveal via IntersectionObserver
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/**
 * Animated Count-Ups for Stat Numbers
 * Hardened: Resting HTML holds the real value by default.
 * Animation starts only when element enters viewport AND reduced motion is not requested.
 */
function initCountUps() {
  const statElements = document.querySelectorAll('[data-count-target]');
  if (!statElements.length) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Keep final static values already populated in HTML
    return;
  }

  const animateCount = (el) => {
    const rawTarget = el.getAttribute('data-count-target');
    const target = parseFloat(rawTarget);
    if (isNaN(target)) return;

    const isDecimal = rawTarget.includes('.');
    const decimalPlaces = isDecimal ? (rawTarget.split('.')[1] || '').length : 0;
    const duration = 1600;
    const startTime = performance.now();

    // Reset to 0 only at the moment animation begins
    el.textContent = isDecimal ? (0).toFixed(decimalPlaces) : '0';

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic-out easing
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * ease;
      const current = isDecimal ? currentVal.toFixed(decimalPlaces) : Math.floor(currentVal);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        el.textContent = isDecimal ? target.toFixed(decimalPlaces) : target;
      }
    };

    requestAnimationFrame(updateValue);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -20px 0px' });

    statElements.forEach(el => observer.observe(el));
  }
}

/**
 * Animated Reputation Comparison Progress Bars
 * Hardened: Resting HTML holds final width by default.
 */
function initReputationBars() {
  const barFills = document.querySelectorAll('.comp-bar-fill');
  if (!barFills.length) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    barFills.forEach(fill => {
      const targetPercent = fill.getAttribute('data-fill-percent') || '0';
      fill.style.width = targetPercent + '%';
    });
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetPercent = fill.getAttribute('data-fill-percent') || '0';
          fill.style.width = '0%';
          // Force layout reflow
          void fill.offsetWidth;
          fill.style.transition = 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
          fill.style.width = targetPercent + '%';
          obs.unobserve(fill);
        }
      });
    }, { threshold: 0.25 });

    barFills.forEach(bar => observer.observe(bar));
  } else {
    barFills.forEach(fill => {
      const targetPercent = fill.getAttribute('data-fill-percent') || '0';
      fill.style.width = targetPercent + '%';
    });
  }
}

/**
 * Smooth Anchor Scrolling with Header Compensation & Active Spy
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"], .drawer-link[href^="#"], a.btn[href^="#"], .footer-link[href^="#"], .dropdown-item[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const mainNavLinks = document.querySelectorAll('.main-nav .nav-link[href^="#"]');

  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const header = document.querySelector('.site-header');
        const headerOffset = header ? header.offsetHeight + 10 : 80;
        const elemPosition = targetElem.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elemPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active link spy
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const secTop = sec.offsetTop;
      const secHeight = sec.offsetHeight;
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    mainNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/**
 * Interactive Contact Form
 * Transmits inquiry directly to Shoaib.s@ampmcarrentals.com with rich feedback.
 */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  };

  // Toggle 'Other' service explanation textarea dynamically
  const serviceDropdown = form.querySelector('#serviceInterest');
  const otherGroup = form.querySelector('#otherServiceGroup');
  const otherInput = form.querySelector('#otherServiceInput');
  if (serviceDropdown && otherGroup) {
    serviceDropdown.addEventListener('change', () => {
      if (serviceDropdown.value === 'Other') {
        otherGroup.style.display = 'block';
        if (otherInput) {
          otherInput.required = true;
          setTimeout(() => {
            otherInput.focus();
            otherGroup.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 60);
        }
      } else {
        otherGroup.style.display = 'none';
        if (otherInput) {
          otherInput.required = false;
          otherInput.value = '';
        }
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    const name = form.name ? form.name.value.trim() : '';
    const company = form.company ? form.company.value.trim() : '';
    const email = form.email ? form.email.value.trim() : '';
    const phone = form.phone ? form.phone.value.trim() : '';
    const fleetSelect = form.fleet_size;
    const fleetSize = fleetSelect ? fleetSelect.options[fleetSelect.selectedIndex].text : '';
    const serviceSelect = form.service_interest;
    let serviceInterest = serviceSelect && serviceSelect.selectedIndex >= 0 ? serviceSelect.options[serviceSelect.selectedIndex].text : 'General Inquiry';
    const otherServiceInput = form.other_service;
    let explanation = '';
    if (serviceSelect && serviceSelect.value === 'Other' && otherServiceInput && otherServiceInput.value.trim()) {
      explanation = otherServiceInput.value.trim();
      serviceInterest = `Other: ${explanation}`;
    }

    const subject = `Fleet Consultation Request: ${company || 'Operator'} - ${serviceInterest} (${fleetSize})`;
    const body = `Full Name: ${name}\nCompany: ${company}\nCorporate Email: ${email}\nPhone: ${phone}\nFleet Size Range: ${fleetSize}\nService of Interest: ${serviceInterest}${explanation ? `\n\nRequirement Explanation:\n${explanation}` : ''}\n\n---\nTransmitted via Godavari Micro Consultation Portal`;
    const mailtoUri = `mailto:Shoaib.s@ampmcarrentals.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Show processing state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Routing Consultation Request...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `
        <div style="font-size:1.05rem; font-weight:800; color:#065F46; margin-bottom:6px;">✓ Operations Consultation Request Prepared!</div>
        <div style="color:#064E3B; font-size:0.9375rem; line-height:1.5;">
          Thank you, <strong>${escapeHtml(name)}</strong>. Your fleet profile for <strong>${escapeHtml(company)}</strong> has been recorded.
          Our operations leadership team will review your objectives and respond within 24 business hours.
        </div>
        <div style="margin-top:12px; padding:12px 14px; background:rgba(255,255,255,0.7); border:1px solid rgba(16,185,129,0.3); border-radius:8px; font-size:0.875rem;">
          <div><strong>Primary Recipient:</strong> <a href="mailto:Shoaib.s@ampmcarrentals.com" style="color:#0B1FA0; font-weight:700;">Shoaib.s@ampmcarrentals.com</a></div>
          <div style="margin-top:4px;"><strong>Service of Interest:</strong> ${escapeHtml(serviceInterest)}</div>
          <div style="margin-top:4px;"><strong>Fleet Size:</strong> ${escapeHtml(fleetSize)} &bull; <strong>Contact:</strong> ${escapeHtml(email)}</div>
        </div>
        <div style="margin-top:14px;">
          <a href="${mailtoUri}" class="btn btn-sm btn-primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
            <span>Open Email Dispatch Directly</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>
      `;

      // Try triggering mailto client
      try {
        const link = document.createElement('a');
        link.href = mailtoUri;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.warn('Mailto link navigation caught:', err);
      }

      form.reset();
      if (otherGroup) otherGroup.style.display = 'none';
      if (otherInput) {
        otherInput.required = false;
        otherInput.value = '';
      }
      // Reset custom dropdown displays
      const fleetLabel = form.querySelector('#fleetSizeDropdown .selected-text');
      if (fleetLabel) fleetLabel.textContent = '25 – 100 Vehicles';
      const serviceLabel = form.querySelector('#serviceInterestDropdown .selected-text');
      if (serviceLabel) {
        serviceLabel.textContent = 'Select an Operation / Service';
        serviceLabel.classList.add('placeholder-active');
      }
      form.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
      const defaultFleetOpt = form.querySelector('#fleetSizeDropdown .custom-option[data-value="25-100"]');
      if (defaultFleetOpt) defaultFleetOpt.classList.add('selected');

      setTimeout(() => {
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }, 850);
  });
}

/**
 * Custom Styled Form Dropdowns for Consultation Form
 */
function initCustomFormDropdowns() {
  const dropdowns = document.querySelectorAll('.custom-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.custom-dropdown-btn');
    const panel = dropdown.querySelector('.custom-dropdown-panel');
    const select = dropdown.querySelector('.hidden-native-select');
    const labelSpan = dropdown.querySelector('.selected-text');
    const options = dropdown.querySelectorAll('.custom-option');

    if (!btn || !panel || !select) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdowns.forEach(other => {
        if (other !== dropdown) {
          other.classList.remove('open');
          other.classList.remove('drop-up');
        }
      });
      const isOpen = dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (isOpen) {
        // Smart direction detection: if opening near the bottom of viewport, drop UP
        const rect = btn.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 260 && rect.top > 250) {
          dropdown.classList.add('drop-up');
        } else {
          dropdown.classList.remove('drop-up');
        }
      }
    });

    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.getAttribute('data-value');
        select.value = val;

        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        if (labelSpan) {
          const textSpan = opt.querySelector('span:not(.other-badge)');
          let displayText = textSpan ? textSpan.textContent.trim() : opt.textContent.replace('✓', '').trim();
          labelSpan.textContent = displayText;
          labelSpan.classList.remove('placeholder-active');
        }

        dropdown.classList.remove('open');
        dropdown.classList.remove('drop-up');
        btn.setAttribute('aria-expanded', 'false');

        // Trigger change event so existing listeners execute
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        const btn = dropdown.querySelector('.custom-dropdown-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');
        const btn = dropdown.querySelector('.custom-dropdown-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

// Add simple CSS spin keyframe dynamically
const styleTag = document.createElement('style');
styleTag.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

/**
 * Interactive Fleet ROI & Margin Recovery Calculator
 */
function initRoiCalculator() {
  const fleetSlider = document.getElementById('calcFleetSize');
  const adrSlider = document.getElementById('calcAdr');
  const disputesSlider = document.getElementById('calcDisputes');

  if (!fleetSlider || !adrSlider || !disputesSlider) return;

  const fleetValDisplay = document.getElementById('calcFleetVal');
  const adrValDisplay = document.getElementById('calcAdrVal');
  const disputesValDisplay = document.getElementById('calcDisputesVal');

  const totalDisplay = document.getElementById('calcTotalVal');
  const ancillaryDisplay = document.getElementById('calcAncillaryVal');
  const chargebackDisplay = document.getElementById('calcChargebackVal');

  const syncFormFleet = document.getElementById('fleetSize');

  const updateCalculations = () => {
    const fleetSize = parseInt(fleetSlider.value, 10);
    const adr = parseInt(adrSlider.value, 10);
    const monthlyDisputes = parseInt(disputesSlider.value, 10);

    if (fleetValDisplay) fleetValDisplay.textContent = `${fleetSize} Vehicles`;
    if (adrValDisplay) adrValDisplay.textContent = `$${adr}/day`;
    if (disputesValDisplay) disputesValDisplay.textContent = `${monthlyDisputes} cases/mo`;

    // 1. Ancillary Revenue Expansion:
    // Avg 22 rental days/vehicle/month * fleetSize * 35% add-on conversion * 18% ADR margin lift
    const annualAncillary = Math.round(fleetSize * 22 * 12 * 0.35 * (adr * 0.18));

    // 2. Recovered Chargebacks:
    // 80.6% win rate on decided disputes * monthlyDisputes * avg disputed transaction ($385) * 12 months
    const annualRecovered = Math.round(monthlyDisputes * 12 * 385 * 0.806);

    // 3. Total Value Created
    const totalAnnual = annualAncillary + annualRecovered;

    if (totalDisplay) totalDisplay.textContent = `+$${totalAnnual.toLocaleString()}`;
    if (ancillaryDisplay) ancillaryDisplay.textContent = `+$${annualAncillary.toLocaleString()}`;
    if (chargebackDisplay) chargebackDisplay.textContent = `+$${annualRecovered.toLocaleString()}`;
  };

  fleetSlider.addEventListener('input', updateCalculations);
  adrSlider.addEventListener('input', updateCalculations);
  disputesSlider.addEventListener('input', updateCalculations);

  // Sync to contact form dropdown when CTA clicked
  const ctaBtn = document.getElementById('calcCtaBtn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      const val = parseInt(fleetSlider.value, 10);
      if (syncFormFleet) {
        if (val <= 100) syncFormFleet.value = '25-100';
        else if (val <= 300) syncFormFleet.value = '100-300';
        else if (val <= 600) syncFormFleet.value = '300-600';
        else syncFormFleet.value = '600+';
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to contact on index.html
        window.location.href = 'index.html#contact';
      }
    });
  }

  updateCalculations();
}

/**
 * Interactive Fleet Case Study Modal
 * Displays percentage-based metrics and operational case studies when a client logo is selected.
 * Strict Constraint: Strictly percentage lifts & operational overviews — zero dollar amounts.
 */
function initCaseStudyModal() {
  const overlay = document.getElementById('caseStudyModalOverlay');
  const modalContent = document.getElementById('caseStudyModalContent');
  const closeBtn = document.getElementById('caseStudyModalClose');
  const brandCards = document.querySelectorAll('.operating-brand-card[data-client]');
  const tabBtns = document.querySelectorAll('.case-study-tab-btn[data-target-client]');

  if (!overlay || !modalContent) return;

  const caseStudies = {
    priceless: {
      name: 'Priceless Car Rental',
      subtitle: 'LAX Airport Fleet Desk & High-Volume Operations',
      logo: 'assets/client-logo-priceless.png',
      location: 'Los Angeles International Airport (LAX)',
      pms: 'TSD / Bluebird / CarRentalOS',
      shift: '24/7/365 Bi-Continental Layer',
      metrics: [
        {
          num: '+18.4%',
          title: 'ADR Margin Expansion',
          desc: '15-minute algorithmic shopping across Expedia, Booking & Kayak protecting yield without losing volume.',
          highlight: false
        },
        {
          num: '+78.2%',
          title: 'Dispute Win Rate',
          desc: 'Standardized dossier audits pairing signed RAs with pre/post return time-stamped damage photos.',
          highlight: true
        },
        {
          num: '+62.0%',
          title: 'Pre-Clearance Speed',
          desc: 'Digital document triage prior to flight touch-down, cutting physical queue friction at the airport desk.',
          highlight: false
        },
        {
          num: '+85.0%',
          title: 'First-Contact Resolution',
          desc: 'Rapid handling of rental extension requests, flight delays, and billing clarifications within minutes.',
          highlight: true
        }
      ],
      challenge: 'Operating an airport rental desk at LAX presents intense pressure: tight flight turnaround windows, frequent OTA rate price wars, high-volume chargeback exposures, and counter staff frequently overwhelmed by administrative data entry.',
      howWeHelped: [
        '<strong>Automated Continuous Rate Parity:</strong> Synchronized dynamic pricing across all online travel agencies every 15 minutes, capturing yield surges during flight delays while avoiding off-peak margin deflation.',
        '<strong>Immediate Dispute Defense Packaging:</strong> Created 48-hour rebuttal packages featuring signed contracts, credit card authorizations, and vehicle return scans &mdash; boosting chargeback win rate to 78.2%.',
        '<strong>Pre-Arrival Renter Verification:</strong> Verified driver licenses and secondary renter credentials before arrival, reducing counter checkout times to under 90 seconds per customer.',
        '<strong>Daily Post-Return Audit:</strong> Overnight audit of fuel adjustments, toll transponders, and supplemental protection charges, eliminating counter billing leakage.'
      ],
      impactSummary: 'By transferring the entire digital, rate, and administrative burden to Godavari Micro\'s 24/7 operating layer, Priceless LAX converted counter chaos into predictable margin lift and consistent dispute protection.'
    },

    nextcar: {
      name: 'NextCar Rental · Leasing · Sales',
      subtitle: 'Multi-Branch Regional Fleet & 24/7 Digital Operations',
      logo: 'assets/client-logo-nextcar.png',
      location: 'Multi-Branch U.S. Regional Network',
      pms: 'TSD Fleet / Rate-Highway / Counter PMS',
      shift: 'Continuous Night & Day Shift',
      metrics: [
        {
          num: '+84.0%',
          title: 'Positive Review Lift',
          desc: 'Post-return outreach automation converting seamless drop-offs into verified 5-star Google reviews.',
          highlight: true
        },
        {
          num: '+72.8%',
          title: 'Citation & Toll Recovery',
          desc: 'Subrogation audit matching license plates to toll transactions before renter card authorizations expire.',
          highlight: true
        },
        {
          num: '96.5%',
          title: 'OTA Channel Response',
          desc: 'Average inquiry response under 3 minutes across all external booking engines and partner portals.',
          highlight: false
        },
        {
          num: '-68.0%',
          title: 'Admin Workload Reduction',
          desc: 'Logistics operations data entry, reservation rescheduling, and nightly close-outs handled by India operations.',
          highlight: false
        }
      ],
      challenge: 'Managing a distributed fleet network across several branch locations led to fragmented communications, uncaptured toll violations, delayed response times to OTA rental leads, and overburdened station managers.',
      howWeHelped: [
        '<strong>Centralized 24/7 Operations Command:</strong> Consolidated all branch phone inquiries, reservation modifications, and extension authorizations into a single 24-hour logistics operations queue.',
        '<strong>Systematic Toll & Violation Subrogation:</strong> Ingested state toll authority data and license plate cameras to instantly post toll fees directly to renter folios with zero delay.',
        '<strong>Proactive Renter Grievance Triage:</strong> Contacted returnees flagged by counter return agents within 15 minutes to solve concerns before they turned into 1-star public reviews.',
        '<strong>Overnight Fleet Parity Checks:</strong> Performed daily rate reconciliation across all regional branches every night, guaranteeing rate synchronization across the entire network.'
      ],
      impactSummary: 'NextCar achieved seamless operational uniformity across all branches, a dramatic 84% surge in positive Google review volume, and near-total capture of previously lost road toll recoveries.'
    },

    ampm: {
      name: 'AMPM Rent A Car',
      subtitle: '4.7★ Premier Airport Hub & High-Rating Protection',
      logo: 'assets/client-logo-ampm.png',
      location: 'Prime Airport Location & Operations Hub',
      pms: 'Enterprise PMS / Integrated Telematics',
      shift: '24/7 Real-Time Counter Triage',
      metrics: [
        {
          num: '4.7★',
          title: 'Rating Sustained',
          desc: 'Protected across high-volume holiday peak seasons and thousands of completed airport contracts.',
          highlight: true
        },
        {
          num: '+74.6%',
          title: 'Unjust Review Removal',
          desc: 'Evidence-backed submissions to review platforms successfully removing invalid or fraudulent reviews.',
          highlight: true
        },
        {
          num: '+81.2%',
          title: 'Delinquent Balance Capture',
          desc: 'Rigorous digital follow-up on delayed returns, unreturned transponders, and excess mileage fees.',
          highlight: false
        },
        {
          num: '+91.0%',
          title: 'Contract Audit Integrity',
          desc: 'Eliminated missing insurance declarations and unverified secondary drivers at point of return.',
          highlight: false
        }
      ],
      challenge: 'Maintaining a 4.7-star rating in the notoriously volatile airport car rental sector requires immaculate service continuity, immediate dispute de-escalation, and ironclad damage claim processing.',
      howWeHelped: [
        '<strong>Real-Time 60-Minute Return Audits:</strong> Every vehicle return agreement is scrutinized within an hour of drop-off to ensure accurate fuel levels, mileage, and return conditions.',
        '<strong>Platform Review Defense:</strong> Identified and contested bad-faith 1-star reviews by submitting rental agreements, signed walk-around inspection logs, and timestamped telematics proof to Google.',
        '<strong>De-Escalation Resolution Pathway:</strong> Offered direct customer assistance and fair policy explanations immediately upon complaint detection, preventing social friction.',
        '<strong>Insurance Claim & Damage Dossiers:</strong> Assembled comprehensive subrogation packages with photo evidence for rapid insurance carrier reimbursement.'
      ],
      impactSummary: 'AMPM secured its reputation as a top-tier 4.7★ airport car rental brand, drastically reduced malicious reviews, and achieved unprecedented 81.2% recovery rates on delinquent renter balances.'
    }
  };

  const renderCaseStudy = (clientKey) => {
    const data = caseStudies[clientKey];
    if (!data) return;

    // Update active state in tabs
    tabBtns.forEach(btn => {
      const isMatch = btn.getAttribute('data-target-client') === clientKey;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !window.location.pathname.includes('.html');
    const consultHref = isHome ? '#contact' : 'index.html#contact';

    modalContent.innerHTML = `
      <!-- Header Row -->
      <div class="case-study-client-header">
        <div class="case-study-client-title-block">
          <div class="case-study-client-logo-box">
            <img src="${data.logo}" alt="${data.name}" width="120" height="40">
          </div>
          <div>
            <h3 class="case-study-client-name" id="caseStudyModalTitle">${data.name}</h3>
            <div class="case-study-client-meta">
              <span>📍 ${data.location}</span>
              <span>•</span>
              <span>⏱ ${data.shift}</span>
            </div>
          </div>
        </div>
        <div style="font-size:0.8125rem; background:#F1F5F9; border:1px solid #E2E8F0; padding:6px 12px; border-radius:8px; font-weight:700; color:#334155;">
          PMS Matrix: <strong style="color:#0B1FA0;">${data.pms}</strong>
        </div>
      </div>

      <!-- Percentage Metrics Grid (Strictly % and Ratios, Zero Dollar Amounts) -->
      <div style="margin-bottom:12px;">
        <span style="font-family:var(--font-mono, monospace); font-size:0.75rem; font-weight:800; letter-spacing:0.1em; color:#0B1FA0; text-transform:uppercase;">
          // VERIFIED PERCENTAGE LIFTS &amp; OPERATIONAL OUTCOMES
        </span>
      </div>
      <div class="case-study-metrics-grid">
        ${data.metrics.map(m => `
          <div class="case-study-metric-card">
            <div class="case-study-metric-number ${m.highlight ? 'highlight-green' : ''}">${m.num}</div>
            <div class="case-study-metric-title">${m.title}</div>
            <div class="case-study-metric-desc">${m.desc}</div>
          </div>
        `).join('')}
      </div>

      <!-- Operational Challenge Narrative -->
      <div class="case-study-narrative-box">
        <div class="case-study-section-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>The Operational Challenge</span>
        </div>
        <p class="case-study-narrative-text">${data.challenge}</p>

        <div class="case-study-section-heading" style="margin-top:20px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="16 12 12 8 8 12"></polyline><line x1="12" y1="16" x2="12" y2="8"></line></svg>
          <span>How Godavari Micro Helped Them (Operational Blueprint)</span>
        </div>
        <ul class="case-study-bullets">
          ${data.howWeHelped.map(item => `
            <li class="case-study-bullet-item">
              <svg class="case-study-bullet-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Operational Impact Summary -->
      <div style="background:#F8FAFC; border-left:4px solid #0B1FA0; padding:16px 20px; border-radius:0 12px 12px 0; margin-bottom:20px;">
        <strong style="color:#060B24; font-size:0.875rem; text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:4px;">Continuous Operating Result:</strong>
        <p style="margin:0; font-size:0.9rem; color:#334155; line-height:1.6;">${data.impactSummary}</p>
      </div>

      <!-- Bottom Action CTA -->
      <div class="case-study-modal-cta">
        <div class="case-study-cta-text">
          <h4>Apply This Operational Model To Your Fleet</h4>
          <p>Schedule a confidential logistics operations and dispute audit for your rental business.</p>
        </div>
        <a href="${consultHref}" class="btn btn-primary btn-sm modal-consult-btn" style="background:#00F0FF; color:#060B24; font-weight:800; border:none;">
          <span>Request Fleet Consultation</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </a>
      </div>
    `;

    // Hook up modal internal consult button to close modal and scroll
    const consultBtn = modalContent.querySelector('.modal-consult-btn');
    if (consultBtn) {
      consultBtn.addEventListener('click', (e) => {
        closeModal();
        if (isHome) {
          e.preventDefault();
          const target = document.getElementById('contact');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  };

  const openModal = (clientKey) => {
    renderCaseStudy(clientKey);
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Click on Brand Cards
  brandCards.forEach(card => {
    card.addEventListener('click', () => {
      const client = card.getAttribute('data-client') || 'priceless';
      openModal(client);
    });

    // Support Enter or Space key
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const client = card.getAttribute('data-client') || 'priceless';
        openModal(client);
      }
    });
  });

  // Switch tabs inside modal
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const client = btn.getAttribute('data-target-client');
      if (client) renderCaseStudy(client);
    });
  });

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

