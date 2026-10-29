import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import ProjectsSection from "./_components/ProjectsSection";
import SkillsSection from "./_components/SkillsSection";
import ExperienceSection from "./_components/ExperienceSection";
import AchievementsSection from "./_components/AchievementsSection";
import TestimonialsSection from "./_components/TestimonialsSection";
import BlogSection from "./_components/BlogSection";
import ContactSection from "./_components/ContactSection";
import Footer from "./_components/Footer";
import PortfolioTheme from "./_providers/PortfolioTheme";

export default function Home() {
  return (
    <PortfolioTheme>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <AchievementsSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </PortfolioTheme>
  );
}
