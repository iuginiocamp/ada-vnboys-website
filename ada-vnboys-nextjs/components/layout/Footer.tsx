import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <a href="https://github.com/epfl-ada/ada-2022-project-vnboys">
        <Image
          src="/assets/img/ivon.png"
          alt="GitHub"
          title="GitHub"
          width={45}
          height={45}
        />
      </a>
      <div className="link--git">
        <div className="ling--git--item">
          <a href="https://github.com/iuginiocamp">
            Eugenio <span className="red">I</span>uginiocamp
          </a>
        </div>
        <div className="ling--git--item">
          <a href="https://github.com/pigglou">
            Louis <span className="red">P</span>igglou
          </a>
        </div>
        <div className="ling--git--item">
          <a href="https://github.com/vickiwarou">
            Victoria <span className="red">V</span>ickiwarou
          </a>
        </div>
        <div className="ling--git--item">
          <a href="https://github.com/plpeter74">
            <span className="red">P</span>lpeter75
          </a>
        </div>
        <div className="ling--git--item">
          <a href="https://github.com/aaduval">
            Anthonin <span className="red">A</span>aduval
          </a>
        </div>
      </div>
    </footer>
  );
}

