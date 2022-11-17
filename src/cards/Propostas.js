/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from 'moment';
import useSpeechToText from 'react-hook-speech-to-text';
// funções.
import toast from '../functions/toast';
import modal from '../functions/modal';

// import toast from '../functions/toast';
import checkinput from '../functions/checkinput';
// imagens.
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import microfone from '../images/microfone.svg';
import flag from '../images/flag.svg';
import fail from '../images/fail.svg';
import back from '../images/back.svg';

function Propostas() {

  // context.
  const {
    html,
    settoast, setdialogo,
    usuario, // objeto com {id e nome_usuario}.
    atendimento, // id_atendimento.
    propostas, setpropostas,
    arraypropostas, setarraypropostas,
    card, setcard,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-propostas') {
      loadPropostas();
    }
    // eslint-disable-next-line
  }, [card]);

  // carregando as propostas do atendimento.
  const loadPropostas = () => {
    axios.get(html + 'list_propostas/' + atendimento).then((response) => {
      setpropostas(response.data.rows);
      setarraypropostas(response.data.rows);
    });
  }

  // atualizando uma proposta.
  const [proposta, setproposta] = useState(0);
  const updateProposta = (item, inputproposta, inputprazo, status) => {
    var obj = {
      id_atendimento: item.id_atendimento,
      proposta: document.getElementById(inputproposta).value.toUpperCase(),
      status: status,
      data_proposta: item.data_proposta,
      id_usuario: item.id_usuario,
      prazo: inputprazo == null ? moment().startOf('day').add(4, 'day') : moment().startOf('day').add(1, 'day').add(document.getElementById(inputprazo).value, 'days'),
      data_conclusao: status == 0 ? null : moment(),
    }
    axios.post(html + 'update_proposta/' + item.id_proposta, obj).then(() => {
      loadPropostas();
      toast(settoast, 'DADOS DA PROPOSTA ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // inserindo uma proposta.
  const insertProposta = () => {
    var obj = {
      id_atendimento: atendimento,
      proposta: document.getElementById("inputProposta").value.toUpperCase(),
      status: 0,
      data_proposta: moment(),
      id_usuario: usuario.id,
      prazo: moment().startOf('day').add(1, 'day').add(document.getElementById("inputPrazo").value, 'days'),
      data_conclusao: null,
    }
    axios.post(html + 'insert_proposta', obj).then(() => {
      loadPropostas();
      setviewinsertproposta(0);
      toast(settoast, 'PROPOSTA REGISTRADA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // excluir uma proposta.
  const deleteProposta = (proposta) => {
    axios.get(html + 'delete_proposta/' + proposta.id_proposta).then(() => {
      loadPropostas();
      toast(settoast, 'PROPOSTA EXCLUÍDA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // registro de textarea por voz.
  const [selectedproposta, setselectedproposta] = useState(null);
  const [selectedprazo, setselectedprazo] = useState(null);
  function Botoes(item) {
    const [btngravavoz, setbtngravavoz] = useState("button-green");
    const {
      isRecording,
      results,
      setResults,
      startSpeechToText,
      stopSpeechToText,
    } = useSpeechToText({
      continuous: true,
      useLegacyResults: false
    })
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div id="botão de retorno"
            className="button-red"
            style={{
              display: 'flex',
              alignSelf: 'center',
            }}
            onClick={() => setviewinsertproposta(0)}>
            <img
              alt=""
              src={back}
              style={{ width: 30, height: 30 }}
            ></img>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div id="btngravavoz" className={btngravavoz}
              style={{ display: 'flex', width: 50, height: 50 }}
              onClick={(e) => {
                if (selectedproposta == null) {
                  if (isRecording == true) {
                    stopSpeechToText();
                    setbtngravavoz("button-green");
                    document.getElementById("inputProposta").value = results.map(result => result.transcript.toString().toUpperCase() + '.');
                    insertProposta();
                    e.stopPropagation();
                  } else {
                    setbtngravavoz("gravando");
                    startSpeechToText();
                    e.stopPropagation();
                  }
                } else {
                  if (isRecording == true) {
                    stopSpeechToText();
                    setbtngravavoz("button-green");
                    document.getElementById(selectedproposta).value = document.getElementById(selectedproposta).value + ' ' + results.map(result => result.transcript.toString().toUpperCase() + '.');
                    updateProposta(proposta, selectedproposta, selectedprazo, item.status);
                    setselectedproposta(null);
                    setselectedprazo(null);
                    e.stopPropagation();
                  } else {
                    setbtngravavoz("gravando");
                    startSpeechToText();
                    e.stopPropagation();
                  }
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
            </div>
          </div>
        </div>
        <div id="btnsalvarevolucao"
          className='button-green'
          style={{ width: 50, height: 50 }}
          onClick={(e) => {
            setviewinsertproposta(1);
            e.stopPropagation();
          }}
        >
          <img
            alt=""
            src={novo}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
      </div>
    );
  }

  const [viewinsertproposta, setviewinsertproposta] = useState(0);
  const InsertProposta = useCallback(() => {
    return (
      <div className="fundo" style={{ display: viewinsertproposta == 1 ? 'flex' : 'none' }}
        onClick={(e) => { setviewinsertproposta(0); e.stopPropagation() }}>
        <div className="janela" onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text3'>PROPOSTA</div>
            <input
              id="inputProposta"
              title="PROPOSTA."
              autoComplete="off"
              placeholder='PROPOSTA...'
              className="input"
              type="text"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'PROPOSTA...')}
              defaultValue={proposta.proposta}
              maxLength={300}
              style={{
                display: 'flex',
                flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                whiteSpace: 'pre-wrap',
                width: window.innerWidth < 426 ? '70vw' : '40vw',
                height: 50,
              }}
            >
            </input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text3'>DIAS PARA EFETIVAÇÃO</div>
            <input
              id="inputPrazo"
              title='DIAS PARA O CUMPRIMENTO DA PROPOSTA (META).'
              autoComplete="off"
              placeholder="DIAS..."
              className="input"
              type="text"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'DIAS...')}
              maxLength={3}
              style={{
                width: 75,
                height: 50,
                alignSelf: 'center',
              }}
            ></input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div id="botão de retorno"
              className="button-red"
              style={{
                display: 'flex',
                alignSelf: 'center',
              }}
              onClick={() => setviewinsertproposta(0)}>
              <img
                alt=""
                src={back}
                style={{ width: 30, height: 30 }}
              ></img>
            </div>
            <div id='btnsalvarproposta' className='button-green'
              onKeyUp={(e) => {
                if (isNaN(e.target.value) == true || e.target.value == '') {
                  document.getElementById("inputPrazo").value = '';
                  document.getElementById("inputPrazo").focus();
                  e.stopPropagation();
                }
              }}
              onClick={() => checkinput('input', settoast, ['inputProposta', 'inputPrazo'], "btnsalvarproposta", insertProposta, [])}
            >
              <img
                alt=""
                src={salvar}
                style={{
                  margin: 10,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [viewinsertproposta]);

  function FilterPropostas() {
    return (
      <div className='input-special'
        style={{
          position: 'sticky',
          top: window.innerWidth < 426 ? 70 : 10,
          display: 'flex', alignSelf: 'center',
          zIndex: 20,
        }}>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR NAS PROPOSTAS..."
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR NAS PROPOSTAS...')}
          onClick={(e) => e.stopPropagation()}
          onKeyUp={(e) => { filterProposta(); e.stopPropagation(); }}
          type="text"
          id="inputFilterProposta"
          defaultValue={filterproposta}
          maxLength={100}
          style={{ margin: 5, width: window.innerWidth < 426 ? '65vw' : '30vw' }}
        ></input>
      </div>
    )
  }

  const [filterproposta, setfilterproposta] = useState('');
  var searchproposta = '';
  const filterProposta = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterProposta").focus();
    searchproposta = document.getElementById("inputFilterProposta").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchproposta == '') {
        setfilterproposta('');
        setarraypropostas(propostas);
        document.getElementById("inputFilterProposta").value = '';
        setTimeout(() => {
          document.getElementById("inputFilterProposta").focus();
        }, 100);
      } else {
        setfilterproposta(document.getElementById("inputFilterProposta").value.toUpperCase());
        setarraypropostas(propostas.filter(item => item.proposta.includes(searchproposta)));
        document.getElementById("inputFilterProposta").value = searchproposta;
        setTimeout(() => {
          document.getElementById("inputFilterProposta").focus();
        }, 100);
      }
    }, 1000);
  }

  var timeout = null;
  return (
    <div id="scroll-propostas"
      className='card-aberto'
      style={{ display: card == 'card-propostas' ? 'flex' : 'none' }}
      onClick={(e) => {
        setcard('');
        e.stopPropagation();
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column', justifyContent: 'center',
        }}>
        <div className="text3">PROPOSTAS</div>
        <FilterPropostas></FilterPropostas>
        {arraypropostas.sort((a, b) => moment(a.data_proposta) < moment(b.data_proposta) ? 1 : -1).map((item) => (
          <div
            key={'proposta ' + item.id_proposta}
            className='row'
            style={{
              margin: 5,
            }}
          >
            <div style={{
              display: 'flex', flexDirection: window.innerWidth < 426 ? 'column' : 'row',
              justifyContent: 'center',
              flex: 5,
            }}>
              <div id="identificador"
                className={item.status == 1 ? 'button-green' : moment().startOf('day').add(1, 'day').diff(item.prazo, 'days') > -1 ? 'button-red' : 'button'}
                style={{
                  flex: 1,
                  flexDirection: window.innerWidth < 426 ? 'row' : 'column',
                  justifyContent: window.innerWidth < 426 ? 'space-between' : 'center',
                  alignSelf: 'center',
                  margin: 5, padding: 5,
                  width: window.innerWidth < 426 ? '95%' : '',
                  height: window.innerWidth < 426 ? 60 : 130,
                  marginBottom: window.innerWidth < 426 ? 0 : 5,
                  marginRight: window.innerWidth < 426 ? 5 : 0,
                  borderTopLeftRadius: window.innerWidth < 426 ? 5 : 5,
                  borderTopRightRadius: window.innerWidth < 426 ? 5 : 0,
                  borderBottomLeftRadius: window.innerWidth < 426 ? 0 : 5,
                  borderBottomRightRadius: window.innerWidth < 426 ? 0 : 0,
                }}>
                <div style={{
                  display: window.innerWidth < 426 ? 'none' : 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div className='text2' style={{ color: '#ffffff' }}>{moment(item.data_proposta).format('DD/MM/YY')}</div>
                  <div className='text2' style={{ color: '#ffffff', marginTop: 0 }}>{moment(item.data_proposta).format('HH:mm')}</div>
                </div>
                <div style={{
                  display: window.innerWidth < 426 ? 'flex' : 'none',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div className='text2' style={{ color: '#ffffff' }}>{moment(item.data_proposta).format('DD/MM/YY - HH:mm')}</div>
                </div>
                <div className='button-red'
                  style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
                  onClick={(e) => {
                    modal(setdialogo, 'CONFIRMAR EXCLUSÃO DA EVOLUÇÃO ?', deleteProposta, item);
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
              </div>
              <div id="conteúdo da proposta"
                style={{
                  display: 'flex', flexDirection: window.innerWidth < 426 ? 'column' : 'row',
                  justifyContent: 'center',
                  flex: 4,
                  backgroundColor: 'blue',
                  padding: 5,
                  height: window.innerWidth < 426 ? 100 : 120,
                  borderTopLeftRadius: window.innerWidth < 426 ? 0 : 0,
                  borderTopRightRadius: window.innerWidth < 426 ? 0 : 5,
                  borderBottomLeftRadius: window.innerWidth < 426 ? 5 : 0,
                  borderBottomRightRadius: window.innerWidth < 426 ? 5 : 5,
                  marginTop: window.innerWidth < 426 ? 0 : 5,
                  marginLeft: window.innerWidth < 426 ? 5 : 0,

                }}>
                <div style={{
                  display: 'flex', flexDirection: window.innerWidth < 426 ? 'column' : 'row',
                  flex: window.innerWidth < 426 ? 1 : 3,
                  display: 'flex',
                }}>
                  <textarea id={"inputProposta " + item.id_proposta}
                    className="textarea"
                    placeholder='PROPOSTA...'
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'INSERIR PROPOSTA...')}
                    defaultValue={item.proposta}
                    onClick={(e) => {
                      setproposta(item);
                      setselectedproposta("inputProposta " + item.id_proposta);
                      setselectedprazo("inputPrazo " + item.id_proposta);
                      e.stopPropagation();
                    }}
                    onKeyUp={(e) => {
                      clearTimeout(timeout);
                      timeout = setTimeout(() => {
                        if (document.getElementById("inputProposta " + item.id_proposta).value != '' && document.getElementById("inputPrazo " + item.id_proposta).value != '') {
                          updateProposta(item, "inputProposta " + item.id_proposta, "inputPrazo " + item.id_proposta, item.status);
                        }
                        e.stopPropagation();
                      }, 2000);
                    }}
                    style={{
                      flex: window.innerWidth < 426 ? 1 : 3,
                      display: 'flex',
                      flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                      whiteSpace: 'pre-wrap',
                    }}
                    title="PROPOSTA."
                  >
                  </textarea>
                  <div id="prazo"
                    style={{
                      position: 'relative',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'red',
                    }}>
                    <div className='text1'>PRAZO</div>
                    <input id={"inputPrazo " + item.id_proposta}
                      autoComplete="off"
                      placeholder="DIAS..."
                      className="input"
                      type="text"
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'DIAS...')}
                      maxLength={3}
                      style={{
                        pointerEvents: item.status == 1 ? 'none' : 'auto',
                        width: 75,
                        height: 50,
                        backgroundColor: moment(item.prazo).diff(moment(), 'days') > 0 || item.status == 1 ? 'white' : 'rgb(231, 76, 60, 0.7)',
                        color: moment(item.prazo).diff(moment(), 'days') > 0 || item.status == 1 ? '' : 'white',
                      }}
                      defaultValue={
                        moment(item.prazo).diff(moment(), 'days') > 0 && item.status == 0 ? moment(item.prazo).diff(moment(), 'days') :
                          moment(item.prazo).diff(moment(), 'days') < 1 && item.status == 0 ? 0 : moment(item.data_conclusao).diff(moment(item.data_proposta), 'days')}
                      onClick={(e) => {
                        setproposta(item);
                        setselectedproposta("inputProposta " + item.id_proposta);
                        setselectedprazo("inputPrazo " + item.id_proposta);
                        e.stopPropagation()
                      }}
                      onKeyUp={(e) => {
                        if (isNaN(e.target.value) == true || e.target.value == '') {
                          document.getElementById("inputPrazo " + item.id_proposta).value = '';
                          document.getElementById("inputPrazo " + item.id_proposta).focus();
                          e.stopPropagation();
                        } else {
                          clearTimeout(timeout);
                          timeout = setTimeout(() => {
                            updateProposta(item, "inputProposta " + item.id_proposta, "inputPrazo " + item.id_proposta, item.status);
                            e.stopPropagation();
                          }, 500);
                        }
                      }}
                    ></input>
                    <div className='input-special' style={{ marginTop: -20, padding: 1 }}>
                      <img
                        onClick={(e) => {
                          setproposta(item);
                          setselectedproposta("inputProposta " + item.id_proposta);
                          setselectedprazo("inputPrazo " + item.id_proposta);
                          if (item.status == 0) {
                            setTimeout(() => {
                              updateProposta(item, "inputProposta " + item.id_proposta, "inputPrazo " + item.id_proposta, 1);
                            }, 500);
                          } else {
                            updateProposta(item, "inputProposta " + item.id_proposta, "inputPrazo " + item.id_proposta, 0);
                          }
                          e.stopPropagation();
                        }}
                        alt=""
                        src={item.status == 1 ? flag : fail}
                        className='cor2'
                        style={{
                          opacity: 1,
                          margin: 10,
                          padding: 5,
                          height: 40,
                          width: 40,
                          backgroundColor: 'white',
                          borderRadius: 5,
                        }}
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <InsertProposta></InsertProposta>
      <Botoes item={proposta}></Botoes>
    </div>
  )
}

export default Propostas;