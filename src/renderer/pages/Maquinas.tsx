import { useEffect, useState } from 'react';
import Menu from '../components/Menu';
import CardMaquina from '../components/CardMaquina';
import CardHistMaquina from '../components/CardHistMaquina';
import '../css/maquina.css';
import Modal from '../components/Modal';
import arrow from '../../../assets/arrow.png';
import filtro from '../../../assets/filter.png'; // Import the filter icon
import { useUser } from '../components/UserContext';

// --- INTERFACES ---
interface IMaquina {
  ID: number;
  Descricao: string;
  DataCompra: string;
  Setor: string;
}

interface IChamado {
  Id: number;
  Descricao: string;
  StatusCurrent: string;
  NomeTecnico: string;
  NomeFuncionario: string;
  DataCriacao: Date;
  Nivel: string;
  IDMaquina: number;
  Feedback: string;
}

interface ISetor {
  id: number;
  nome: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [maquinaSelecionadaId, setMaquinaSelecionadaId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false); // State for filter modal

  const [maquinas, setMaquinas] = useState<IMaquina[]>([]);
  const [chamados, setChamadosTodos] = useState<IChamado[]>([]);
  const [setores, setSetores] = useState<ISetor[]>([]);
  const [maquinasFiltradas, setMaquinasFiltradas] = useState<IMaquina[]>([]); // State for filtered machines

  const [novaDescricao, setNovaDescricao] = useState('');
  const [novaDataCompra, setNovaDataCompra] = useState('');
  const [novoSetorId, setNovoSetorId] = useState('');

  // --- States for Search and Filter ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetorId, setSelectedSetorId] = useState(''); // State for sector filter dropdown

  const fetchMaquinas = () => {
    fetch('http://localhost:5000/maquinas')
      .then(response => response.json())
      .then(data => {
        setMaquinas(data);
        setMaquinasFiltradas(data); // Initialize filtered machines with all machines
      })
      .catch(error => console.error('Erro ao buscar máquinas:', error));
  };

  useEffect(() => {
    fetchMaquinas();

    fetch('http://localhost:5000/chamados')
      .then(response => response.json())
      .then(data => setChamadosTodos(data))
      .catch(error => console.error('Erro ao buscar chamados:', error));

    fetch('http://localhost:5000/setores')
      .then(res => res.json())
      .then(setSetores);
  }, []);

  // --- Filter Logic ---
  useEffect(() => {
    let filtered = maquinas;

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(maquina =>
        Object.values(maquina).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sector filter
    if (selectedSetorId) {
      const selectedSetorName = setores.find(setor => setor.id === parseInt(selectedSetorId))?.nome;
      if (selectedSetorName) {
        filtered = filtered.filter(maquina => maquina.Setor === selectedSetorName);
      }
    }

    setMaquinasFiltradas(filtered);
    setCurrentPage(1); // Reset pagination when filters change
  }, [searchTerm, selectedSetorId, maquinas, setores]); // Depend on maquinas and setores for initial load and updates

  const handleSelecionarMaquina = (id: number) => {
    setMaquinaSelecionadaId((prev) => (prev === id ? null : id));
  };

  const handleCadastrarMaquina = (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaDescricao || !novaDataCompra || !novoSetorId) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }

    const novaMaquina = {
      Descricao: novaDescricao,
      DataCompra: novaDataCompra,
      IDSetor: parseInt(novoSetorId, 10)
    };

