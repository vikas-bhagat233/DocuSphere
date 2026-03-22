import { useState, useRef, useEffect } from 'react';
import { chatWithBot } from '../services/aiService';

export default function DocuBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! I am DocuBot ✨ I am connected to Gemini and I can see exactly what documents are inside your Vault right now. What would you like to know?' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // If user is not logged in, DocuBot goes to sleep!
  if (!token) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await chatWithBot(userMessage.text, token);
      
      // Transform bold markdown **text** to <strong> and newlines to <br/> naturally without ReactMarkdown plugin complexity
      const formattedReply = reply
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br/>');

      setMessages(prev => [...prev, { sender: 'bot', text: formattedReply }]);
    } catch (error) {
       console.error("DocuBot Error:", error);
       const exactError = error.response?.data?.message || "Oops, my Gemini connection had a glitch. Check your API key or backend logs!";
       setMessages(prev => [...prev, { sender: 'bot', text: exactError }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="docubot-wrapper">
      <button className="docubot-toggle" onClick={() => setIsOpen(!isOpen)}>
         {isOpen ? "✖ Close" : "✨ DocuBot"}
      </button>

      {isOpen && (
        <div className="docubot-window glass-panel animate-fade-up">
           <div className="docubot-header">
              <h4>✨ DocuBot <span>Powered by Gemini</span></h4>
           </div>
           
           <div className="docubot-messages">
             {messages.map((msg, index) => (
                <div key={index} className={`message-bubble ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
                   {msg.sender === 'bot' && <span className="bot-avatar">✨</span>}
                   <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                </div>
             ))}
             {isTyping && <div className="message-bubble bot-msg typing-indicator">Generating response...</div>}
             <div ref={messagesEndRef} />
           </div>

           <form onSubmit={handleSend} className="docubot-input-form">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your vault..." 
                disabled={isTyping}
              />
              <button className="docubot-send" type="submit" disabled={isTyping || !input.trim()}>⚡</button>
           </form>
        </div>
      )}
    </div>
  );
}
