# Your Junk Pro — Website

Static, vanilla HTML/CSS/JS website for **Your Junk Pro** — junk removal, cleanouts,
hauling and light demolition serving Westchase, Tampa, Clearwater and the surrounding
communities across Hillsborough, Pinellas and Pasco counties.

- Phone: 813-731-0155
- Email: bookyourjunkpro@gmail.com

## Structure

```
index.html            Home — hero, difference, services, process, service areas, contact + estimate form
blank/index.html      Privacy Policy
blank-1/index.html    Accessibility Statement
assets/css/styles.css Design system and all page styles
assets/js/main.js     Mobile nav, form submission (fetch + plain-POST fallback), footer year
images/source/        Photography kept from the previous site
favicon.svg           Site icon
robots.txt            Crawler directives
```

No build step and no dependencies — open `index.html` or serve the folder statically
(for example `python3 -m http.server`) and every root-relative link resolves.

## Forms

The estimate form on every page POSTs to the LeadrVision endpoint
`https://vision.leadrai.com/api/forms/768636d1b0d0bae829a0d42a004ba883`.
JavaScript upgrades the submission to `fetch()` with a JSON body and shows an inline
confirmation; with JavaScript disabled the plain HTML POST still works and the visitor
returns to the same page with `?submitted=1`, which also triggers the confirmation.
