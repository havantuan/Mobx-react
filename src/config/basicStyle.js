const rowStyle = {
  width: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
};
const colStyle = {
  marginBottom: '16px',
};

const blueButton = {
  width: '100%', backgroundColor: '#23b7e5', color: 'white'
};
const greenButton = {
  width: '100%', backgroundColor: '#5cb85c', color: 'white'
};
const orangeBg = {
  backgroundColor: '#FFA931', color: '#FFFFFF', borderColor: '#FFA931'
};
const redBg = {
  backgroundColor: '#EE3939', color: '#FFFFFF', borderColor: '#EE3939'
};
const greenBg = {
  backgroundColor: '#23AD44', color: '#FFFFFF', borderColor: '#1E943A'
};
const margin = {margin: '10px 8px 8px 0'};

const labelStatus = {
  textAlign: 'left',
  padding: '15px 20px',
  fontWeight: 'bold',
};

const textEdit = {
  textDecoration: 'underline',
  textDecorationStyle: 'dashed',
  color: '#3993cf',
  cursor: 'pointer',
};

const colors = {
  title: '#1890ff'
};

const gutter = 16;

const basicStyle = {
  rowStyle,
  colStyle,
  gutter,
  margin,
  blueButton,
  greenButton,
  orangeBg,
  labelStatus,
  textEdit,
  redBg,
  greenBg,
  colors
};

export default basicStyle;
