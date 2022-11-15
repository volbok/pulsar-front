/* eslint eqeqeq: "off" */
import React, { useEffect, useContext, useState } from 'react';
import Context from './Context';
import { useHistory } from 'react-router-dom';
import { Page, Text, View, Document, PDFViewer, StyleSheet } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import fontbold from '../fonts/Roboto-Bold.ttf';
import moment from 'moment';
// imagens.
import back from '../images/back.svg';

function Pdf() {

  // context.
  const {
    pagina,
    setpagina,
    pacientes,
    atendimento,
    atendimentos,

    interconsultas

  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const [selectedatendimento, setselectedatendimento] = useState(null);
  useEffect(() => {
    if (pagina == 6) {
      setselectedatendimento(atendimentos.filter(item => item.id_atendimento == atendimento));
      console.log('ATENDIMENTOS: ' + atendimentos.length);
      console.log('ID ATENDIMENTO: ' + atendimento);
      console.log(atendimentos.filter(item => item.id_atendimento == atendimento));
    }
    // eslint-disable-next-line
  }, [pagina]);

  // registro de fontes para o react-pdf (a lib não aceita ajustar fontWeight).
  Font.register({
    family: 'Roboto',
    src: fontbold,
  });

  // estilização (css).
  const styles = StyleSheet.create({
    title1: {
      display: 'flex',
      fontFamily: 'Helvetica-Bold',
      fontSize: 14, textAlign: 'center',
      fontWeight: 'bold',
      margin: 2.5,
      height: 20,
      maxHeight: 20
    },
    title2: {
      flex: 1,
      display: 'flex',
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
      fontWeight: 'bold',
      padding: 10,
      margin: 5,
      borderStyle: 'solid', borderWidth: 1, borderRadius: 5, borderColor: 'black',
    },
    view0: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginTop: 2.5,
      padding: 2.5,
      borderStyle: 'solid', borderWidth: 1, borderRadius: 5, borderColor: 'black',
    },
    view1: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 2.5,
      padding: 2.5,
      borderStyle: 'none', borderWidth: 0, borderRadius: 5, borderColor: 'transparent',
    },
    view2: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      margin: 2.5,
      padding: 5,
      borderRadius: 5,
      backgroundColor: '#f2f2f2'
    },
    view3: {
      display: 'flex',
      margin: 2.5,
      padding: 2.5,
      borderRadius: 5,
      backgroundColor: '#f2f2f2',
      justifyContent: 'flex-start'
    },
  });

  const BackButton = () => {
    return (
      <div id="botão de retorno"
        className="button-red"
        style={{
          position: 'absolute', bottom: 25, left: 25,
          opacity: 1, backgroundColor: '#ec7063',
          alignSelf: 'center',
          zIndex: 90
        }}
        onClick={() => {
          setpagina(1);
          history.push('/passometro');
        }}>
        <img
          alt=""
          src={back}
          style={{ width: 30, height: 30 }}
        ></img>
      </div >
    )
  }

  // conteúdo de cada atendimento.
  const pdfAtendimento = (item) => {
    return (
      <View style={styles.view0}>
        <View style={styles.view1}>
          <Text style={[styles.title2, { flex: 1 }]}>
            {'LEITO: ' + item.leito}
          </Text>
          <Text style={[styles.title2, { flex: 5 }]}>
            {'NOME: ' + pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(valor => valor.nome_paciente)}
          </Text>
        </View>
        <View style={styles.view1}>
          <Text style={styles.title2}>
            {'IDADE: ' + pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(valor => moment().diff(valor.dn_paciente, 'years'))}
          </Text>
          <Text style={styles.title2}>
            {'ADMISSÃO: ' + moment(item.data_inicio).format('DD/MM/YY')}
          </Text>
          <Text style={[styles.title2, { flex: 2 }]}>
            {'DIAS DE INTERNAÇÃO: ' + moment().diff(item.data_inicio, 'days')}
          </Text>
          <Text style={[styles.title2, { flex: 4 }]}>
            {'INTERCONSULTAS: ' + interconsultas}
          </Text>
        </View>

      </View>
    )
  }

  return (
    <div style={{ display: pagina == 6 ? 'flex' : 'none' }}>
      <BackButton></BackButton>
      <PDFViewer
        style={{
          position: 'relative',
          width: window.innerWidth, height: window.innerHeight,
          fontSize: 10,
          border: 'none'
        }}>
        <Document>
          <Page size="A4" style={{ padding: 10 }}>
            <View id="CONTEUDO">
              {
                // pdfAtendimento(selectedatendimento.pop())
              }
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
};

export default Pdf;