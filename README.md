# Insight BI Studio Website

This is a premium Power BI portfolio and consulting website powered by data from [data/company.json](/C:/Users/reddy/Edu/Desktop/Codex/data/company.json).

## Files

- [index.html](/C:/Users/reddy/Edu/Desktop/Codex/index.html) contains the site structure.
- [styles.css](/C:/Users/reddy/Edu/Desktop/Codex/styles.css) contains the premium light/dark theme and responsive styling.
- [app.js](/C:/Users/reddy/Edu/Desktop/Codex/app.js) loads the JSON data and powers filtering, the theme toggle, the modal, and the form behavior.
- [data/company.json](/C:/Users/reddy/Edu/Desktop/Codex/data/company.json) stores the editable branding, services, projects, experience, and contact content.
- [serve.ps1](/C:/Users/reddy/Edu/Desktop/Codex/serve.ps1) starts a simple local server so the browser can load the JSON file correctly.
- [start-site.cmd](/C:/Users/reddy/Edu/Desktop/Codex/start-site.cmd) starts the local server and opens the site in your browser with one double-click.

## Run locally

Fastest option on Windows:

```bat
start-site.cmd
```

Or use PowerShell from this folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open `http://localhost:8080`.

Opening `index.html` directly with `file://` will not load the JSON data in most browsers. Use the local server instead.

## Update content

Edit the values in [data/company.json](/C:/Users/reddy/Edu/Desktop/Codex/data/company.json). The page reads the company name, hero copy, services, projects, experience, skills, process, footer, and contact details directly from that file.

## Contact form delivery

The contact form is configured to send submissions to `jithendrareddypunuru@gmail.com` through FormSubmit using the `submitUrl` in [data/company.json](/C:/Users/reddy/Edu/Desktop/Codex/data/company.json).

Successful submissions redirect to [thanks.html](/C:/Users/reddy/Edu/Desktop/Codex/thanks.html) so visitors stay inside the branded site experience.

On the first live submission, FormSubmit may send a one-time activation email to confirm the destination inbox before normal delivery starts.
