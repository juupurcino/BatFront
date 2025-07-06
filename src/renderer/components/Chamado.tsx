import React, { useState } from 'react';
import '../css/chamado.css';

interface ChamadoProps {
  isOpen: boolean;
  onClose: () => void;
  chamado: any; 
  user: any;
}

export default function Chamado({ isOpen, onClose, chamado, user }: ChamadoProps) {
  if (!isOpen) return null;

  // Estado para controlar o status selecionado no dropdown
  const [selectedStatus, setSelectedStatus] = useState(chamado.StatusCurrent);

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/chamados/${chamado.IDChamado}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Status: selectedStatus }),
      });

      if (response.ok) {
        alert(`Status atualizado para: ${selectedStatus}`);
        onClose(); // fecha o modal após sucesso
      } else {
        const erro = await response.json();
        alert(`Erro: ${erro.erro || 'Erro ao atualizar status.'}`);
      }
    } catch (error) {
      alert('Erro de rede ao atualizar o status.');
      console.error(error);
    }
  };

  const handleCancelarChamado = async () => {
  const confirmar = window.confirm("Tem certeza que deseja cancelar este chamado?");
  if (!confirmar) return;

  try {
    const response = await fetch(`http://localhost:5000/chamados/${chamado.IDChamado}/cancelar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Chamado cancelado com sucesso!');
      onClose(); // Fecha o modal
    } else {
      const erro = await response.json();
      alert(`Erro: ${erro.erro || 'Erro ao cancelar chamado.'}`);
    }
  } catch (error) {
    alert('Erro de rede ao cancelar o chamado.');
    console.error(error);
  }
};

  
  // Lógica para a Linha do Tempo
  const statusSteps = ['Aberto', 'Em Andamento', 'Fechado'];
  const currentStatusIndex = statusSteps.indexOf(chamado.StatusCurrent);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-revamped" onClick={e => e.stopPropagation()}>
        
        {/* CABEÇALHO DO MODAL */}
        <div className="modal-header">
          <h2>Detalhes do Chamado</h2>
          <p className="header-title">{chamado.Descricao}</p>
        </div>

        {/* LINHA DO TEMPO DE STATUS */}
        <div className="timeline-container">
          <h3>Status do Chamado</h3>
          <div className="timeline-status">
            <div className="timeline-line">
                <div className="timeline-line-progress" style={{ width: `${currentStatusIndex * 50}%` }}></div>
            </div>
            {statusSteps.map((step, index) => (
              <div 
                key={step} 
                className={`timeline-step ${index <= currentStatusIndex ? 'completed' : ''} ${index === currentStatusIndex ? 'active' : ''}`}
              >
                <div className="step-circle"></div>
                <div className="step-label">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CORPO COM DETALHES */}
        <div className="modal-body">
          <div className="details-grid">
            <div className="detail-item">
              <strong>Responsável Técnico:</strong>
              <p>{chamado.NomeTecnico || 'Não atribuído'}</p>
            </div>
            <div className="detail-item">
              <strong>Autor:</strong>
              <p>{chamado.NomeFuncionario}</p>
            </div>
            <div className="detail-item">
              <strong>Data da Abertura:</strong>
              <p>{new Date(chamado.DataCriacao).toLocaleDateString()}</p>
            </div>
            <div className="detail-item">
                <strong>Prioridade:</strong>
                <div className={`prioridade prioridade-${chamado.Nivel?.toLowerCase()}`}>
                    <span className="bolinha"></span> {chamado.Nivel}
                </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent:'flex-end' }}>
            {(user?.funcao === 1 && user.id === chamado.IDFuncionario) && (
              <button className="btn-cancel" onClick={handleCancelarChamado}>
                Cancelar Chamado
              </button>
            )}
          </div>

          
        </div>

        {/* SEÇÃO DE ATUALIZAÇÃO PARA O TÉCNICO */}
        {(user.id == chamado.IDTecnico) && (
          <div className="update-status-section">
            <label htmlFor="status-select">Atualizar Status:</label>
            <div className="update-controls">
              <select 
                id="status-select" 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Aberto">Aberto</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluído">Concluído</option>
              </select>
              <button className="btn-save" onClick={handleStatusUpdate}>Salvar</button>
            </div>
          </div>
        )}

        

        {/* RODAPÉ DO MODAL */}
        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Fechar</button>
        </div>

      </div>
    </div>
  );
}