import '../css/menu.css'

import linha from '../../../assets/linha.jpg'
import logo from '../../../assets/logo.png'
import notification from '../../../assets/notification.png'
import { Link, Route, Routes } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Notification from './Notification';
import React, { useEffect, useState } from 'react';

import { useUser } from "./UserContext";

function getNotificacoesPorFuncao(funcao : any) {
  switch (funcao) {
    case 1: // Operador
      return [
        "✅ Técnico iniciou o chamado #123 - Máquina Injetora 3",
        "🔄 Chamado #456 atualizado para 'Em análise'",
        "🔧 Chamado #789 está aguardando peça",
        "✅ Chamado #321 foi finalizado com sucesso",
        "📅 Manutenção preventiva da sua máquina agendada para amanhã às 10h",
        "📢 Máquina 4 liberada para operação",
        "⚠️ Aviso: Máquina 6 com vibração excessiva detectada",
        "🚫 Chamado #334 reprovado por falta de informação",
        "🔍 Técnico solicitou mais detalhes sobre o problema da Máquina 9",
        "📝 Checklist diário de operação pendente",
      ];
    case 2: // Técnico Mecânica
    return [
      "📢 Novo chamado atribuído: Máquina 5 - Prensa Hidráulica",
      "⚠️ Chamado #222 cancelado pelo operador",
      "🛠️ Chamado #789 marcado como urgente",
      "🔧 Nova solicitação de manutenção - Linha 2",
      "📅 Lembrete: preventiva da Linha 1 às 14h",
      "🛞 Troca de correia solicitada na Esteira 3",
      "📈 Frequência alta de falhas na Máquina 7 - investigar",
      "🧰 Ferramenta especial disponível na oficina",
      "⛓️ Lubrificação pendente em corrente da Máquina 10",
      "🔩 Técnico elétrico designado como apoio no chamado #654",
    ];
    case 3: // Técnico Elétrica
      return [
        "📢 Novo chamado atribuído: Quadro de Comando - Setor A",
        "⚠️ Chamado #543 cancelado pelo operador",
        "⚡ Alerta: queda de energia na Máquina 8 - Verificar URGENTE",
        "🔌 Chamado #999 requer verificação de sensor de presença",
        "🧰 Ferramentas calibradas prontas para retirada",
        "🔦 Luz de segurança falhando na Linha 4",
        "📉 Oscilação de tensão detectada no Setor B",
        "🛑 Motor da Máquina 11 com sobreaquecimento",
        "📡 Verificar conexão de rede da balança automática",
        "🔋 UPS ativado automaticamente às 16h42",
      ];
    case 5: // Supervisor de Turno (líder)
      return [
        "⏰ Chamado #456 está há 37 minutos em aberto",
        "⏰ Chamado #789 sem atualização há 52 minutos",
        "📈 Linha 2 apresentou 3 chamados seguidos hoje",
        "📊 Relatório de eficiência do turno disponível",
        "🔍 Técnico #002 não alterou status há 45min",
        "📢 Técnico indisponível - realocar chamado #882",
        "🟡 Linha 3 operando abaixo da meta de produtividade",
        "📝 Validação de chamados pendentes de ontem",
        "🔄 Turno anterior deixou observações no chamado #322",
        "📅 Reunião de rotina com engenheiro às 14h",
      ];
    case 4: // Engenheiro de Produção (sem notificações simuladas por agora)
    default:
      return ["Sem notificações disponíveis."];
  }
}


function Menu() {
  const [isModalOpen, setModalOpen] = useState(false);

  const { user } = useUser();

    return (
      <>
        <Notification
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Notificações">
          <div className='modal'>
            {user && getNotificacoesPorFuncao(user.funcao).map((notificacao, index) => (
              <div>
                <p key={index}>{notificacao}</p>
                <hr />
              </div>
            ))}
          </div>
        </Notification>
        <div className='AbaSuperior'>
          <img alt="icon" src={linha} className='Imagem'/>
          <div className='Logo'>
            <img src={logo} alt="BatBrasil"/>
          </div>
        </div>
        <div className='Menu'>
          <div className='Y'>
          <NavLink to="/home" className={({ isActive }) => isActive ? 'text_menu active' : 'text_menu'}>Dashboards</NavLink>
          <NavLink to="/chamados" className={({ isActive }) => isActive ? 'text_menu active' : 'text_menu'}>Chamados</NavLink>
          <NavLink to="/maquinas" className={({ isActive }) => isActive ? 'text_menu active' : 'text_menu'}>Máquinas</NavLink>
          </div>

          <div className='Not'>            
            {user && <h3>{user.nome}</h3>}
            <button onClick={() => setModalOpen(true)}><img src={notification} alt="notifications" /></button>
            <Link to="/" className='text_menu'>Sair</Link>
          </div>
        </div>
      </>
    );
}

export default Menu;