/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from 'moment';
import useSpeechToText from 'react-hook-speech-to-text';
// funções.
import toast from '../functions/toast';
// import toast from '../functions/toast';
import checkinput from '../functions/checkinput';
// imagens.
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import back from '../images/back.svg';
import microfone from '../images/microfone.svg';
// funções.
import modal from '../functions/modal';

function Culturas() {

  // context.
  const {
    html,
    settoast, setdialogo,
    atendimento, // id_atendimento.
    culturas, setculturas,
    arrayculturas, setarrayculturas,
    card, setcard,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-culturas') {
      loadCulturas();
      setcultura(0);
    }
    // eslint-disable-next-line
  }, [card]);

  // carregando as culturas do atendimento.
  const loadCulturas = () => {
    axios.get(html + 'list_culturas/' + atendimento).then((response) => {
      setculturas(response.data.rows);
      setarrayculturas(response.data.rows);
    });
  }

  // atualizando uma cultura.
  const [cultura, setcultura] = useState(0);
  const updateCultura = (item) => {
    var obj = null;
    if (viewinsertcultura == 1) {
      obj = {
        id_atendimento: item.id_atendimento,
        material: document.getElementById('inputMaterial').value.toUpperCase(),
        resultado: document.getElementById('inputResultado').value.toUpperCase(),
        data_pedido: item.data_pedido,
        data_resultado: item.data_resultado,
      }
    } else {
      obj = {
        id_atendimento: item.id_atendimento,
        material: document.getElementById("inputMaterial " + cultura.id_cultura).value.toUpperCase(),
        resultado: document.getElementById("inputResultado " + cultura.id_cultura).value.toUpperCase(),
        data_pedido: item.data_pedido,
        data_resultado: item.data_resultado,
      }
    }
    axios.post(html + 'update_cultura/' + item.id_cultura, obj).then(() => {
      loadCulturas();
      toast(settoast, 'DADOS DA CULTURA ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // inserindo uma cultura.
  const insertCultura = () => {
    var obj = {
      id_atendimento: atendimento,
      material: document.getElementById("inputMaterial").value.toUpperCase(),
      resultado: document.getElementById("inputResultado").value.toUpperCase(),
      data_pedido: moment(document.getElementById("inputDataPedido").value + ' - ' + moment().format('HH:mm'), 'DD/MM/YY - HH:mm'),
      data_resultado: null,
    }
    axios.post(html + 'insert_cultura', obj).then((response) => {
      console.log(JSON.stringify(obj + response));
      loadCulturas();
      setviewinsertcultura(0);
      toast(settoast, 'CULTURA REGISTRADA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // excluir uma cultura.
  const deleteCultura = (cultura) => {
    axios.get(html + 'delete_cultura/' + cultura.id_cultura).then(() => {
      loadCulturas();
      toast(settoast, 'CULTURA EXCLUÍDA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
  }

  // registro de textarea por voz.
  function Botoes() {
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
              if (cultura == 0) {
                if (isRecording == true) {
                  stopSpeechToText();
                  setbtngravavoz("button-green");
                  document.getElementById("inputMaterial").value = results.slice(0, 1).map(result => result.transcript.toString().toUpperCase());
                  document.getElementById("inputResultado").value = results.slice(1, 2).map(result => result.transcript.toString().toUpperCase());

                  var obj = {
                    id_atendimento: atendimento,
                    material: results.slice(0, 1).map(result => result.transcript.toString().toUpperCase()).pop(),
                    resultado: results.slice(1, 2).map(result => result.transcript.toString().toUpperCase()).pop(),
                    data_pedido: moment(),
                    data_resultado: null,
                  }
                  axios.post(html + 'insert_cultura', obj).then((response) => {
                    loadCulturas();
                    setviewinsertcultura(0);
                    toast(settoast, 'CULTURA REGISTRADA COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
                  })

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
                  document.getElementById("inputMaterial " + cultura.id_cultura).value = results.slice(0, 1).map(result => result.transcript.toString().toUpperCase());
                  document.getElementById("inputResultado " + cultura.id_cultura).value = results.slice(1, 2).map(result => result.transcript.toString().toUpperCase());
                  console.log('CULTURA: ' + cultura.id_cultura);
                  updateCultura(cultura);
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
          <div id="btnsalvarcultura"
            className='button-green'
            style={{ width: 50, height: 50 }}
            onClick={(e) => {
              setviewinsertcultura(1);
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
        <div id="lista de resultados"
          className="button"
          style={{
            display: btngravavoz == "gravando" && results.length < 3 ? 'flex' : 'none',
            flexDirection: 'column', justifyContent: 'center', width: 150,
            alignSelf: 'center',
          }}>
          <div className='button-yellow' style={{ display: results.length > 1 ? 'none' : 'flex', pading: 10 }}>
            {results.length == 0 ? 'INFORME MATERIAL' : results.length == 1 ? 'INFORME RESULTADO' : ''}
          </div>
          <div>
            {results.length == 1 ? 'MATERIAL: ' : results.length == 2 ? 'RESULTADO: ' : ''}
          </div>
          {results.slice(-1).map(item => (
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
    );
  }

  const [viewinsertcultura, setviewinsertcultura] = useState(0);
  const InsertCultura = useCallback(() => {
    var timeout = null;
    return (
      <div className="fundo" style={{ display: viewinsertcultura == 1 ? 'flex' : 'none' }}
        onClick={(e) => { setviewinsertcultura(0); e.stopPropagation() }}>
        <div className="janela" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div id="campos" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div id="material" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>MATERIAL</div>
              <input
                className="input"
                autoComplete="off"
                placeholder='MATERIAL...'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'MATERIAL...')}
                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  whiteSpace: 'pre-wrap',
                  width: window.innerWidth < 426 ? '70vw' : '50vw',
                }}
                id="inputMaterial"
                title="MATERIAL."
              >
              </input>
            </div>
            <div id="dia da coleta" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>DIA DA COLETA</div>
              <input
                autoComplete="off"
                placeholder="DATA"
                className="input"
                type="text"
                inputMode='numeric'
                maxLength={10}
                id="inputDataPedido"
                title="FORMATO: DD/MM/YYYY"
                onClick={() => document.getElementById("inputDataPedido").value = ''}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DATA')}
                onKeyUp={() => {
                  var x = document.getElementById("inputDataPedido").value;
                  if (x.length == 2) {
                    x = x + '/';
                    document.getElementById("inputDataPedido").value = x;
                  }
                  if (x.length == 5) {
                    x = x + '/'
                    document.getElementById("inputDataPedido").value = x;
                  }
                  clearTimeout(timeout);
                  var date = moment(document.getElementById("inputDataPedido").value, 'DD/MM/YYYY', true);
                  timeout = setTimeout(() => {
                    if (date.isValid() == false) {
                      toast(settoast, 'DATA INVÁLIDA', 'rgb(231, 76, 60, 1)', 3000);
                      document.getElementById("inputDataPedido").value = '';
                    } else {
                      document.getElementById("inputDataPedido").value = moment(date).format('DD/MM/YYYY');
                    }
                  }, 3000);
                }}
                defaultValue={moment().format('DD/MM/YYYY')}
              ></input>
            </div>
            <div id="resultado" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>RESULTADO</div>
              <input
                className="input"
                autoComplete="off"
                placeholder='RESULTADO...'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'RESULTADO...')}
                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  whiteSpace: 'pre-wrap',
                  width: window.innerWidth < 426 ? '70vw' : '50vw',
                }}
                id="inputResultado"
                title="RESULTADO."
              >
              </input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div id="botão de retorno"
                className="button-red"
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                }}
                onClick={() => setviewinsertcultura(0)}>
                <img
                  alt=""
                  src={back}
                  style={{ width: 30, height: 30 }}
                ></img>
              </div>
              <div id='btnsalvarcultura' className='button-green' style={{ maxWidth: 50, alignSelf: 'center' }}
                onClick={() => checkinput('input', settoast, ['inputDataPedido'], "btnsalvarcultura", insertCultura, [])}
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
        </div >
      </div>
    )
    // eslint-disable-next-line
  }, [viewinsertcultura]);

  var timeout = null;
  const [filtercultura, setfiltercultura] = useState('');
  var searchcultura = '';
  const filterCultura = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterCultura").focus();
    searchcultura = document.getElementById("inputFilterCultura").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchcultura == '') {
        setfiltercultura('');
        setarrayculturas(culturas);
        document.getElementById("inputFilterCultura").value = '';
        setTimeout(() => {
          document.getElementById("inputFilterCultura").focus();
        }, 100);
      } else {
        setfiltercultura(document.getElementById("inputFilterCultura").value.toUpperCase());
        setarrayculturas(culturas.filter(item => item.material.includes(searchcultura)));
        document.getElementById("inputFilterCultura").value = searchcultura;
        setTimeout(() => {
          document.getElementById("inputFilterCultura").focus();
        }, 100);
      }
    }, 1000);
  }

  function FilterCulturas() {
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
          placeholder="BUSCAR NAS CULTURAS..."
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR NAS CULTURAS...')}
          onClick={(e) => e.stopPropagation()}
          onKeyUp={(e) => { filterCultura(); e.stopPropagation() }}
          type="text"
          id="inputFilterCultura"
          defaultValue={filtercultura}
          maxLength={100}
          style={{ margin: 5, width: window.innerWidth < 426 ? '65vw' : '30vw' }}
        ></input>
      </div>
    )
  }

  return (
    <div id="scroll-culturas"
      className='card-aberto'
      style={{ display: card == 'card-culturas' ? 'flex' : 'none', position: 'relative' }}
    >
      <div className="text3">
        CULTURAS
      </div>
      <FilterCulturas></FilterCulturas>
      <div
        style={{
          position: 'relative', display: 'flex', flexDirection: 'row',
          justifyContent: 'space-evenly', flexWrap: 'wrap',
          alignItems: 'flex-start', alignContent: 'flex-start',
        }}>
        {arrayculturas.sort((a, b) => moment(a.data_pedido) < moment(b.data_pedido) ? 1 : -1).map((item) => (
          <div
            key={'cultura ' + item.id_cultura}
            className='row'
            style={{
              position: 'relative',
              margin: 5,
              flexDirection: window.innerWidth < 426 ? 'column' : 'row',
              width: window.innerWidth < 426 ? '95%' : '',
            }}
          >
            <div style={{
              display: 'flex', flexDirection: window.innerWidth < 426 ? 'column' : 'row',
              justifyContent: 'center', alignContent: 'center', alignItems: 'center',
            }}>
              <div id="identificador"
                className={item.resultado != null ? 'button-green' : 'button-red'}
                style={{
                  flex: 1,
                  flexDirection: window.innerWidth < 426 ? 'row' : 'column',
                  justifyContent: window.innerWidth < 426 ? 'space-between' : 'center',
                  alignSelf: 'center', alignContent: 'center',
                  margin: 5,
                  padding: 5,
                  height: window.innerWidth < 426 ? 60 : 200,
                  width: window.innerWidth < 426 ? '95%' : '',
                  marginBottom: window.innerWidth < 426 ? 0 : 5,
                  marginRight: window.innerWidth < 426 ? 5 : 0,
                  borderTopLeftRadius: window.innerWidth < 426 ? 5 : 5,
                  borderTopRightRadius: window.innerWidth < 426 ? 5 : 0,
                  borderBottomLeftRadius: window.innerWidth < 426 ? 0 : 5,
                  borderBottomRightRadius: window.innerWidth < 426 ? 0 : 0,
                }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className='text2'
                    title='DATA DA COLETA.'
                    style={{
                      color: '#ffffff'
                    }}>
                    {moment(item.data_pedido).format('DD/MM/YY')}
                  </div>
                </div>
                <div className='button-red'
                  style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
                  onClick={(e) => {
                    modal(setdialogo, 'CONFIRMAR EXCLUSÃO DA CULTURA ?', deleteCultura, item);
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
              <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                margin: 5, padding: 5,
                borderTopLeftRadius: window.innerWidth < 426 ? 0 : 0,
                borderTopRightRadius: window.innerWidth < 426 ? 0 : 5,
                borderBottomLeftRadius: window.innerWidth < 426 ? 5 : 0,
                borderBottomRightRadius: window.innerWidth < 426 ? 5 : 5,
                marginTop: window.innerWidth < 426 ? 0 : 5,
                marginLeft: window.innerWidth < 426 ? 5 : 0,
                backgroundColor: 'white',
                height: 200,
                width: window.innerWidth < 426 ? '95%' : '',
              }}>
                <input id={"inputMaterial " + item.id_cultura}
                  className="input"
                  placeholder='MATERIAL...'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'MATERIAL...')}
                  defaultValue={item.material}
                  onClick={(e) => { setcultura(item); e.stopPropagation() }}
                  onKeyUp={(e) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      var obj = {
                        id_atendimento: item.id_atendimento,
                        material: document.getElementById('inputMaterial ' + item.id_cultura).value.toUpperCase(),
                        resultado: document.getElementById('inputResultado ' + item.id_cultura).value.toUpperCase(),
                        data_pedido: item.data_pedido,
                        data_resultado: item.data_resultado,
                      }
                      axios.post(html + 'update_cultura/' + item.id_cultura, obj).then(() => {
                        loadCulturas();
                        toast(settoast, 'DADOS DA CULTURA ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
                      });
                      e.stopPropagation();
                    }, 3000);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                    width: 'calc(100% - 10px)',
                    margin: 2.5
                  }}
                  title="MATERIAL."
                >
                </input>
                <textarea id={"inputResultado " + item.id_cultura}
                  className="textarea"
                  placeholder='RESULTADO...'
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'RESULTADO...')}
                  defaultValue={item.resultado}
                  onClick={(e) => { setcultura(item); e.stopPropagation() }}
                  onKeyUp={(e) => {
                    clearTimeout(timeout);
                    var resultado = document.getElementById('inputResultado ' + item.id_cultura).value.toUpperCase();
                    timeout = setTimeout(() => {
                      var obj = {
                        id_atendimento: item.id_atendimento,
                        material: document.getElementById('inputMaterial ' + item.id_cultura).value.toUpperCase(),
                        resultado: resultado == '' ? null : resultado,
                        data_pedido: item.data_pedido,
                        data_resultado: resultado == '' ? null : moment(),
                      }
                      axios.post(html + 'update_cultura/' + item.id_cultura, obj).then(() => {
                        loadCulturas();
                        toast(settoast, 'DADOS DA CULTURA ATUALIZADOS COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
                      });
                      e.stopPropagation();
                    }, 3000);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                    width: 'calc(100% - 30px)',
                    height: 100,
                    backgroundColor: item.resultado == null || item.resultado.includes('NEGATIV') || item.resultado.includes('NHCB') ? '#F2F2F2' : item.resultado.includes('VRE') || item.resultado.includes('ESBL') || item.resultado.includes('KPC') ? 'rgb(231, 76, 60, 0.5)' : 'rgb(244, 208, 63, 0.5)',
                    borderColor: 'transparent',
                    color: item.resultado == null || item.resultado.includes('NEGATIV') || item.resultado.includes('NHCB') ? '' : item.resultado.includes('VRE') || item.resultado.includes('ESBL') || item.resultado.includes('KPC') ? 'white' : '',
                  }}
                  title={item.data_resultado != null ? "DATA DO RESULTADO: " + moment(item.data_resultado).format('DD/MM/YY') : 'RESULTADO.'}
                >
                </textarea>
              </div>
              <div className='text2'
                title='DATA DO RESULTADO.'
                style={{
                  position: 'absolute', top: 10, right: 10,
                  display: 'none',
                  margin: 5, padding: 0, color: 'rgb(231, 76, 60, 1)'
                }}>
                {'RESULTADO: ' + moment(item.data_resultado).format('DD/MM/YY')}
              </div>
            </div>
          </div>
        ))}
      </div>
      <InsertCultura></InsertCultura>
      <Botoes></Botoes>
    </div>
  )
}

export default Culturas;