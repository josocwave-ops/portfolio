import "../globals.css";
import Atmosphere from "./components/Atmosphere";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Atmosphere />
      {children}
    </>
  );
}
