import React, { useState } from 'react';
import { FaPaperPlane, FaCheckCircle, FaEnvelope, FaUser, FaEdit } from 'react-icons/fa';

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

const sampleEmails: EmailMessage[] = [
  {
    id: '1',
    from: 'Prashanth Kumar',
    subject: 'Welcome to my Portfolio!',
    preview: 'Thanks for visiting my interactive portfolio. Feel free to explore and reach out if you\'d like to connect...',
    date: 'Today',
    read: true
  },
  {
    id: '2',
    from: 'Portfolio System',
    subject: 'About This Mail App',
    preview: 'This is a functional contact form disguised as a mail application. Click "Compose" to send me a message...',
    date: 'Today',
    read: true
  },
];

export const Mail: React.FC = () => {
  const [view, setView] = useState<'inbox' | 'compose' | 'sent'>('inbox');
  const [emails] = useState<EmailMessage[]>(sampleEmails);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Simulate sending email
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 3 seconds and return to inbox
      setTimeout(() => {
        setShowSuccess(false);
        setView('inbox');
      }, 3000);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderSidebar = () => (
    <div className="w-52 bg-gray-50 border-r border-gray-200 p-3">
      <button
        onClick={() => setView('compose')}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md mb-3 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
      >
        <FaEdit size={14} />
        <span>New Message</span>
      </button>

      <div className="space-y-0.5">
        <div
          onClick={() => {
            setView('inbox');
            setSelectedEmail(null);
          }}
          className={`py-1.5 px-3 rounded-md cursor-pointer transition-colors text-sm ${
            view === 'inbox' ? 'bg-gray-200 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FaEnvelope size={13} />
            <span>Inbox</span>
            <span className="ml-auto text-xs text-gray-500">{emails.length}</span>
          </div>
        </div>

        <div
          onClick={() => setView('sent')}
          className={`py-1.5 px-3 rounded-md cursor-pointer transition-colors text-sm ${
            view === 'sent' ? 'bg-gray-200 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FaPaperPlane size={13} />
            <span>Sent</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInbox = () => (
    <div className="flex-1 flex">
      {/* Email List */}
      <div className="w-80 border-r border-gray-200 overflow-y-auto bg-white">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => setSelectedEmail(email)}
            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedEmail?.id === email.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
            } ${!email.read && selectedEmail?.id !== email.id ? 'bg-blue-50/30' : ''}`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className={`font-semibold ${!email.read ? 'text-blue-700' : 'text-gray-800'}`}>
                {email.from}
              </div>
              <div className="text-xs text-gray-500">{email.date}</div>
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">{email.subject}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{email.preview}</div>
          </div>
        ))}

        {emails.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FaEnvelope className="mx-auto mb-2" size={48} />
            <p>No messages</p>
          </div>
        )}
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {selectedEmail ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{selectedEmail.subject}</h2>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {selectedEmail.from[0]}
              </div>
              <div>
                <div className="font-semibold">{selectedEmail.from}</div>
                <div className="text-sm text-gray-500">{selectedEmail.date}</div>
              </div>
            </div>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {selectedEmail.preview}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <FaEnvelope size={64} className="mx-auto mb-4 opacity-50" />
              <p>Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompose = () => (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">New Message</h2>

        {showSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-8 text-center">
            <FaCheckCircle className="text-green-500 mx-auto mb-4" size={56} />
            <h3 className="text-xl font-semibold text-green-700 mb-2">Message Sent!</h3>
            <p className="text-green-600 text-sm">Thank you for reaching out. I'll get back to you soon!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <FaEnvelope />
                <span className="font-medium">To:</span>
                <span className="text-blue-600">prashanth@portfolio.dev</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaUser className="text-gray-400" />
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" />
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Let's work together!"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                placeholder="Hi Prashanth, I'd love to discuss..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSending}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  isSending
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setView('inbox')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a demonstration contact form. In a production environment,
            you would integrate this with a backend service or email API (like EmailJS, Formspree, or your own server).
          </p>
        </div>
      </div>
    </div>
  );

  const renderSent = () => (
    <div className="flex-1 flex items-center justify-center text-gray-400">
      <div className="text-center">
        <FaPaperPlane size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg">No sent messages yet</p>
        <p className="text-sm mt-2">Messages you send will appear here</p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex bg-white">
      {renderSidebar()}
      {view === 'inbox' && renderInbox()}
      {view === 'compose' && renderCompose()}
      {view === 'sent' && renderSent()}
    </div>
  );
};
