/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import useSpeechToText from 'react-hook-speech-to-text';
// funções.
import toast from '../functions/toast';
// imagens.
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import microfone from '../images/microfone.svg';
import back from '../images/back.svg';

function Anamnese() {

  // context.
  const {
    html,
    settoast,

    unidade,
    pacientes,
    paciente,
    atendimentos, setatendimentos, // todos os registros de atendimento para a unidade selecionada.

    atendimento, // corresponde ao id_atendimento das tabela "atendimento".
    card, setcard,
  } = useContext(Context);

  const [anamnese, setanamnese] = useState([]);
  const [selectedatendimento, setselectedatendimento] = useState([]);

  useEffect(() => {
    if (card == 'card-anamnese') {
      setselectedinput(null);
      setanamnese(pacientes.filter(item => item.id_paciente == paciente));
      setselectedatendimento(atendimentos.filter(item => item.id_atendimento == atendimento));
      document.getElementById("inputProblemas").value = atendimentos.filter(item => item.id_atendimento == atendimento).map(item => item.problemas);
      document.getElementById("inputSituacao").value = atendimentos.filter(item => item.id_atendimento == atendimento).map(item => item.situacao);
      document.getElementById("inputAntecedentesPessoais").value = pacientes.filter(item => item.id_paciente == paciente).map(item => item.antecedentes_pessoais);
      document.getElementById("inputMedicacoesPrevias").value = pacientes.filter(item => item.id_paciente == paciente).map(item => item.medicacoes_previas);
      document.getElementById("inputExamesPrevios").value = pacientes.filter(item => item.id_paciente == paciente).map(item => item.exames_previos);
    }
    // eslint-disable-next-line
  }, [card, paciente, atendimentos, atendimento]);

  // atualizando um paciente.
  const updatePaciente = () => {
    var item = pacientes.filter(item => item.id_paciente == paciente);
    var obj = {
      nome_paciente: item.map(item => item.nome_paciente).pop(),
      nome_mae_paciente: item.map(item => item.nome_mae_paciente).pop(),
      dn_paciente: item.map(item => item.dn_paciente).pop(),
      antecedentes_pessoais: document.getElementById("inputAntecedentesPessoais").value.toUpperCase(),
      medicacoes_previas: document.getElementById("inputMedicacoesPrevias").value.toUpperCase(),
      exames_previos: document.getElementById("inputExamesPrevios").value.toUpperCase(),
    }
    axios.post(html + 'update_paciente/' + paciente, obj).then(() => {
      toast(settoast, 'DADOS DA ANAMNESE ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      axios.get(html + 'list_atendimentos/' + unidade).then((response) => {
        setatendimentos(response.data.rows);
      });
    })
  }

  // atualizando um atendimento.
  const updateAtendimento = () => {
    var obj = {
      data_inicio: selectedatendimento.map(item => item.data_inicio).pop(),
      data_termino: selectedatendimento.map(item => item.data_termino).pop(),
      problemas: document.getElementById("inputProblemas").value.toUpperCase(),
      id_paciente: selectedatendimento.map(item => item.id_paciente).pop(),
      id_unidade: selectedatendimento.map(item => item.id_unidade).pop(),
      nome_paciente: selectedatendimento.map(item => item.nome_paciente).pop(),
      leito: selectedatendimento.map(item => item.leito).pop(),
      situacao: document.getElementById("inputSituacao").value.toUpperCase(),
    }
    axios.post(html + 'update_atendimento/' + atendimento, obj).then(() => {
      toast(settoast, 'DADOS DA ANAMNESE ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      axios.get(html + 'list_atendimentos/' + unidade).then((response) => {
        setatendimentos(response.data.rows);
        console.log('LISTA DE ATENDIMENTOS CARREGADA: ' + response.data.rows.length);
      });
    })
  }

  // registro de textarea por voz.
  const [selectedinput, setselectedinput] = useState(null);
  function Botoes() {
    const [btngravavoz, setbtngravavoz] = useState("button-green");
    const {
      isRecording,
      results,
      startSpeechToText,
      stopSpeechToText,
      setResults,
    } = useSpeechToText({
      continuous: true,
      useLegacyResults: false
    });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 15 }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div id="botão de retorno"
            className="button-red"
            style={{
              display: 'flex',
              alignSelf: 'center',
            }}
            onClick={() => setcard('')}>
            <img
              alt=""
              src={back}
              style={{ width: 30, height: 30 }}
            ></img>
          </div>
          <div id="btngravavoz" className={btngravavoz}
            style={{ display: 'flex', width: 50, height: 50 }}
            onClick={(e) => {
              if (selectedinput != null) {
                if (isRecording == true) {
                  // nada.
                } else {
                  setbtngravavoz("gravando");
                  startSpeechToText();
                  e.stopPropagation();
                }
              } else {
                toast(settoast, 'SELECIONE UM CAMPO PRIMEIRO', 'rgb(231, 76, 60, 1)', 3000);
                e.stopPropagation();
              }
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
        </div>
        <div id="lista de resultados"
          className="button"
          style={{
            display: btngravavoz == "gravando" ? 'flex' : 'none',
            flexDirection: 'column', justifyContent: 'center', width: 150,
            alignSelf: 'center',
          }}>
          {results.map(item => (
            <div key={item.timestamp}>
              {item.transcript.toUpperCase()}
            </div>
          ))}
          <div className='button-red'
            style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
            onClick={(e) => {
              stopSpeechToText();
              setResults([]);
              setbtngravavoz("button-green");
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
              document.getElementById(selectedinput).value = document.getElementById(selectedinput).value + ' ' + results.map(result => result.transcript.toString().toUpperCase() + '.');
              updatePaciente(pacientes.filter(item => item.id_paciente == paciente));
              updateAtendimento();
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
    );
  }

  var timeout = null;
  return (
    <div id="scroll-anamnese"
      className='card-aberto'
      style={{ display: card == 'card-anamnese' ? 'flex' : 'none' }}
    >
      <div
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          flex: 1
        }}>

        <div className='text3'>LISTA DE PROBLEMAS</div>
        <textarea
          className="textarea"
          placeholder='LISTA DE PROBLEMAS'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'LISTA DE PROBLEMAS')}
          defaultValue={selectedatendimento.map(item => item.problemas)}
          onClick={(e) => { setselectedinput("inputProblemas"); e.stopPropagation() }}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              if (document.getElementById("inputProblemas").value != '') {
                updateAtendimento();
              }
              e.stopPropagation();
            }, 2000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputProblemas"
          title="LISTA DE PROBLEMAS."
        ></textarea>
        <div className='text3'>SITUAÇÃO</div>
        <textarea
          className="textarea"
          placeholder='SITUAÇÃO, CONTEXTO, HISTÓRIA DA DOENÇA ATUAL'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'SITUAÇÃO, CONTEXTO, HISTÓRIA DA DOENÇA ATUAL')}
          defaultValue={selectedatendimento.map(item => item.situacao)}
          onClick={(e) => { setselectedinput("inputSituacao"); e.stopPropagation() }}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              if (document.getElementById("inputSituacao").value != '') {
                updateAtendimento();
              }
              e.stopPropagation();
            }, 2000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputSituacao"
          title="SITUAÇÃO, CONTEXTO, HISTÓRIA DA DOENÇA ATUAL."
        ></textarea>
        <div className='text3'>ANTECEDENTES PESSOAIS</div>
        <textarea
          className="textarea"
          placeholder='ANTECEDENTES PESSOAIS'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'ANTECEDENTES PESSOAIS')}
          defaultValue={anamnese.map(item => item.antecedentes_pessoais)}
          onClick={(e) => { setselectedinput("inputAntecedentesPessoais"); e.stopPropagation() }}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              if (document.getElementById("inputAntecedentesPessoais").value != '') {
                updatePaciente();
              }
              e.stopPropagation();
            }, 2000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputAntecedentesPessoais"
          title="ANTECEDENTES PESSOAIS."
        >
        </textarea>
        <div className='text3'>MEDICAÇÕES DE USO DOMICILIAR</div>
        <textarea
          className="textarea"
          placeholder='MEDICAÇÕES DE USO DOMICILIAR'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'MEDICAÇÕES DE USO DOMICILIAR')}
          defaultValue={anamnese.map(item => item.medicacoes_previas)}
          onClick={(e) => { setselectedinput("inputMedicacoesPrevias"); e.stopPropagation() }}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              if (document.getElementById("inputMedicacoesPrevias").value != '') {
                updatePaciente();
              }
              e.stopPropagation();
            }, 2000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputMedicacoesPrevias"
          title="MEDICAÇÕES DE USO DOMICILIAR."
        >
        </textarea>
        <div className='text3'>EXAMES PRÉVIOS</div>
        <textarea
          className="textarea"
          placeholder='EXAMES PRÉVIOS'
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'EXAMES PRÉVIOS')}
          defaultValue={anamnese.map(item => item.exames_previos)}
          onClick={(e) => { setselectedinput("inputExamesPrevios"); e.stopPropagation() }}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              if (document.getElementById("inputExamesPrevios").value != '') {
                updatePaciente();
              }
              e.stopPropagation();
            }, 2000);
          }}
          style={{
            display: 'flex',
            flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
            whiteSpace: 'pre-wrap',
            width: window.innerWidth < 426 ? '85%' : '95%',
            height: window.innerWidth < 426 ? '50vh' : '',
          }}
          id="inputExamesPrevios"
          title="EXAMES PRÉVIOS."
        >
        </textarea>
        <Botoes></Botoes>
      </div>
    </div>
  )
}

export default Anamnese;