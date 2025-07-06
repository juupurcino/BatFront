import '../css/maquina.css';
import { useUser } from '../components/UserContext';

interface CardMaquinaProps {
  id: number;
  descricao: string;
  dataCompra: string;
  idSetor: string;
  onDelete?: () => void;
}

export default function CardChamado({ id, descricao, dataCompra, idSetor, onDelete }: CardMaquinaProps) {

  const dataFormatada = new Date(dataCompra).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year:
      'numeric',
  });

  const { user } = useUser();
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
        <p className="data"><strong>{idSetor}</strong></p>
        <div className='abrir-chamado'>
            {(user?.funcao === 4 || user?.funcao === 5) && (
                onDelete && (
                  <button
                    style={{
                      marginTop: '10px',
                      backgroundColor: '#c62828',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={onDelete}
                  >
                    Excluir
                  </button>
                ))}
          </div>
      </div>
    </div>
  );
};

