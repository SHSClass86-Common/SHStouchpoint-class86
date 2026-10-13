# Smithville Smithies · Class of 1986

Private static website for Green Local High School's Class of 1986 (Smithville, Ohio).

This folder is ready for **GitHub Pages**. There is no server, no database, and no build step.

## Put it online

1. Create a GitHub repository.
2. Upload **these files at the top of the repository** (`index.html` must be visible in the root, not inside another folder).
3. Repository **Settings → Pages → Deploy from a branch → main / (root)**.
4. Wait a minute, then open the address GitHub shows you.
5. Paste that address into `siteUrl` in `js/config.js` and upload the file again.

Plain-English instructions also live on **admin.html**.

## What classmates will do

- Home page is public (search engines are asked not to index it).
- Roster, community, memories, memorial, and Anvil Pong open with the classmate passcode (set in `js/config.js`).
- Life updates, photos, mixtape picks, memorial names, and RSVPs go to a Google Form, the committee email, or a copy-a-note window if neither is set yet.

## What admins will do

Open **admin.html**. That page shows a live “is it ready?” list and the how-to. Ordinary updates should not need a developer.

## Before you share the address

These are the only things a person still has to type in. The site works without them, but it is not finished for the class until 1 and 2 are done.

1. Change the starter passcode in `js/config.js`.
2. Add a committee email in `js/config.js`.
3. Optional: Facebook group URL, Google Form links, Spotify playlist ID, next gathering date, public site URL.

## Courtesy lock

The passcode lives in `js/config.js`. Anyone who can view that file can find it. That is normal for a free GitHub Pages site. It keeps casual visitors out; it is not bank security.
