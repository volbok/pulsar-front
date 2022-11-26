/* eslint eqeqeq: "off" */
import React, { useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import microfone from '../images/microfone.svg';
import salvar from '../images/salvar.svg';
import deletar from '../images/deletar.svg';

function Gravador({ funcao }) {
  const [btngravavoz, setbtngravavoz] = useState("button-green");
  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: false,
    useLegacyResults: false
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div id="btngravavoz" className={btngravavoz}
        style={{ display: 'flex', width: 50, height: 50 }}
        onClick={isRecording ?
          () => {
            // não faz nada.
          } :
          (e) => {
            document.getElementById("btngravavoz").style.pointerEvents = 'none';
            setbtngravavoz("gravando");
            startSpeechToText();
            e.stopPropagation();
          }}
      >
        <img
          alt=""
          src={microfone}
          style={{
            margin: 10,
            height: 30,
            width: 30,
          }}
        ></img>
      </div>
      <div id="lista de resultados"
        className="button"
        style={{
          display: btngravavoz == "gravando" ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center', width: 150
        }}>
        {results.map(item => (
          <div key={item.timestamp}>
            {item.transcript.toUpperCase()}
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div id="botão excluir" className='button-red'
            style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
            onClick={(e) => {
              stopSpeechToText();
              setResults([]);
              setbtngravavoz("button-green");
              document.getElementById("btngravavoz").style.pointerEvents = 'auto';
              e.stopPropagation();
            }}>
            <img
              alt=""
              src={deletar}
              style={{
                margin: 10,
                height: 25,
                width: 25,
              }}
            ></img>
          </div>
          <div id="botão salvar" className='button-green'
            style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
            onClick={(e) => {
              stopSpeechToText();
              setbtngravavoz("button-green");
              results.map(result => funcao([result.transcript.toString().toUpperCase()]));
              document.getElementById("btngravavoz").style.pointerEvents = 'auto';
              e.stopPropagation();
            }}>
            <img
              alt=""
              src={salvar}
              style={{
                margin: 10,
                height: 25,
                width: 25,
              }}
            ></img>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gravador;