import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext, ConversationContext } from '../Context/UserContext';
import NavBar from './Components/NavBar';
import Page from './Pages/index';


function App() {
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ConversationContext.Provider value={{ conversation, setConversation }}>
        <BrowserRouter>
        <div>
            <NavBar/>
        </div>
        <div>
            <Routes>
              <Route path='/' element={<Page.Home />} />
              <Route path='/about' element={<Page.About />} />
            </Routes>
        </div>
        </BrowserRouter>
      </ConversationContext.Provider>
    </UserContext.Provider>
  )
}

export default App
