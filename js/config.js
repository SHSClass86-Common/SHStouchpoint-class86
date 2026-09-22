/* =============================================================================
   SMITHVILLE SMITHIES  ·  CLASS OF 1986
   THE ONLY FILE MOST ADMINS NEED TO EDIT
   =============================================================================
   Open this file in any text editor (Notepad, TextEdit, VS Code).
   Change the words inside the quotes. Keep the quotes and commas.
   Save the file, then upload the whole site folder to GitHub Pages.

   Leave a value as "" (empty quotes) if you don't have it yet — the site
   will hide that button or fall back to email instead of showing a
   broken link.
   ============================================================================= */

window.SHS86 = {

  /* Classmate passcode. Anyone who knows this can open the members pages.
     Share it only with the Class of '86.
     This is a courtesy lock (the code lives in this file) — not bank-level
     security. That is normal for a free GitHub Pages site. */
  passcode: "Smithie86",

  /* Where classmates can reach the committee. Used for Contact, profile
     updates, memorial notes, and mixtape picks until Google Forms are ready. */
  contactEmail: "SHSClass86@proton.me",

  /* Private Facebook group for the class. */
  facebookUrl: "https://www.facebook.com/groups/195090170536846",

  /* Public web address of this site once it is live, with NO trailing slash.
     Used so shared links show the crest picture.
     Example: "https://yourname.github.io/smithville86"
     Example: "https://yourname.github.io"   (if this repo is yourname.github.io) */
  siteUrl: "",

  /* Form share links (Jotform, Google Forms, etc.). The site opens each
     in a new tab. Leave empty and classmates will email the committee instead. */
  forms: {
    claimProfile: "https://fomr.io/s/0gSGh1aaDV",   // Update / claim my classmate page
    mixtape: "https://fomr.io/s/CPbSmAx4Nm",        // Add a song to the class mixtape
    memorial: "https://fomr.io/s/IWRfMabqKy",       // Memorial note
    photos: "https://fomr.io/s/P8zM2vT40k",         // Send a throwback or reunion photo
    rsvp: "https://fomr.io/s/_WtrQMRD4N"            // Next gathering (interest)
  },

  /* Spotify playlist ID only — the letters after /playlist/ in the share link.
     Example: for https://open.spotify.com/playlist/37i9dQZF1DX  use  37i9dQZF1DX
     Leave empty until the playlist exists; the track list still shows. */
  spotifyPlaylistId: "4VVSZiewqIxV0rCtQyyR0t",

  /* Next get-together. Edit these three lines when you have a date.
     Until then, the page honestly says details are coming. */
  nextGathering: {
    title: "The Next Time We Gather",
    date: "Date to be announced",
    venue: "Smithville, Ohio",
    blurb: "The 40th was a gift. When the committee picks a date for the next one, it will show up here. Until then, use the roster, send a note, and don't be a stranger."
  }
};
