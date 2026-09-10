# Godavari Micro — Corporate Website (v3, GM Monogram Theme)

A professional, evergreen corporate website built for **Godavari Micro** — an India-based back-end operations company running the digital, administrative, and customer-support layer behind a live car-rental operation in Los Angeles, USA.

> **Tagline:** *"The Back-End Power Behind the Rental Operation."*  
> **Closing Line:** *"Your Fleet Stays Local. Your Operations Become Global."*

---

## 1. Brand Identity & Logo Files

The visual theme is derived strictly from the official **Godavari Micro 3D GM Monogram** (`godavari-micro-logo-gm-monogram.png`):
- High-resolution master logo: `assets/godavari-micro-logo-gm-monogram.png` (1672 × 941 px)
- Tight-cropped header/footer lockup mark: `assets/logo-mark-tight.png`
- Favicons:
  - `assets/favicon-32x32.png`
  - `assets/favicon-64x64.png`
  - `assets/favicon-192x192.png`
  - `assets/favicon-gm.png`

### 5-Color System (Derived Directly from the Mark)
- **Primary Cobalt / Royal Blue:** `#0B1FA0` (`#000E8C` – `#141FAE`)
- **Deep Navy Shadow Tone:** `#00095C`
- **Bright Highlight Blue:** `#3A5CFF` (Pop accent & underline flourishes)
- **Pure White:** `#FFFFFF`
- **Neutral Light Gray:** `#F1F4F9`
- **Body Text:** `#33374A`

---

## 2. Project File Structure

```
godavari-micro/
├── index.html                  # Semantic, accessible, SEO-optimized single-page architecture
├── robots.txt                  # Search engine crawling rules
├── sitemap.xml                 # XML sitemap with all section anchor priorities
├── README.md                   # Technical setup & operational documentation
├── css/
│   └── styles.css              # Modular CSS3 stylesheet with design tokens, responsive queries
├── js/
│   └── main.js                 # Count-up stats, sticky header, mobile drawer, scroll animations
└── assets/
    ├── godavari-micro-logo-gm-monogram.png  # Master GM Monogram brandmark
    ├── logo-mark-tight.png                 # Cropped logo for lockups
    ├── favicon-gm.png                      # High-res favicon source
    ├── favicon-32x32.png                   # Standard tab icon
    ├── favicon-64x64.png                   # Retina tab icon
    └── favicon-192x192.png                 # Mobile home screen icon
```

---

## 3. How to Run / Preview the Site

The codebase is self-contained modern HTML5 + CSS3 + vanilla JavaScript. There are zero heavy build dependencies or node package installations required to view or deploy.

### Option A: Open directly in any browser
Double click `index.html` or open it with Chrome, Safari, Edge, or Firefox.

### Option B: Run with Python local server
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option C: Run with VS Code / IDE Live Server
Right-click `index.html` and choose **Open with Live Server**.

---

## 4. Production Deployment & Configurations

### 1. Final Domain Setup
- In `index.html`: Update the canonical URL and Open Graph URL tags to your production domain (e.g. `https://godavarimicro.com`).
- In `sitemap.xml` and `robots.txt`: Replace `https://godavarimicro.com` with your production domain.

### 2. Contact Form Backend Integration
In `index.html`, locate the `<form id="consultationForm">` in Section 10:
- **Formspree / Formkeep / Web3Forms:**  
  Set `action="https://formspree.io/f/YOUR_FORM_ID"` and `method="POST"`.
- **Custom Node/PHP/Python Endpoint:**  
  In `js/main.js`, update the `initContactForm()` function to `fetch('/api/contact', { method: 'POST', body: ... })`.

### 3. Client Logo Placeholders
The placeholders for current operating experience (**Priceless Car Rental**, **NextCar**, **AM PM Rent A Car**) are styled in Section 1 and Section 9. When real partner SVG/PNG vector marks are available, simply replace the placeholder `.client-logo-card` markup with `<img>` tags.

---

## 5. Contact & Corporate Coordinates

- **Corporate Office Address:**  
  Sr. no. 16/4/2/1 Majestique Biznow, Office no.602, 603 & 604, Off Nibm Road, Kondhwa (kh), Pune 411048, Maharashtra, India
- **Direct Phone:** `(+91) 9834501195`
- **Email:** `shoaib.s@ampmcarrentals.com`
- **Field Desk Partner:** LAX Airport Corridor, Los Angeles, CA 90045, USA
- **Operational Hours:** 24 Hours / 7 Days / 365 Days Continuous Operations

