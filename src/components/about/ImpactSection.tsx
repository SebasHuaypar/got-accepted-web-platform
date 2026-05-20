import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";

export default function ImpactSection() {
  return (
    <section className="pb-24 md:pb-32 pt-8 md:pt-12 bg-white overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          
          {/* Left: Real Certificate Image (Tal cual el ejemplo) */}
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="relative z-10 w-full max-w-[550px] mx-auto group">
              {/* Premium Frame Effect */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-white p-3 rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transform -rotate-1 group-hover:rotate-0 transition-all duration-700">
                <Image
                  src="/images/certificate.jpg"
                  alt="Official GotAccepted Accreditation"
                  width={600}
                  height={800}
                  className="rounded-lg w-full h-auto border border-gray-100"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right: Content — Centered on mobile */}
          <div className="flex-1 max-w-2xl order-1 lg:order-2 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="mb-10 flex flex-col items-center lg:items-start">
              {/* Isotipo GotAccepted */}
              <div className="mb-8">
                <Image 
                  src="/images/isotype.png" 
                  alt="GotAccepted Isotype" 
                  width={60} 
                  height={60} 
                  className="w-auto h-12 md:h-14 object-contain"
                />
              </div>
              
              <div className="w-12 h-1 bg-accent mb-6 rounded-full" />
              <Title as="h2" className="text-primary text-3xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
                Institutional <br />
                Trust & <span className="font-serif italic text-accent">Support</span>
              </Title>
              <p className="text-lg md:text-2xl text-gray-800 leading-relaxed mb-10 font-light">
                Got Accepted is a youth-led organization focused on helping students and professionals with international education goals, cross-border opportunities, and institutional accreditation.
              </p>
              <a 
                href="https://www.gob.pe/senaju" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent font-bold hover:underline transition-all flex items-center gap-2 text-base md:text-lg"
              >
                www.gotaccepted.org
                <span className="w-5 h-[2px] bg-accent transition-all"></span>
              </a>
            </div>

            {/* Stats Row with Real Logos — Centered on mobile */}
            <div className="grid grid-cols-2 gap-8 md:gap-12 mt-8 md:mt-16 pt-8 border-t border-gray-50 w-full">
              <div className="flex flex-col items-center lg:items-start">
                <div className="h-12 md:h-16 mb-4 flex items-center justify-center lg:justify-start">
                  <Image 
                    src="/images/senaju.png" 
                    alt="SENAJU Logo" 
                    width={180} 
                    height={60} 
                    className="w-auto h-10 md:h-12 object-contain"
                  />
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] md:text-xs">Youth Secretariat</p>
                <p className="text-gray-400 text-[10px] mt-1">National Recognition</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="h-12 md:h-16 mb-4 flex items-center justify-center lg:justify-start">
                  <div className="text-primary font-black text-3xl md:text-5xl">3K+</div>
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] md:text-xs">Impacted Students</p>
                <p className="text-gray-400 text-[10px] mt-1">Global Community</p>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
