import { useEffect, useRef } from "react";

const headingClass =
  "font-['Bricolage_Grotesque'] font-semibold text-[13px] tracking-[1px] text-[#2200b8]";
const bodyClass =
  "font-['Bricolage_Grotesque'] font-light text-[13px] leading-[1.55] tracking-[0.5px] text-[#2200b8]";

const SECTIONS = [
  {
    title: "What is collected",
    body: "Pages you visit, how far you scroll, which sections you reach, clicks, and general details like browser, device type, and country. Visits are also recorded as anonymous session replays so I can see where the site is confusing.",
  },
  {
    title: "What is not collected",
    body: "No accounts, no sign-ups, no forms, no payment details. Nothing you type is captured — Microsoft Clarity masks text input by default. I cannot identify you personally from any of this.",
  },
  {
    title: "Why",
    body: "This is a design portfolio. The data tells me which projects people actually read and where they lose interest, so I can improve how the work is presented.",
  },
  {
    title: "Who processes it",
    body: "Vercel Web Analytics (cookieless, aggregate counts) and Microsoft Clarity (scroll maps, click maps, session replay). Both act as processors on my behalf. Nothing is sold, shared, or used for advertising.",
  },
  {
    title: "Your choice",
    body: "Browser-level tracking protection, an ad blocker, or private browsing will all stop this collection. Nothing on the site breaks if you block it.",
  },
] as const;

/** Concise privacy note, opened from the footer. Native <dialog> gives Escape and focus handling. */
export function PrivacyDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Backdrop click resolves to the dialog element itself, never its content.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto w-[min(560px,calc(100vw-2rem))] rounded-[6px] border border-[#2200b8] bg-[#fcf7ee] p-0 backdrop:bg-[#2200b8]/25"
      aria-labelledby="privacy-title"
    >
      <div className="flex max-h-[80vh] flex-col gap-5 overflow-y-auto p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="privacy-title"
            className="font-['Bricolage_Grotesque'] font-semibold text-[length:var(--text-subtitle)] tracking-[1.4px] text-[#2200b8]"
          >
            Privacy
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="font-['Bricolage_Grotesque'] text-[13px] tracking-[1px] text-[#2200b8] transition-colors duration-200 hover:text-[#ff0090] cursor-pointer"
          >
            Close
          </button>
        </div>

        <p className={bodyClass}>
          This site uses privacy-light analytics to understand how people move
          through the work. No cookie banner, because there is nothing here worth
          interrupting you for.
        </p>

        {SECTIONS.map(({ title, body }) => (
          <div key={title} className="flex flex-col gap-1">
            <h3 className={headingClass}>{title}</h3>
            <p className={bodyClass}>{body}</p>
          </div>
        ))}

        <p className={bodyClass}>
          Questions, or want your session data removed?{" "}
          <a
            href="mailto:Mikammm12@gmail.com"
            className="underline transition-colors duration-200 hover:text-[#ff0090] cursor-pointer"
          >
            Mikammm12@gmail.com
          </a>
          <br />
          Last updated August 2026.
        </p>
      </div>
    </dialog>
  );
}
