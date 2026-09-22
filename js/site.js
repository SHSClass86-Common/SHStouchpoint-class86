/* Shared behavior for the Class of '86 static site. */
(function () {
  var GATE_KEY = "smithville86_gate";
  var BOOT_KEY = "smithville86_seen_boot";
  var NAME_KEY = "smithville86_myname";
  var cfg = window.SHS86 || {};

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function mailto(subject, body) {
    var email = (cfg.contactEmail || "").trim();
    if (!email) return "";
    var url = "mailto:" + encodeURIComponent(email);
    var parts = [];
    if (subject) parts.push("subject=" + encodeURIComponent(subject));
    if (body) parts.push("body=" + encodeURIComponent(body));
    if (parts.length) url += "?" + parts.join("&");
    return url;
  }

  var writeState = { subject: "", formUrl: "" };

  function ensureWriteModal() {
    if (qs("#write-modal")) return;
    var wrap = document.createElement("div");
    wrap.id = "write-modal";
    wrap.className = "write-modal";
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="write-dialog" role="dialog" aria-modal="true" aria-labelledby="write-title">' +
        '<button type="button" class="write-close" aria-label="Close">&times;</button>' +
        '<h2 id="write-title">Write the committee</h2>' +
        '<p class="write-lead" id="write-lead"></p>' +
        '<label class="write-label" for="write-name">Your name</label>' +
        '<input id="write-name" type="text" autocomplete="name" placeholder="First and last name">' +
        '<label class="write-label" for="write-body">Message</label>' +
        '<textarea id="write-body" rows="7"></textarea>' +
        '<div class="write-actions">' +
          '<button type="button" class="btn btn-forge" id="write-send">Open in Email</button>' +
          '<button type="button" class="btn btn-outline-darkforge" id="write-copy">Copy message</button>' +
        "</div>" +
        '<p id="write-status" class="write-status" role="status"></p>' +
      "</div>";
    document.body.appendChild(wrap);

    function close() {
      wrap.hidden = true;
      document.body.classList.remove("modal-open");
    }
    qs(".write-close", wrap).addEventListener("click", close);
    wrap.addEventListener("click", function (e) { if (e.target === wrap) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !wrap.hidden) close();
    });

    qs("#write-send").addEventListener("click", function () {
      var name = (qs("#write-name").value || "").trim();
      var body = (qs("#write-body").value || "").trim();
      if (name) {
        try { localStorage.setItem(NAME_KEY, name); } catch (err) {}
      }
      var composed = (name ? "From: " + name + "\n\n" : "") + body;
      var mail = mailto(writeState.subject, composed);
      if (mail) {
        window.location.href = mail;
        qs("#write-status").textContent = "Your email app should open. If it does not, use Copy message and send it yourself.";
      } else {
        qs("#write-status").textContent = "No committee email is on the site yet. Use Copy message, then send it to a classmate on the committee.";
      }
    });

    qs("#write-copy").addEventListener("click", function () {
      var name = (qs("#write-name").value || "").trim();
      var body = (qs("#write-body").value || "").trim();
      if (name) {
        try { localStorage.setItem(NAME_KEY, name); } catch (err) {}
      }
      var composed = (writeState.subject ? writeState.subject + "\n\n" : "") +
        (name ? "From: " + name + "\n\n" : "") + body;
      var status = qs("#write-status");
      if (!composed.trim()) {
        status.textContent = "Write a note first, then copy it.";
        qs("#write-body").focus();
        return;
      }
      function ok() { status.textContent = "Copied. Paste it into an email or Facebook message to the committee."; }
      function fallback() {
        var temp = document.createElement("textarea");
        temp.value = composed;
        temp.setAttribute("readonly", "");
        temp.style.cssText = "position:fixed;left:-9999px;top:0;";
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        var worked = false;
        try { worked = document.execCommand("copy"); } catch (err) {}
        document.body.removeChild(temp);
        if (worked) { ok(); return; }
        var ta = qs("#write-body");
        ta.value = composed;
        ta.focus();
        ta.select();
        status.textContent = "Copy didn't work automatically. The message is selected — press Ctrl+C (or Cmd+C on a Mac), then paste it into an email.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
        navigator.clipboard.writeText(composed).then(ok).catch(fallback);
      } else {
        fallback();
      }
    });
  }

  function openWriteIn(opts) {
    opts = opts || {};
    var form = (opts.formUrl || "").trim();
    if (form) {
      window.open(form, "_blank", "noopener");
      return;
    }
    ensureWriteModal();
    writeState.subject = opts.subject || "Class of '86";
    writeState.formUrl = "";
    qs("#write-title").textContent = opts.title || "Write the committee";
    qs("#write-lead").textContent = opts.lead ||
      ((cfg.contactEmail || "").trim()
        ? "This opens an email to the committee. Add your note and send."
        : "The committee email is not on the site yet. Write your note, copy it, and send it to a classmate on the committee.");
    var saved = "";
    try { saved = localStorage.getItem(NAME_KEY) || ""; } catch (err) {}
    qs("#write-name").value = saved;
    qs("#write-body").value = opts.body || "";
    qs("#write-status").textContent = "";
    var send = qs("#write-send");
    send.textContent = (cfg.contactEmail || "").trim() ? "Open in Email" : "No email on file — copy instead";
    send.disabled = !(cfg.contactEmail || "").trim();
    qs("#write-modal").hidden = false;
    document.body.classList.remove("modal-open");
    (saved ? qs("#write-body") : qs("#write-name")).focus();
  }

  window.SHS86_LIB = {
    isUnlocked: function () {
      try { return localStorage.getItem(GATE_KEY) === "unlocked"; }
      catch (e) { return false; }
    },
    unlock: function () {
      try { localStorage.setItem(GATE_KEY, "unlocked"); } catch (e) {}
    },
    lock: function () {
      try { localStorage.removeItem(GATE_KEY); } catch (e) {}
    },
    passcodeOk: function (val) {
      var real = String(cfg.passcode || "").trim().toUpperCase();
      return real && String(val || "").trim().toUpperCase() === real;
    },
    openWriteIn: openWriteIn,
    mailto: mailto
  };

  var ACTION_COPY = {
    "claim-profile": {
      title: "Update my classmate page",
      subject: "Class of '86 — update my classmate page",
      lead: "A short life update is enough. The committee will add it to your roster page so everyone can see it.",
      body: "Hi — this is [YOUR NAME]. I'd like to update my classmate page.\n\nWhere I live now:\nWhat I've been up to:\nFamily:\n"
    },
    mixtape: {
      title: "Add a song to the mixtape",
      subject: "Class of '86 mixtape pick",
      lead: "One song that belongs on the Class of '86 tape.",
      body: "Song title:\nArtist:\nWhy it belongs on the tape:\n"
    },
    memorial: {
      title: "Add a name to the memorial",
      subject: "Class of '86 — memorial addition",
      lead: "A name and approximate dates are enough to start.",
      body: "Name:\nYears (if known):\nA few words, if you'd like:\n"
    },
    photos: {
      title: "Send a photo",
      subject: "Class of '86 photo",
      lead: "Describe the photo. Attach it in the email if your email app opens, or send it after you copy this note.",
      body: "I'm sending a photo from:\n(Year / reunion / school days)\nWho's in it, if you know:\n"
    },
    rsvp: {
      title: "Tell the committee you'll come",
      subject: "Class of '86 RSVP",
      lead: "When a date is set, this is how we know who's coming. Until then it is a show of interest.",
      body: "Name:\nI'll be there / maybe / can't make it:\nGuests:\n"
    }
  };

  function wireAction(el, key) {
    if (!el) return;
    var copy = ACTION_COPY[key] || ACTION_COPY["claim-profile"];
    var form = cfg.forms && cfg.forms[
      key === "claim-profile" ? "claimProfile" :
      key === "mixtape" ? "mixtape" :
      key === "memorial" ? "memorial" :
      key === "photos" ? "photos" :
      key === "rsvp" ? "rsvp" : ""
    ];
    form = (form || "").trim();
    el.hidden = false;
    el.removeAttribute("aria-disabled");
    el.classList.remove("disabled");
    if (form) {
      el.setAttribute("href", form);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      return;
    }
    el.setAttribute("href", "#");
    el.removeAttribute("target");
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openWriteIn({
        title: copy.title,
        subject: copy.subject,
        lead: copy.lead,
        body: copy.body,
        formUrl: ""
      });
    });
  }

  function applyConfig() {
    var siteUrl = (cfg.siteUrl || "").replace(/\/$/, "");
    if (siteUrl) {
      qsa('meta[property="og:image"], meta[name="twitter:image"]').forEach(function (m) {
        m.setAttribute("content", siteUrl + "/assets/meta/og-image.png");
      });
      qsa('meta[property="og:url"]').forEach(function (m) {
        var page = location.pathname.split("/").pop() || "index.html";
        m.setAttribute("content", siteUrl + "/" + page);
      });
    }

    qsa("[data-contact-email]").forEach(function (el) {
      var email = (cfg.contactEmail || "").trim();
      if (!email) { el.hidden = true; return; }
      el.hidden = false;
      if (el.tagName === "A") {
        el.setAttribute("href", mailto(el.getAttribute("data-mail-subject") || "Class of '86", el.getAttribute("data-mail-body") || ""));
        if (!el.textContent.trim() || el.getAttribute("data-fill-email") === "true") {
          el.textContent = email;
        }
      }
    });

    qsa("[data-facebook]").forEach(function (el) {
      var url = (cfg.facebookUrl || "").trim();
      if (!url) { el.hidden = true; return; }
      el.hidden = false;
      if (el.tagName === "A") el.setAttribute("href", url);
    });

    qsa("[data-needs-contact]").forEach(function (el) {
      el.hidden = !(cfg.contactEmail || "").trim() && !(cfg.facebookUrl || "").trim();
    });
    qsa("[data-missing-contact]").forEach(function (el) {
      el.hidden = !!(cfg.contactEmail || "").trim() || !!(cfg.facebookUrl || "").trim();
    });

    ["claim-profile", "mixtape", "memorial", "photos", "rsvp"].forEach(function (key) {
      qsa("[data-action='" + key + "']").forEach(function (el) { wireAction(el, key); });
    });

    var g = cfg.nextGathering || {};
    qsa("[data-gathering='title']").forEach(function (el) { if (g.title) el.textContent = g.title; });
    qsa("[data-gathering='date']").forEach(function (el) { if (g.date) el.textContent = g.date; });
    qsa("[data-gathering='venue']").forEach(function (el) { if (g.venue) el.textContent = g.venue; });
    qsa("[data-gathering='blurb']").forEach(function (el) { if (g.blurb) el.textContent = g.blurb; });

    var sp = (cfg.spotifyPlaylistId || "").trim();
    var wrap = qs("#spotify-embed");
    var note = qs("#spotify-placeholder-note");
    if (wrap) {
      if (sp && sp !== "YOUR_PLAYLIST_ID") {
        wrap.innerHTML = '<iframe src="https://open.spotify.com/embed/playlist/' +
          encodeURIComponent(sp) +
          '" style="border-radius:12px;width:100%;height:352px;border:0;" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Class of \'86 mixtape on Spotify"></iframe>';
        if (note) note.hidden = true;
      } else if (note) {
        note.hidden = false;
      }
    }
  }

  function wireGateway() {
    var input = qs("#gateway-passcode");
    var btn = qs("#gateway-submit");
    var msg = qs("#gateway-msg");
    if (!btn) return;

    function goHub() { window.location.href = "members-hub.html"; }

    function fail(text) {
      if (!msg) return;
      msg.textContent = text;
      msg.classList.add("is-error");
      if (input) {
        input.setAttribute("aria-invalid", "true");
        input.classList.remove("shake");
        void input.offsetWidth;
        input.classList.add("shake");
        input.focus();
        input.select();
      }
    }

    function tryUnlock() {
      if (window.SHS86_LIB.isUnlocked()) { goHub(); return; }
      var val = input ? input.value : "";
      if (!String(val).trim()) {
        fail("Type the classmate passcode first.");
        return;
      }
      if (window.SHS86_LIB.passcodeOk(val)) {
        if (msg) { msg.textContent = ""; msg.classList.remove("is-error"); }
        if (input) input.removeAttribute("aria-invalid");
        window.SHS86_LIB.unlock();
        goHub();
      } else {
        fail("That's not it. Try again, or ask a classmate from the 40th for the passcode.");
      }
    }

    if (window.SHS86_LIB.isUnlocked()) {
      btn.textContent = "Enter the Members Hub";
      if (input) input.style.display = "none";
      var already = qs("#gateway-already");
      if (already) already.hidden = false;
    }

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      tryUnlock();
    });
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); tryUnlock(); }
      });
    }

    qsa("[data-needs-gate]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (window.SHS86_LIB.isUnlocked()) return;
        e.preventDefault();
        var gate = qs("#gateway");
        if (gate) gate.scrollIntoView({ behavior: "smooth" });
        fail("Unlock the gateway first — type the classmate passcode in the box above.");
        if (input) input.focus();
      });
    });
  }

  function wireGatePage() {
    var gated = qs("#gated-content");
    var locked = qs("#locked-notice");
    if (!gated || !locked) return;
    var ok = window.SHS86_LIB.isUnlocked();
    gated.style.display = ok ? "block" : "none";
    locked.style.display = ok ? "none" : "block";
    if (ok) return;

    if (!qs("#page-passcode", locked)) {
      var form = document.createElement("div");
      form.className = "page-unlock";
      form.innerHTML =
        '<label class="visually-hidden" for="page-passcode">Classmate passcode</label>' +
        '<input type="password" id="page-passcode" placeholder="Classmate passcode" autocomplete="off" aria-describedby="page-unlock-msg">' +
        '<button type="button" class="btn btn-forge" id="page-unlock">Unlock</button>' +
        '<p id="page-unlock-msg" class="gate-note" role="status" aria-live="polite"></p>';
      var homeBtn = qs("a.btn", locked);
      if (homeBtn && homeBtn.parentNode) {
        homeBtn.parentNode.insertBefore(form, homeBtn);
        homeBtn.textContent = "Or go to the home page";
      } else {
        locked.appendChild(form);
      }
    }

    function pageFail(text) {
      var m = qs("#page-unlock-msg");
      if (m) {
        m.textContent = text;
        m.classList.add("is-error");
      }
      var inp = qs("#page-passcode");
      if (inp) {
        inp.setAttribute("aria-invalid", "true");
        inp.classList.remove("shake");
        void inp.offsetWidth;
        inp.classList.add("shake");
        inp.focus();
        inp.select();
      }
    }
    function pageTry() {
      var inp = qs("#page-passcode");
      var val = inp ? inp.value : "";
      if (!String(val).trim()) { pageFail("Type the classmate passcode first."); return; }
      if (window.SHS86_LIB.passcodeOk(val)) {
        window.SHS86_LIB.unlock();
        window.location.reload();
      } else {
        pageFail("That's not it. Try again, or ask a classmate from the 40th for the passcode.");
      }
    }
    var uBtn = qs("#page-unlock");
    var uInp = qs("#page-passcode");
    if (uBtn && !uBtn.getAttribute("data-wired")) {
      uBtn.setAttribute("data-wired", "1");
      uBtn.addEventListener("click", pageTry);
      if (uInp) {
        uInp.addEventListener("keydown", function (e) {
          if (e.key === "Enter") { e.preventDefault(); pageTry(); }
        });
      }
    }
  }

  function wireBoot() {
    var boot = qs("#boot-screen");
    if (!boot) return;
    var linesEl = qs("#boot-lines");
    var enterRow = qs("#boot-enter-row");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var skipParam = new URLSearchParams(window.location.search).get("entered") === "1";
    var seen = false;
    try { seen = localStorage.getItem(BOOT_KEY) === "1"; } catch (e) {}

    var lines = [
      "SMITHVILLE DIGITAL TOUCHPOINT BBS v1.86",
      "COPYRIGHT (C) SMITHVILLE SMITHIES CLASS OF '86",
      "",
      "INITIALIZING MODEM.......... OK",
      "DIALING SMITHVILLE, OHIO....",
      "CARRIER DETECTED............ 2400 BAUD",
      "LOADING MEMBER ROSTER....... OK",
      "LOADING REUNION ARCHIVE..... OK",
      "",
      "40 YEARS SINCE THE CLASS OF '86.",
      "THE FORGE REMEMBERS.",
      "WELCOME BACK, SMITHIE."
    ];

    function dismiss() {
      boot.classList.add("hidden");
      try { localStorage.setItem(BOOT_KEY, "1"); } catch (e) {}
      setTimeout(function () { boot.style.display = "none"; }, 650);
    }

    if (skipParam || seen) {
      boot.style.display = "none";
      return;
    }

    if (reduceMotion) {
      if (linesEl) linesEl.textContent = lines.join("\n") + "\n";
      if (enterRow) enterRow.classList.add("show");
    } else if (linesEl) {
      var i = 0;
      function typeLine() {
        if (i >= lines.length) {
          if (enterRow) enterRow.classList.add("show");
          return;
        }
        linesEl.textContent += lines[i] + "\n";
        i += 1;
        setTimeout(typeLine, 200);
      }
      typeLine();
    }

    var enterBtn = qs("#boot-enter-btn");
    var skip = qs("#skip-intro");
    if (enterBtn) enterBtn.addEventListener("click", dismiss);
    if (skip) skip.addEventListener("click", dismiss);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && boot.style.display !== "none" && !boot.classList.contains("hidden")) {
        e.preventDefault();
        dismiss();
      }
    });
  }

  function wireLockToggle() {
    qsa("[data-lock-site]").forEach(function (el) {
      el.setAttribute("href", "index.html#gateway");
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var sure = window.confirm("Lock the members area on this computer or phone?\n\nYou'll need the classmate passcode to get back in.");
        if (!sure) return;
        window.SHS86_LIB.lock();
        window.location.href = "index.html#gateway";
      });
      el.hidden = !window.SHS86_LIB.isUnlocked();
    });
  }

  function wireLightbox() {
    var links = qsa(".photo-grid a, .gallery-hero a");
    if (!links.length) return;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous photo">&#8249;</button>' +
      '<img alt="">' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next photo">&#8250;</button>' +
      '<div class="lightbox-caption"></div>';
    document.body.appendChild(box);
    var img = qs("img", box);
    var cap = qs(".lightbox-caption", box);
    var index = 0;

    function show(i) {
      index = (i + links.length) % links.length;
      var a = links[index];
      img.src = a.getAttribute("href");
      img.alt = (qs("img", a) && qs("img", a).alt) || "Reunion photo";
      cap.textContent = (index + 1) + " of " + links.length;
      box.classList.add("open");
      qs(".lightbox-close", box).focus();
    }
    function close() {
      box.classList.remove("open");
      img.src = "";
    }

    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        show(i);
      });
    });
    qs(".lightbox-close", box).addEventListener("click", close);
    qs(".lightbox-prev", box).addEventListener("click", function () { show(index - 1); });
    qs(".lightbox-next", box).addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  function wireNav() {
    var col = qs("#mainNav") || qs(".navbar-collapse");
    qsa(".navbar-collapse .nav-link").forEach(function (a) {
      a.addEventListener("click", function () {
        if (!col || !col.classList.contains("show") || !window.bootstrap) return;
        var inst = bootstrap.Collapse.getInstance(col);
        if (inst) inst.hide();
      });
    });
    document.addEventListener("click", function (e) {
      if (!col || !col.classList.contains("show") || !window.bootstrap) return;
      if (e.target.closest("#mainNav") || e.target.closest(".navbar-toggler")) return;
      var inst = bootstrap.Collapse.getInstance(col);
      if (inst) inst.hide();
    });
  }

  function markStatus(ok, warn, label, detail) {
    var cls = ok ? "ok" : (warn ? "warn" : "miss");
    var word = ok ? "Ready" : (warn ? "Check" : "Needed");
    return '<li class="status-' + cls + '"><span class="status-flag">' + word + "</span><div><strong>" + label + "</strong><div class=\"status-detail\">" + detail + "</div></div></li>";
  }

  function wireAdminStatus() {
    var el = qs("#admin-status");
    if (!el) return;
    var pass = String(cfg.passcode || "").trim();
    var email = (cfg.contactEmail || "").trim();
    var fb = (cfg.facebookUrl || "").trim();
    var forms = cfg.forms || {};
    var formKeys = ["claimProfile", "mixtape", "memorial", "photos", "rsvp"];
    var formCount = formKeys.filter(function (k) { return (forms[k] || "").trim(); }).length;
    var spotify = (cfg.spotifyPlaylistId || "").trim();
    var url = (cfg.siteUrl || "").trim();
    var date = ((cfg.nextGathering || {}).date || "").trim();
    var defaultDate = !date || /to be announced/i.test(date);
    var starterPass = !pass || pass.toUpperCase() === "SMITHY86";

    el.innerHTML =
      "<h2>Is the site ready to publish?</h2>" +
      "<p>This list reads the settings file automatically. Green means that piece is filled in. You can still publish with yellow items — classmates will use email or copy-a-note instead of a form.</p>" +
      "<ul class=\"status-list\">" +
        markStatus(!starterPass, starterPass, "Classmate passcode",
          starterPass ? "Still the starter code. Change it in js/config.js before you share the address widely." : "A custom passcode is set.") +
        markStatus(!!email, false, "Committee email",
          email ? email : "Empty. Write-in buttons still work (classmates can copy a note), but Open in Email will not until you add an address.") +
        markStatus(!!fb, !fb, "Facebook group",
          fb ? "Link is set." : "Optional. The Facebook line stays hidden until you paste a group URL.") +
        markStatus(formCount === 5, formCount > 0, "Class forms",
          formCount + " of 5 forms pasted. Empty ones fall back to email or copy-a-note.") +
        markStatus(!!spotify, !spotify, "Spotify mixtape",
          spotify ? "Playlist embed will show on the home page." : "Optional. The Side A track list still shows.") +
        markStatus(!!url, !url, "Public site address",
          url ? url : "Optional, but needed so shared links show the crest picture. Paste it after GitHub Pages is live.") +
        markStatus(!defaultDate, defaultDate, "Next gathering",
          defaultDate ? "Honestly says the date is to be announced." : date) +
      "</ul>";
  }

  applyConfig();
  wireGateway();
  wireGatePage();
  wireBoot();
  wireLockToggle();
  wireLightbox();
  wireNav();
  wireAdminStatus();
})();
