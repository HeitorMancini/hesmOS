import { useState, useRef, useEffect } from "react";
import "98.css";
import "../Global.css";

const Janela = ({ id, titulo, conteudo, fechar, trazerParaFrente, zIndex }) => {
    const janelaRef = useRef(null);
    const [posicao, setPosicao] = useState({ x: 100, y: 100 });
    const [arrastando, setArrastando] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const iniciarArrasto = (e) => {
        if (e.target.closest(".title-bar-controls")) return;
        setArrastando(true);
        setOffset({ x: e.clientX - posicao.x, y: e.clientY - posicao.y });
        trazerParaFrente(); // Traz a janela para frente ao clicar
    };

    const arrastar = (e) => {
        if (arrastando) {
            setPosicao({ x: e.clientX - offset.x, y: e.clientY - offset.y });
        }
    };

    const pararArrasto = () => {
        setArrastando(false);
    };

    useEffect(() => {
        if (arrastando) {
            document.addEventListener("mousemove", arrastar);
            document.addEventListener("mouseup", pararArrasto);
        } else {
            document.removeEventListener("mousemove", arrastar);
            document.removeEventListener("mouseup", pararArrasto);
        }

        return () => {
            document.removeEventListener("mousemove", arrastar);
            document.removeEventListener("mouseup", pararArrasto);
        };
    }, [arrastando]);

    return (
        <div
            ref={janelaRef}
            className="window" // Aplica a classe minimizada
            style={{
                width: "300px",
                left: `${posicao.x}px`,
                top: `${posicao.y}px`,
                zIndex: zIndex,
                position: "absolute",
            }}
            onMouseDown={trazerParaFrente} // Traz a janela para frente ao clicar
        >
            <div className="title-bar" onMouseDown={iniciarArrasto}>
                <div className="title-bar-text">{titulo}</div>
                <div className="title-bar-controls">
                    <button aria-label="Close" onClick={fechar}></button>
                </div>
            </div>
            <div className="window-body">
                <p>{conteudo}</p>
            </div>
        </div>
    );
};

export default Janela;
