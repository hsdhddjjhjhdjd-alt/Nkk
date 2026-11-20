/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { DesignLabPreset, PageRoute, PROJECTS } from './data/projects';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { DesignLabPage } from './pages/DesignLabPage';
import { AboutPage } from './pages/AboutPage';

gsap.registerPlugin(ScrollTrigger);

function parseHash(): { page: PageRoute; projectId: string } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'home') {
    return { page: 'home', projectId: PROJECTS[0].id };
  }
  if (hash === 'discover') {
    return { page: 'discover', projectId: PROJECTS[0].id };
  }
  if (hash === 'projects') {
    return { page: 'projects', projectId: PROJECTS[0].id };
  }
  if (hash === 'design-lab') {
    return { page: 'design-lab', projectId: PROJECTS[0].id };
  }
  if (hash === 'about') {
    return { page: 'about', projectId: PROJECTS[0].id };
  }
  if (hash.startsWith('project/')) {
    const id = hash.slice('project/'.length);
    const match = PROJECTS.find((p) => p.id === id);
    if (match) {
      return { page: 'project-details', projectId: match.id };
    }
  }
  return { page: 'home', projectId: PROJECTS[0].id };
}

export default function App() {
  const initial = parseHash();
  const [currentPage, setCurrentPage] = useState<PageRoute>(initial.page);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initial.projectId
  );
  const [labPreset, setLabPreset] = useState<DesignLabPreset | undefined>(
    undefined
  );

  useEffect(() => {
    const onHashChange = () => {
      const next = parseHash();
      setCurrentPage(next.page);
      setSelectedProjectId(next.projectId);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (page: PageRoute) => {
    if (page === 'design-lab') {
      setLabPreset(undefined);
    }
    setCurrentPage(page);
    if (page === 'project-details') {
      window.location.hash = `project/${selectedProjectId}`;
    } else {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage('project-details');
    window.location.hash = `project/${projectId}`;
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const openDesignLabWithPreset = (preset?: DesignLabPreset) => {
    setLabPreset(preset);
    setCurrentPage('design-lab');
    window.location.hash = 'design-lab';
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const activeProject =
    PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

  const isTransparentHero =
    currentPage === 'home' || currentPage === 'project-details';

  const routeKey =
    currentPage === 'project-details'
      ? `project-${activeProject.id}`
      : currentPage;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F8F7F2] text-[#141513] flex flex-col">
        <CustomCursor routeKey={routeKey} />

        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          transparentHero={isTransparentHero}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={routeKey}
              initial={
                currentPage === 'project-details'
                  ? { opacity: 0, y: 18 }
                  : { opacity: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                currentPage === 'project-details'
                  ? { opacity: 0, y: -12 }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => {
                ScrollTrigger.refresh();
              }}
            >
              {currentPage === 'home' && (
                <HomePage
                  onNavigate={navigateTo}
                  onSelectProject={selectProject}
                />
              )}

              {currentPage === 'discover' && (
                <DiscoverPage onSelectProject={selectProject} />
              )}

              {currentPage === 'projects' && (
                <ProjectsPage
                  onSelectProject={selectProject}
                  onNavigate={navigateTo}
                />
              )}

              {currentPage === 'project-details' && (
                <ProjectDetailsPage
                  project={activeProject}
                  onSelectProject={selectProject}
                  onNavigate={navigateTo}
                  onOpenDesignLab={openDesignLabWithPreset}
                />
              )}

              {currentPage === 'design-lab' && (
                <DesignLabPage initialPreset={labPreset} />
              )}

              {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {currentPage !== 'design-lab' && <Footer onNavigate={navigateTo} />}
      </div>
    </MotionConfig>
  );
}
