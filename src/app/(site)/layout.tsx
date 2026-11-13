import "../globals.css";
import Atmosphere from "./components/Atmosphere";
import StarCursor from "./components/StarCursor";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Atmosphere />
      {children}
      <StarCursor />
    </>
  );
}
