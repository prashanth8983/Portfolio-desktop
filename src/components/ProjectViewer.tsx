import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft } from 'react-icons/fa';
import { IoTimeOutline, IoDesktopOutline, IoDocumentTextOutline, IoDownloadOutline, IoCloudOutline, IoAppsOutline } from 'react-icons/io5';
import { projects, Project } from '../data/portfolio';
import { useTheme } from '../contexts/ThemeContext';

export const ProjectViewer: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { isDark } = useTheme();

  const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <div className={`flex items-center px-2 py-1.5 rounded-md text-sm font-medium transition-colors cursor-default ${active
      ? 'bg-gray-300/50 dark:bg-white/10 text-black dark:text-white'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/30 dark:hover:bg-white/5'
      }`}>
      <span className={`mr-2.5 text-lg ${active ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>{icon}</span>
      {label}
    </div>
  );

  return (
    <div className="flex h-full w-full">
      {/* Sidebar - Transparent to show Window Blur */}
      <div className="w-[200px] flex-shrink-0 flex flex-col py-4 px-2 space-y-6 select-none">

        {/* Favorites Section */}
        <div className="space-y-1">
          <div className="px-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 opacity-80 mb-1">Favorites</div>
          <SidebarItem icon={<IoTimeOutline />} label="Recents" />
          <SidebarItem icon={<IoAppsOutline />} label="Applications" />
          <SidebarItem icon={<IoDesktopOutline />} label="Desktop" />
          <SidebarItem icon={<IoDocumentTextOutline />} label="Documents" active />
          <SidebarItem icon={<IoDownloadOutline />} label="Downloads" />
        </div>

        {/* iCloud Section */}
        <div className="space-y-1">
          <div className="px-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 opacity-80 mb-1">iCloud</div>
          <SidebarItem icon={<IoCloudOutline />} label="iCloud Drive" />
        </div>

        {/* Locations Section */}
        <div className="space-y-1">
          <div className="px-2 text-[11px] font-bold text-gray-500 dark:text-gray-400 opacity-80 mb-1">Locations</div>
          <SidebarItem icon={<IoDesktopOutline />} label="Macintosh HD" />
        </div>
      </div>

      {/* Main Content Area - White/Dark Surface */}
      <div className={`flex-1 h-full overflow-hidden flex flex-col ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} shadow-sm`}>

        {/* Toolbar in Content Area (Optional, mimics Finder path bar or tools) */}
        {!selectedProject && (
          <div className={`h-10 flex items-center px-4 border-b ${isDark ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-600'} select-none`}>
            <div className="flex items-center gap-2">
              <span className="text-xl opacity-50"><IoDocumentTextOutline /></span>
              <span className="font-semibold text-sm">Projects</span>
              <span className="text-xs opacity-50 ml-2">5 items</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {selectedProject ? (
            // Detailed View
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <button
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <FaChevronLeft />
                <span>Back to Projects</span>
              </button>

              {selectedProject.image && (
                <div className="mb-6 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-white/10">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>{selectedProject.title}</h1>

              <div className="flex gap-3 mb-6">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                  >
                    <FaGithub />
                    <span>View Code</span>
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaExternalLinkAlt />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>

              <div className="mb-6">
                <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Technology Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>About</h2>
                <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedProject.longDescription}</p>
              </div>

              <div className="mb-6">
                <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Key Features</h2>
                <ul className="space-y-2">
                  {selectedProject.features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`group rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${isDark
                    ? 'bg-[#2a2a2a] border border-white/5 hover:bg-[#333]'
                    : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
                    }`}
                >
                  {/* Preview Image / Icon area */}
                  <div className="aspect-video bg-gray-100 dark:bg-black/20 overflow-hidden relative">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📁</div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{project.title}</h3>
                    <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
