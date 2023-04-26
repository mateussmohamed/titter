export function Footer() {
  return (
    <footer className="w-full bg-white p-8 shadow-md">
      <div className="flex items-center justify-center text-center font-light text-gray-400">
        Created with&nbsp;<span aria-label="heart">❤️</span>&nbsp;by&nbsp;
        <a
          href="https://www.github.com/mateussantana"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-slate-400 underline underline-offset-4 hover:text-slate-950"
        >
          @mateussmohamed
        </a>
        &nbsp; | Hosted on&nbsp;
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-slate-400 underline underline-offset-4 hover:text-slate-950"
        >
          Vercel
        </a>
      </div>
    </footer>
  )
}
