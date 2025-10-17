import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft } from 'react-icons/fa';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  features: string[];
  challenges?: string;
}

const projects: Project[] = [
  {
    id: 'portfolio-desktop',
    title: 'Portfolio Desktop',
    description: 'Interactive macOS/iOS simulator as a creative portfolio',
    longDescription: 'A fully functional desktop and mobile operating system simulation built entirely in React. Features include window management, drag-and-drop, keyboard shortcuts, and responsive design that adapts between macOS and iOS interfaces.',
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS 4', 'Vite'],
    image: '/wallpaper.jpg',
    githubUrl: 'https://github.com/prashanth8983/Portfolio-desktop',
    liveUrl: 'https://prashanth8983.github.io/Portfolio-desktop',
    features: [
      'Fully functional window management system',
      'Window snapping to screen edges',
      'Keyboard shortcuts (Cmd+W, Cmd+M, Cmd+F, Cmd+Space)',
      'Working applications (Browser, Calculator, Text Editor)',
      'Responsive design (macOS desktop ↔ iOS mobile)',
      'Dark/Light theme with persistence',
      'Context menus and drag-and-drop',
      'Spotlight search with math evaluation'
    ],
    challenges: 'Managing z-index layering for multiple windows, implementing smooth drag operations with proper offset calculations, and ensuring responsive behavior across different screen sizes.'
  },
  {
    id: 'project-2',
    title: '[Your Project Name]',
    description: 'Brief description of your project',
    longDescription: 'Detailed description of what this project does, why you built it, and what problem it solves. Include the story behind the project and what you learned.',
    techStack: ['React', 'Node.js', 'MongoDB'],
    features: [
      'Feature 1 - description',
      'Feature 2 - description',
      'Feature 3 - description',
    ],
    githubUrl: 'https://github.com/prashanth8983',
    liveUrl: '',
  },
  {
    id: 'project-3',
    title: '[Another Project]',
    description: 'Brief description',
    longDescription: 'Full description of the project...',
    techStack: ['TypeScript', 'Express', 'PostgreSQL'],
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
    ],
    githubUrl: 'https://github.com/prashanth8983',
  },
];

export const ProjectViewer: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject) {
    return (
      <div className="w-full h-full overflow-auto bg-white">
        {/* Project Detail View */}
        <div className="max-w-4xl mx-auto p-8">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100"
          >
            <FaChevronLeft />
            <span>All Projects</span>
          </button>

          {selectedProject.image && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold mb-4 text-gray-800">{selectedProject.title}</h1>

          <div className="flex gap-3 mb-6">
            {selectedProject.githubUrl && (
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaExternalLinkAlt />
                <span>Live Demo</span>
              </a>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {selectedProject.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">About</h2>
            <p className="text-gray-600 leading-relaxed">{selectedProject.longDescription}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Key Features</h2>
            <ul className="space-y-2">
              {selectedProject.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {selectedProject.challenges && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Technical Challenges</h2>
              <p className="text-gray-600 leading-relaxed">{selectedProject.challenges}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <p className="text-sm text-gray-500 mt-0.5">Click on any project to view details</p>
      </div>

      <div className="max-w-6xl mx-auto p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-gray-300"
            >
              {project.image && (
                <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              )}
              {!project.image && (
                <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-4xl">📁</span>
                </div>
              )}

              <div className="p-5">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {project.githubUrl && (
                    <div className="text-gray-500 hover:text-gray-700">
                      <FaGithub size={18} />
                    </div>
                  )}
                  {project.liveUrl && (
                    <div className="text-blue-500 hover:text-blue-700">
                      <FaExternalLinkAlt size={16} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Want to see more?</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Check out my GitHub profile for more projects and contributions!
          </p>
          <a
            href="https://github.com/prashanth8983"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <FaGithub />
            <span>Visit GitHub Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
};
