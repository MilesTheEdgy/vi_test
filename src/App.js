import { HashRouter } from 'react-router-dom';

import Layout from './components/layout/Layout';
import './scss/style.scss';


function App() {
  return (
    <HashRouter>
      <Layout/>
    </HashRouter>
  );
}

export default App;
