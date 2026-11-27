"use client";

import { useState } from "react";

// On a phone the header's links fold away behind a "✿ menu" button (with the
// page you're on beside it), so the work shows up without scrolling past
// three rows of links. On bigger screens the button is hidden and the links
// sit in the band as usual. The looks live in SiteHeader.module.css.
export default function NavMenu({
  here,
  classes,
  children,
}: {
  /** the name of the page you're on */
  here?: string;
  classes: { menu: string; open: string; toggle: string; here: string; links: string };
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${classes.menu} ${open ? classes.open : ""}`}>
      <button
        type="button"
        className={classes.toggle}
        aria-expanded={open}
        aria-controls="site-links"
        onClick={() => setOpen((o) => !o)}
      >
        <span>✿ menu {open ? "▴" : "▾"}</span>
        {here && <span className={classes.here}>{here}</span>}
      </button>
      {/* picking a link folds the menu away again */}
      <div
        id="site-links"
        className={classes.links}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        {children}
      </div>
    </div>
  );
}
