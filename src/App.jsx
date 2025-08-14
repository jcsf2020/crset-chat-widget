import React from 'react';
import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Demo page content */}
      <div className="demo-content">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              CRSET AI Assistant Demo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Teste o nosso assistente de IA integrado. Clique no botão de chat no canto inferior direito.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Funcionalidades do AI Assistant
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">🤖 Chat Inteligente</h3>
                  <p className="text-gray-600">
                    Powered by OpenAI GPT-4o com conhecimento específico sobre CRSET Solutions
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">🎯 Qualificação de Leads</h3>
                  <p className="text-gray-600">
                    Deteta automaticamente interesse e oferece captura de dados
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">💾 Memória de Sessão</h3>
                  <p className="text-gray-600">
                    Mantém contexto da conversa durante toda a sessão
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2">📱 Responsivo</h3>
                  <p className="text-gray-600">
                    Funciona perfeitamente em desktop e mobile
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-2">
                💡 Como Testar
              </h3>
              <p className="text-yellow-700">
                Experimente perguntar sobre preços, serviços, ou solicite uma análise gratuita do seu negócio. 
                O assistente irá detectar o seu interesse e oferecer próximos passos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
