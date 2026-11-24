"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  FaReact,
  FaAws,
  FaDocker,
  FaNodeJs,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaGoogle,
  FaApple,
} from "react-icons/fa";
import { SiNextdotjs, SiVercel, SiRedux, SiTypescript, SiFacebook } from "react-icons/si";

const fallbackUrls = ["/logo.png", "/hero-3d/slide-1.svg"];

const iconConfigs = [
  { Icon: FaReact, color: "#61DAFB" },
  { Icon: FaAws, color: "#FF9900" },
  { Icon: FaDocker, color: "#2496ED" },
  { Icon: FaNodeJs, color: "#339933" },
  { Icon: SiNextdotjs, color: "#000000" },
  { Icon: SiVercel, color: "#000000" },
  { Icon: SiRedux, color: "#764ABC" },
  { Icon: SiTypescript, color: "#3178C6" },
  { Icon: FaGithub, color: "#181717" },
  { Icon: FaTwitter, color: "#1DA1F2" },
  { Icon: FaLinkedin, color: "#0077B5" },
  { Icon: FaInstagram, color: "#E1306C" },
  { Icon: FaGoogle, color: "#DB4437" },
  { Icon: FaApple, color: "#000000" },
  { Icon: SiFacebook, color: "#1877F2" },
  { Icon: null, img: fallbackUrls[0] },
  { Icon: null, img: fallbackUrls[1] },
];

export default function FeatureSection() {
  const orbitCount = 3;
  const orbitGap = 8;
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  return (
    <section className="container-pad my-16">
      <div className="relative mx-auto flex h-[30rem] max-w-6xl items-center justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white pl-10">
        <div className="z-10 w-1/2">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 sm:text-6xl">Build your idea</h2>
          <p className="mb-6 max-w-lg text-gray-500">
            Licomanagement delivers modern, scalable software architecture for fintech, education platforms, government service apps,
            and business automation systems.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="default" asChild>
              <Link href="/it-software-development">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/support">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="relative flex h-full w-1/2 items-center justify-start overflow-hidden">
          <div className="relative flex h-[50rem] w-[50rem] translate-x-[50%] items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 shadow-lg">
              <FaReact className="h-12 w-12 text-blue-400" />
            </div>

            {[...Array(orbitCount)].map((_, orbitIdx) => {
              const size = `${12 + orbitGap * (orbitIdx + 1)}rem`;
              const angleStep = (2 * Math.PI) / iconsPerOrbit;

              return (
                <div
                  key={orbitIdx}
                  className="absolute rounded-full border-2 border-dotted border-gray-300"
                  style={{
                    width: size,
                    height: size,
                    animation: `spin ${12 + orbitIdx * 6}s linear infinite`,
                  }}
                >
                  {iconConfigs
                    .slice(orbitIdx * iconsPerOrbit, orbitIdx * iconsPerOrbit + iconsPerOrbit)
                    .map((cfg, iconIdx) => {
                      const angle = iconIdx * angleStep;
                      const x = 50 + 50 * Math.cos(angle);
                      const y = 50 + 50 * Math.sin(angle);

                      return (
                        <div
                          key={iconIdx}
                          className="absolute rounded-full bg-white p-1 shadow-md"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          {cfg.Icon ? (
                            <cfg.Icon className="h-8 w-8" style={{ color: cfg.color }} />
                          ) : (
                            <Image src={cfg.img} alt="icon" width={32} height={32} className="h-8 w-8 object-contain" />
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
