import React, { useState, useEffect } from 'react';
import '../css/chamado.css';
import Menu from '../components/Menu';
import CardChamado from '../components/CardChamado';
import Modal from '../components/Modal';
import Chamado from '../components/Chamado';
import { useUser } from '../components/UserContext';

import filtro from '../../../assets/filter.png';
import arrow from '../../../assets/arrow.png';
import SkeletonCard from '../components/SkeletonCard';

interface IChamado {
  ID: number;
  Descricao: string;
  StatusCurrent: string;
  NomeTecnico: string;
  IDTecnico: number;
  NomeFuncionario: string;
  DataCriacao: Date;
  Nivel: string;
  IDMaquina: number;
  Feedback: string;
  JustificativaCancelamento?: string;
}

interface ISelectOption {
  id: number;
  nome: string;
}

interface IMaquinaOption {
  id: number;
  descricao: string;
}

export default function Chamados() {
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState('todos');
  const [chamadosTodos, setChamadosTodos] = useState<IChamado[]>([]);
  const [chamadosMeus, setChamadosMeus] = useState<IChamado[]>([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState<IChamado[]>([]);

  const [isNovoChamadoModalOpen, setNovoChamadoModalOpen] = useState(false);
  const [isDetalheChamadoModalOpen, setDetalheChamadoModalOpen] = useState(false);
  const [isFiltroModalOpen, setFiltroModalOpen] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState<IChamado | null>(null);

  const initialFilters = { prioridade: '', tecnico: '', maquina: '' };
  const [filtrosSelecionados, setFiltrosSelecionados] = useState(initialFilters);
  const [filtrosAtivos, setFiltrosAtivos] = useState(initialFilters);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [setores, setSetores] = useState<ISelectOption[]>([]);
  const [maquinas, setMaquinas] = useState<IMaquinaOption[]>([]);
  const [tecnicos, setTecnicos] = useState<ISelectOption[]>([]);
  const [ordenacaoData, setOrdenacaoData] = useState<'maisRecentes' | 'maisAntigos'>('maisRecentes');
  const [formData, setFormData] = useState({
    setor: '',
    maquina: '',
    tecnico: '',
    nivel: '',
    descricao: '',
  });

  const carregarChamados = () => {
    fetch('https://batback.onrender.com/chamados')
      .then((response) => response.json())
      .then((data: IChamado[]) => {
        setChamadosTodos(Array.isArray(data) ? data : []);
        setChamadosMeus(
          Array.isArray(data)
            ? data.filter((c: IChamado) =>
                user?.ruf ? c.IDTecnico === user.ruf : c.NomeTecnico === user?.nome
              )
            : []
        );
      })
      .catch((error) => console.error('Erro ao buscar chamados:', error));
  };

  useEffect(() => {
    fetch('https://batback.onrender.com/setores')
      .then((res) => res.json())
      .then(setSetores);
    fetch('https://batback.onrender.com/tecnicos')
      .then((res) => res.json())
      .then(setTecnicos);

    carregarChamados();
  }, [user]);

  useEffect(() => {
    if (formData.setor) {
      fetch(`https://batback.onrender.com/maquinas/${formData.setor}`)
        .then((res) => res.json())
        .then(setMaquinas);
    } else {
      setMaquinas([]);
    }
  }, [formData.setor]);

  useEffect(() => {
    const baseList = activeTab === 'todos' ? chamadosTodos : chamadosMeus;

    const filtrados = baseList?.filter((chamado) => {
      const matchPrioridade = !filtrosAtivos.prioridade || chamado.Nivel === filtrosAtivos.prioridade;
      const matchTecnico = !filtrosAtivos.tecnico || chamado.NomeTecnico === filtrosAtivos.tecnico;
      return matchPrioridade && matchTecnico;
    }) || [];

    const ordenados = filtrados.sort((a, b) => {
      const dataA = new Date(a.DataCriacao).getTime();
      const dataB = new Date(b.DataCriacao).getTime();
      return ordenacaoData === 'maisRecentes' ? dataB - dataA : dataA - dataB;
    });

    setChamadosFiltrados(ordenados);
  }, [chamadosTodos, chamadosMeus, activeTab, filtrosAtivos, ordenacaoData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtrosAtivos, activeTab]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltrosSelecionados((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvarFiltros = () => {
    setFiltrosAtivos(filtrosSelecionados);
    setFiltroModalOpen(false);
  };

  const handleLimparFiltros = () => {
    setFiltrosSelecionados(initialFilters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNovoChamado = async () => {
    const { descricao, nivel, tecnico, maquina } = formData;
    if (!descricao || !nivel || !tecnico || !maquina) {
      alert('Preencha todos os campos.');
      return;
    }
    const chamadoData = {
      Descricao: descricao,
      IDFuncionario: user?.ruf,
      IDTecnico: parseInt(tecnico),
      IDStatus: 3,
      IDDificuldade: parseInt(nivel),
      IDMaquina: parseInt(maquina),
    };
    try {
      const response = await fetch('https://batback.onrender.com/chamados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chamadoData),
      });
      if (response.ok) {
        alert('Chamado aberto com sucesso!');
        setNovoChamadoModalOpen(false);
        carregarChamados();
      } else {
        alert('Erro ao abrir chamado.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de rede.');
    }
  };

  const openDetalheChamadoModal = (chamado: IChamado) => {
    setSelectedChamado(chamado);
    setDetalheChamadoModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chamadosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(chamadosFiltrados.length / itemsPerPage);

  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);
  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Chamado
        isOpen={isDetalheChamadoModalOpen}
        onClose={() => {
          setDetalheChamadoModalOpen(false);
          carregarChamados();
        }}
        chamado={selectedChamado}
        user={user}
      />
      <Modal
        isOpen={isNovoChamadoModalOpen}
        onClose={() => setNovoChamadoModalOpen(false)}
        title="Abrir Chamado"
      >
        <div className="modal">
          <label>Setor</label>
          <select
            name="setor"
            value={formData.setor}
            onChange={handleInputChange}
          >
            <option value="">Selecione</option>
            {setores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>

          <label>Máquina</label>
          <select
            name="maquina"
            value={formData.maquina}
            onChange={handleInputChange}
            disabled={!formData.setor}
          >
            <option value="">Selecione</option>
            {maquinas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.descricao}
              </option>
            ))}
          </select>

          <label>Técnico</label>
          <select
            name="tecnico"
            value={formData.tecnico}
            onChange={handleInputChange}
          >
            <option value="">Selecione</option>
            {tecnicos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>

          <label>Prioridade</label>
          <select
            name="nivel"
            value={formData.nivel}
            onChange={handleInputChange}
          >
            <option value="">Selecione</option>
            <option value="1">Alta</option>
            <option value="2">Média</option>
            <option value="3">Baixa</option>
          </select>

          <label>Descrição</label>
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
          />

          <button className="button" onClick={handleSubmitNovoChamado}>
            Abrir chamado
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isFiltroModalOpen}
        onClose={() => setFiltroModalOpen(false)}
        title="Filtrar Chamados"
      >
        <div className="filtro-modal-body">
          <label htmlFor="filtro-prioridade">Prioridade</label>
          <select
            id="filtro-prioridade"
            name="prioridade"
            value={filtrosSelecionados.prioridade}
            onChange={handleFiltroChange}
          >
            <option value="">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>

          <label htmlFor="filtro-tecnico">Técnico Responsável</label>
          <select
            id="filtro-tecnico"
            name="tecnico"
            value={filtrosSelecionados.tecnico}
            onChange={handleFiltroChange}
          >
            <option value="">Todos</option>
            {tecnicos.map((t) => (
              <option key={t.id} value={t.nome}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="filtro-modal-footer">
          <button onClick={handleLimparFiltros} className="btn-limpar">
            Limpar
          </button>
          <button onClick={handleSalvarFiltros} className="btn-salvar-filtro">
            Salvar Filtros
          </button>
        </div>
      </Modal>

      {/* --- Estrutura da Página Principal --- */}
      <Menu />
      <div className="abaChamado">
        <div className="container-chamados">
          <h1>Chamados</h1>

          <div className="mini-navbar">
            <button
              className={`tab-button ${activeTab === 'todos' ? 'active' : ''}`}
              onClick={() => setActiveTab('todos')}
            >
              Todos
            </button>
            <button
              className={`tab-button ${activeTab === 'meus' ? 'active' : ''}`}
              onClick={() => setActiveTab('meus')}
            >
              Meus
            </button>
          </div>

          <div className="conteudo-chamado">
            <div className="filter">
              <div className="ordenacao-container">
                <label htmlFor="ordenar-data">Ordenar por:</label>
                <select
                  id="ordenar-data"
                  value={ordenacaoData}
                  onChange={(e) =>
                    setOrdenacaoData(
                      e.target.value as 'maisRecentes' | 'maisAntigos',
                    )
                  }
                >
                  <option value="maisRecentes">Mais Recentes</option>
                  <option value="maisAntigos">Mais Antigos</option>
                </select>
              </div>

              <div className="acoes-direita">
                <button
                  onClick={() => setFiltroModalOpen(true)}
                  className="but_filtro"
                  title="Filtrar Chamados"
                >
                  <img src={filtro} alt="Filtrar Chamados" />
                </button>
                {(user?.funcao === 1 || user?.funcao === 4) && (
                  <button
                    onClick={() => setNovoChamadoModalOpen(true)}
                    className="abrir"
                  >
                    Abrir Chamado
                  </button>
                )}
              </div>
            </div>

            <div className="chamados">
              {chamadosTodos.length === 0 ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                currentItems.map((chamado) => (
                  <CardChamado
                    key={chamado.ID}
                    titulo={chamado.Descricao}
                    status={chamado.StatusCurrent}
                    responsavel={chamado.NomeTecnico}
                    autor={chamado.NomeFuncionario}
                    data={chamado.DataCriacao}
                    prioridade={chamado.Nivel}
                    onClick={() => openDetalheChamadoModal(chamado)}
                  />
                ))
              )}
              {chamadosTodos.length > 0 && currentItems.length === 0 && (
                <p>Nenhum chamado encontrado para os filtros selecionados.</p>
              )}
            </div>

            {currentItems.length >= 1 && (
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
          </div>
        </div>
      </div>
    </>
  );
}