    fetch('http://localhost:5000/maquinas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaMaquina)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Falha ao cadastrar máquina');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message);
        setModalOpen(false);
        fetchMaquinas(); // Re-fetch machines after successful registration
        setNovaDescricao('');
        setNovaDataCompra('');
        setNovoSetorId('');
      })
      .catch(error => {
        console.error('Erro ao cadastrar máquina:', error);
        alert('Ocorreu um erro ao cadastrar a máquina. Verifique o console.');
      });
  };

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of machines per page

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = maquinasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(maquinasFiltradas.length / itemsPerPage);
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);
  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // --- Handlers for Filter Modal ---
  const handleApplyFilter = () => {
    setFilterModalOpen(false);
  };

  const handleClearFilter = () => {
    setSelectedSetorId('');
    setFilterModalOpen(false);
  };

  const excluirMaquina = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta máquina?')) {
      fetch(`http://localhost:5000/maquinas/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Erro ao excluir máquina');
          }
          fetchMaquinas(); // Atualiza a lista após excluir
        })
        .catch((err) => {
          console.error(err);
          alert('Erro ao excluir máquina. Verifique o console.');
        });
    }
  };

  const { user } = useUser();

  return (
    <div className="app-container">
      <Menu />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Cadastrar Nova Máquina">
        <form onSubmit={handleCadastrarMaquina}>
          <div className="cadastro-modal-body">
            <label htmlFor="nome-maquina">Nome da máquina</label>
            <input
              id="nome-maquina"
              type="text"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
              required
            />

            <label htmlFor="data-compra">Data da compra</label>
            <input
              id="data-compra"
              type="date"
              value={novaDataCompra}
              onChange={(e) => setNovaDataCompra(e.target.value)}
              required
            />

            <label htmlFor="setor">Setor</label>
            <select
              name="setor"
              id="setor"
              value={novoSetorId}
              onChange={(e) => setNovoSetorId(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um setor</option>
              {setores.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="cadastro-modal-footer">
            <button className="btn-cadastrar" type="submit">Cadastrar</button>
          </div>
        </form>
      </Modal>

      {/* Filter Modal */}
      <Modal isOpen={isFilterModalOpen} onClose={() => setFilterModalOpen(false)} title="Filtrar Máquinas por Setor">
        <div className="filtro-modal-body">
          <label htmlFor="filter-setor">Setor</label>
          <select
            id="filter-setor"
            value={selectedSetorId}
            onChange={(e) => setSelectedSetorId(e.target.value)}
          >
            <option value="">Todos</option>
            {setores.map((setor) => (
              <option key={setor.id} value={setor.id}>
                {setor.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="filtro-modal-footer">
          <button onClick={handleClearFilter} className="btn-limpar">Limpar</button>
          <button onClick={handleApplyFilter} className="btn-salvar-filtro">Aplicar Filtro</button>
        </div>
      </Modal>

      <main className="main">
        <div className='controls-container'> {/* New container for controls */}
          <div className='search-and-filter'>
            <input
              type="text"
              placeholder="Pesquisar por qualquer coisa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <button onClick={() => setFilterModalOpen(true)} className='but_filtro'>
              <img src={filtro} alt="Filtrar Máquinas por Setor" />
            </button>
          </div>
          <div className='abrir-chamado'>
            {(user?.funcao === 4 || user?.funcao === 5) && (
                <button type="button" onClick={() => setModalOpen(true)}>Cadastrar Máquina</button>
              )}
            
          </div>
        </div>

        <div className="maquinas">
          {currentItems.length > 0 ? (
            currentItems.map((maquina) => (
              <div key={maquina.ID} className="card-container">
                <div onClick={() => handleSelecionarMaquina(maquina.ID)}>
                  <CardMaquina
                    id={maquina.ID}
                    descricao={maquina.Descricao}
                    dataCompra={maquina.DataCompra}
                    idSetor={maquina.Setor}
                    onDelete={() => {
                      if (window.confirm('Tem certeza que deseja excluir esta máquina?')) {
                        fetch(`http://localhost:5000/maquinas/${maquina.ID}`, {
                          method: 'DELETE',
                        })
                          .then(response => {
                            if (!response.ok) throw new Error('Erro ao excluir');
                            return response.json();
                          })
                          .then(() => fetchMaquinas()) 
                          .catch(error => {
                            console.error('Erro ao excluir máquina:', error);
                            alert('Erro ao excluir máquina. Verifique o console.');
                          });
                      }
                    }}
                  />

                </div>

                <div
                  className={`historico ${maquinaSelecionadaId === maquina.ID ? 'aberto' : ''}`}
                >
                  {maquinaSelecionadaId === maquina.ID && (
                    <>
                      <h4>Histórico de Chamados</h4>
                      {chamados.filter((chamado) => chamado.IDMaquina === maquina.ID).length > 0 ? (
                        chamados
                          .filter((chamado) => chamado.IDMaquina === maquina.ID)
                          .map((chamado) => (
                            <CardHistMaquina
                              key={chamado.Id}
                              id={chamado.Id}
                              dataChamado={chamado.DataCriacao}
                              funcionario={chamado.NomeFuncionario}
                              tecnico={chamado.NomeTecnico}
                              descricao={chamado.Descricao}
                              feedback={chamado.Feedback}
                            />
                          ))
                      ) : (
                        <p>Nenhum chamado encontrado para esta máquina.</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Nenhuma máquina encontrada com os critérios de pesquisa/filtro.</p>
          )}
        </div>
        {maquinasFiltradas.length > 0 &&
          <div className="pagination">
            <button onClick={goPrev} disabled={currentPage === 1}><img src={arrow} alt="Anterior" className="arrow left" /></button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx + 1} onClick={() => goToPage(idx + 1)} className={idx + 1 === currentPage ? 'active' : ''}>
                {idx + 1}
              </button>
            ))}
            <button onClick={goNext} disabled={currentPage === totalPages || totalPages === 0}><img src={arrow} alt="Próximo" className="arrow right" /></button>
          </div>
        }
      </main>
    </div>
  );
}