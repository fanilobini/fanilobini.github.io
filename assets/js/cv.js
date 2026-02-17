(function () {
  const nameEl = document.getElementById("cvName");
  const titleEl = document.getElementById("cvTitle");
  const contactEl = document.getElementById("cvContact");
  const profileEl = document.getElementById("cvProfile");
  const experienceEl = document.getElementById("cvExperience");
  const educationEl = document.getElementById("cvEducation");
  const skillsEl = document.getElementById("cvSkills");
  const toolsEl = document.getElementById("cvTools");
  const languagesEl = document.getElementById("cvLanguages");

  function appendEmphasis(container, text) {
    const parts = text.split("*");
    parts.forEach((part, index) => {
      if (!part) return;
      if (index % 2 === 1) {
        const strong = document.createElement("strong");
        strong.textContent = part;
        container.appendChild(strong);
      } else {
        container.appendChild(document.createTextNode(part));
      }
    });
  }

  function renderText(container, text) {
    if (!container || !text) return;
    container.innerHTML = "";
    
    const paragraphs = text.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
    const frag = document.createDocumentFragment();

    if (paragraphs.length === 0 && text.trim()) {
      const p = document.createElement("p");
      appendEmphasis(p, text.trim());
      frag.appendChild(p);
    } else {
      for (const block of paragraphs) {
        const p = document.createElement("p");
        const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        lines.forEach((line, index) => {
          if (index > 0) p.appendChild(document.createElement("br"));
          appendEmphasis(p, line);
        });
        frag.appendChild(p);
      }
    }

    container.appendChild(frag);
  }

  function renderExperienceOrEducation(container, text) {
    if (!container || !text) return;
    container.innerHTML = "";
    
    const blocks = text.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
    const frag = document.createDocumentFragment();

    blocks.forEach((block) => {
      const div = document.createElement("div");
      div.className = "cv__entry";
      
      const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      
      lines.forEach((line, index) => {
        if (index === 0) {
          // First line is the title/header
          const header = document.createElement("div");
          header.className = "cv__entry-header";
          appendEmphasis(header, line);
          div.appendChild(header);
        } else {
          // Other lines are description
          const desc = document.createElement("div");
          desc.className = "cv__entry-desc";
          appendEmphasis(desc, line);
          div.appendChild(desc);
        }
      });
      
      frag.appendChild(div);
    });

    container.appendChild(frag);
  }

  function renderSkillsOrTools(container, text) {
    if (!container || !text) return;
    container.innerHTML = "";
    
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const frag = document.createDocumentFragment();

    lines.forEach((line) => {
      const div = document.createElement("div");
      div.className = "cv__skill-line";
      
      // Split by pipe for inline items, but preserve formatting
      if (line.includes("|")) {
        const items = line.split("|").map((item) => item.trim()).filter(Boolean);
        items.forEach((item, index) => {
          if (index > 0) {
            const sep = document.createElement("span");
            sep.className = "cv__skill-sep";
            sep.textContent = " • ";
            div.appendChild(sep);
          }
          const span = document.createElement("span");
          span.className = "cv__skill-item";
          appendEmphasis(span, item);
          div.appendChild(span);
        });
      } else {
        appendEmphasis(div, line);
      }
      
      frag.appendChild(div);
    });

    container.appendChild(frag);
  }

  function renderContact(email, phone, location) {
    if (!contactEl) return;
    contactEl.innerHTML = "";
    const frag = document.createDocumentFragment();

    if (email) {
      const a = document.createElement("a");
      a.href = `mailto:${email}`;
      a.className = "cv__contact-item";
      a.textContent = email;
      frag.appendChild(a);
    }

    if (phone) {
      const span = document.createElement("span");
      span.className = "cv__contact-item";
      span.textContent = phone;
      frag.appendChild(span);
    }

    if (location) {
      const span = document.createElement("span");
      span.className = "cv__contact-item";
      span.textContent = location;
      frag.appendChild(span);
    }

    contactEl.appendChild(frag);
  }

  async function loadCVData() {
    try {
      const response = await fetch("../cv_data/info.txt?ts=" + Date.now());
      if (!response.ok) throw new Error("Failed to load CV data");
      
      const text = await response.text();
      const data = parseInfoTxt(text);
      renderCV(data);
    } catch (err) {
      console.error("Error loading CV data:", err);
    }
  }

  function parseInfoTxt(text) {
    const lines = text.split(/\r?\n/);
    const sections = {};
    let currentKey = null;
    const sectionRegex = /^=([a-zA-Z0-9_\-]+)=$/;

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      if (trimmed === "==") {
        currentKey = null;
        return;
      }

      const match = trimmed.match(sectionRegex);
      if (match) {
        currentKey = match[1];
        sections[currentKey] = [];
        return;
      }

      if (currentKey) {
        sections[currentKey].push(line);
      }
    });

    // Join lines for each section
    Object.keys(sections).forEach((key) => {
      sections[key] = sections[key].join("\n").trim();
    });

    return sections;
  }

  function renderCV(data) {
    if (nameEl && data.name) {
      nameEl.textContent = data.name;
    }

    if (titleEl && data.title) {
      titleEl.textContent = data.title;
    }

    renderContact(data.contact_email, data.contact_phone, data.contact_location);
    renderText(profileEl, data.profile);
    renderExperienceOrEducation(experienceEl, data.experience);
    renderExperienceOrEducation(educationEl, data.education);
    renderSkillsOrTools(skillsEl, data.skills);
    renderSkillsOrTools(toolsEl, data.tools);
    renderText(languagesEl, data.languages);
  }

  // Load CV data on page load
  loadCVData();
})();

// Download CV PDF
function downloadCV() {
  const pdfUrl = "./FaniloBINI_CV_26.pdf";
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = "FaniloBINI_CV_26.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
