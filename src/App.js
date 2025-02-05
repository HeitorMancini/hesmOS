import { useState } from "react";
import "98.css";
import "./Global.css";
import Janela from "./components/Janela";
import Taskbar from "./components/Taskbar";
import sobreIcon from "./assets/sobre.png";
import projetosIcon from "./assets/projetos.png";
import contatoIcon from "./assets/contato.png";

function App() {
    const [janelasAbertas, setJanelasAbertas] = useState([]);
    const [ordemZ, setOrdemZ] = useState(1);

    const icones = [
        { id: "sobre", nome: "Sobre", imagem: sobreIcon, conteudo: "Informações sobre mim." },
        { id: "projetos", nome: "Projetos", imagem: projetosIcon, conteudo: "Aqui estão meus projetos." },
        { id: "contato", nome: "Contato", imagem: contatoIcon, conteudo: "Como me contatar." }
    ];

    const abrirJanela = (id) => {
        if (!janelasAbertas.some(j => j.id === id)) {
            setJanelasAbertas(prev => [
                ...prev,
                { id, titulo: icones.find(i => i.id === id).nome, conteudo: icones.find(i => i.id === id).conteudo, zIndex: ordemZ }
            ]);
            setOrdemZ(ordemZ + 1);
        } else {
            trazerParaFrente(id);
        }
    };

    const fecharJanela = (id) => {
        setJanelasAbertas(janelasAbertas.filter(j => j.id !== id));
    };

    const trazerParaFrente = (id) => {
        setJanelasAbertas(prev => 
            prev.map(j => j.id === id ? { ...j, zIndex: ordemZ } : j)
        );
        setOrdemZ(ordemZ + 1);
    };

    return (
        <div className="w-screen h-screen bg-[#008080] flex flex-col p-4 relative">
            <div className="absolute left-4 top-4 icones-container flex flex-col gap-4">
                {icones.map(icone => (
                    <div key={icone.id} className="flex icone flex-col items-center cursor-pointer p-2"
                        onDoubleClick={() => abrirJanela(icone.id)}>
                        <img src={icone.imagem} alt={icone.nome} className="w-12 h-12 ico" />
                        <span className="text-white text-sm">{icone.nome}</span>
                    </div>
                ))}
            </div>

            {janelasAbertas.map(janela => (
                <Janela
                    key={janela.id}
                    id={janela.id}
                    titulo={janela.titulo}
                    conteudo={janela.conteudo}
                    fechar={() => fecharJanela(janela.id)}
                    trazerParaFrente={() => trazerParaFrente(janela.id)}
                    zIndex={janela.zIndex}
                />
            ))}

            <Taskbar />
        </div>
    );
}

export default App;
