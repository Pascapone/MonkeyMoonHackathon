import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';

import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from './app/Home/Home';
import Ico from './app/Ico/Ico';
import Vault from './app/Vault/Vault';
import ColorPalette from './app/Colors/ColorPalette';

import { store } from './app/state/store'
import { Provider } from 'react-redux'

import { MoralisProvider } from "react-moralis";

import NFT from './app/NFT/NFT'
import NFTDetails from './app/NFT/NFTDetails'
import Admin from './app/Admin/Admin'
import Games from './app/Games/Games'
import Dashboard from './app/Dashboard/Dashboard'

ReactDOM.render(  
  <React.StrictMode>
    <Provider store={store}>     
      <MoralisProvider 
        appId={process.env.REACT_APP_MORALIS_APPLICATION_ID} 
        serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />                
              <Route path="color-palette" element={<ColorPalette />}/>
              <Route path="dashboard" element={<Dashboard />}/>
              <Route path="ico" element={<Ico />}/>
              <Route path="nft" element={<NFT />}/>
              <Route path="nft-details">
                <Route path=":objectId" element={<NFTDetails />}/>
              </Route>
              <Route index path="vault" element ={<Vault />}/>
              <Route index path="games" element ={<Games />}/>
              <Route index path="admin" element ={<Admin />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </MoralisProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
