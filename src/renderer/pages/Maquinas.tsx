// Maquinas.tsx
import { useEffect, useState } from 'react';
import Menu from '../components/Menu';
import CardMaquina from '../components/CardMaquina';
import CardHistMaquina from '../components/CardHistMaquina';
import '../css/maquina.css';
import Modal from '../components/Modal';
import arrow from '../../../assets/arrow.png';
import filtro from '../../../assets/filter.png'; // Import the filter icon
import { useUser } from '../components/UserContext';
import SkeletonCard from '../components/SkeletonCard';

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

export default function App() {
  const [maquinaSelecionadaId, setMaquinaSelecionadaId] = useState<
    number | null
  >(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [maquinas, setMaquinas] = useState<IMaquina[]>([]);
  const [chamados, setChamadosTodos] = useState<IChamado[]>([]);
  const [setores, setSetores] = useState<ISetor[]>([]);
  const [maquinasFiltradas, setMaquinasFiltradas] = useState<IMaquina[]>([]);
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novaDataCompra, setNovaDataCompra] = useState('');
  const [novoSetorId, setNovoSetorId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSetorId, setSelectedSetorId] = useState('');

  const fetchMaquinas = () => {
    fetch('https://batback.onrender.com/maquinas')
      .then((response) => response.json())
      .then((data) => {
        setMaquinas(data);
        setMaquinasFiltradas(data);
      })
      .catch((error) => console.error('Erro ao buscar máquinas:', error));
  };

  useEffect(() => {
    fetchMaquinas();
    fetch('https://batback.onrender.com/chamados')
      .then((response) => response.json())
      .then((data) => setChamadosTodos(data))
      .catch((error) => console.error('Erro ao buscar chamados:', error));
    fetch('https://batback.onrender.com/setores')
      .then((res) => res.json())
      .then(setSetores);
  }, []);

  useEffect(() => {
    let filtered = maquinas;
    if (searchTerm) {
      filtered = filtered.filter((maquina) =>
        Object.values(maquina).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
    if (selectedSetorId) {
      const selectedSetorName = setores.find(
        (setor) => setor.id === parseInt(selectedSetorId),
      )?.nome;
      if (selectedSetorName) {
        filtered = filtered.filter(
          (maquina) => maquina.Setor === selectedSetorName,
        );
      }
    }
    setMaquinasFiltradas(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedSetorId, maquinas, setores]);

  const handleSelecionarMaquina = (id: number) => {
    setMaquinaSelecionadaId((prev) => (prev === id ? null : id));
  };

  const handleEditarMaquina = (maquina: IMaquina) => {
    setNovaDescricao(maquina.Descricao);
    setNovaDataCompra(maquina.DataCompra);
    const setor = setores.find((s) => s.nome === maquina.Setor);
    setNovoSetorId(setor ? String(setor.id) : '');
    setMaquinaSelecionadaId(maquina.ID);
    setModalOpen(true);
  };

  const handleCadastrarOuEditarMaquina = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaDescricao || !novaDataCompra || !novoSetorId) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }
    const dadosMaquina = {
      Descricao: novaDescricao,
      DataCompra: novaDataCompra,
      IDSetor: parseInt(novoSetorId, 10),
    };
    const method = maquinaSelecionadaId ? 'PUT' : 'POST';
    const url = maquinaSelecionadaId
      ? `https://batback.onrender.com/maquinas/${maquinaSelecionadaId}`
      : 'https://batback.onrender.com/maquinas';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosMaquina),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao salvar máquina');
        return response.json();
      })
      .then(() => {
        fetchMaquinas();
        setModalOpen(false);
        setNovaDescricao('');
        setNovaDataCompra('');
        setNovoSetorId('');
        setMaquinaSelecionadaId(null);
      })
      .catch((error) => {
        console.error('Erro ao salvar máquina:', error);
        alert('Erro ao salvar máquina. Verifique o console.');
      });
  };

  const excluirMaquina = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta máquina?')) {
      fetch(`https://batback.onrender.com/maquinas/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) throw new Error('Erro ao excluir máquina');
          fetchMaquinas();
        })
        .catch((err) => {
          console.error(err);
          alert('Erro ao excluir máquina. Verifique o console.');
        });
    }
  };

  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = maquinasFiltradas.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(maquinasFiltradas.length / itemsPerPage);
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);
  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleApplyFilter = () => setFilterModalOpen(false);
  const handleClearFilter = () => {
    setSelectedSetorId('');
    setFilterModalOpen(false);
  };

  return (
    <div className="app-container">
      <Menu />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Cadastrar Nova Máquina"
      >
        <form onSubmit={handleCadastrarOuEditarMaquina}>
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
              id="setor"
              value={novoSetorId}
              onChange={(e) => setNovoSetorId(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione um setor
              </option>
              {setores.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="cadastro-modal-footer">
            <button className="btn-cadastrar" type="submit">
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      <main className="main">
        <div className="controls-container">
          <div className="search-and-filter">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <button
              onClick={() => setFilterModalOpen(true)}
              className="but_filtro"
            >
              <img src={filtro} alt="Filtrar" />
            </button>
          </div>
          <div className='abrir-chamado'>
            {(user?.funcao === 4 || user?.funcao === 5) && (
                <button type="button" onClick={() => setModalOpen(true)}>Cadastrar Máquina</button>
              )}
            
          </div>
        </div>

        <div className="maquinas">
          {maquinas.length === 0 ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            currentItems.map((maquina) => (
  <div key={maquina.ID} className="card-container">
    <div onClick={() => handleSelecionarMaquina(maquina.ID)}>
      <CardMaquina
        id={maquina.ID}
        descricao={maquina.Descricao}
        dataCompra={maquina.DataCompra}
        idSetor={maquina.Setor}
        onDelete={() => excluirMaquina(maquina.ID)}
        onEdit={() => handleEditarMaquina(maquina)}
      />
      </div>

      {/* Histórico de chamados */}
      <div className={`historico ${maquinaSelecionadaId === maquina.ID ? 'aberto' : ''}`}>
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

          )}
        </div>

        

        {maquinasFiltradas.length > 0 && (
          <div className="pagination">
            <button onClick={goPrev} disabled={currentPage === 1}>
              <img src={arrow} alt="Anterior" className="arrow left" />
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => goToPage(idx + 1)}
                className={idx + 1 === currentPage ? 'active' : ''}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={goNext}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <img src={arrow} alt="Próximo" className="arrow right" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
