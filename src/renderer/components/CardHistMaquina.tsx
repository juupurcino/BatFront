import '../css/cardHistMaquina.css';
import BotaoMaq from './BotaoMaq';
import hist from '../../../assets/history.png';

interface HistoricoItem {
  texto: string;
  data: string;
}

interface CardMaquinasProps {
  id: number;
  dataChamado: Date;
  funcionario: string;
  tecnico: string;
  descricao: string;
  feedback: string;
  // historico: HistoricoItem[];
}

function mapTextoParaTipo(
  texto: string,
): 'aberto' | 'em-andamento' | 'finalizado' {
  const lower = texto.toLowerCase();

  if (lower === 'chamado aberto') return 'aberto';
  if (lower === 'chamado em andamento') return 'em-andamento';
  if (lower === 'chamado finalizado') return 'finalizado';

  return 'aberto';
}

export default function CardHistMaquina({
  id,
  dataChamado,
  funcionario,
  tecnico,
  descricao,
  feedback,
  // historico,
}: CardMaquinasProps) {

  const dataFormatada = new Date(dataChamado).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year:
     'numeric',
  });

  return (
    <div className="mainCard" key={id}>
      <div className="tempo">
        <div className="bolaTempo">
          <img src={hist}></img>
        </div>
        <div className="linhaTempo"></div>
      </div>

      <div className="arruma">
        <div className="data">{dataFormatada}</div>

        <div className="pagCard">
          <div className="card">
            <div className="desc">
              <div className="fontBold">Chamado aberto por:</div>
              <div className="font">{funcionario}</div>
            </div>
            <div className="desc">
              <div className="fontBold">Descrição:</div>
              <div className="inputDesc">{descricao}</div>
            </div>
            <div className="desc">
              <div className="fontBold">Feedback:</div>
              <div className="inputDesc">{feedback}</div>
            </div>
            <div className="desc">
              <div className="fontBold">Técnico:</div>
              <div className="font">{tecnico}</div>
            </div>
          </div>

          {/* <div className="cardHist">
            <div className="fontBold">Histórico</div>
            {historico.length > 0 ? (
              historico.map((item, index) => (
                <div className="arrumaHist" key={index}>
                  <BotaoMaq
                    texto={item.texto}
                    tipo={mapTextoParaTipo(item.texto)}
                  />
                  <div className="data">- {item.data}</div>
                </div>
              ))
            ) : (
              <div className="semHistorico">Sem histórico disponível.</div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
