import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion"; 
import { MoveRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = useMemo(
    () => ["Otomatik Pilot'ta", "AI ile Kolay", "Saniyeler İçinde", "Profesyonel Kalitede", "Tamamen Otomatik"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-8 lg:py-16 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              AI Destekli Video Üretimi <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular" id="hero-title">
              <span className="text-gray-900">Video Reklam Üretimi</span>
              <br />
              <span className="text-gray-900">Artık</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>
            <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              AI destekli video üretim platformumuz ile saniyeler içinde profesyonel kalitede video reklamlar oluşturun.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="default">
              Hemen Başla <MoveRight className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4" variant="outline">
              Demo İzle <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;