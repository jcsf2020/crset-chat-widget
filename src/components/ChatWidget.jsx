import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://chat-api.crsetsolutions.com' 
    : 'http://localhost:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensagem de boas-vindas
      setMessages([{
        id: 'welcome',
        type: 'assistant',
        content: 'Olá! 👋 Sou o assistente da CRSET Solutions. Como posso ajudá-lo hoje? Posso falar sobre os nossos serviços, planos ou fazer uma análise gratuita do seu negócio.',
        timestamp: new Date().toISOString()
      }]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com o servidor');
      }

      const data = await response.json();

      const assistantMessage = {
        id: `assistant_${Date.now()}`,
        type: 'assistant',
        content: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        isQualifiedLead: data.is_qualified_lead
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Se for um lead qualificado, mostrar opção de contacto
      if (data.is_qualified_lead) {
        setTimeout(() => {
          const leadMessage = {
            id: `lead_${Date.now()}`,
            type: 'system',
            content: 'Gostaria de deixar os seus dados para recebermos uma proposta personalizada?',
            timestamp: new Date().toISOString(),
            showLeadForm: true
          };
          setMessages(prev => [...prev, leadMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'system',
        content: 'Desculpe, ocorreu um erro. Tente novamente ou contacte-nos diretamente em crsetsolutions@gmail.com',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const formatMessage = (content) => {
    // Converter quebras de linha em <br>
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const LeadForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      company: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.name && formData.email) {
        onSubmit(formData);
      }
    };

    return (
      <div className="lead-form">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded text-sm"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email profissional"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-2 border rounded text-sm"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Nome da empresa (opcional)"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white p-2 rounded text-sm hover:bg-blue-700"
            >
              Enviar Dados
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  };

  const handleLeadSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/api/chat/lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          session_id: sessionId,
          chat_summary: messages.map(m => `${m.type}: ${m.content}`).join('\n')
        })
      });

      if (response.ok) {
        const successMessage = {
          id: `success_${Date.now()}`,
          type: 'system',
          content: '✅ Obrigado! Os seus dados foram enviados. Entraremos em contacto em breve.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev.filter(m => !m.showLeadForm), successMessage]);
      } else {
        throw new Error('Erro ao enviar dados');
      }
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'system',
        content: 'Erro ao enviar dados. Contacte-nos diretamente em crsetsolutions@gmail.com',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev.filter(m => !m.showLeadForm), errorMessage]);
    }
  };

  const handleLeadCancel = () => {
    setMessages(prev => prev.filter(m => !m.showLeadForm));
  };

  return (
    <div className="chat-widget">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`chat-button ${isOpen ? 'open' : ''}`}
        aria-label="Abrir chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">CRSET Assistant</div>
                <div className="text-xs text-gray-500">Online agora</div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'user' ? (
                    <User size={16} />
                  ) : message.type === 'assistant' ? (
                    <Bot size={16} />
                  ) : (
                    <div className="w-4 h-4 bg-orange-500 rounded-full" />
                  )}
                </div>
                <div className="message-content">
                  {message.showLeadForm ? (
                    <LeadForm
                      onSubmit={handleLeadSubmit}
                      onCancel={handleLeadCancel}
                    />
                  ) : (
                    <div className={`message-bubble ${message.type} ${message.isError ? 'error' : ''}`}>
                      {formatMessage(message.content)}
                    </div>
                  )}
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString('pt-PT', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="message-bubble assistant">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="ml-2">A escrever...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input">
            <div className="input-container">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escreva a sua mensagem..."
                className="message-input"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="send-button"
                aria-label="Enviar mensagem"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="chat-footer">
              Powered by <strong>CRSET Solutions</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

