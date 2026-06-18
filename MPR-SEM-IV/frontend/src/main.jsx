import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ArtisanPage from './components/Artisan/ArtisanPage.jsx'
import ArtisanDashboard from './components/Artisan/ArtisanDashboard.jsx'
import ArtisanOverview from './components/Artisan/ArtisanOverview.jsx'
import AddProduct from './components/Artisan/AddProduct.jsx'

// Clean flattened structure to prevent layouts from stacking on top of each other
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "artisan",
        element: <ArtisanPage />
      },
      {
        path: "artisandashboard",
        element: <ArtisanDashboard />
      },
      {
        path: "artisanoverview",
        element: <ArtisanOverview />
      },
      {
        path: "addproduct",
        element: <AddProduct />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);