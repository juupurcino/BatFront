import '../css/cardHistMaquina.css';

interface BotaoMaqProps {
  texto: string;
  tipo?: 'finalizado' | 'aberto' | 'em-andamento'; 
}

export default function BotaoMaq({ texto = "aberto", tipo = 'aberto' }: BotaoMaqProps) {
  return (
    <button className={`botao-maq ${tipo}`}>
      {texto}
    </button>
  );
}
