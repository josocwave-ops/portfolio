import "../globals.css";
import Atmosphere from "./components/Atmosphere";
import { InkDefs } from "./components/Ornaments";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Atmosphere />
      <InkDefs />
      {children}
    </>
  );
}
