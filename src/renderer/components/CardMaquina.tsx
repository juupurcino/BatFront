import { useState } from 'react';
import '../css/maquina.css';
import { useUser } from '../components/UserContext';

interface CardMaquinaProps {
  id: number;
  descricao: string;
  dataCompra: string;
  idSetor: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function CardMaquina({ id, descricao, dataCompra, idSetor, onDelete, onEdit }: CardMaquinaProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const { user } = useUser();

  const dataFormatada = new Date(dataCompra).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const toggleMenu = () => setMenuAberto(!menuAberto);
  const podeEditarExcluir = user?.funcao === 4 || user?.funcao === 5;

  return (
    <div className="card-chamado">
      <div className="coluna-esquerda">
        <strong className='id'><div className='hash'>#</div>{id}</strong>
        <strong>{descricao}</strong>
      </div>

      <div className="coluna-centro">
        <p><strong>Data compra:</strong>&nbsp;{dataFormatada}</p>
      </div>

      <div className="coluna-direita">

        {podeEditarExcluir && (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '5px'
              }}
              onClick={toggleMenu}
            >
              &#8943;
            </button>
            <p className="data"><strong>{idSetor}</strong></p>

            {menuAberto && (
              <div
                style={{
                  position: 'absolute',
                  top: '30px',
                  right: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  zIndex: 10
                }}
              >
                {onEdit && (
                  <button
                    onClick={() => {
                      setMenuAberto(false);
                      onEdit();
                    }}
                    style={{
                      display: 'block',
                      padding: '8px 12px',
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      setMenuAberto(false);
                      onDelete();
                    }}
                    style={{
                      display: 'block',
                      padding: '8px 12px',
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'red'
                    }}
                  >
                    Excluir
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
