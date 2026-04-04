import { MainLayout } from './components/layout/MainLayout';
import { Feed } from './components/feed/Feed';
import './index.css';

function App() {
  return (
    <MainLayout>
      <Feed />
    </MainLayout>
  );
}

export default App;
