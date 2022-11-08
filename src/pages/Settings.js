/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import Context from './Context';
import axios from 'axios';
// router.
import { useHistory } from 'react-router-dom';
// funções.
import toast from '../functions/toast';
// imagens.
import back from '../images/back.svg';
import salvar from '../images/salvar.svg';

function Settings() {

  // context.
  const {
    html,
    usuario,
    settoast,
    pagina, setpagina,
    settings, setsettings,

    tema, settema,
    carddiasinternacao, setcarddiasinternacao,
    cardalergias, setcardalergias,
    cardanamnese, setcardanamnese,
    cardevolucoes, setcardevolucoes,
    cardpropostas, setcardpropostas,
    cardprecaucoes, setcardprecaucoes,
    cardriscos, setcardriscos,
    cardalertas, setcardalertas,
    cardsinaisvitais, setcardsinaisvitais,
    cardbody, setcardbody,
    cardvm, setcardvm,
    cardinfusoes, setcardinfusoes,
    carddieta, setcarddieta,
    cardculturas, setcardculturas,
    cardatb, setcardatb,
    cardinterconsultas, setcardinterconsultas,

  } = useContext(Context);

  // history (router).
  let history = useHistory();

  useEffect(() => {
    if (pagina == 4) {
      
      // recuperando configurações dos cards.
      setcarddiasinternacao(settings.map(item => item.card_diasinternacao).pop());
      setcardalergias(settings.map(item => item.card_alergias).pop());
      setcardanamnese(settings.map(item => item.card_anamnese).pop());
      setcardevolucoes(settings.map(item => item.card_evolucoes).pop());
      setcardpropostas(settings.map(item => item.card_propostas).pop());
      setcardprecaucoes(settings.map(item => item.card_precaucoes).pop());
      setcardriscos(settings.map(item => item.card_riscos).pop());
      setcardalertas(settings.map(item => item.card_alertas).pop());
      setcardsinaisvitais(settings.map(item => item.card_sinaisvitais).pop());
      setcarddiasinternacao(settings.map(item => item.card_diasinternacao).pop());
      setcardbody(settings.map(item => item.card_body).pop());
      setcardvm(settings.map(item => item.card_vm).pop());
      setcardinfusoes(settings.map(item => item.card_infusoes).pop());
      setcarddieta(settings.map(item => item.card_dieta).pop());
      setcardculturas(settings.map(item => item.card_culturas).pop());
      setcardatb(settings.map(item => item.card_antibioticos).pop());
      setcardinterconsultas(settings.map(item => item.card_interconsultas).pop());
    }
    // eslint-disable-next-line
  }, [pagina]);

  // atualizando configurações.
  const updateOptions = () => {
    var id = usuario.id;
    console.log('ID: ' + id);
    var obj = {
      id_usuario: id,
      tema: 1,
      card_diasinternacao: carddiasinternacao,
      card_alergias: cardalergias,
      card_anamnese: cardanamnese,
      card_evolucoes: cardevolucoes,
      card_propostas: cardpropostas,
      card_precaucoes: cardprecaucoes,
      card_riscos: cardriscos,
      card_alertas: cardalergias,
      card_sinaisvitais: cardsinaisvitais,
      card_body: cardbody,
      card_vm: cardvm,
      card_infusoes: cardinfusoes,
      card_dieta: carddieta,
      card_culturas: cardculturas,
      card_antibioticos: cardatb,
      card_interconsultas: cardinterconsultas
    }
    axios.post(html + 'update_settings/' + settings.map(item => item.id), obj).then(() => {
      setpagina(0);
      history.push('/')
    });
  }

  // construtor dos seletores para os cards.
  const cardSelector = (titulo, estado, setestado) => {
    return (
      <div
        className={estado == 1 ? 'button-red' : 'button'}
        style={{
          minWidth: 130, maxWidth: 130, minHeight: 130, maxHeight: 130,
          opacity: estado == 1 ? 1 : 0.3
        }}
        onClick={() => {
          if (estado == 0) {
            setestado(1);
          } else {
            setestado(0);
          }
        }}
      >
        {titulo}
      </div>
    )
  }

  return (
    <div className="main" style={{ justifyContent: 'flex-start' }}>
      <div className="text3">
        CONFIGURAÇÕES
      </div>
      <div className='text1'>TEMA</div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div className='button'
          onClick={() => settema(1)}
        >
          {'AZUL'}
        </div>
        <div className='button'
          onClick={() => settema(2)}
        >
          {'VERDE'}
        </div>
        <div className='button'
          onClick={() => settema(3)}
        >
          {'DARK'}
        </div>
      </div>
      <div>
        <div className='text1'>CARDS VISUALIZADOS</div>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
          width: '90vw',
        }}>
          {cardSelector('TEMPO DE INTERNAÇÃO', carddiasinternacao, setcarddiasinternacao)}
          {cardSelector('ALERGIAS', cardalergias, setcardalergias)}
          {cardSelector('ANAMNESE', cardanamnese, setcardanamnese)}
          {cardSelector('EVOLUÇÕES', cardevolucoes, setcardevolucoes)}
          {cardSelector('PROPOSTAS', cardpropostas, setcardpropostas)}
          {cardSelector('PRECAUÇÕES', cardprecaucoes, setcardprecaucoes)}
          {cardSelector('RISCOS', cardriscos, setcardriscos)}
          {cardSelector('ALERTAS', cardalertas, setcardalertas)}
          {cardSelector('SINAIS VITAIS', cardsinaisvitais, setcardsinaisvitais)}
          {cardSelector('INVASÕES E LESÕES', cardbody, setcardbody)}
          {cardSelector('VENTILAÇÃO MECÂNICA', cardvm, setcardvm)}
          {cardSelector('INFUSÕES', cardinfusoes, setcardinfusoes)}
          {cardSelector('DIETA', carddieta, setcarddieta)}
          {cardSelector('CULTURAS', cardculturas, setcardculturas)}
          {cardSelector('ANTIBIÓTICOS', cardatb, setcardatb)}
          {cardSelector('INTERCONSULTAS', cardinterconsultas, setcardinterconsultas)}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div id="botão de retorno"
          className="button-red"
          style={{
            display: 'flex',
            alignSelf: 'center',
          }}
          onClick={() => { setpagina(1); history.push('/passometro') }}>
          <img
            alt=""
            src={back}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
        <div id="btnupdatesettings"
          className='button-green'
          onClick={(e) => { updateOptions() }}
          style={{ width: 50, height: 50 }}
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
  )
}

export default Settings;
