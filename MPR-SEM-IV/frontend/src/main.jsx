import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { createBrowserRouter,createRoutesFromElements } from 'react-router-dom'
import ArtisanPage from './components/Artisan/ArtisanPage.jsx'
import ArtisanDashboard from './components/Artisan/ArtisanDashboard.jsx'
import ArtisanOverview from './components/Artisan/ArtisanOverview.jsx'
import AddProduct from './components/Artisan/AddProduct.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="artisan" element={<ArtisanPage />} />
      <Route path="artisandashboard" element={<ArtisanDashboard/>}/>
      <Route path="artisanoverview" element={<ArtisanOverview/>}/>
      <Route path="addproduct" element={<AddProduct/>}/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>  
  </StrictMode>,
)