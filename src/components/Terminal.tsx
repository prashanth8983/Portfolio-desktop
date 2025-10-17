import React, { useState, useRef, useEffect } from 'react';

interface CommandHistoryItem {
  command: string;
  output: string | React.ReactNode;
  isError?: boolean;
}

// Helper to get a realistic last login time
const getLastLoginTime = () => {
  const now = new Date();
  // Go back a random amount of time for realism
  now.setHours(now.getHours() - Math.floor(Math.random() * 3));
  now.setMinutes(now.getMinutes() - Math.floor(Math.random() * 60));
  return now.toString();
};

export const Terminal: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: '',
      output: `Last login: ${getLastLoginTime()} on ttys000`,
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const commands: Record<string, () => string | React.ReactNode> = {
    help: () => (
      <div className="space-y-1">
        <div>These shell commands are defined internally. Type `help` to see this list.</div>
        <div>
          <span className="text-green-400">about</span> - About Prashanth Kumar
        </div>
        <div>
          <span className="text-green-400">skills</span> - Technical skills and expertise
        </div>
        <div>
          <span className="text-green-400">projects</span> - View my projects
        </div>
        <div>
          <span className="text-green-400">experience</span> - Work experience
        </div>
        <div>
          <span className="text-green-400">education</span> - Educational background
        </div>
        <div>
          <span className="text-green-400">contact</span> - Contact information
        </div>
        <div>
          <span className="text-green-400">resume</span> - View/download resume
        </div>
        <div>
          <span className="text-green-400">social</span> - Social media links
        </div>
        <div>
          <span className="text-green-400">cowsay [text]</span> - Make the cow say something
        </div>
        <div>
          <span className="text-green-400">ls</span> - List files
        </div>
        <div>
          <span className="text-green-400">cat [file]</span> - Read a file
        </div>
        <div>
          <span className="text-green-400">clear</span> - Clear terminal
        </div>
        <div>
          <span className="text-green-400">date</span> - Show current date and time
        </div>
        <div>
          <span className="text-green-400">whoami</span> - Display current user
        </div>
      </div>
    ),
    about: () => (
      <div className="space-y-2">
        <div className="text-cyan-400">👨‍💻 About Me</div>
        <div className="ml-4">
          <div>Name: Prashanth Kumar</div>
          <div>Role: Full-Stack Developer</div>
          <div>Location: [Your Location]</div>
          <div className="mt-2">
            Passionate developer with expertise in building modern web applications.
            Specializing in React, TypeScript, and creating unique user experiences.
          </div>
        </div>
      </div>
    ),
    skills: () => (
      <div className="space-y-2">
        <div className="text-cyan-400">💪 Technical Skills</div>
        <div className="ml-4 space-y-3">
          <div>
            <div className="text-yellow-400">Frontend:</div>
            <div className="ml-4">React, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3</div>
          </div>
          <div>
            <div className="text-yellow-400">Backend:</div>
            <div className="ml-4">Node.js, Express, REST APIs</div>
          </div>
          <div>
            <div className="text-yellow-400">Tools & Technologies:</div>
            <div className="ml-4">Git, GitHub, Vite, npm, VS Code</div>
          </div>
          <div>
            <div className="text-yellow-400">Other:</div>
            <div className="ml-4">Responsive Design, UI/UX, Performance Optimization</div>
          </div>
        </div>
      </div>
    ),
    projects: () => (
      <div className="space-y-2">
        <div className="text-cyan-400">🚀 Featured Projects</div>
        <div className="ml-4 space-y-3">
          <div>
            <div className="text-green-400">1. Portfolio Desktop</div>
            <div className="ml-4 text-sm">
              <div>Interactive macOS/iOS simulator as portfolio</div>
              <div className="text-gray-400">Tech: React 19, TypeScript, Tailwind CSS</div>
            </div>
          </div>
          <div>
            <div className="text-green-400">2. [Your Project Name]</div>
            <div className="ml-4 text-sm">
              <div>[Project description]</div>
              <div className="text-gray-400">Tech: [Technologies used]</div>
            </div>
          </div>
          <div className="text-gray-400 mt-2">
            💡 Tip: Open the "Projects" folder on the desktop for detailed project information!
          </div>
        </div>
      </div>
    ),
    experience: () => (
      <div className="space-y-2">
        <div className="text-cyan-400">💼 Work Experience</div>
        <div className="ml-4 space-y-3">
          <div>
            <div className="text-yellow-400">[Job Title] at [Company Name]</div>
            <div className="text-sm text-gray-400">[Start Date] - [End Date/Present]</div>
            <div className="ml-4 text-sm mt-1">
              <div>• [Key responsibility or achievement]</div>
              <div>• [Key responsibility or achievement]</div>
              <div>• [Key responsibility or achievement]</div>
            </div>
          </div>
        </div>
      </div>
    ),
    education: () => (
      <div className="space-y-2">
        <div className="text-cyan-400">🎓 Education</div>
        <div className="ml-4 space-y-2">
          <div>
            <div className="text-yellow-400">[Degree] in [Field]</div>
            <div className="text-sm">[University Name]</div>
            <div className="text-sm text-gray-400">[Graduation Year]</div>
          </div>
        </div>
      </div>
    ),
    contact: () => (
      <div className="space-y-2">
        <div className="text-cyan-400">📧 Contact Information</div>
        <div className="ml-4 space-y-1">
          <div>Email: <a href="mailto:your.email@example.com" className="text-blue-400 hover:underline">your.email@example.com</a></div>
          <div>Phone: [Your Phone Number]</div>
          <div>LinkedIn: <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">linkedin.com/in/yourprofile</a></div>
          <div>GitHub: <a href="https://github.com/prashanth8983" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/prashanth8983</a></div>
          <div className="mt-2 text-gray-400">💡 You can also use the Mail app on the desktop!</div>
        </div>
      </div>
    ),
    resume: () => (
      <div className="space-y-2">
        <div className="text-cyan-400">📄 Resume</div>
        <div className="ml-4">
          <div>My resume is available on the desktop as "Prashanth Kumar.pdf"</div>
          <div className="mt-2">
            <a href="/Resume.pdf" download className="text-blue-400 hover:underline">
              → Click here to download resume
            </a>
          </div>
        </div>
      </div>
    ),
    social: () => (
      <div className="space-y-2">
        <div className="text-cyan-400">🌐 Social Media</div>
        <div className="ml-4 space-y-1">
          <div>GitHub: <a href="https://github.com/prashanth8983" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/prashanth8983</a></div>
          <div>LinkedIn: <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">linkedin.com/in/yourprofile</a></div>
          <div>Twitter: <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@yourhandle</a></div>
          <div>Portfolio: <a href="https://prashanth8983.github.io/Portfolio-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">prashanth8983.github.io/Portfolio-desktop</a></div>
        </div>
      </div>
    ),
    ls: () => (
      <div className="ml-4 grid grid-cols-3 gap-2">
        <div className="text-blue-400">Documents/</div>
        <div className="text-blue-400">Projects/</div>
        <div className="text-blue-400">Photos/</div>
        <div>resume.pdf</div>
        <div>skills.txt</div>
        <div>about.txt</div>
      </div>
    ),
    cat: () => 'Usage: cat [filename]\nAvailable files: resume.txt, skills.txt, about.txt',
    clear: () => '__CLEAR__',
    date: () => new Date().toString(),
    whoami: () => 'prashanth-kumar',
  };

  const handleCatCommand = (filename: string): string | React.ReactNode => {
    const files: Record<string, string> = {
      'resume.txt': 'This is Prashanth Kumar\'s resume. For the full version, check out the PDF on the desktop!',
      'skills.txt': 'React • TypeScript • JavaScript • Node.js • Tailwind CSS • Git',
      'about.txt': 'Full-stack developer passionate about creating unique and interactive web experiences.',
    };

    const file = files[filename];
    if (file) {
      return file;
    }
    return `cat: ${filename}: No such file or directory`;
  };

  const handleCowsay = (text: string): React.ReactNode => {
    const message = text || 'Hello from the terminal!';
    const border = '_'.repeat(message.length + 2);

    return (
      <pre className="text-sm">
{` ${border}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`}
      </pre>
    );
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) {
      setHistory([...history, { command: '', output: '' }]);
      return;
    }

    const [baseCmd, ...args] = trimmedCmd.split(' ');
    let output: string | React.ReactNode;
    let isError = false;

    if (baseCmd === 'clear') {
      setHistory([]);
      return;
    } else if (baseCmd === 'cat' && args.length > 0) {
      output = handleCatCommand(args.join(' '));
      isError = typeof output === 'string' && output.startsWith('cat:');
    } else if (baseCmd === 'cowsay') {
      output = handleCowsay(args.join(' '));
    } else if (commands[baseCmd]) {
      output = commands[baseCmd]();
    } else {
      output = `zsh: command not found: ${baseCmd}`;
      isError = true;
    }

    if (output === '__CLEAR__') {
      setHistory([]);
      return;
    }

    setHistory([...history, { command: trimmedCmd, output, isError }]);
    setCommandHistory([...commandHistory, trimmedCmd]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div
      className="w-full h-full font-mono text-sm bg-[#1e1e1e] text-gray-200 p-3 overflow-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
      ref={terminalRef}
    >
      {/* Blinking cursor style */}
      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .blinking-cursor::after {
            content: '';
            display: inline-block;
            width: 8px;
            height: 1.2em;
            background-color: #f0f0f0;
            animation: blink 1.2s infinite;
            margin-left: 4px;
            position: relative;
            top: 2px;
          }
          .blinking-cursor-focused::after {
            animation: none;
          }
        `}
      </style>
      <div className="space-y-2">
        {history.map((item, index) => (
          <div key={index}>
            {item.command && (
              <div className="flex items-center">
                <span className="text-green-400">prashanth@mac</span>
                <span className="text-gray-400 mx-1">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-400 mx-1">$</span>
                <span className="flex-1">{item.command}</span>
              </div>
            )}
            {item.output && (
              <div className={`whitespace-pre-wrap ${item.isError ? 'text-red-400' : ''}`}>
                {item.output}
              </div>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-green-400">prashanth@mac</span>
          <span className="text-gray-400 mx-1">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-gray-400 mx-1">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-gray-200 pl-2"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="blinking-cursor"></span>
        </div>
      </div>
    </div>
  );
};
