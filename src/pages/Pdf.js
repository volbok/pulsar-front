/* eslint eqeqeq: "off" */
import React, { useContext } from 'react';
import Context from './Context';
import { useHistory } from 'react-router-dom';
import { Page, Text, View, Document, PDFViewer, StyleSheet } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import fontbold from '../fonts/Roboto-Bold.ttf';
// imagens.
import back from '../images/back.svg';

function Pdf() {

  // context.
  const {
    pagina,
    setpagina,
    atendimentos,
    atendimento, // id do atendimento selecionado.

  } = useContext(Context);

  // history (router).
  let history = useHistory();

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
      display: 'flex',
      fontFamily: 'Helvetica-Bold',
      fontSize: 10, textAlign: 'center',
      fontWeight: 'bold',
      margin: 5,
      padding: 0,
    },
    view1: {
      display: 'flex',
      marginTop: 2.5,
      padding: 2.5,
      borderStyle: 'solid', borderWidth: 1, borderRadius: 5, borderColor: 'black',
    },
    view2: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: 2.5,
      padding: 2.5,
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
              <Text style={styles.title1}>
                {'LISTA DE PROBLEMAS:'}
              </Text>
              <Text>
                {atendimentos.filter(item => item.id_atendimento == atendimento).map(item => item.problemas)}
              </Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
};

export default Pdf;