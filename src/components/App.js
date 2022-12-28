import { Navigate, Route, Routes } from 'react-router-dom';
import '../styles/App.css';
import CreateLink from './CreateLink';
import Header from './Header';
import LinkList from './LinkList';
import Login from './Login';
import Search from './Search';


function App() {
  return (
    <div className='center w90 w-80-l'>
      <Header />

      <div className='pv1 ph3 background-gray'>
        <Routes>
          <Route path='/' element={<Navigate replace to='/new/1' />} />
          <Route path='/create' element={<CreateLink />} />
          <Route path='/login' element={<Login />} />
          <Route path='/search' element={<Search />} />
          <Route path='/top' element={<LinkList />} />
          <Route path='/new/:path' element={<LinkList />} />
        </Routes>
      </div>
    </div>

  );
}

export default App;
