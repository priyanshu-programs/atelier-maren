import ButtonWithIconDemo from "@/components/ui/button-with-icon";

export default function GetStarted() {
  return (
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 w-full flex justify-center items-center bg-background">
      <div className="max-w-4xl text-center flex flex-col items-center">
        <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tight mb-6 sm:mb-8">
          Begin the narrative of your space.
        </h2>
        <p className="font-sans text-sm sm:text-base text-foreground/70 max-w-md mx-auto mb-8 sm:mb-12">
          Consultations are strictly limited per quarter to ensure uncompromising dedication to each project.
        </p>
        <ButtonWithIconDemo
          label="Apply for a Consultation"
          className="bg-foreground text-background font-sans uppercase tracking-widest px-10"
        />
      </div>
    </section>
  );
}
